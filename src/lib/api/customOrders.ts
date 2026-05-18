import { apiRequest } from "./client";

export interface CreateCustomOrderPayload {
  /** Numer kliencki (np. 6 cyfr); backend zapisuje w kolumnie. */
  clientOrderNumber: string;
  description: string;
  preferences: Record<string, unknown>;
}

export interface ApiCustomOrderResponse {
  id: number;
}

/** Odpowiedź listy / szczegółów zamówienia własnego (GET /my). */
export interface ApiCustomOrderListItem {
  id: number;
  customerId: number;
  description: string;
  preferences?: Record<string, unknown> | null;
  status: string;
  assignedToId?: number | null;
  createdAt: string;
  updatedAt: string;
  clientOrderNumber?: string | null;
}

/** Publiczny track custom-orders (backend: customOrderId + …). */
export interface ApiCustomOrderTrackResponse {
  customOrderId?: number;
  orderId?: number;
  id?: number;
  clientOrderNumber?: string | null;
  description?: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export async function createCustomOrder(
  token: string,
  payload: CreateCustomOrderPayload
): Promise<ApiCustomOrderResponse> {
  return apiRequest<ApiCustomOrderResponse>("/api/custom-orders", {
    method: "POST",
    token,
    body: payload,
  });
}

export async function listMyCustomOrders(token: string): Promise<ApiCustomOrderListItem[]> {
  return apiRequest<ApiCustomOrderListItem[]>("/api/custom-orders/my", { token });
}

export async function requestCustomOrderTrack(
  orderId: string,
  email: string
): Promise<ApiCustomOrderTrackResponse> {
  const params = new URLSearchParams({
    orderId: orderId.trim(),
    email: email.trim(),
  });
  return apiRequest<ApiCustomOrderTrackResponse>(`/api/custom-orders/track?${params.toString()}`);
}

/** Szczegóły zamówienia własnego (JWT; zawiera preferences z estimatedPrice). */
export async function getCustomOrderById(
  token: string,
  id: number
): Promise<ApiCustomOrderListItem> {
  return apiRequest<ApiCustomOrderListItem>(`/api/custom-orders/${id}`, { token });
}
