"use client";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function ThemeSwitcher() {
  const [isDark, setIsDark] = useState(false);
  const { dict } = useLanguage();

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className={`w-28 py-2 rounded-lg text-sm font-medium transition-colors text-center ${
        isDark 
          ? "bg-slate-100 text-slate-900" 
          : "bg-slate-500 text-white"
      }`}
    >
      {isDark ? dict.navbar.darkMode : dict.navbar.lightMode}
    </button>
  );
}
