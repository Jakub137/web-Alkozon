"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function UnderageRestrictedPage() {
  const { dict } = useLanguage();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grow flex items-center">
      <div className="w-full bg-white dark:bg-slate-800 border border-red-200 dark:border-red-800 rounded-3xl p-8 text-center shadow-sm dark:shadow-slate-900/50">
        <div className="text-5xl mb-5" aria-hidden>
          18+
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-3">
          {dict.ageGate?.restrictedMessageTitle || "Ograniczenie wiekowe"}
        </h1>
        <p className="text-slate-600 dark:text-slate-300 max-w-xl mx-auto mb-6">
          {dict.ageGate?.restrictedPageMessage ||
            dict.ageGate?.restrictedMessage ||
            "Ta część strony jest dostępna wyłącznie dla osób pełnoletnich. Możesz nadal korzystać z sekcji informacyjnych, takich jak FAQ i historia alkoholi."}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto h-11 px-5 inline-flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-700 text-white font-medium transition-colors"
          >
            {dict.ageGate?.homeLink || "Strona główna"}
          </Link>
          <Link
            href="/faq"
            className="w-full sm:w-auto h-11 px-5 inline-flex items-center justify-center rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:border-blue-500 transition-colors"
          >
            {dict.ageGate?.faqLink || "FAQ"}
          </Link>
          <Link
            href="/history"
            className="w-full sm:w-auto h-11 px-5 inline-flex items-center justify-center rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:border-blue-500 transition-colors"
          >
            {dict.ageGate?.historyLink || "Historia alkoholi"}
          </Link>
        </div>
      </div>
    </div>
  );
}
