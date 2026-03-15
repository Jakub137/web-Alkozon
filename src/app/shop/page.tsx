"use client";

import { useLanguage } from "@/context/LanguageContext";
import { mockProducts } from "@/data/products";
import ProductCard from "@/components/ProductCard";

export default function ShopPage() {
  const { dict } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grow">
      <header className="mb-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4 transition-colors">
          {dict.shop.title}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto transition-colors">
          {dict.shop.subtitle}
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="w-full lg:w-64 shrink-0">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm dark:shadow-slate-900/50">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 transition-colors">
              {dict.shop.filters.title}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 transition-colors">
                  {dict.shop.filters.category}
                </label>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Filtry kategorii - do implementacji
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 transition-colors">
                  {dict.shop.filters.priceRange}
                </label>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Suwak cenowy - do implementacji
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1 flex flex-col">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 mb-6 shadow-sm dark:shadow-slate-900/50">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder={dict.shop.search.placeholder}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  disabled
                />
              </div>
              <div className="w-full sm:w-48">
                <select
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  disabled
                >
                  <option>{dict.shop.sort.label}</option>
                  <option>{dict.shop.sort.priceAsc}</option>
                  <option>{dict.shop.sort.priceDesc}</option>
                  <option>{dict.shop.sort.nameAsc}</option>
                  <option>{dict.shop.sort.nameDesc}</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mockProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
