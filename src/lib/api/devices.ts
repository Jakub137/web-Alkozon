import { apiRequest } from "./client";

export type DevicePlatform = "WEB" | "ANDROID" | "IOS";

export interface RegisterFcmTokenRequest {
  token: string;
  platform: DevicePlatform;
}

export async function registerFcmDeviceApi(accessToken: string, payload: RegisterFcmTokenRequest): Promise<void> {
  await apiRequest<void>("/api/devices/fcm", {
    method: "POST",
    token: accessToken,
    body: payload,
  });
}
