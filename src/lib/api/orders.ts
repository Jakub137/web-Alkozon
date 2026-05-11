import { apiRequest } from "./client";
import type { Product } from "@/types/product";
import type { OrderRecord, OrderStatus } from "@/types/order";

interface ApiOrderItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
}

interface ApiOrderResponse {
  id: number;
  customerId: number;
  status: "SUBMITTED" | "IN_PRODUCTION" | "IN_PACKING" | "IN_DELIVERY" | "DELIVERED" | "CANCELLED";
  deliveryAddress: string;
  totalAmount: number;
  createdAt: string;
  deliveredAt: string | null;
  items: ApiOrderItem[];
}

function mapStatus(status: ApiOrderResponse["status"]): OrderStatus {
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

function estimateDelivery(createdAt: string, deliveredAt: string | null): string {
  if (deliveredAt) return deliveredAt;
  const base = new Date(createdAt).getTime();
  return new Date(base + 3 * 24 * 60 * 60 * 1000).toISOString();
}

export function extractOrderId(orderNumber: string): string {
  const raw = orderNumber.trim();
  if (!raw) return "";

  const prefixed = raw.match(/^ORD-(\d+)$/i);
  if (prefixed?.[1]) return prefixed[1];

  if (/^\d+$/.test(raw)) return raw;
  return "";
}

export function mapApiOrderToRecord(apiOrder: ApiOrderResponse, email = ""): OrderRecord {
  const status = mapStatus(apiOrder.status);
  return {
    orderNumber: `ORD-${apiOrder.id}`,
    email,
    placedAt: apiOrder.createdAt,
    estimatedDelivery: estimateDelivery(apiOrder.createdAt, apiOrder.deliveredAt),
    status,
    history: [
      { status: "received", changedAt: apiOrder.createdAt },
      ...(apiOrder.deliveredAt ? [{ status: "delivered" as const, changedAt: apiOrder.deliveredAt }] : []),
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

export async function getOrderById(token: string, orderId: string, email?: string): Promise<OrderRecord> {
  const result = await apiRequest<ApiOrderResponse>(`/api/orders/${orderId}`, { token });
  return mapApiOrderToRecord(result, email);
}

export async function getMyOrders(token: string, email?: string): Promise<OrderRecord[]> {
  const result = await apiRequest<ApiOrderResponse[]>("/api/orders/my", { token });
  return result.map((order) => mapApiOrderToRecord(order, email));
}

export async function createOrder(
  token: string,
  payload: { items: Array<{ productId: number; quantity: number }>; deliveryAddress: string }
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
