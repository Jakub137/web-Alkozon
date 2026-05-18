"use client";

import React, { createContext, useContext, useState } from "react";
import pl from "../dictionaries/pl.json";
import en from "../dictionaries/en.json";

const dictionaries = { pl, en };

type Language = "pl" | "en";
type Dictionary = typeof pl;

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  dict: Dictionary;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>("pl"); // domyślny język to polski

  return (
    <LanguageContext.Provider value={{ lang, setLang, dict: dictionaries[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage musi być użyte wewnątrz LanguageProvider");
  }
  return context;
}
