"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function LoginButton() {
  const { dict } = useLanguage();

  return (
    <button className="w-28 bg-slate-900 text-white px-0 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition text-center">
      {dict.navbar.login}
    </button>
  );
}
