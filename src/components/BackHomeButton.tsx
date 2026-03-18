"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export default function BackHomeButton() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { dict } = useLanguage();

  if (pathname === "/") {
    return null;
  }

  const returnHref =
    pathname === "/cart" && searchParams.get("from") === "shop" ? "/shop" : "/";

  return (
    <Link
      href={returnHref}
      className="h-10 px-4 inline-flex items-center justify-center rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:border-blue-500 transition-colors whitespace-nowrap text-sm font-medium"
    >
      {dict.navbar.returnHome}
    </Link>
  );
}
