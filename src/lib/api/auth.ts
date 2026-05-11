import { apiRequest } from "./client";
import type {
  AuthSession,
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  UserRole,
} from "./types";

function parseJwtPayload(token: string): Record<string, unknown> {
  const tokenParts = token.split(".");
  if (tokenParts.length < 2) return {};

  try {
    const base64 = tokenParts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const decoded = atob(padded);
    return JSON.parse(decoded) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function sessionFromTokens(tokens: TokenResponse): AuthSession {
  const payload = parseJwtPayload(tokens.accessToken);
  const email = typeof payload.email === "string" ? payload.email : undefined;
  const username = email ? email.split("@")[0] : "Użytkownik";
  const role = typeof payload.role === "string" ? (payload.role as UserRole) : undefined;

  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    tokenType: tokens.tokenType,
    expiresAt: Date.now() + tokens.expiresInSeconds * 1000,
    user: {
      username,
      email,
      role,
    },
  };
}

export async function loginApi(data: LoginRequest): Promise<AuthSession> {
  const result = await apiRequest<TokenResponse>("/api/auth/login", {
    method: "POST",
    body: data,
  });
  return sessionFromTokens(result);
}

export async function registerApi(data: RegisterRequest): Promise<AuthSession> {
  const result = await apiRequest<TokenResponse>("/api/auth/register", {
    method: "POST",
    body: data,
  });
  return sessionFromTokens(result);
}

export async function guestApi(): Promise<AuthSession> {
  const result = await apiRequest<TokenResponse>("/api/auth/guest", {
    method: "POST",
  });
  return sessionFromTokens(result);
}

export async function confirmAgeApi(accessToken: string): Promise<AuthSession> {
  const result = await apiRequest<TokenResponse>("/api/auth/confirm-age", {
    method: "POST",
    token: accessToken,
  });
  return sessionFromTokens(result);
}

export async function refreshApi(refreshToken: string): Promise<AuthSession> {
  const result = await apiRequest<TokenResponse>("/api/auth/refresh", {
    method: "POST",
    body: { refreshToken },
  });
  return sessionFromTokens(result);
}

export async function logoutApi(refreshToken: string): Promise<void> {
  await apiRequest<void>("/api/auth/logout", {
    method: "POST",
    body: { refreshToken },
  });
}

export function hydrateSession(raw: string): AuthSession | null {
  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}
