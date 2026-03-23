"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function Home() {
  const { dict } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col items-center justify-center text-center grow">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4 transition-colors">
        {dict.home.title}
      </h1>
      <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-2xl transition-colors">
        {dict.home.subtitle}
      </p>
      
      <div className="flex flex-wrap justify-center gap-6 max-w-4xl">
        <Tile icon="🍷" title={dict.home.tiles.shop.title} desc={dict.home.tiles.shop.desc} href="/shop" />
        <Tile icon="🛒" title={dict.home.tiles.cart.title} desc={dict.home.tiles.cart.desc} href="/cart" />
        <Tile icon="🚚" title={dict.home.tiles.status.title} desc={dict.home.tiles.status.desc} href="/order-status" />
        <Tile icon="📚" title={dict.home.tiles.history.title} desc={dict.home.tiles.history.desc} href="/history" />
        <Tile icon="🧪" title={dict.home.tiles.custom.title} desc={dict.home.tiles.custom.desc} href="/custom-order" />
        <Tile icon="❓" title={dict.home.tiles.faq.title} desc={dict.home.tiles.faq.desc} href="/faq" />
      </div>
    </div>
  );
}

function Tile({ icon, title, desc, href = "#" }: { icon: string, title: string, desc: string, href?: string }) {
  return (
    <Link
      href={href}
      className="flex-shrink-0 flex-grow-0 w-64 h-32 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm dark:shadow-slate-900/50 hover:shadow-md dark:hover:shadow-slate-900/70 hover:border-blue-400 dark:hover:border-blue-500 transition-all group overflow-hidden flex flex-col items-center justify-center"
    >
      <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{icon}</div>
      <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1 transition-colors text-center px-3 whitespace-nowrap overflow-hidden text-ellipsis">
        {title}
      </h2>
      <p className="text-xs text-slate-500 dark:text-slate-400 text-center px-4 transition-colors whitespace-nowrap overflow-hidden text-ellipsis">
        {desc}
      </p>
    </Link>
  );
}