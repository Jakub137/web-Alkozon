"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useAge } from "@/context/AgeContext";
import UnderageRestrictedPage from "@/components/UnderageRestrictedPage";
import { getProductById } from "@/lib/api/products";
import { ApiError } from "@/lib/api/types";

export default function ShopProductPage({ params }: { params: { id: string } }) {
  const { dict } = useLanguage();
  const { ageStatus } = useAge();
  const [product, setProduct] = useState<Awaited<ReturnType<typeof getProductById>> | null>(null);
  const [imageSrc, setImageSrc] = useState("/placeholder-product.svg");
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProduct() {
      if (ageStatus === "underage") {
        setProduct(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setNotFound(false);
        setErrorMsg(null);
        const data = await getProductById(params.id);
        if (!cancelled) {
          setProduct(data);
          setImageSrc(data.image || "/placeholder-product.svg");
        }
      } catch (error) {
        if (cancelled) return;
        if (error instanceof ApiError && error.status === 404) {
          setNotFound(true);
          setProduct(null);
        } else {
          setErrorMsg("Nie udało się pobrać danych produktu.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadProduct();
    return () => {
      cancelled = true;
    };
  }, [ageStatus, params.id]);

  if (ageStatus === "underage") {
    return <UnderageRestrictedPage />;
  }

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grow">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 text-center text-slate-600 dark:text-slate-300 shadow-sm dark:shadow-slate-900/50">
          Ładowanie produktu...
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grow">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 text-center text-slate-600 dark:text-slate-300 shadow-sm dark:shadow-slate-900/50">
          {dict.shop.noProducts}
        </div>
        <div className="mt-6">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center h-11 px-5 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium transition-colors"
          >
            {dict.shop.details.backToShop}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grow">
      {errorMsg && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 text-sm text-red-700 dark:text-red-300">
          {errorMsg}
        </div>
      )}
      <div className="mb-6">
        <Link
          href="/shop"
          className="inline-flex items-center justify-center h-11 px-5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:border-blue-500 transition-colors"
        >
          {dict.shop.details.backToShop}
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm dark:shadow-slate-900/50">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-80">
            <div className="relative w-full h-72 bg-slate-200 dark:bg-slate-900 rounded-xl flex items-center justify-center p-6">
              <Image
                src={imageSrc}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 320px"
                className="object-contain p-6"
                onError={() => setImageSrc("/placeholder-product.svg")}
              />
            </div>
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-2 transition-colors">
              {product.name}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 transition-colors">
              {product.capacity}
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6 transition-colors">
              {product.price.toFixed(2)} zł
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 p-4">
                <div className="text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  {dict.shop.details.capacity}
                </div>
                <div className="text-sm text-slate-900 dark:text-slate-100">{product.capacity}</div>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 p-4">
                <div className="text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  {dict.shop.details.alcoholContent}
                </div>
                <div className="text-sm text-slate-900 dark:text-slate-100">
                  {product.alcoholContent ? `${product.alcoholContent}%` : "—"}
                </div>
              </div>
            </div>

            <button
              type="button"
              disabled
              className="w-full h-11 px-4 bg-blue-600 opacity-50 cursor-not-allowed dark:bg-blue-500 rounded-lg font-medium transition-colors flex items-center justify-center whitespace-nowrap truncate"
            >
              {dict.shop.product.addToCart}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm dark:shadow-slate-900/50">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
            {dict.shop.details.descriptionTitle}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            {product.description || dict.shop.details.description}
          </p>
        </section>

        <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm dark:shadow-slate-900/50">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
            {dict.shop.details.historyTitle}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            {dict.shop.details.history}
          </p>
        </section>
      </div>
    </div>
  );
}
