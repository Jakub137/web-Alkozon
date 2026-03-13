"use client";
import { useState } from "react";

export default function ThemeSwitcher() {
  const [isDark, setIsDark] = useState(false);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className={`w-28 py-2 rounded-lg text-sm font-medium transition-colors text-center ${
        isDark 
          ? "bg-slate-100 text-slate-900" 
          : "bg-slate-500 text-white"
      }`}
    >
      {isDark ? "Tryb ciemny" : "Tryb jasny"}
    </button>
  );
}
