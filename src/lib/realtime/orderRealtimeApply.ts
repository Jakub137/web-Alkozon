import {
  mapApiCustomStatusToUi,
  mapBackendOrderStatusToUi,
} from "@/lib/api/orders";
import type {
  BackendOrderStatus,
  OrderRecord,
  OrderStatus,
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

export function applyRealtimeEventToOrderRecord(
  entry: OrderRecord,
  event: OrderStatusUpdateEvent
): OrderRecord | null {
  if (!orderMatchesRealtimeEvent(entry, event)) {
    return null;
  }
  const mapped = mapRealtimeStatusToOrderUpdate(event.status, entry.kind);
  return {
    ...entry,
    status: mapped.status,
    apiStatus: mapped.apiStatus,
  };
}
