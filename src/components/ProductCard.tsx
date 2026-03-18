"use client";

import Link from "next/link";
import { Product } from "@/types/product";
import { useLanguage } from "@/context/LanguageContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { dict } = useLanguage();

  return (
    <div className="w-full sm:w-[200px] h-[400px] sm:flex-none flex flex-col min-w-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm dark:shadow-slate-900/50 hover:shadow-md dark:hover:shadow-slate-900/70 hover:border-blue-400 dark:hover:border-blue-500 transition-all group overflow-hidden">
      <div className="w-full h-64 bg-slate-200 dark:bg-slate-900 flex items-center justify-center p-6">
        <div className="text-6xl">🍷</div>
      </div>
      
      <div className="p-4 flex flex-col grow">
        <Link
          href={`/shop/${product.id}`}
          className="block w-full min-w-0 text-lg font-bold text-slate-800 dark:text-slate-100 mb-1 transition-colors hover:text-blue-600 dark:hover:text-blue-400 truncate"
        >
          {product.name}
        </Link>
        <p className="block w-full min-w-0 text-sm text-slate-500 dark:text-slate-400 mb-3 transition-colors truncate">
          {product.capacity}
        </p>
        
        <div className="mt-auto">
          <p className="block w-full text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 transition-colors whitespace-nowrap truncate">
            {product.price.toFixed(2)} zł
          </p>
          
          <button
            type="button"
            className="w-full min-w-0 h-11 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-800 text-white rounded-lg font-medium transition-colors flex items-center justify-center whitespace-nowrap truncate"
          >          
            {dict.shop.product.addToCart}
          </button>
        </div>
      </div>
    </div>
  );
}
