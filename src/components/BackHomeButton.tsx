"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { ArrowLeft } from "lucide-react";

type BackHomeButtonProps = {
  iconOnly?: boolean;
  className?: string;
};

export default function BackHomeButton({ iconOnly = false, className = "" }: BackHomeButtonProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { dict } = useLanguage();

  if (pathname === "/") {
    return null;
  }

  const returnHref = pathname === "/cart" && searchParams.get("from") === "shop" ? "/shop" : "/";

  return (
    <Link
      href={returnHref}
      aria-label={dict.navbar.returnHome}
      title={dict.navbar.returnHome}
      className={
        iconOnly
          ? `h-10 w-10 inline-flex items-center justify-center rounded-full border border-amber-300 dark:border-amber-500/70 bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-200 hover:bg-amber-200 dark:hover:bg-amber-500/30 hover:border-amber-500 transition-colors shadow-sm ${className}`
          : `h-10 px-4 inline-flex items-center justify-center rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:border-blue-500 transition-colors whitespace-nowrap text-sm font-medium ${className}`
      }
    >
      {iconOnly ? <ArrowLeft className="w-4 h-4" /> : dict.navbar.returnHome}
    </Link>
  );
}
