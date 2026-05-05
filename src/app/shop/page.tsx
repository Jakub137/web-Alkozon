"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ProductCategory } from "@/types/product";
import { mockProducts } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";

const ITEMS_PER_PAGE = 8;

type SortKey = "priceAsc" | "priceDesc" | "nameAsc" | "nameDesc";

function useDebouncedValue<T>(value: T, delayMs: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedValue(value), delayMs);
    return () => window.clearTimeout(timeout);
  }, [value, delayMs]);

  return debouncedValue;
}

export default function ShopPage() {
  const { dict } = useLanguage();
  const { cartItems, cartItemsCount, cartItemsLimit, addToCart, removeFromCart } = useCart();
  const categoryOptions: ProductCategory[] = ["vodka", "whisky", "wine", "beer", "liqueur", "rum"];
  const isCartLimitReached = cartItemsCount >= cartItemsLimit;

  const priceBounds = useMemo(() => {
    let min = Number.POSITIVE_INFINITY;
    let max = Number.NEGATIVE_INFINITY;

    for (const p of mockProducts) {
      min = Math.min(min, p.price);
      max = Math.max(max, p.price);
    }

    return { min, max };
  }, []);

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 300);

  const [sortKey, setSortKey] = useState<SortKey>("nameAsc");
  const [selectedCategories, setSelectedCategories] = useState<ProductCategory[]>([]);

  const [priceMin, setPriceMin] = useState<number>(priceBounds.min);
  const [priceMax, setPriceMax] = useState<number>(priceBounds.max);

  const selectedCategoriesKey = useMemo(
    () => selectedCategories.slice().sort().join(","),
    [selectedCategories]
  );

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedQuery, sortKey, selectedCategoriesKey, priceMin, priceMax]);

  const filteredAndSorted = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    const min = Math.min(priceMin, priceMax);
    const max = Math.max(priceMin, priceMax);

    const filtered = mockProducts.filter((p) => {
      const matchQuery = q.length === 0 || p.name.toLowerCase().includes(q);
      const matchCategory =
        selectedCategories.length === 0 || selectedCategories.includes(p.category);
      const matchPrice = p.price >= min && p.price <= max;

      return matchQuery && matchCategory && matchPrice;
    });

    const sorted = filtered.slice();

    sorted.sort((a, b) => {
      switch (sortKey) {
        case "priceAsc":
          return a.price - b.price;
        case "priceDesc":
          return b.price - a.price;
        case "nameAsc":
          return a.name.localeCompare(b.name);
        case "nameDesc":
          return b.name.localeCompare(a.name);
      }
    });

    return sorted;
  }, [debouncedQuery, priceMin, priceMax, selectedCategories, sortKey]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSorted.length / ITEMS_PER_PAGE));

  useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredAndSorted.slice(start, end);
  }, [filteredAndSorted, currentPage]);

  const visiblePages = useMemo(() => {
    const maxButtons = 5;
    const total = totalPages;

    if (total <= maxButtons) return Array.from({ length: total }, (_, i) => i + 1);

    let start = Math.max(1, currentPage - 2);
    const end = Math.min(total, start + maxButtons - 1);
    start = Math.max(1, end - maxButtons + 1);

    const pages: number[] = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }, [currentPage, totalPages]);

  const toggleCategory = (cat: ProductCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((x) => x !== cat) : [...prev, cat]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grow flex flex-col">
      <header className="mb-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4 transition-colors">
          {dict.shop.title}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto transition-colors">
          {dict.shop.subtitle}
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-6 flex-1">
        <aside className="w-full lg:w-64 lg:min-w-64 lg:max-w-64 shrink-0">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm dark:shadow-slate-900/50">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 transition-colors">
              {dict.shop.filters.title}
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 transition-colors">
                  {dict.shop.filters.category}
                </label>
                <div className="space-y-3">
                  {categoryOptions.map((cat) => {
                    const checked = selectedCategories.includes(cat);
                    return (
                      <label
                        key={cat}
                        className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300 select-none"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleCategory(cat)}
                          className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="truncate">{dict.shop.categories[cat]}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 transition-colors">
                  {dict.shop.filters.priceRange}
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                      {dict.shop.filters.priceMin}
                    </span>
                    <input
                      type="number"
                      value={Number.isFinite(priceMin) ? priceMin : 0}
                      step={0.01}
                      min={priceBounds.min}
                      max={priceBounds.max}
                      onChange={(e) => setPriceMin(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <span className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                      {dict.shop.filters.priceMax}
                    </span>
                    <input
                      type="number"
                      value={Number.isFinite(priceMax) ? priceMax : 0}
                      step={0.01}
                      min={priceBounds.min}
                      max={priceBounds.max}
                      onChange={(e) => setPriceMax(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>{Math.min(priceMin, priceMax).toFixed(2)} zł</span>
                  <span>{Math.max(priceMin, priceMax).toFixed(2)} zł</span>
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
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <div className="w-full sm:w-48">
                <select
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value as SortKey)}
                >
                  <option value="priceAsc">{dict.shop.sort.priceAsc}</option>
                  <option value="priceDesc">{dict.shop.sort.priceDesc}</option>
                  <option value="nameAsc">{dict.shop.sort.nameAsc}</option>
                  <option value="nameDesc">{dict.shop.sort.nameDesc}</option>
                </select>
              </div>
            </div>
          </div>

          {filteredAndSorted.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 text-center text-slate-600 dark:text-slate-300 shadow-sm dark:shadow-slate-900/50">
              {dict.shop.noProducts}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {pageItems.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={addToCart}
                    isAddDisabled={isCartLimitReached}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-auto pt-8 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="h-10 min-w-[90px] px-4 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label={dict.shop.pagination.prev}
                  >
                    {dict.shop.pagination.prev}
                  </button>

                  {visiblePages.map((page) => {
                    const active = page === currentPage;
                    return (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        aria-current={active ? "page" : undefined}
                        className={`h-10 w-10 rounded-lg border transition-colors ${
                          active
                            ? "bg-blue-600 border-blue-600 text-white border-blue-600"
                            : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 hover:border-blue-500"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="h-10 min-w-[90px] px-4 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label={dict.shop.pagination.next}
                  >
                    {dict.shop.pagination.next}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="fixed bottom-4 left-4 sm:bottom-6 sm:right-6 z-40 w-72 max-w-[calc(100vw-2rem)]">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl dark:shadow-slate-900/60 p-4">
          <div className="flex items-start gap-3 mb-3">
            <div className="relative shrink-0">
              <span className="text-3xl leading-none">🛒</span>
              <span className="absolute -top-2 -left-2 min-w-5 h-5 px-1 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center">
                {cartItemsCount}
              </span>
            </div>

            <div className="min-w-0">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {dict.shop.cart.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {dict.shop.cart.items}: {cartItemsCount}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {dict.shop.cart.limit}: {cartItemsLimit}
              </p>
            </div>
          </div>

          {isCartLimitReached && (
            <p className="mb-3 text-xs text-red-600 dark:text-red-400">
              {dict.shop.cart.limitReached}
            </p>
          )}

          {cartItems.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">{dict.shop.cart.empty}</p>
          ) : (
            <ul className="max-h-44 overflow-y-auto space-y-2 pr-1">
              {cartItems.map((item) => (
                <li
                  key={item.product.id}
                  className="text-sm text-slate-700 dark:text-slate-200 flex items-center justify-between gap-3"
                >
                  <span className="truncate">{item.product.name}</span>
                  <div className="shrink-0 flex items-center gap-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400">x{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.product.id)}
                      className="h-7 px-2 rounded-md border border-slate-300 dark:border-slate-600 text-xs text-slate-700 dark:text-slate-200 hover:border-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      aria-label={dict.shop.cart.remove}
                    >
                      {dict.shop.cart.remove}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <Link
            href="/cart?from=shop"
            className="mt-3 w-full h-10 px-3 inline-flex items-center justify-center rounded-lg bg-green-600 hover:bg-green-600 dark:bg-green-500 dark:hover:bg-green-700 text-white text-sm font-medium transition-colors"
          >
            {dict.shop.cart.summary}
          </Link>
        </div>
      </div>
    </div>
  );
}
