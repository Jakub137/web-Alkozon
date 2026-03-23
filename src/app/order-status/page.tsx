"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { findOrderByNumberAndEmail } from "@/data/orders";
import { OrderProgressStep, OrderRecord, OrderStatus } from "@/types/order";

const PROGRESS_STEPS: OrderProgressStep[] = ["received", "processing", "shipped", "delivered"];

function getProgressIndex(status: OrderStatus): number {
  switch (status) {
    case "received":
    case "paid":
      return 0;
    case "processing":
      return 1;
    case "shipped":
      return 2;
    case "delivered":
    case "returned":
      return 3;
    case "cancelled":
    case "payment_failed":
      return -1;
    default:
      return -1;
  }
}

function getStatusTone(status: OrderStatus): string {
  if (status === "cancelled" || status === "payment_failed" || status === "returned") {
    return "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300";
  }
  if (status === "delivered") {
    return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300";
  }
  return "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300";
}

function formatDate(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(value));
}

export default function OrderStatusPage() {
  const { dict, lang } = useLanguage();
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [searched, setSearched] = useState(false);
  const [order, setOrder] = useState<OrderRecord | null>(null);

  const currentLocale = lang === "pl" ? "pl-PL" : "en-US";
  const progressIndex = order ? getProgressIndex(order.status) : -1;

  const canSubmit = useMemo(
    () => orderNumber.trim().length > 0 && email.trim().length > 0,
    [email, orderNumber]
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = findOrderByNumberAndEmail(orderNumber, email);
    setOrder(result);
    setSearched(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grow">
      <header className="mb-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-3 transition-colors">
          {dict.orderStatusPage.title}
        </h1>
        <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto transition-colors">
          {dict.orderStatusPage.subtitle}
        </p>
      </header>

      <div className="w-full sm:w-[920px] sm:max-w-[920px] mx-auto grid grid-cols-1 gap-6">
        <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-6 shadow-sm dark:shadow-slate-900/50">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {dict.orderStatusPage.form.orderNumberLabel}
              </label>
              <input
                type="text"
                value={orderNumber}
                onChange={(event) => setOrderNumber(event.target.value)}
                placeholder={dict.orderStatusPage.form.orderNumberPlaceholder}
                className="w-full h-11 px-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {dict.orderStatusPage.form.emailLabel}
              </label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={dict.orderStatusPage.form.emailPlaceholder}
                className="w-full h-11 px-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>

            <div className="sm:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={!canSubmit}
                className="h-11 min-w-[180px] px-4 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
              >
                {dict.orderStatusPage.form.submit}
              </button>
            </div>
          </form>
        </section>

        {searched && !order && (
          <section className="bg-white dark:bg-slate-800 border border-red-200 dark:border-red-900/40 rounded-2xl p-5 sm:p-6 shadow-sm dark:shadow-slate-900/50">
            <p className="text-sm text-red-700 dark:text-red-300">{dict.orderStatusPage.notFound}</p>
          </section>
        )}

        {order && (
          <>
            <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-6 shadow-sm dark:shadow-slate-900/50 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {dict.orderStatusPage.details.title}
                </h2>
                <span
                  className={`h-8 px-3 rounded-full text-xs font-semibold inline-flex items-center ${getStatusTone(order.status)}`}
                >
                  {dict.orderStatusPage.statuses[order.status]}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900/30">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                    {dict.orderStatusPage.details.orderNumber}
                  </p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{order.orderNumber}</p>
                </div>

                <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900/30">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                    {dict.orderStatusPage.details.placedAt}
                  </p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {formatDate(order.placedAt, currentLocale)}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900/30">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                    {dict.orderStatusPage.details.status}
                  </p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {dict.orderStatusPage.statuses[order.status]}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900/30">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                    {dict.orderStatusPage.details.estimatedDelivery}
                  </p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {formatDate(order.estimatedDelivery, currentLocale)}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">
                  {dict.orderStatusPage.progress.title}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PROGRESS_STEPS.map((step, index) => {
                    const isCompleted = progressIndex >= 0 && index < progressIndex;
                    const isCurrent = progressIndex >= 0 && index === progressIndex;

                    return (
                      <div
                        key={step}
                        className={`h-10 rounded-lg border text-xs sm:text-sm font-medium flex items-center justify-center transition-colors ${
                          isCurrent
                            ? "bg-blue-600 border-blue-600 text-white"
                            : isCompleted
                            ? "bg-emerald-600 border-emerald-600 text-white"
                            : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {dict.orderStatusPage.progress.steps[step]}
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-6 shadow-sm dark:shadow-slate-900/50 space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {dict.orderStatusPage.nextStepsTitle}
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                {dict.orderStatusPage.nextSteps[order.status]}
              </p>

              {order.status === "shipped" && order.tracking && (
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {dict.orderStatusPage.trackingPrefix}{" "}
                  <a
                    href={order.tracking.trackingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold underline"
                  >
                    {order.tracking.carrier}: {order.tracking.trackingNumber}
                  </a>
                </p>
              )}

              <div className="flex flex-wrap gap-3 pt-1">
                <Link
                  href="/shop"
                  className="h-11 min-w-[170px] px-4 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-700 text-white font-medium inline-flex items-center justify-center transition-colors whitespace-nowrap"
                >
                  {dict.orderStatusPage.buttons.goToShop}
                </Link>
                <a
                  href={`mailto:${dict.orderStatusPage.contactEmail}`}
                  className="h-11 min-w-[170px] px-4 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:border-blue-500 hover:text-blue-700 dark:hover:text-blue-400 font-medium inline-flex items-center justify-center transition-colors whitespace-nowrap"
                >
                  {dict.orderStatusPage.buttons.contact}
                </a>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
