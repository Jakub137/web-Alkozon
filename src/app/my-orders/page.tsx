"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { getMyOrders, mapBackendOrderStatusToUi } from "@/lib/api/orders";
import { ApiError } from "@/lib/api/types";
import { formatOrderDate, getBackendStatusLabelKey, getStatusTone } from "@/lib/orderStatusUi";
import { subscribeOrderStatusUpdates } from "@/lib/realtime/orderUpdates";
import type { OrderRecord } from "@/types/order";

export default function MyOrdersPage() {
  const router = useRouter();
  const { dict, lang } = useLanguage();
  const { token, user, authorizedRequest } = useAuth();
  const [myOrders, setMyOrders] = useState<OrderRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const currentLocale = lang === "pl" ? "pl-PL" : "en-US";
  const canUseCustomerEndpoints =
    Boolean(token) && user?.role === "CUSTOMER" && Boolean(user.ageConfirmedAt);

  useEffect(() => {
    if (!canUseCustomerEndpoints) return;
    let cancelled = false;

    async function load() {
      try {
        setIsLoading(true);
        setErrorMsg(null);
        const result = await authorizedRequest((accessToken) =>
          getMyOrders(accessToken, user?.email ?? undefined)
        );
        if (!cancelled) setMyOrders(result);
      } catch (error) {
        if (cancelled) return;
        if (error instanceof ApiError) {
          if (error.status === 401 || error.status === 403) {
            setErrorMsg(
              dict.orderStatusPage.access?.customerRequired ||
                "Aby pobierać zamówienia z konta, zaloguj się jako klient i potwierdź pełnoletność."
            );
          } else {
            setErrorMsg(error.message);
          }
        } else {
          setErrorMsg(dict.myOrdersPage.loadError || "Nie udało się pobrać listy zamówień.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [
    canUseCustomerEndpoints,
    user?.email,
    authorizedRequest,
    dict.orderStatusPage.access?.customerRequired,
    dict.myOrdersPage.loadError,
  ]);

  useEffect(() => {
    if (!canUseCustomerEndpoints) return;
    const accessToken = token;
    if (!accessToken) return;

    return subscribeOrderStatusUpdates(accessToken, (event) => {
      const nextUiStatus = mapBackendOrderStatusToUi(event.status);
      const targetOrderNumber = `ORD-${event.orderId}`;
      setMyOrders((prev) =>
        prev.map((entry) =>
          entry.orderNumber === targetOrderNumber
            ? { ...entry, status: nextUiStatus, apiStatus: event.status }
            : entry
        )
      );
    });
  }, [canUseCustomerEndpoints, token]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grow">
      <header className="mb-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-3 transition-colors">
          {dict.myOrdersPage.title}
        </h1>
        <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto transition-colors">
          {dict.myOrdersPage.subtitle}
        </p>
      </header>

      {!canUseCustomerEndpoints && (
        <div className="rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-900/20 px-4 py-3 text-sm text-amber-800 dark:text-amber-300 mb-6">
          {dict.orderStatusPage.access?.customerRequired ||
            "Aby pobierać zamówienia z konta, zaloguj się jako klient i potwierdź pełnoletność."}
        </div>
      )}

      {errorMsg && (
        <div className="rounded-xl border border-red-200 dark:border-red-900/40 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-red-700 dark:text-red-300 mb-6">
          {errorMsg}
        </div>
      )}

      {canUseCustomerEndpoints && (
        <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-6 shadow-sm dark:shadow-slate-900/50">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {dict.orderStatusPage.myOrders?.title || dict.myOrdersPage.title}
            </h2>
            {isLoading && (
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {dict.orderStatusPage.myOrders?.loading || "…"}
              </span>
            )}
          </div>

          {myOrders.length === 0 && !isLoading ? (
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {dict.orderStatusPage.myOrders?.empty || dict.myOrdersPage.empty}
            </p>
          ) : (
            <div className="space-y-2">
              {myOrders.map((entry) => {
                const apiLabelKey = getBackendStatusLabelKey(entry.apiStatus);
                const statusLabel = apiLabelKey
                  ? dict.orderStatusPage.backendStatuses?.[apiLabelKey] ||
                    dict.orderStatusPage.statuses[entry.status]
                  : dict.orderStatusPage.statuses[entry.status];

                return (
                  <button
                    key={entry.orderNumber}
                    type="button"
                    onClick={() =>
                      router.push(`/order-status?orderId=${encodeURIComponent(entry.orderNumber)}`)
                    }
                    className="w-full text-left rounded-xl border border-slate-200 dark:border-slate-700 p-3 bg-slate-50 dark:bg-slate-900/30 hover:border-blue-500 transition-colors"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {entry.clientOrderNumber || entry.orderNumber}
                      </span>
                      <span
                        className={`h-7 px-2.5 rounded-full text-xs font-semibold inline-flex items-center ${getStatusTone(entry.status)}`}
                      >
                        {statusLabel}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {dict.orderStatusPage.details.placedAt}:{" "}
                      {formatOrderDate(entry.placedAt, currentLocale)}
                    </p>
                  </button>
                );
              })}
            </div>
          )}

          <p className="mt-6 text-center">
            <Link
              href="/order-status"
              className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 underline"
            >
              {dict.myOrdersPage.linkOrderStatus}
            </Link>
          </p>
        </section>
      )}
    </div>
  );
}
