import { ApiError, type ApiErrorPayload } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api-alcozon.onrender.com";

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string;
  headers?: Record<string, string>;
  signal?: AbortSignal;
};

function buildUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

async function parseError(response: Response): Promise<never> {
  const contentType = response.headers.get("content-type") || "";
  let payload: ApiErrorPayload | undefined;
  let message = `Request failed with status ${response.status}`;

  if (contentType.includes("application/json")) {
    const data = (await response.json()) as Partial<ApiErrorPayload>;
    payload = {
      status: response.status,
      message: data.message || message,
      error: data.error,
      timestamp: data.timestamp,
      path: data.path,
      fieldErrors: data.fieldErrors || [],
    };
    message = payload.message;
  } else {
    const text = await response.text();
    if (text.trim()) {
      message = text;
    }
  }

  throw new ApiError(message, response.status, payload);
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, token, headers, signal } = options;

  const response = await fetch(buildUrl(path), {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
  });

  if (!response.ok) {
    return parseError(response);
  }

  // Logout endpoint returns 204 without body.
  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function getApiBaseUrl(): string {
  return API_BASE_URL;
}
