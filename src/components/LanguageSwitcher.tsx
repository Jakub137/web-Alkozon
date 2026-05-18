"use client";

import Image from "next/image";
import { useLanguage } from "../context/LanguageContext";

export default function LanguageSwitcher() {
  // Pobieram aktualny język i funkcję do jego zmiany z Contextu
  const { lang, setLang } = useLanguage();

  const base = "w-10 h-7 object-cover cursor-pointer rounded-sm border transition-all duration-200";

  return (
    <div className="flex gap-2 items-center">
      {/* PL */}
      <Image
        src="/pl.svg"
        alt="PL"
        width={40}
        height={28}
        onClick={() => setLang("pl")}
        className={`${base} ${
          lang === "pl"
            ? "border-[1.5px] border-green-500"
            : "border-[1.5px] border-gray-500 hover:opacity-80"
        }`}
      />

      {/* EN */}
      <Image
        src="/us.svg"
        alt="EN"
        width={40}
        height={28}
        onClick={() => setLang("en")}
        className={`${base} ${
          lang === "en"
            ? "border-[1.5px] border-green-500"
            : "border-[1.5px] border-gray-500 hover:opacity-80"
        }`}
      />
    </div>
  );
}
