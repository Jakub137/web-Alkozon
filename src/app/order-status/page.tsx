"use client";

import Link from "next/link";
import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { findOrderByNumberAndEmail } from "@/data/orders";
import { BackendOrderStatus, OrderProgressStep, OrderRecord, OrderStatus } from "@/types/order";
import { useAuth } from "@/context/AuthContext";
import { extractOrderId, getMyOrders, getOrderById, mapBackendOrderStatusToUi } from "@/lib/api/orders";
import { ApiError } from "@/lib/api/types";
import { subscribeOrderStatusUpdates } from "@/lib/realtime/orderUpdates";

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

function getBackendStatusLabelKey(status?: BackendOrderStatus): BackendOrderStatus | null {
  return status ?? null;
}

function formatDate(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(value));
}

function formatDateTime(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function OrderStatusPage() {
  const { dict, lang } = useLanguage();
  const { token, user, authorizedRequest } = useAuth();
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [searched, setSearched] = useState(false);
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [myOrders, setMyOrders] = useState<OrderRecord[]>([]);
  const [isMyOrdersLoading, setIsMyOrdersLoading] = useState(false);
  const [myOrdersError, setMyOrdersError] = useState<string | null>(null);

  const currentLocale = lang === "pl" ? "pl-PL" : "en-US";
  const progressIndex = order ? getProgressIndex(order.status) : -1;

  const canSubmit = useMemo(
    () => orderNumber.trim().length > 0 && email.trim().length > 0,
    [email, orderNumber]
  );
  const orderItemsCount = useMemo(
    () => order?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0,
    [order]
  );
  const orderItemsTotal = useMemo(
    () => order?.items?.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0) ?? 0,
    [order]
  );
  const statusHistory = useMemo(() => {
    if (!order?.history?.length) return [];
    return [...order.history].sort(
      (left, right) => new Date(left.changedAt).getTime() - new Date(right.changedAt).getTime()
    );
  }, [order]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMsg(null);
    const normalizedOrderId = extractOrderId(orderNumber);

    if (token && normalizedOrderId) {
      try {
        setIsLoading(true);
        const result = await authorizedRequest((accessToken) =>
          getOrderById(accessToken, normalizedOrderId, user?.email ?? undefined)
        );
        setOrder(result);
        setSearched(true);
        return;
      } catch (error) {
        if (error instanceof ApiError && error.status !== 404) {
          setErrorMsg(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    const result = findOrderByNumberAndEmail(orderNumber, email);
    setOrder(result);
    setSearched(true);
  };

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    async function loadMyOrders() {
      try {
        setIsMyOrdersLoading(true);
        setMyOrdersError(null);
        const result = await authorizedRequest((accessToken) =>
          getMyOrders(accessToken, user?.email ?? undefined)
        );
        if (!cancelled) {
          setMyOrders(result);
        }
      } catch (error) {
        if (cancelled) return;
        if (error instanceof ApiError) {
          setMyOrdersError(error.message);
        } else {
          setMyOrdersError("Nie udało się pobrać listy Twoich zamówień.");
        }
      } finally {
        if (!cancelled) {
          setIsMyOrdersLoading(false);
        }
      }
    }

    void loadMyOrders();
    return () => {
      cancelled = true;
    };
  }, [token, user?.email, authorizedRequest]);

  useEffect(() => {
    if (!token) return;

    return subscribeOrderStatusUpdates(token, (event) => {
      const nextUiStatus = mapBackendOrderStatusToUi(event.status);
      const targetOrderNumber = `ORD-${event.orderId}`;

      setMyOrders((prev) =>
        prev.map((entry) =>
          entry.orderNumber === targetOrderNumber
            ? { ...entry, status: nextUiStatus, apiStatus: event.status }
            : entry
        )
      );

      setOrder((prev) => {
        if (!prev || prev.orderNumber !== targetOrderNumber) return prev;
        return {
          ...prev,
          status: nextUiStatus,
          apiStatus: event.status,
        };
      });
    });
  }, [token]);

  useEffect(() => {
    const paramValue = new URLSearchParams(window.location.search).get("orderId");
    if (!paramValue || !token) return;

    const normalizedOrderId = extractOrderId(paramValue);
    if (!normalizedOrderId) return;

    let cancelled = false;
    async function preloadOrder() {
      try {
        setIsLoading(true);
        setOrderNumber(paramValue ?? "");
        setEmail(user?.email || "");
        const result = await authorizedRequest((accessToken) =>
          getOrderById(accessToken, normalizedOrderId, user?.email ?? undefined)
        );
        if (!cancelled) {
          setOrder(result);
          setSearched(true);
        }
      } catch (error) {
        if (cancelled) return;
        if (error instanceof ApiError && error.status !== 404) {
          setErrorMsg(error.message);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void preloadOrder();
    return () => {
      cancelled = true;
    };
  }, [token, user?.email, authorizedRequest]);

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
                disabled={!canSubmit || isLoading}
                className="h-11 min-w-[180px] px-4 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
              >
                {isLoading ? "Ładowanie..." : dict.orderStatusPage.form.submit}
              </button>
            </div>
          </form>
        </section>

        {errorMsg && (
          <section className="bg-white dark:bg-slate-800 border border-red-200 dark:border-red-900/40 rounded-2xl p-5 sm:p-6 shadow-sm dark:shadow-slate-900/50">
            <p className="text-sm text-red-700 dark:text-red-300">{errorMsg}</p>
          </section>
        )}

        {token && (
          <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-6 shadow-sm dark:shadow-slate-900/50">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {dict.orderStatusPage.myOrders?.title || "Moje zamówienia"}
              </h2>
              {isMyOrdersLoading && (
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {dict.orderStatusPage.myOrders?.loading || "Ładowanie..."}
                </span>
              )}
            </div>

            {myOrdersError && (
              <p className="text-sm text-red-700 dark:text-red-300 mb-3">{myOrdersError}</p>
            )}

            {myOrders.length === 0 ? (
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {dict.orderStatusPage.myOrders?.empty || "Nie masz jeszcze żadnych zamówień."}
              </p>
            ) : (
              <div className="space-y-2">
                {myOrders.map((entry) => {
                  const apiLabelKey = getBackendStatusLabelKey(entry.apiStatus);
                  const statusLabel = apiLabelKey
                    ? dict.orderStatusPage.backendStatuses?.[apiLabelKey] || dict.orderStatusPage.statuses[entry.status]
                    : dict.orderStatusPage.statuses[entry.status];

                  return (
                    <button
                      key={entry.orderNumber}
                      type="button"
                      onClick={() => {
                        setOrder(entry);
                        setOrderNumber(entry.orderNumber);
                        setEmail(entry.email || user?.email || "");
                        setSearched(true);
                      }}
                      className="w-full text-left rounded-xl border border-slate-200 dark:border-slate-700 p-3 bg-slate-50 dark:bg-slate-900/30 hover:border-blue-500 transition-colors"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {entry.orderNumber}
                        </span>
                        <span className={`h-7 px-2.5 rounded-full text-xs font-semibold inline-flex items-center ${getStatusTone(entry.status)}`}>
                          {statusLabel}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {dict.orderStatusPage.details.placedAt}: {formatDate(entry.placedAt, currentLocale)}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        )}

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
                  {order.apiStatus
                    ? dict.orderStatusPage.backendStatuses?.[order.apiStatus] || dict.orderStatusPage.statuses[order.status]
                    : dict.orderStatusPage.statuses[order.status]}
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
                    {order.apiStatus
                      ? dict.orderStatusPage.backendStatuses?.[order.apiStatus] || dict.orderStatusPage.statuses[order.status]
                      : dict.orderStatusPage.statuses[order.status]}
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
                {order.apiStatus
                  ? dict.orderStatusPage.backendNextSteps?.[order.apiStatus] || dict.orderStatusPage.nextSteps[order.status]
                  : dict.orderStatusPage.nextSteps[order.status]}
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

            {statusHistory.length > 0 && (
              <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-6 shadow-sm dark:shadow-slate-900/50">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
                  {dict.orderStatusPage.timelineTitle}
                </h3>
                <div className="space-y-3">
                  {statusHistory.map((item) => (
                    <div
                      key={`${item.status}-${item.changedAt}`}
                      className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900/30"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span
                          className={`h-7 px-2.5 rounded-full text-xs font-semibold inline-flex items-center ${getStatusTone(item.status)}`}
                        >
                          {dict.orderStatusPage.statuses[item.status]}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {formatDateTime(item.changedAt, currentLocale)}
                        </span>
                      </div>
                      {item.note && (
                        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                          {dict.orderStatusPage.timelineNotePrefix} {item.note}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {order.items && order.items.length > 0 && (
              <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-6 shadow-sm dark:shadow-slate-900/50">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
                  {dict.orderStatusPage.items.title}
                </h3>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 bg-slate-50 dark:bg-slate-900/30 flex items-center gap-3"
                    >
                      <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0">
                        {item.image ? (
                          <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-lg">🍾</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {dict.orderStatusPage.items.quantityLabel}: {item.quantity} ·{" "}
                          {dict.orderStatusPage.items.unitPriceLabel}: {item.unitPrice.toFixed(2)} zl
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                        {(item.unitPrice * item.quantity).toFixed(2)} zl
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-xl border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900/30 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {dict.orderStatusPage.items.totalItemsLabel}:{" "}
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{orderItemsCount}</span>
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {dict.orderStatusPage.items.totalValueLabel}:{" "}
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {orderItemsTotal.toFixed(2)} zl
                    </span>
                  </p>
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
