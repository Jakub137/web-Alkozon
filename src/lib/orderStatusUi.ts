import type { BackendOrderStatus, OrderStatus } from "@/types/order";

export function getStatusTone(status: OrderStatus): string {
  if (status === "cancelled" || status === "payment_failed" || status === "returned") {
    return "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300";
  }
  if (status === "delivered") {
    return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300";
  }
  return "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300";
}

export function getBackendStatusLabelKey(status?: BackendOrderStatus): BackendOrderStatus | null {
  return status ?? null;
}

export function formatOrderDate(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(value));
}

export function formatOrderDateTime(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
