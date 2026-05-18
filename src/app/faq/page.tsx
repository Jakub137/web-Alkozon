"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, HelpCircle, Search } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const categoryKeys = ["all", "orders", "payments", "delivery", "products", "account"] as const;
type FaqCategoryKey = (typeof categoryKeys)[number];

const categoryAccent: Record<FaqCategoryKey, string> = {
  all: "border-l-slate-400 dark:border-l-slate-500",
  orders: "border-l-amber-500 dark:border-l-amber-400",
  payments: "border-l-emerald-500 dark:border-l-emerald-400",
  delivery: "border-l-sky-500 dark:border-l-sky-400",
  products: "border-l-violet-500 dark:border-l-violet-400",
  account: "border-l-rose-500 dark:border-l-rose-400",
};

function matchSummary(template: string, shown: number, total: number) {
  return template.replace("{{shown}}", String(shown)).replace("{{total}}", String(total));
}

export default function FaqPage() {
  const { dict } = useLanguage();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<FaqCategoryKey>("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const normalizedQuery = query.trim().toLowerCase();
  const totalCount = dict.faqPage.items.length;

  const filteredItems = useMemo(() => {
    return dict.faqPage.items.filter((item) => {
      const categoryMatch = activeCategory === "all" || item.category === activeCategory;
      const textMatch =
        normalizedQuery.length === 0 ||
        item.question.toLowerCase().includes(normalizedQuery) ||
        item.answer.toLowerCase().includes(normalizedQuery);

      return categoryMatch && textMatch;
    });
  }, [activeCategory, dict.faqPage.items, normalizedQuery]);

  useEffect(() => {
    if (!openId) return;
    const stillVisible = filteredItems.some((item) => item.id === openId);
    if (!stillVisible) setOpenId(null);
  }, [filteredItems, openId]);

  const summaryText =
    dict.faqPage.matchSummary != null
      ? matchSummary(dict.faqPage.matchSummary, filteredItems.length, totalCount)
      : `${filteredItems.length} / ${totalCount}`;

  return (
    <div className="grow bg-white dark:bg-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <header className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600/10 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 mb-5 ring-1 ring-blue-600/20 dark:ring-blue-400/25">
            <HelpCircle className="w-9 h-9" strokeWidth={1.75} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-3 tracking-tight">
            {dict.faqPage.title}
          </h1>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            {dict.faqPage.subtitle}
          </p>
        </header>

        <div className="w-full max-w-3xl mx-auto mb-6">
          <label className="relative block group">
            <span className="sr-only">{dict.faqPage.searchPlaceholder}</span>
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none"
              aria-hidden
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={dict.faqPage.searchPlaceholder}
              className="w-full h-12 pl-12 pr-4 rounded-2xl border border-slate-200 dark:border-slate-600 bg-white/90 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500 transition-shadow"
            />
          </label>
          <p className="mt-2 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {summaryText}
          </p>
        </div>

        <div className="w-full max-w-3xl mx-auto mb-8">
          <div className="-mx-4 flex flex-nowrap gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 sm:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categoryKeys.map((key) => {
              const active = key === activeCategory;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveCategory(key)}
                  className={`shrink-0 h-10 px-4 rounded-full border text-sm font-semibold whitespace-nowrap transition-all ${
                    active
                      ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/25 scale-[1.02]"
                      : "bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:border-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  }`}
                >
                  {dict.faqPage.categories[key]}
                </button>
              );
            })}
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="w-full max-w-3xl mx-auto rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-600 bg-white/60 dark:bg-slate-800/40 px-8 py-14 text-center">
            <div className="inline-flex rounded-full bg-slate-100 dark:bg-slate-700/80 p-4 mb-4">
              <Search className="w-10 h-10 text-slate-400 dark:text-slate-500" strokeWidth={1.5} />
            </div>
            <p className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">
              {dict.faqPage.noResults}
            </p>
            {dict.faqPage.noResultsHint != null && (
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                {dict.faqPage.noResultsHint}
              </p>
            )}
          </div>
        ) : (
          <ul className="w-full max-w-3xl mx-auto space-y-3 list-none p-0 m-0">
            {filteredItems.map((item) => {
              const isOpen = openId === item.id;
              const cat = item.category as FaqCategoryKey;
              const accent = cat in categoryAccent ? categoryAccent[cat] : categoryAccent.products;

              return (
                <li
                  key={item.id}
                  className={`rounded-2xl border border-slate-200/90 dark:border-slate-700/90 bg-white/95 dark:bg-slate-800/95 shadow-md shadow-slate-900/5 dark:shadow-slate-950/40 overflow-hidden border-l-[5px] ${accent}`}
                >
                  <button
                    type="button"
                    id={`faq-q-${item.id}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${item.id}`}
                    onClick={() => setOpenId((prev) => (prev === item.id ? null : item.id))}
                    className="w-full px-5 py-4 sm:py-5 flex items-center justify-between gap-4 text-left hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors"
                  >
                    <span className="text-base sm:text-[1.05rem] font-semibold text-slate-900 dark:text-slate-100 leading-snug pr-2">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`w-6 h-6 shrink-0 text-slate-400 dark:text-slate-500 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-blue-500 dark:text-blue-400" : ""
                      }`}
                      aria-hidden
                    />
                  </button>

                  {isOpen && (
                    <div
                      id={`faq-a-${item.id}`}
                      role="region"
                      aria-labelledby={`faq-q-${item.id}`}
                      className="px-5 pb-5 text-sm sm:text-[0.9375rem] leading-relaxed text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-700/80 animate-in fade-in slide-in-from-top-1 duration-200"
                    >
                      <p className="pt-4">{item.answer}</p>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
