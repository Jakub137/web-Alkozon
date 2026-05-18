export type OrderStatus =
  | "received"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "payment_failed"
  | "returned";

export type BackendOrderStatus =
  | "SUBMITTED"
  | "IN_PRODUCTION"
  | "IN_PACKING"
  | "IN_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

/** Statusy zamówienia własnego (API custom-orders). */
export type BackendCustomOrderStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "REJECTED";

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

export type DeliveryDetails = {
  recipientName: string;
  streetAddress: string;
  city: string;
  postalCode: string;
  country: string;
  deliveryNotes?: string | null;
  paymentMethod: string;
};

export type OrderRecord = {
  /** Zamówienie sklepowe vs konfiguracja własna (custom-orders). */
  kind?: "shop" | "custom";
  /** Krótki opis trunku (tylko custom). */
  customDescription?: string;
  orderNumber: string;
  clientOrderNumber?: string;
  email: string;
  placedAt: string;
  estimatedDelivery: string;
  status: OrderStatus;
  apiStatus?: BackendOrderStatus | BackendCustomOrderStatus;
  tracking?: OrderTracking;
  history?: OrderStatusHistoryItem[];
  items?: OrderItem[];
  deliveryAddress?: string;
  deliveryDetails?: DeliveryDetails | null;
};
