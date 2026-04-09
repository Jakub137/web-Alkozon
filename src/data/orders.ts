import { OrderRecord } from "@/types/order";

export const mockOrders: OrderRecord[] = [
  {
    orderNumber: "ALK-2026-0001",
    email: "jakub@example.com",
    placedAt: "2026-03-20T10:30:00.000Z",
    estimatedDelivery: "2026-03-25T00:00:00.000Z",
    status: "processing",
    history: [
      { status: "received", changedAt: "2026-03-20T10:30:00.000Z" },
      { status: "paid", changedAt: "2026-03-20T10:34:00.000Z" },
      { status: "processing", changedAt: "2026-03-21T07:20:00.000Z", note: "Kompletujemy zamówienie." },
    ],
    items: [
      {
        id: "whisky-1",
        name: "Glenfiddich 12 YO",
        quantity: 1,
        unitPrice: 179.99,
        image: "/products/glenfiddich.jpg",
      },
      {
        id: "wine-1",
        name: "Chianti Classico DOCG",
        quantity: 2,
        unitPrice: 89.99,
        image: "/products/chianti.jpg",
      },
    ],
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
    history: [
      { status: "received", changedAt: "2026-03-18T08:10:00.000Z" },
      { status: "paid", changedAt: "2026-03-18T08:12:00.000Z" },
      { status: "processing", changedAt: "2026-03-18T14:35:00.000Z" },
      {
        status: "shipped",
        changedAt: "2026-03-19T09:05:00.000Z",
        note: "Paczka przekazana do kuriera.",
      },
    ],
    items: [
      {
        id: "rum-1",
        name: "Havana Club Anejo 7",
        quantity: 1,
        unitPrice: 119.99,
        image: "/products/havana-club.jpg",
      },
      {
        id: "vodka-1",
        name: "Belvedere Pure",
        quantity: 1,
        unitPrice: 149.99,
        image: "/products/belvedere.jpg",
      },
    ],
  },
  {
    orderNumber: "ALK-2026-0003",
    email: "michal@example.com",
    placedAt: "2026-03-12T09:20:00.000Z",
    estimatedDelivery: "2026-03-16T00:00:00.000Z",
    status: "delivered",
    history: [
      { status: "received", changedAt: "2026-03-12T09:20:00.000Z" },
      { status: "paid", changedAt: "2026-03-12T09:25:00.000Z" },
      { status: "processing", changedAt: "2026-03-12T17:15:00.000Z" },
      { status: "shipped", changedAt: "2026-03-13T08:45:00.000Z" },
      { status: "delivered", changedAt: "2026-03-15T15:12:00.000Z" },
    ],
    items: [
      {
        id: "liqueur-1",
        name: "Jagermeister",
        quantity: 1,
        unitPrice: 79.99,
        image: "/products/jagermeister.jpg",
      },
      {
        id: "beer-1",
        name: "Guinness Draught",
        quantity: 3,
        unitPrice: 12.99,
        image: "/products/guinness.jpg",
      },
    ],
  },
  {
    orderNumber: "ALK-2026-0004",
    email: "ola@example.com",
    placedAt: "2026-03-21T12:40:00.000Z",
    estimatedDelivery: "2026-03-26T00:00:00.000Z",
    status: "payment_failed",
    history: [
      { status: "received", changedAt: "2026-03-21T12:40:00.000Z" },
      {
        status: "payment_failed",
        changedAt: "2026-03-21T12:43:00.000Z",
        note: "Brak autoryzacji płatności.",
      },
    ],
    items: [
      {
        id: "whisky-2",
        name: "Jameson",
        quantity: 1,
        unitPrice: 109.99,
        image: "/products/jameson.jpg",
      },
    ],
  },
  {
    orderNumber: "ALK-2026-0005",
    email: "pawel@example.com",
    placedAt: "2026-03-11T14:05:00.000Z",
    estimatedDelivery: "2026-03-15T00:00:00.000Z",
    status: "returned",
    history: [
      { status: "received", changedAt: "2026-03-11T14:05:00.000Z" },
      { status: "paid", changedAt: "2026-03-11T14:07:00.000Z" },
      { status: "processing", changedAt: "2026-03-11T18:22:00.000Z" },
      { status: "shipped", changedAt: "2026-03-12T09:02:00.000Z" },
      { status: "delivered", changedAt: "2026-03-13T16:45:00.000Z" },
      { status: "returned", changedAt: "2026-03-17T11:15:00.000Z", note: "Zwrot po odstąpieniu od umowy." },
    ],
    items: [
      {
        id: "vodka-2",
        name: "Chopin Rye",
        quantity: 1,
        unitPrice: 129.99,
        image: "/products/chopin.jpg",
      },
      {
        id: "wine-2",
        name: "Rioja Reserva",
        quantity: 1,
        unitPrice: 94.99,
        image: "/products/rioja.jpg",
      },
    ],
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
