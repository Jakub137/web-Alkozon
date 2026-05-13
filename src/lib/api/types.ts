export type UserRole = "GUEST" | "CUSTOMER" | "EMPLOYEE" | "MANAGER";

export interface ApiErrorPayload {
  timestamp?: string;
  status: number;
  error?: string;
  message: string;
  path?: string;
  fieldErrors?: Array<{
    field: string;
    message: string;
  }>;
}

export class ApiError extends Error {
  status: number;
  payload?: ApiErrorPayload;

  constructor(message: string, status: number, payload?: ApiErrorPayload) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresInSeconds: number;
  userId?: number;
  email?: string;
  role?: UserRole;
  firstName?: string | null;
  lastName?: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresAt: number;
  user: {
    id?: number;
    username: string;
    email?: string;
    role?: UserRole;
    firstName?: string;
    lastName?: string;
    phone?: string | null;
    courier?: boolean;
    active?: boolean;
    ageConfirmedAt?: string | null;
  };
}

export interface UserMeResponse {
  id: number;
  email: string;
  role: UserRole;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  courier: boolean;
  active: boolean;
  ageConfirmedAt: string | null;
}
