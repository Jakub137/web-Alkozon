import { apiRequest } from "./client";

interface CreateCustomOrderRequest {
  description: string;
  preferences: Record<string, unknown>;
}

interface ApiCustomOrderResponse {
  id: number;
}

export async function createCustomOrder(
  token: string,
  payload: CreateCustomOrderRequest
): Promise<ApiCustomOrderResponse> {
  return apiRequest<ApiCustomOrderResponse>("/custom-orders", {
    method: "POST",
    token,
    body: payload,
  });
}
