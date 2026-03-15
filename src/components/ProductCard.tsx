"use client";

import { Product } from "@/types/product";
import { useLanguage } from "@/context/LanguageContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { dict } = useLanguage();

  return (
    <div className="flex flex-col bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm dark:shadow-slate-900/50 hover:shadow-md dark:hover:shadow-slate-900/70 hover:border-blue-400 dark:hover:border-blue-500 transition-all group overflow-hidden">
      <div className="w-full h-30 bg-slate-200 dark:bg-slate-900 flex items-center justify-center p-6">
        <div className="text-6xl">🍷</div>
      </div>
      
      <div className="p-4 flex flex-col grow">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1 transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 transition-colors">
          {product.capacity}
        </p>
        
        <div className="mt-auto">
          <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 transition-colors">
            {product.price.toFixed(2)} zł
          </p>
          
          <button
            type="button"
            className="w-full h-15 py-2 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-800 text-white rounded-lg font-medium transition-colors flex items-center justify-center"
          >          
            {dict.shop.product.addToCart}
          </button>
        </div>
      </div>
    </div>
  );
}
