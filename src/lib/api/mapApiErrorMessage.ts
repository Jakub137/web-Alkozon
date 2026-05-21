import type pl from "@/dictionaries/pl.json";
import { ApiError } from "./types";

export type AuthErrorMessages = typeof pl.auth.errors;

const KNOWN_AUTH_MESSAGES: Record<string, keyof AuthErrorMessages> = {
  "Invalid credentials": "invalidCredentials",
  "Email already registered": "emailAlreadyRegistered",
};

function normalizeMessage(value: string): string {
  return value.trim().toLowerCase();
}

export function mapAuthApiErrorMessage(
  error: unknown,
  messages: AuthErrorMessages,
  fallback?: string
): string {
  if (!(error instanceof ApiError)) {
    return fallback ?? messages.generic;
  }

  if (error.status === 429) {
    return messages.tooManyLoginAttempts;
  }

  const raw = (error.payload?.message ?? error.message ?? "").trim();
  if (!raw) {
    return fallback ?? messages.generic;
  }

  const mapped = KNOWN_AUTH_MESSAGES[raw];
  if (mapped) {
    return messages[mapped];
  }

  const normalized = normalizeMessage(raw);
  if (normalized === "invalid credentials") {
    return messages.invalidCredentials;
  }
  if (normalized.includes("email already registered")) {
    return messages.emailAlreadyRegistered;
  }

  return fallback ?? messages.generic;
}
