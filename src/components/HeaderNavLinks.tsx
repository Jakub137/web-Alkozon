"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function HeaderNavLinks() {
  const { dict } = useLanguage();

  return (
    <nav className="hidden lg:flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm font-medium text-slate-600 dark:text-slate-300">
      <Link href="/shop" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
        {dict.navbar.shop}
      </Link>
      <Link
        href="/order-status"
        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        {dict.navbar.orderStatus}
      </Link>
      <Link
        href="/my-orders"
        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        {dict.navbar.myOrders}
      </Link>
    </nav>
  );
}
