"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

export default function LoginButton() {
  const { dict } = useLanguage();
  const { theme } = useTheme();
  
  return (
    <button 
      className={`w-28 px-0 py-2 rounded-lg text-sm font-medium transition text-center ${
        theme === "dark"
          ? "bg-white text-slate-900 hover:bg-slate-100"
          : "bg-slate-900 text-white hover:bg-slate-800"
      }`}
    >
      {dict.navbar.login}
    </button>
  );
}
