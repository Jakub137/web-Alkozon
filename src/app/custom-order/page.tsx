"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Product, ProductCategory } from "@/types/product";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";

type CustomBase = Exclude<ProductCategory, "beer">;
type CapacityOption = "0.5L" | "0.7L" | "1.0L";
type FlavorKey = "sweet" | "dry" | "fruity" | "smoky" | "herbal" | "barrel";

const BASES: CustomBase[] = ["vodka", "whisky", "wine", "liqueur"];
const CAPACITIES: CapacityOption[] = ["0.5L", "0.7L", "1.0L"];
const FLAVORS: FlavorKey[] = ["sweet", "dry", "fruity", "smoky", "herbal", "barrel"];

const baseConfig: Record<
  CustomBase,
  { basePrice: number; standardAbv: number; minAbv: number; maxAbv: number }
> = {
  vodka: { basePrice: 65, standardAbv: 40, minAbv: 30, maxAbv: 60 },
  whisky: { basePrice: 95, standardAbv: 40, minAbv: 35, maxAbv: 65 },
  wine: { basePrice: 55, standardAbv: 12, minAbv: 8, maxAbv: 20 },
  liqueur: { basePrice: 70, standardAbv: 25, minAbv: 15, maxAbv: 45 },
};

const capacityMultiplier: Record<CapacityOption, number> = {
  "0.5L": 0.85,
  "0.7L": 1.0,
  "1.0L": 1.35,
};

const intensityMultiplier: Record<number, number> = {
  1: 0.95,
  2: 1.0,
  3: 1.07,
  4: 1.14,
  5: 1.22,
};

const premiumFlavors = new Set<FlavorKey>(["smoky", "barrel"]);
const MAX_CUSTOM_NAME_CHARS = 20;
const MAX_NOTE_WORDS = 100;

function toEnding99(value: number) {
  const floored = Math.max(0, Math.floor(value));
  return floored + 0.99;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function countWords(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

function limitWords(value: string, maxWords: number) {
  const trimmed = value.trim();
  if (!trimmed) return "";

  const words = trimmed.split(/\s+/);
  if (words.length <= maxWords) return value;

  return words.slice(0, maxWords).join(" ");
}

export default function CustomOrderPage() {
  const { dict } = useLanguage();
  const { addToCart, cartItemsCount, cartItemsLimit, customOrderItemsCount, customOrderItemsLimit } = useCart();

  const [step, setStep] = useState(1);
  const [selectedBase, setSelectedBase] = useState<CustomBase>("whisky");
  const [capacity, setCapacity] = useState<CapacityOption>("0.7L");
  const [abv, setAbv] = useState(baseConfig.whisky.standardAbv);
  const [selectedFlavors, setSelectedFlavors] = useState<FlavorKey[]>([]);
  const [intensity, setIntensity] = useState<number>(3);
  const [customName, setCustomName] = useState("");
  const [note, setNote] = useState("");
  const [toastType, setToastType] = useState<"success" | "limit">("success");
  const [addedMessageVisible, setAddedMessageVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showGoToSummaryButton, setShowGoToSummaryButton] = useState(false);

  useEffect(() => {
    const config = baseConfig[selectedBase];
    setAbv(config.standardAbv);
  }, [selectedBase]);

  const currentBaseConfig = baseConfig[selectedBase];

  const pricing = useMemo(() => {
    const base = currentBaseConfig.basePrice;
    const afterCapacity = base * capacityMultiplier[capacity];
    const delta = abv - currentBaseConfig.standardAbv;
    const abvAdjustment = delta >= 0 ? delta * 1.2 : delta * 0.6;
    const flavorSurcharge = selectedFlavors.reduce(
      (sum, flavor) => sum + (premiumFlavors.has(flavor) ? 6 : 4),
      0
    );

    const beforeIntensity = Math.max(39.99, afterCapacity + abvAdjustment + flavorSurcharge);
    const finalRaw = beforeIntensity * intensityMultiplier[intensity];
    const finalClamped = clamp(finalRaw, 39.99, 399.99);
    const finalPrice = toEnding99(finalClamped);

    return {
      base,
      afterCapacity,
      abvAdjustment,
      flavorSurcharge,
      intensityMultiplierValue: intensityMultiplier[intensity],
      finalPrice,
    };
  }, [abv, capacity, currentBaseConfig, intensity, selectedFlavors]);

  const toggleFlavor = (flavor: FlavorKey) => {
    setSelectedFlavors((prev) =>
      prev.includes(flavor) ? prev.filter((x) => x !== flavor) : [...prev, flavor]
    );
  };

  const canGoToStep3 = true;
  const canSubmit = customName.trim().length >= 3;
  const customNameLength = customName.length;
  const noteWordCount = countWords(note);
  const isTotalCartLimitReached = cartItemsCount >= cartItemsLimit;
  const isCustomOrderLimitReached = customOrderItemsCount >= customOrderItemsLimit;

  const showToast = (message: string, type: "success" | "limit") => {
    setToastMessage(message);
    setToastType(type);
    setAddedMessageVisible(true);
    window.setTimeout(() => setAddedMessageVisible(false), 2200);
  };

  const handleCustomNameChange = (value: string) => {
    setCustomName(value.slice(0, MAX_CUSTOM_NAME_CHARS));
  };

  const handleNoteChange = (value: string) => {
    setNote(limitWords(value, MAX_NOTE_WORDS));
  };

  const handleAddToCart = () => {
    if (!canSubmit || addedMessageVisible) return;

    const generatedName = customName.trim();
    const customProduct: Product = {
      id: `custom-${Date.now()}`,
      name: generatedName,
      capacity,
      price: pricing.finalPrice,
      image: "/products/custom-order.jpg",
      category: selectedBase,
      alcoholContent: Number(abv.toFixed(1)),
    };

    const result = addToCart(customProduct);
    if (!result.ok) {
      const message =
        result.reason === "custom_limit"
          ? dict.customOrderPage.messages.limitCustomReached
          : dict.customOrderPage.messages.limitTotalReached;
      showToast(message, "limit");
      return;
    }

    showToast(dict.customOrderPage.messages.added, "success");
    setShowGoToSummaryButton(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grow">
      <header className="mb-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-3 transition-colors">
          {dict.customOrderPage.title}
        </h1>
        <p className="text-slate-600 dark:text-slate-300 transition-colors max-w-2xl mx-auto">
          {dict.customOrderPage.subtitle}
        </p>
      </header>

      <div className="w-full sm:w-[920px] sm:max-w-[920px] mx-auto mb-6">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 sm:p-5 shadow-sm dark:shadow-slate-900/50">
          <div className="grid grid-cols-3 gap-3">
            {([1, 2, 3] as const).map((value) => {
              const active = value === step;
              const completed = value < step;
              return (
                <div
                  key={value}
                  className={`h-10 rounded-lg border text-xs sm:text-sm font-medium flex items-center justify-center transition-colors ${
                    active
                      ? "bg-blue-600 border-blue-600 text-white"
                      : completed
                      ? "bg-emerald-600 border-emerald-600 text-white"
                      : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {dict.customOrderPage.steps[`step${value}`]}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="w-full sm:w-[920px] sm:max-w-[920px] mx-auto grid grid-cols-1 lg:grid-cols-[620px_276px] gap-6 items-start">
        <section className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-6 shadow-sm dark:shadow-slate-900/50">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {dict.customOrderPage.sections.base}
              </h2>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  {dict.customOrderPage.fields.base}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {BASES.map((base) => {
                    const active = base === selectedBase;
                    return (
                      <button
                        key={base}
                        type="button"
                        onClick={() => setSelectedBase(base)}
                        className={`h-11 px-3 rounded-lg border text-sm font-medium whitespace-nowrap transition-colors ${
                          active
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 hover:border-blue-500"
                        }`}
                      >
                        {dict.shop.categories[base]}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  {dict.customOrderPage.fields.capacity}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {CAPACITIES.map((option) => {
                    const active = option === capacity;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setCapacity(option)}
                        className={`h-11 px-3 rounded-lg border text-sm font-medium whitespace-nowrap transition-colors ${
                          active
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 hover:border-blue-500"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {dict.customOrderPage.fields.strength}: {abv}%
                </label>
                <input
                  type="range"
                  min={currentBaseConfig.minAbv}
                  max={currentBaseConfig.maxAbv}
                  step={1}
                  value={abv}
                  onChange={(e) => setAbv(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
                <div className="mt-1 flex justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>{currentBaseConfig.minAbv}%</span>
                  <span>{currentBaseConfig.maxAbv}%</span>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {dict.customOrderPage.sections.flavor}
              </h2>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  {dict.customOrderPage.fields.flavors}
                </label>
                <div className="flex flex-wrap gap-2">
                  {FLAVORS.map((flavor) => {
                    const active = selectedFlavors.includes(flavor);
                    return (
                      <button
                        key={flavor}
                        type="button"
                        onClick={() => toggleFlavor(flavor)}
                        className={`h-10 px-4 rounded-full border text-sm font-medium whitespace-nowrap transition-colors ${
                          active
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 hover:border-blue-500"
                        }`}
                      >
                        {dict.customOrderPage.flavors[flavor]}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {dict.customOrderPage.fields.intensity}: {intensity}
                </label>
                <input
                  type="range"
                  min={1}
                  max={5}
                  step={1}
                  value={intensity}
                  onChange={(e) => setIntensity(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
                <div className="mt-1 flex justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>1</span>
                  <span>5</span>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {dict.customOrderPage.sections.finish}
              </h2>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {dict.customOrderPage.fields.customName}
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => handleCustomNameChange(e.target.value)}
                  maxLength={MAX_CUSTOM_NAME_CHARS}
                  placeholder={dict.customOrderPage.fields.customNamePlaceholder}
                  className="w-full h-11 px-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between gap-3">
                  <span>
                  {dict.customOrderPage.validation.nameHint}
                  </span>
                  <span className="whitespace-nowrap">
                    {customNameLength}/{MAX_CUSTOM_NAME_CHARS}
                  </span>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {dict.customOrderPage.fields.note}
                </label>
                <textarea
                  value={note}
                  onChange={(e) => handleNoteChange(e.target.value)}
                  placeholder={dict.customOrderPage.fields.notePlaceholder}
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-y"
                />
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 text-right">
                  {noteWordCount}/{MAX_NOTE_WORDS} {dict.customOrderPage.validation.wordsLabel}
                </p>
              </div>

            </div>
          )}

          <div className="mt-8 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setStep((prev) => Math.max(1, prev - 1))}
              disabled={step === 1}
              className="h-11 min-w-[120px] px-4 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {dict.customOrderPage.buttons.back}
            </button>

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => Math.min(3, prev + 1))}
                disabled={step === 2 && !canGoToStep3}
                className="h-11 min-w-[120px] px-4 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {dict.customOrderPage.buttons.next}
              </button>
            ) : (
              <div className="flex items-center gap-2">
                {showGoToSummaryButton && (
                  <Link
                    href="/cart?from=custom-order"
                    className="h-11 min-w-[180px] px-4 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-medium inline-flex items-center justify-center transition-colors hover:border-blue-500"
                  >
                    {dict.customOrderPage.buttons.goToSummary}
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!canSubmit || addedMessageVisible || isTotalCartLimitReached || isCustomOrderLimitReached}
                  className="h-11 min-w-[160px] px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                >
                  {dict.customOrderPage.buttons.addToCart}
                </button>
              </div>
            )}
          </div>
          {step === 3 && (isTotalCartLimitReached || isCustomOrderLimitReached) && (
            <p className="mt-2 text-xs text-red-600 dark:text-red-400 text-right">
              {isCustomOrderLimitReached
                ? dict.customOrderPage.messages.limitCustomReached
                : dict.customOrderPage.messages.limitTotalReached}
            </p>
          )}
        </section>

        <aside className="w-full lg:w-[276px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm dark:shadow-slate-900/50 h-fit">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
            {dict.customOrderPage.summary.title}
          </h3>

          <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
            <div className="flex justify-between gap-3">
              <span>{dict.customOrderPage.summary.base}</span>
              <span className="font-medium">{dict.shop.categories[selectedBase]}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span>{dict.customOrderPage.summary.capacity}</span>
              <span className="font-medium">{capacity}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span>{dict.customOrderPage.summary.strength}</span>
              <span className="font-medium">{abv}%</span>
            </div>
            <div className="flex justify-between gap-3">
              <span>{dict.customOrderPage.summary.intensity}</span>
              <span className="font-medium">{intensity}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span>{dict.customOrderPage.summary.flavors}</span>
              <span className="font-medium">{selectedFlavors.length}</span>
            </div>
          </div>

          <div className="my-4 border-t border-slate-200 dark:border-slate-700" />

          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex justify-between gap-3">
              <span>{dict.customOrderPage.pricing.base}</span>
              <span>{pricing.base.toFixed(2)} zl</span>
            </div>
            <div className="flex justify-between gap-3">
              <span>{dict.customOrderPage.pricing.capacity}</span>
              <span>{pricing.afterCapacity.toFixed(2)} zl</span>
            </div>
            <div className="flex justify-between gap-3">
              <span>{dict.customOrderPage.pricing.strength}</span>
              <span>{pricing.abvAdjustment >= 0 ? "+" : ""}{pricing.abvAdjustment.toFixed(2)} zl</span>
            </div>
            <div className="flex justify-between gap-3">
              <span>{dict.customOrderPage.pricing.flavors}</span>
              <span>+{pricing.flavorSurcharge.toFixed(2)} zl</span>
            </div>
            <div className="flex justify-between gap-3">
              <span>{dict.customOrderPage.pricing.intensity}</span>
              <span>x{pricing.intensityMultiplierValue.toFixed(2)}</span>
            </div>
          </div>

          <div className="my-4 border-t border-slate-200 dark:border-slate-700" />

          <div className="flex items-center justify-between gap-3">
            <span className="text-base font-semibold text-slate-900 dark:text-slate-100">
              {dict.customOrderPage.summary.estimatedPrice}
            </span>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 whitespace-nowrap">
              {pricing.finalPrice.toFixed(2)} zl
            </span>
          </div>
        </aside>
      </div>

      {addedMessageVisible && (
        <div
          className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 h-10 px-4 rounded-lg text-sm font-medium flex items-center shadow-md dark:shadow-slate-900/60 whitespace-nowrap ${
            toastType === "success"
              ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
              : "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"
          }`}
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}
