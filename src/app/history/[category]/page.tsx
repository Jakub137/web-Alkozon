"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { historyContent, isHistoryCategory } from "@/data/historyContent";

export default function HistoryCategoryPage() {
  const { dict, lang } = useLanguage();
  const params = useParams<{ category: string }>();
  const categoryParam = params?.category ?? "";

  const entry = useMemo(() => {
    if (!isHistoryCategory(categoryParam)) return null;
    return historyContent[categoryParam];
  }, [categoryParam]);

  if (!entry || !isHistoryCategory(categoryParam)) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grow">
        <div className="w-full sm:w-[920px] sm:max-w-[920px] mx-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
            {dict.historyPage.notFoundTitle}
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            {dict.historyPage.notFoundDescription}
          </p>
          <Link
            href="/history"
            className="h-11 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-700 text-white font-medium inline-flex items-center justify-center transition-colors"
          >
            {dict.historyPage.backToHistory}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grow">
      <header className="w-full sm:w-[920px] sm:max-w-[920px] mx-auto mb-6">
        <Link
          href="/history"
          className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline mb-3"
        >
          {dict.historyPage.backToHistory}
        </Link>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 mb-2">
          {entry.icon} {dict.shop.categories[categoryParam]}
        </h1>
        <p className="text-slate-600 dark:text-slate-300">{entry.teaser[lang]}</p>
      </header>

      <div className="w-full sm:w-[920px] sm:max-w-[920px] mx-auto grid grid-cols-1 lg:grid-cols-[620px_276px] gap-6 items-start">
        <section className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-6 shadow-sm dark:shadow-slate-900/50 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              {dict.historyPage.sections.origin}
            </h2>
            <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">{entry.origin[lang]}</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              {dict.historyPage.sections.evolution}
            </h2>
            <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">
              {entry.evolution[lang]}
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
              {dict.historyPage.sections.process}
            </h2>
            <div className="space-y-3">
              {entry.process.map((step, index) => (
                <div
                  key={step.title.en}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900/30"
                >
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
                    {dict.historyPage.processStepLabel} {index + 1}
                  </p>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">
                    {step.title[lang]}
                  </h3>
                  <p className="text-sm text-slate-700 dark:text-slate-300">{step.description[lang]}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
              {dict.historyPage.sections.timeline}
            </h2>
            <div className="space-y-3">
              {entry.timeline.map((item) => (
                <div
                  key={`${item.period}-${item.title.en}`}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900/30"
                >
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">{item.period}</p>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">
                    {item.title[lang]}
                  </h3>
                  <p className="text-sm text-slate-700 dark:text-slate-300">{item.description[lang]}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
              {dict.historyPage.sections.gallery}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((slot) => (
                <div
                  key={slot}
                  className="rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50/70 dark:bg-slate-900/30 p-3"
                >
                  <div className="h-36 rounded-lg bg-slate-200 dark:bg-slate-700/60 flex items-center justify-center text-slate-500 dark:text-slate-400 text-sm text-center px-3">
                    {dict.historyPage.imagePlaceholderTitle}
                  </div>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    {dict.historyPage.imagePlaceholderDescription} {slot}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="w-full lg:w-[276px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm dark:shadow-slate-900/50 space-y-5">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">
              {dict.historyPage.sections.curiosities}
            </h3>
            <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
              {entry.curiosities.map((curiosity) => (
                <li key={curiosity.en} className="flex gap-2">
                  <span className="text-blue-600 dark:text-blue-400">•</span>
                  <span>{curiosity[lang]}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
              {dict.historyPage.sections.sources}
            </h3>
            <ul className="space-y-2">
              {entry.sources.map((source) => (
                <li key={source.url}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline break-words"
                  >
                    {source.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <Link
            href="/shop"
            className="h-11 w-full rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-700 text-white font-medium inline-flex items-center justify-center transition-colors"
          >
            {dict.historyPage.goToShop}
          </Link>
        </aside>
      </div>
    </div>
  );
}
