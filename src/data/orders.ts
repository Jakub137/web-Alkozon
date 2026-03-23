import { OrderRecord } from "@/types/order";

export const mockOrders: OrderRecord[] = [
  {
    orderNumber: "ALK-2026-0001",
    email: "jakub@example.com",
    placedAt: "2026-03-20T10:30:00.000Z",
    estimatedDelivery: "2026-03-25T00:00:00.000Z",
    status: "processing",
  },
  {
    orderNumber: "ALK-2026-0002",
    email: "anna@example.com",
    placedAt: "2026-03-18T08:10:00.000Z",
    estimatedDelivery: "2026-03-22T00:00:00.000Z",
    status: "shipped",
    tracking: {
      carrier: "InPost",
      trackingNumber: "IPX123456789PL",
      trackingUrl: "https://inpost.pl/sledzenie-przesylek?number=IPX123456789PL",
    },
  },
  {
    orderNumber: "ALK-2026-0003",
    email: "michal@example.com",
    placedAt: "2026-03-12T09:20:00.000Z",
    estimatedDelivery: "2026-03-16T00:00:00.000Z",
    status: "delivered",
  },
  {
    orderNumber: "ALK-2026-0004",
    email: "ola@example.com",
    placedAt: "2026-03-21T12:40:00.000Z",
    estimatedDelivery: "2026-03-26T00:00:00.000Z",
    status: "payment_failed",
  },
  {
    orderNumber: "ALK-2026-0005",
    email: "pawel@example.com",
    placedAt: "2026-03-11T14:05:00.000Z",
    estimatedDelivery: "2026-03-15T00:00:00.000Z",
    status: "returned",
  },
];

export function findOrderByNumberAndEmail(orderNumber: string, email: string): OrderRecord | null {
  const normalizedOrder = orderNumber.trim().toUpperCase();
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedOrder || !normalizedEmail) return null;

  const order =
    mockOrders.find(
      (entry) =>
        entry.orderNumber.trim().toUpperCase() === normalizedOrder &&
        entry.email.trim().toLowerCase() === normalizedEmail
    ) ?? null;

  return order;
}
