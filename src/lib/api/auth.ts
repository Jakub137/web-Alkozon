import { apiRequest } from "./client";
import type {
  AuthSession,
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  UserMeResponse,
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

function normalizeName(value?: string | null): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function buildUsername(params: {
  firstName?: string | null;
  lastName?: string | null;
  email?: string;
  fallbackFromJwt?: string;
}): string {
  const firstName = normalizeName(params.firstName);
  const lastName = normalizeName(params.lastName);
  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  if (fullName) return fullName;
  if (params.email) return params.email.split("@")[0];
  if (params.fallbackFromJwt) return params.fallbackFromJwt;
  return "Użytkownik";
}

function sessionFromTokens(tokens: TokenResponse): AuthSession {
  const payload = parseJwtPayload(tokens.accessToken);
  const jwtEmail = typeof payload.email === "string" ? payload.email : undefined;
  const email = tokens.email ?? jwtEmail;
  const roleFromToken = tokens.role;
  const roleFromJwt = typeof payload.role === "string" ? (payload.role as UserRole) : undefined;
  const role = roleFromToken ?? roleFromJwt;
  const firstName = normalizeName(tokens.firstName);
  const lastName = normalizeName(tokens.lastName);
  const username =
    role === "GUEST"
      ? "Gość"
      : buildUsername({
          firstName,
          lastName,
          email,
          fallbackFromJwt: jwtEmail ? jwtEmail.split("@")[0] : undefined,
        });

  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    tokenType: tokens.tokenType,
    expiresAt: Date.now() + tokens.expiresInSeconds * 1000,
    user: {
      id: typeof tokens.userId === "number" ? tokens.userId : undefined,
      username,
      email,
      role,
      firstName,
      lastName,
    },
  };
}

export function mergeProfileIntoSession(session: AuthSession, profile: UserMeResponse): AuthSession {
  const role = profile.role;
  return {
    ...session,
    user: {
      ...session.user,
      id: profile.id,
      email: profile.email,
      role,
      firstName: normalizeName(profile.firstName),
      lastName: normalizeName(profile.lastName),
      username:
        role === "GUEST"
          ? "Gość"
          : buildUsername({
              firstName: profile.firstName,
              lastName: profile.lastName,
              email: profile.email,
            }),
      phone: profile.phone,
      courier: profile.courier,
      active: profile.active,
      ageConfirmedAt: profile.ageConfirmedAt,
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

export async function getCurrentUserApi(accessToken: string): Promise<UserMeResponse> {
  return apiRequest<UserMeResponse>("/api/users/me", {
    token: accessToken,
  });
}

export function hydrateSession(raw: string): AuthSession | null {
  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}
