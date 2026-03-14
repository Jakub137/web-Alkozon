"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

export default function ThemeSwitcher() {
  const { dict } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`w-28 py-2 rounded-lg text-sm font-medium transition-colors text-center ${
        theme === "dark"
          ? "bg-slate-100 text-slate-900"
          : "bg-slate-700 text-white"
      }`}
    >
      {theme === "dark" ? dict.navbar.darkMode : dict.navbar.lightMode}
    </button>
  );
}
