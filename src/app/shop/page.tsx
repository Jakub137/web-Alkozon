"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ProductCategory } from "@/types/product";
import ProductCard from "@/components/ProductCard";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { useAge } from "@/context/AgeContext";
import { useAuth } from "@/context/AuthContext";
import { CategoryIcon } from "@/components/CategoryIcon";
import UnderageRestrictedPage from "@/components/UnderageRestrictedPage";
import { getProducts } from "@/lib/api/products";
import { ApiError } from "@/lib/api/types";

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
  const { ageStatus } = useAge();
  const { user, setToast } = useAuth();
  const categoryOptions: ProductCategory[] = ["vodka", "whisky", "wine", "beer", "liqueur", "rum"];
  const isCartLimitReached = cartItemsCount >= cartItemsLimit;
  const canOrder = user?.role === "CUSTOMER" && Boolean(user.ageConfirmedAt);

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 300);

  const [sortKey, setSortKey] = useState<SortKey>("nameAsc");
  const [selectedCategories, setSelectedCategories] = useState<ProductCategory[]>([]);
  const [priceMin, setPriceMin] = useState<number>(0);
  const [priceMax, setPriceMax] = useState<number>(2000);
  const [products, setProducts] = useState<Awaited<ReturnType<typeof getProducts>>["content"]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);

  const selectedCategoriesKey = useMemo(
    () => selectedCategories.slice().sort().join(","),
    [selectedCategories]
  );

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedQuery, sortKey, selectedCategoriesKey, priceMin, priceMax]);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      if (ageStatus === "underage") {
        setProducts([]);
        setTotalPages(1);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setErrorMsg(null);

        const selectedCategory =
          selectedCategories.length === 1 ? selectedCategories[0] : undefined;
        const response = await getProducts({
          page: Math.max(currentPage - 1, 0),
          size: ITEMS_PER_PAGE,
          sort: sortKey,
          q: debouncedQuery,
          category: selectedCategory,
          minPrice: Math.min(priceMin, priceMax),
          maxPrice: Math.max(priceMin, priceMax),
        });

        if (cancelled) return;
        setProducts(response.content);
        setTotalPages(Math.max(1, response.totalPages));
      } catch (error) {
        if (cancelled) return;
        if (error instanceof ApiError && error.status === 429) {
          setErrorMsg("Zbyt wiele zapytań do wyszukiwarki. Spróbuj ponownie za chwilę.");
        } else {
          setErrorMsg("Nie udało się pobrać produktów.");
        }
        setProducts([]);
        setTotalPages(1);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadProducts();
    return () => {
      cancelled = true;
    };
  }, [ageStatus, currentPage, debouncedQuery, selectedCategories, sortKey, priceMin, priceMax]);

  const handleAddToCart = (product: (typeof products)[number]) => {
    if (!canOrder) {
      setToast(
        dict.shop.cart.checkout?.authRequired ||
          "Aby złożyć zamówienie, zaloguj się lub załóż konto."
      );
      return;
    }

    addToCart(product);
  };

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
    setSelectedCategories((prev) => (prev.includes(cat) ? [] : [cat]));
  };

  if (ageStatus === "underage") {
    return <UnderageRestrictedPage />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grow flex flex-col min-w-0 w-full overflow-x-hidden">
      <header className="mb-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4 transition-colors">
          {dict.shop.title}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto transition-colors">
          {dict.shop.subtitle}
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-w-0 max-w-full">
        <aside className="w-full min-w-0 max-w-full lg:w-64 lg:min-w-64 lg:max-w-64 shrink-0">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm dark:shadow-slate-900/50 min-w-0 max-w-full overflow-hidden">
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
                        <span className="flex items-center gap-2 truncate">
                          <CategoryIcon category={cat} className="w-4 h-4 text-slate-500" />
                          {dict.shop.categories[cat]}
                        </span>
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

        <div className="flex-1 flex flex-col min-w-0 max-w-full">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 mb-6 shadow-sm dark:shadow-slate-900/50 min-w-0 max-w-full">
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

          {errorMsg && (
            <div
              data-testid="shop-catalog-error"
              className="mb-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 text-sm text-red-700 dark:text-red-300"
            >
              {errorMsg}
            </div>
          )}

          {isLoading ? (
            <div
              data-testid="shop-catalog-loading"
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 text-center text-slate-600 dark:text-slate-300 shadow-sm dark:shadow-slate-900/50"
            >
              Ładowanie produktów...
            </div>
          ) : products.length === 0 ? (
            <div
              data-testid="shop-catalog-empty"
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 text-center text-slate-600 dark:text-slate-300 shadow-sm dark:shadow-slate-900/50"
            >
              {dict.shop.noProducts}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 min-w-0 max-w-full [&>*]:min-w-0">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    isAddDisabled={isCartLimitReached}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-auto pt-8 w-full max-w-full">
                  <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="h-10 min-w-0 px-3 sm:px-4 sm:min-w-[90px] rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
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
                    className="h-10 min-w-0 px-3 sm:px-4 sm:min-w-[90px] rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
                    aria-label={dict.shop.pagination.next}
                  >
                    {dict.shop.pagination.next}
                  </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <button
        type="button"
        aria-label={dict.shop.cart.title}
        onClick={() => setIsMobileCartOpen((open) => !open)}
        className="fixed bottom-4 left-4 sm:bottom-6 z-50 h-14 w-14 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl dark:shadow-slate-900/60 flex items-center justify-center animate-bounce"
      >
        <span className="text-3xl leading-none">🛒</span>
        <span className="absolute -top-1 -right-1 min-w-6 h-6 px-1 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
          {cartItemsCount}
        </span>
      </button>

      {isMobileCartOpen && (
        <div className="fixed bottom-20 left-4 sm:bottom-24 z-50 w-72 max-w-[calc(100vw-2rem)] animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl dark:shadow-slate-900/60 p-4">
            <button
              type="button"
              onClick={() => setIsMobileCartOpen(false)}
              aria-label="Zamknij koszyk"
              className="absolute top-3 right-3 h-8 w-8 inline-flex items-center justify-center rounded-full border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-300 hover:text-red-600 hover:border-red-400 dark:hover:text-red-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
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
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        x{item.quantity}
                      </span>
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
      )}
    </div>
  );
}
