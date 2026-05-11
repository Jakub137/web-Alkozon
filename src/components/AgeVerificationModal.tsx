"use client";

import React, { useEffect, useState } from "react";
import { useAge } from "@/context/AgeContext";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { confirmAgeApi } from "@/lib/api/auth";

export default function AgeVerificationModal() {
  const { ageStatus, setAgeStatus, isVerified } = useAge();
  const { dict } = useLanguage();
  const { token, login } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Oczekujemy na weryfikację stanu z localStorage, by zapobiec miganiu modalu (hydration mismatch)
  if (!mounted || !isVerified) return null;

  if (ageStatus !== "unknown") return null;

  const handleAdultConfirmation = async () => {
    if (!token) {
      setAgeStatus("adult");
      return;
    }

    try {
      setIsSubmitting(true);
      const session = await confirmAgeApi(token);
      login(session);
      setAgeStatus("adult");
    } catch {
      // Fallback for temporary API outage.
      setAgeStatus("adult");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 max-w-md w-full text-center border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in duration-300">
        <div className="text-6xl mb-6">🔞</div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          {dict.ageGate?.title || "Czy masz ukończone 18 lat?"}
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          {dict.ageGate?.description || "Ta strona zawiera treści przeznaczone wyłącznie dla osób dorosłych. Prosimy o potwierdzenie wieku."}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => void handleAdultConfirmation()}
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
          >
            {dict.ageGate?.yes || "Tak, wchodzę"}
          </button>
          <button
            onClick={() => setAgeStatus("underage")}
            className="flex-1 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-medium py-3 px-6 rounded-xl transition-colors"
          >
            {dict.ageGate?.no || "Nie mam 18 lat"}
          </button>
        </div>
      </div>
    </div>
  );
}
