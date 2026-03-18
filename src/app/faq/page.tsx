"use client";

import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

const categoryKeys = ["all", "orders", "payments", "delivery", "products", "account"] as const;
type FaqCategoryKey = (typeof categoryKeys)[number];

export default function FaqPage() {
  const { dict } = useLanguage();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<FaqCategoryKey>("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const normalizedQuery = query.trim().toLowerCase();

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

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grow">
      <header className="mb-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-3 transition-colors">
          {dict.faqPage.title}
        </h1>
        <p className="text-slate-600 dark:text-slate-300 transition-colors max-w-2xl mx-auto">
          {dict.faqPage.subtitle}
        </p>
      </header>

      <div className="w-full max-w-4xl mx-auto mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={dict.faqPage.searchPlaceholder}
          className="w-full h-11 px-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        />
      </div>

      <div className="w-full max-w-4xl mx-auto mb-6 flex flex-wrap gap-2 justify-center">
        {categoryKeys.map((key) => {
          const active = key === activeCategory;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setActiveCategory(key)}
              className={`h-10 min-w-[120px] px-4 rounded-lg border text-sm font-medium whitespace-nowrap transition-colors ${
                active
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 hover:border-blue-500"
              }`}
            >
              {dict.faqPage.categories[key]}
            </button>
          );
        })}
      </div>

      {filteredItems.length === 0 ? (
        <div className="w-full max-w-4xl mx-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 text-center text-slate-600 dark:text-slate-300 shadow-sm dark:shadow-slate-900/50">
          {dict.faqPage.noResults}
        </div>
      ) : (
        <div className="w-full max-w-4xl mx-auto space-y-3">
          {filteredItems.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm dark:shadow-slate-900/50 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenId((prev) => (prev === item.id ? null : item.id))}
                  className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors"
                >
                  <span className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    {item.question}
                  </span>
                  <span className="text-xl leading-none text-slate-500 dark:text-slate-300 shrink-0">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-700">
                    <p className="pt-4">{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
