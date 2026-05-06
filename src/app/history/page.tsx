"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { HISTORY_CATEGORIES, historyContent } from "@/data/historyContent";
import { CategoryIcon } from "@/components/CategoryIcon";

export default function HistoryPage() {
  const { dict, lang } = useLanguage();
  const [query, setQuery] = useState("");

  const filteredCategories = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return HISTORY_CATEGORIES;

    return HISTORY_CATEGORIES.filter((category) => {
      const categoryLabel = dict.shop.categories[category].toLowerCase();
      const teaser = historyContent[category].teaser[lang].toLowerCase();
      return categoryLabel.includes(q) || teaser.includes(q);
    });
  }, [dict.shop.categories, lang, query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grow">
      <header className="mb-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-3 transition-colors">
          {dict.historyPage.title}
        </h1>
        <p className="text-slate-600 dark:text-slate-300 max-w-3xl mx-auto transition-colors">
          {dict.historyPage.subtitle}
        </p>
      </header>

      <div className="w-full sm:w-[920px] sm:max-w-[920px] mx-auto mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={dict.historyPage.searchPlaceholder}
          className="w-full h-11 px-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        />
      </div>

      {filteredCategories.length === 0 ? (
        <div className="w-full sm:w-[920px] sm:max-w-[920px] mx-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 text-center text-slate-600 dark:text-slate-300">
          {dict.historyPage.noResults}
        </div>
      ) : (
        <div className="w-full sm:w-[920px] sm:max-w-[920px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((category) => {
            const entry = historyContent[category];
            return (
              <Link
                key={category}
                href={`/history/${category}`}
                className="h-[220px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm dark:shadow-slate-900/50 hover:shadow-md dark:hover:shadow-slate-900/70 hover:border-blue-400 dark:hover:border-blue-500 transition-all flex flex-col"
              >
                <div className="flex items-center justify-between gap-3 mb-3">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {dict.shop.categories[category]}
                  </h2>
                  <span className="text-2xl text-slate-500" aria-hidden>
                    <CategoryIcon category={category} className="w-6 h-6" />
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 overflow-hidden max-h-[96px]">
                  {entry.teaser[lang]}
                </p>
                <span className="mt-auto pt-4 text-sm font-medium text-blue-600 dark:text-blue-400">
                  {dict.historyPage.readMore}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
