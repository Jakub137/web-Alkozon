"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function Home() {
  const { dict } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col items-center justify-center text-center grow">
      <h1 className="text-5xl font-extrabold text-slate-900 mb-6">
        {dict.home.title}
      </h1>
      <p className="text-lg text-slate-600 mb-12 max-w-2xl">
        {dict.home.subtitle}
      </p>
      
      {/* Kafelki centrowane przez Flexbox */}
      <div className="flex flex-wrap justify-center gap-6 max-w-4xl">
        <Tile icon="🍷" title={dict.home.tiles.shop.title} desc={dict.home.tiles.shop.desc} />
        <Tile icon="🛒" title={dict.home.tiles.cart.title} desc={dict.home.tiles.cart.desc} />
        <Tile icon="🚚" title={dict.home.tiles.status.title} desc={dict.home.tiles.status.desc} />
        <Tile icon="📚" title={dict.home.tiles.history.title} desc={dict.home.tiles.history.desc} />
        <Tile icon="🧪" title={dict.home.tiles.custom.title} desc={dict.home.tiles.custom.desc} />
        <Tile icon="❓" title={dict.home.tiles.faq.title} desc={dict.home.tiles.faq.desc} />
      </div>
    </div>
  );
}

// Komponent kafelka
function Tile({ icon, title, desc }: { icon: string, title: string, desc: string }) {
  return (
    <Link href="#" className="flex flex-col items-center justify-center w-64 h-40 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-400 transition-all group">
      <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{icon}</div>
      <h2 className="text-lg font-bold text-slate-800 mb-1">{title}</h2>
      <p className="text-xs text-slate-500 text-center px-4">{desc}</p>
    </Link>
  );
}