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
          ? "bg-blue-600 text-white hover:bg-blue-700"
          : "bg-slate-900 text-white hover:bg-slate-800"
      }`}
    >
      {dict.navbar.login}
    </button>
  );
}
