export type OrderStatus =
  | "received"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "payment_failed"
  | "returned";

export type OrderProgressStep = "received" | "processing" | "shipped" | "delivered";

export type OrderTracking = {
  carrier: string;
  trackingNumber: string;
  trackingUrl: string;
};

export type OrderStatusHistoryItem = {
  status: OrderStatus;
  changedAt: string;
  note?: string;
};

export type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  image?: string;
};

export type OrderRecord = {
  orderNumber: string;
  email: string;
  placedAt: string;
  estimatedDelivery: string;
  status: OrderStatus;
  tracking?: OrderTracking;
  history?: OrderStatusHistoryItem[];
  items?: OrderItem[];
};
