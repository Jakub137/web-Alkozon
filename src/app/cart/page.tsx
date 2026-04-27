"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { useAge } from "@/context/AgeContext";

export default function CartPage() {
  const { dict } = useLanguage();
  const { cartItems, cartItemsCount, removeFromCart } = useCart();
  const { ageStatus } = useAge();

  const totalPrice = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grow">
      {ageStatus === "underage" && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md shadow-sm">
          <p className="font-bold">{dict.ageGate?.restrictedMessageTitle || "Ograniczenie wiekowe"}</p>
          <p>{dict.ageGate?.restrictedMessage || "Opcja składania zamówień na produkty alkoholowe jest dla Ciebie wyłączona."}</p>
        </div>
      )}

      <header className="mb-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-3 transition-colors">
          {dict.shop.cart.pageTitle}
        </h1>
        <p className="text-slate-600 dark:text-slate-300 transition-colors">
          {dict.shop.cart.items}: {cartItemsCount}
        </p>
      </header>

      {cartItems.length === 0 ? (
        <div className="w-full sm:w-[560px] sm:max-w-[560px] mx-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 text-center shadow-sm dark:shadow-slate-900/50">
          <p className="text-slate-600 dark:text-slate-300 mb-5">{dict.shop.cart.empty}</p>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center h-11 px-5 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-800 text-white font-medium transition-colors"
          >
            {dict.shop.cart.backToShop}
          </Link>
        </div>
      ) : (
        <div className="w-full sm:w-[560px] sm:max-w-[560px] mx-auto space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.product.id}
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 sm:p-5 shadow-sm dark:shadow-slate-900/50 flex flex-col sm:flex-row sm:items-center gap-4"
            >
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 truncate">
                  {item.product.name}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">{item.product.capacity}</p>
              </div>

              <div className="text-sm text-slate-700 dark:text-slate-200 shrink-0">
                x{item.quantity}
              </div>

              <div className="text-base font-bold text-slate-900 dark:text-slate-100 shrink-0">
                {(item.product.price * item.quantity).toFixed(2)} zl
              </div>

              <button
                type="button"
                onClick={() => removeFromCart(item.product.id)}
                className="h-9 min-w-[92px] px-3 inline-flex items-center justify-center rounded-md border border-slate-300 dark:border-slate-600 text-sm text-slate-700 dark:text-slate-200 hover:border-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors shrink-0 whitespace-nowrap"
              >
                {dict.shop.cart.remove}
              </button>
            </div>
          ))}

          <div className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm dark:shadow-slate-900/50 flex items-center justify-between gap-4">
            <span className="text-lg font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
              {dict.shop.cart.total}
            </span>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 whitespace-nowrap">
              {totalPrice.toFixed(2)} zl
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
