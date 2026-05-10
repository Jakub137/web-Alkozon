"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";
import { useLanguage } from "@/context/LanguageContext";
import { useAge } from "@/context/AgeContext";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  isAddDisabled?: boolean;
}

export default function ProductCard({ product, onAddToCart, isAddDisabled = false }: ProductCardProps) {
  const { dict } = useLanguage();
  const { ageStatus } = useAge();

  const isDisabled = isAddDisabled || ageStatus === "underage";

  return (
    <div className="w-full sm:w-[200px] h-[400px] sm:flex-none flex flex-col min-w-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm dark:shadow-slate-900/50 hover:shadow-md dark:hover:shadow-slate-900/70 hover:border-blue-400 dark:hover:border-blue-500 transition-all group overflow-hidden">
      <div className="relative w-full h-64 bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-4">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, 200px"
          className="object-contain p-4"
        />
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
            disabled={isDisabled}
            onClick={() => onAddToCart?.(product)}
            className="w-full min-w-0 h-11 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-800 text-white rounded-lg font-medium transition-colors flex items-center justify-center whitespace-nowrap truncate disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 disabled:dark:hover:bg-blue-500"
          >          
            {dict.shop.product.addToCart}
          </button>
        </div>
      </div>
    </div>
  );
}
