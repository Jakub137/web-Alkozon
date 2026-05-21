import { apiRequest } from "./client";
import {
  listMyCustomOrders,
  requestCustomOrderTrack,
  type ApiCustomOrderListItem,
  type ApiCustomOrderTrackResponse,
} from "./customOrders";
import { ApiError } from "./types";
import type { Product } from "@/types/product";
import type {
  BackendCustomOrderStatus,
  BackendOrderStatus,
  DeliveryDetails,
  OrderRecord,
  OrderStatus,
} from "@/types/order";

interface ApiOrderItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
}

interface ApiOrderResponse {
  id: number;
  orderNumber?: string | null;
  clientOrderNumber?: string | null;
  customerId: number;
  status: BackendOrderStatus;
  /** Opcjonalne — backend może zwracać tylko deliveryDetails. */
  deliveryAddress?: string | null;
  deliveryDetails?: DeliveryDetails | null;
  totalAmount: number;
  createdAt: string;
  deliveredAt: string | null;
  items: ApiOrderItem[];
}

export type CreateOrderDelivery = {
  recipientName: string;
  streetAddress: string;
  city: string;
  postalCode: string;
  country: string;
  deliveryNotes?: string;
  paymentMethod: string;
};

interface ApiOrderTrackResponse {
  orderId: number;
  orderNumber?: string | null;
  clientOrderNumber?: string | null;
  status: BackendOrderStatus;
  createdAt: string;
  updatedAt: string;
}

export function mapBackendOrderStatusToUi(status: BackendOrderStatus): OrderStatus {
  switch (status) {
    case "SUBMITTED":
      return "received";
    case "IN_PRODUCTION":
    case "IN_PACKING":
      return "processing";
    case "IN_DELIVERY":
      return "shipped";
    case "DELIVERED":
      return "delivered";
    case "CANCELLED":
      return "cancelled";
    default:
      return "processing";
  }
}

export function mapCustomOrderStatusToUi(status: BackendCustomOrderStatus): OrderStatus {
  switch (status) {
    case "PENDING":
      return "received";
    case "IN_PROGRESS":
      return "processing";
    case "COMPLETED":
      return "delivered";
    case "REJECTED":
      return "cancelled";
    default:
      return "processing";
  }
}

const UNIFIED_BACKEND_STATUSES: BackendOrderStatus[] = [
  "SUBMITTED",
  "IN_PRODUCTION",
  "IN_PACKING",
  "IN_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

/** Custom-orders na main: ten sam enum co sklep; starsze odpowiedzi mogą mieć PENDING/IN_PROGRESS. */
export function mapApiCustomStatusToUi(status: string): {
  status: OrderStatus;
  apiStatus: BackendOrderStatus | BackendCustomOrderStatus;
} {
  if (UNIFIED_BACKEND_STATUSES.includes(status as BackendOrderStatus)) {
    const apiStatus = status as BackendOrderStatus;
    return { status: mapBackendOrderStatusToUi(apiStatus), apiStatus };
  }
  const legacy = status as BackendCustomOrderStatus;
  return { status: mapCustomOrderStatusToUi(legacy), apiStatus: legacy };
}

export function parseEstimatedPriceFromPreferences(
  preferences: Record<string, unknown> | null | undefined
): number | undefined {
  if (!preferences) return undefined;
  const raw = preferences.estimatedPrice;
  if (typeof raw === "number" && Number.isFinite(raw)) return raw;
  if (typeof raw === "string") {
    const n = Number(raw.replace(",", ".").trim());
    if (Number.isFinite(n)) return n;
  }
  return undefined;
}

/**
 * Uzupełnia pozycję zamówienia własnego o szacunkową cenę z preferences (konfigurator).
 */
export function applyCustomEstimatedPriceFromPreferences(
  record: OrderRecord,
  preferences: Record<string, unknown> | null | undefined
): OrderRecord {
  if (record.kind !== "custom") return record;
  const unit = parseEstimatedPriceFromPreferences(preferences);
  if (unit == null || !record.items?.length) return record;
  return {
    ...record,
    items: record.items.map((it, idx) => (idx === 0 ? { ...it, unitPrice: unit } : it)),
  };
}

function deliveryDetailsToLine(details: DeliveryDetails | null | undefined): string | undefined {
  if (!details) return undefined;
  const cityLine = [details.postalCode?.trim(), details.city?.trim()].filter(Boolean).join(" ");
  const parts = [details.streetAddress?.trim(), cityLine || undefined].filter(Boolean);
  const line = parts.join(", ").trim();
  return line || undefined;
}

function estimateDelivery(createdAt: string, deliveredAt: string | null): string {
  if (deliveredAt) return deliveredAt;
  const base = new Date(createdAt).getTime();
  return new Date(base + 3 * 24 * 60 * 60 * 1000).toISOString();
}

/**
 * Wartość do parametru orderId w trackingu: cyfry, ORD-*, CUSTOM-* (bez zmian wielkości liter po normalizacji).
 */
export function extractOrderId(orderNumber: string): string {
  const raw = orderNumber.trim();
  if (!raw) return "";

  const prefixed = raw.match(/^ORD-(\d+)$/i);
  if (prefixed?.[1]) return prefixed[1];

  if (/^CUSTOM-\d+$/i.test(raw)) return raw;

  if (/^\d+$/.test(raw)) return raw;
  return "";
}

export function mapApiOrderToRecord(apiOrder: ApiOrderResponse, email = ""): OrderRecord {
  const status = mapBackendOrderStatusToUi(apiOrder.status);
  const deliveryAddress =
    (apiOrder.deliveryAddress && apiOrder.deliveryAddress.trim()) ||
    deliveryDetailsToLine(apiOrder.deliveryDetails) ||
    undefined;

  return {
    kind: "shop",
    orderNumber: `ORD-${apiOrder.id}`,
    clientOrderNumber: apiOrder.clientOrderNumber ?? apiOrder.orderNumber ?? undefined,
    email,
    placedAt: apiOrder.createdAt,
    estimatedDelivery: estimateDelivery(apiOrder.createdAt, apiOrder.deliveredAt),
    status,
    apiStatus: apiOrder.status,
    deliveryAddress,
    deliveryDetails: apiOrder.deliveryDetails ?? null,
    history: [
      { status: "received", changedAt: apiOrder.createdAt },
      ...(apiOrder.deliveredAt
        ? [{ status: "delivered" as const, changedAt: apiOrder.deliveredAt }]
        : []),
    ],
    items: apiOrder.items.map((item) => ({
      id: String(item.productId),
      name: item.productName,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
      image: undefined,
    })),
  };
}

function mapTrackOrderToRecord(track: ApiOrderTrackResponse, email: string): OrderRecord {
  const status = mapBackendOrderStatusToUi(track.status);
  const estimatedDelivery =
    status === "delivered"
      ? track.updatedAt
      : new Date(new Date(track.createdAt).getTime() + 3 * 24 * 60 * 60 * 1000).toISOString();

  return {
    kind: "shop",
    orderNumber: `ORD-${track.orderId}`,
    clientOrderNumber: track.clientOrderNumber ?? undefined,
    email,
    placedAt: track.createdAt,
    estimatedDelivery,
    status,
    apiStatus: track.status,
    history: [
      { status: "received", changedAt: track.createdAt },
      ...(status === "delivered"
        ? [{ status: "delivered" as const, changedAt: track.updatedAt }]
        : []),
    ],
  };
}

function resolveTrackedCustomId(track: ApiCustomOrderTrackResponse): number {
  const candidates = [track.customOrderId, track.orderId, track.id];
  for (const c of candidates) {
    if (typeof c === "number" && c > 0) return c;
  }
  return 0;
}

function mapCustomOrderTrackToRecord(
  track: ApiCustomOrderTrackResponse,
  email: string
): OrderRecord {
  const { status, apiStatus } = mapApiCustomStatusToUi(track.status);
  const id = resolveTrackedCustomId(track);
  const estimatedDelivery =
    status === "delivered"
      ? track.updatedAt
      : new Date(new Date(track.createdAt).getTime() + 3 * 24 * 60 * 60 * 1000).toISOString();

  const desc = (track.description && track.description.trim()) || "";

  return {
    kind: "custom",
    orderNumber: id > 0 ? `CUSTOM-${id}` : "CUSTOM-0",
    clientOrderNumber: track.clientOrderNumber ?? undefined,
    customDescription: track.description ?? undefined,
    email,
    placedAt: track.createdAt,
    estimatedDelivery,
    status,
    apiStatus,
    history: [
      { status: "received", changedAt: track.createdAt },
      ...(status === "delivered"
        ? [{ status: "delivered" as const, changedAt: track.updatedAt }]
        : []),
    ],
    items: [
      {
        id: id > 0 ? `line-custom-${id}` : "line-custom",
        name: desc || "Custom order",
        quantity: 1,
        unitPrice: 0,
        image: "/products/custom-order.jpg",
      },
    ],
  };
}

function clientOrderNumberFromCustomListApi(api: ApiCustomOrderListItem): string | undefined {
  if (api.clientOrderNumber?.trim()) return api.clientOrderNumber.trim();
  const p = api.preferences?.clientOrderNumber;
  return typeof p === "string" && p.trim() ? p.trim() : undefined;
}

function mapCustomOrderListItemToRecord(api: ApiCustomOrderListItem, email: string): OrderRecord {
  const { status, apiStatus } = mapApiCustomStatusToUi(api.status);
  const estimatedDelivery =
    status === "delivered"
      ? api.updatedAt
      : new Date(new Date(api.createdAt).getTime() + 3 * 24 * 60 * 60 * 1000).toISOString();

  const unitPrice = parseEstimatedPriceFromPreferences(api.preferences) ?? 0;

  return {
    kind: "custom",
    orderNumber: `CUSTOM-${api.id}`,
    clientOrderNumber: clientOrderNumberFromCustomListApi(api),
    customDescription: api.description,
    email,
    placedAt: api.createdAt,
    estimatedDelivery,
    status,
    apiStatus,
    history: [
      { status: "received", changedAt: api.createdAt },
      ...(status === "delivered"
        ? [{ status: "delivered" as const, changedAt: api.updatedAt }]
        : []),
    ],
    items: [
      {
        id: `line-custom-${api.id}`,
        name: api.description,
        quantity: 1,
        unitPrice,
        image: "/products/custom-order.jpg",
      },
    ],
  };
}

export async function getOrderById(
  token: string,
  orderId: string,
  email?: string
): Promise<OrderRecord> {
  const result = await apiRequest<ApiOrderResponse>(`/api/orders/${orderId}`, { token });
  return mapApiOrderToRecord(result, email);
}

export async function getMyOrders(token: string, email?: string): Promise<OrderRecord[]> {
  const result = await apiRequest<ApiOrderResponse[]>("/api/orders/my", { token });
  return result.map((order) => mapApiOrderToRecord(order, email));
}

export async function getMyOrdersMerged(token: string, email?: string): Promise<OrderRecord[]> {
  const safeEmail = email ?? "";
  const [shop, customRows] = await Promise.all([
    getMyOrders(token, email),
    listMyCustomOrders(token),
  ]);
  const custom = customRows.map((row) => mapCustomOrderListItemToRecord(row, safeEmail));
  return [...shop, ...custom].sort(
    (a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime()
  );
}

async function trackShopOrderPublic(orderId: string, email: string): Promise<OrderRecord> {
  const params = new URLSearchParams({
    orderId: orderId.trim(),
    email: email.trim(),
  });
  const result = await apiRequest<ApiOrderTrackResponse>(`/api/orders/track?${params.toString()}`);
  return mapTrackOrderToRecord(result, email.trim());
}

/**
 * Najpierw sklep (/api/orders/track), przy 404 — zamówienie własne (/api/custom-orders/track).
 */
export async function trackOrderPublic(orderId: string, email: string): Promise<OrderRecord> {
  try {
    return await trackShopOrderPublic(orderId, email);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      const raw = await requestCustomOrderTrack(orderId, email);
      return mapCustomOrderTrackToRecord(raw, email.trim());
    }
    throw error;
  }
}

export async function createOrder(
  token: string,
  payload: {
    clientOrderNumber: string;
    items: Array<{ productId: number; quantity: number }>;
    delivery: CreateOrderDelivery;
  }
): Promise<OrderRecord> {
  const result = await apiRequest<ApiOrderResponse>("/api/orders", {
    method: "POST",
    token,
    body: payload,
  });
  return mapApiOrderToRecord(result);
}

export function buildOrderItemsFromCart(products: Array<{ product: Product; quantity: number }>) {
  return products
    .map(({ product, quantity }) => ({ productId: Number(product.id), quantity }))
    .filter((item) => Number.isInteger(item.productId) && item.productId > 0 && item.quantity > 0);
}
