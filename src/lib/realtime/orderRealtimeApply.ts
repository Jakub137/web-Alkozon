import {
  mapApiCustomStatusToUi,
  mapBackendOrderStatusToUi,
} from "@/lib/api/orders";
import type {
  BackendOrderStatus,
  OrderRecord,
  OrderStatus,
  OrderStatusHistoryItem,
} from "@/types/order";
import type { OrderStatusUpdateEvent } from "@/lib/realtime/orderUpdates";

const UNIFIED_BACKEND_STATUSES: BackendOrderStatus[] = [
  "SUBMITTED",
  "IN_PRODUCTION",
  "IN_PACKING",
  "IN_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

function normalizeOrderRef(value: string | null | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed || undefined;
}

export function isUnifiedBackendOrderStatus(status: string): boolean {
  return UNIFIED_BACKEND_STATUSES.includes(status as BackendOrderStatus);
}

/**
 * Dopasowanie STOMP do wpisu listy / widoku statusu.
 * Backend: sklep → orderId z customer_orders; custom → id z custom_orders + clientOrderNumber.
 */
export function orderMatchesRealtimeEvent(
  entry: Pick<OrderRecord, "kind" | "orderNumber" | "clientOrderNumber">,
  event: Pick<OrderStatusUpdateEvent, "orderId" | "clientOrderNumber">
): boolean {
  const eventClient = normalizeOrderRef(event.clientOrderNumber);
  const entryClient = normalizeOrderRef(entry.clientOrderNumber);

  if (eventClient) {
    return Boolean(entryClient && eventClient === entryClient);
  }

  if (entry.kind === "custom") {
    return entry.orderNumber.toUpperCase() === `CUSTOM-${event.orderId}`;
  }

  return entry.orderNumber.toUpperCase() === `ORD-${event.orderId}`;
}

export function mapRealtimeStatusToOrderUpdate(
  status: string,
  kind?: OrderRecord["kind"]
): { status: OrderStatus; apiStatus: OrderRecord["apiStatus"] } {
  if (isUnifiedBackendOrderStatus(status)) {
    const apiStatus = status as BackendOrderStatus;
    return {
      status: mapBackendOrderStatusToUi(apiStatus),
      apiStatus,
    };
  }

  if (kind === "custom") {
    return mapApiCustomStatusToUi(status);
  }

  const apiStatus = status as BackendOrderStatus;
  return {
    status: mapBackendOrderStatusToUi(apiStatus),
    apiStatus,
  };
}

const TIMELINE_MILESTONES: OrderStatus[] = ["received", "processing", "shipped", "delivered"];

function progressIndexForTimeline(status: OrderStatus): number {
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
    default:
      return -1;
  }
}

/**
 * Uzupełnia oś czasu o brakujące etapy postępu (np. Przyjęte → W realizacji → Wysłane).
 * Ostatni etap dostaje aktualny czas zdarzenia STOMP.
 */
export function syncOrderHistoryWithStatus(
  history: OrderStatusHistoryItem[] | undefined,
  currentStatus: OrderStatus,
  placedAt: string,
  changedAt = new Date().toISOString()
): OrderStatusHistoryItem[] {
  const progressIdx = progressIndexForTimeline(currentStatus);
  if (progressIdx < 0) {
    const base = history?.length ? [...history] : [];
    const last = base[base.length - 1];
    if (last?.status === currentStatus) return base;
    return [...base, { status: currentStatus, changedAt }];
  }

  const byStatus = new Map((history ?? []).map((item) => [item.status, item]));
  const result: OrderStatusHistoryItem[] = [];

  for (let i = 0; i <= progressIdx; i += 1) {
    const step = TIMELINE_MILESTONES[i];
    const previous = byStatus.get(step);
    result.push({
      status: step,
      changedAt: i === progressIdx ? changedAt : (previous?.changedAt ?? placedAt),
    });
  }

  return result;
}

export function applyRealtimeEventToOrderRecord(
  entry: OrderRecord,
  event: OrderStatusUpdateEvent,
  changedAt = new Date().toISOString()
): OrderRecord | null {
  if (!orderMatchesRealtimeEvent(entry, event)) {
    return null;
  }
  const mapped = mapRealtimeStatusToOrderUpdate(event.status, entry.kind);
  if (mapped.status === entry.status && mapped.apiStatus === entry.apiStatus) {
    return null;
  }
  return {
    ...entry,
    status: mapped.status,
    apiStatus: mapped.apiStatus,
    history: syncOrderHistoryWithStatus(entry.history, mapped.status, entry.placedAt, changedAt),
  };
}
