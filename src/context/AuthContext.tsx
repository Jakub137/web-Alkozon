"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import type { AuthSession } from "@/lib/api/types";
import {
  getCurrentUserApi,
  guestApi,
  hydrateSession,
  logoutApi,
  mergeProfileIntoSession,
  refreshApi,
} from "@/lib/api/auth";
import { registerFcmDeviceApi } from "@/lib/api/devices";
import { ApiError } from "@/lib/api/types";
import { useLanguage } from "@/context/LanguageContext";

type User = AuthSession["user"] | null;

interface AuthContextType {
  token: string | null;
  refreshToken: string | null;
  user: User;
  login: (session: AuthSession) => void;
  logout: (message?: string) => Promise<void>;
  authorizedRequest: <T>(request: (token: string) => Promise<T>) => Promise<T>;
  registerWebPushToken: (fcmToken: string) => Promise<void>;
  toast: string | null;
  setToast: (msg: string | null, durationMs?: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const AUTH_SESSION_STORAGE_KEY = "alkozon_auth_session";
const FCM_TOKEN_STORAGE_KEY = "alkozon_fcm_web_token";

const DEFAULT_TOAST_DURATION_MS = 5000;

export function AuthProvider({ children }: { children: ReactNode }) {
  const { dict } = useLanguage();
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<User>(null);
  const [toast, setToastMessage] = useState<string | null>(null);
  const toastDurationRef = useRef(DEFAULT_TOAST_DURATION_MS);
  const [isClient, setIsClient] = useState(false);
  const [storedFcmToken, setStoredFcmToken] = useState<string | null>(null);

  const setToast = useCallback((msg: string | null, durationMs = DEFAULT_TOAST_DURATION_MS) => {
    toastDurationRef.current = durationMs;
    setToastMessage(msg);
  }, []);

  const applySession = useCallback((session: AuthSession) => {
    setToken(session.accessToken);
    setRefreshToken(session.refreshToken);
    setUser(session.user);
    localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session));
  }, []);

  const clearLocalSession = useCallback(() => {
    setToken(null);
    setRefreshToken(null);
    setUser(null);
  }, []);

  const syncProfile = useCallback(
    async (baseSession: AuthSession): Promise<AuthSession> => {
      try {
        const profile = await getCurrentUserApi(baseSession.accessToken);
        const nextSession = mergeProfileIntoSession(baseSession, profile);
        applySession(nextSession);
        return nextSession;
      } catch {
        return baseSession;
      }
    },
    [applySession]
  );

  const registerFcmToken = useCallback(
    async (accessToken: string, role: AuthSession["user"]["role"], fcmToken: string) => {
      if (!fcmToken.trim()) return;
      if (!role || role === "GUEST") return;
      try {
        await registerFcmDeviceApi(accessToken, { token: fcmToken.trim(), platform: "WEB" });
      } catch {
        // Retry is handled naturally on next login / refresh / token update.
      }
    },
    []
  );

  const registerWebPushToken = useCallback(
    async (fcmToken: string) => {
      const normalized = fcmToken.trim();
      if (!normalized) return;
      localStorage.setItem(FCM_TOKEN_STORAGE_KEY, normalized);
      setStoredFcmToken(normalized);

      if (!token || !user?.role) return;
      await registerFcmToken(token, user.role, normalized);
    },
    [registerFcmToken, token, user]
  );

  useEffect(() => {
    setIsClient(true);
    const existingFcmToken = localStorage.getItem(FCM_TOKEN_STORAGE_KEY);
    if (existingFcmToken?.trim()) {
      setStoredFcmToken(existingFcmToken.trim());
    }

    const rawSession = localStorage.getItem(AUTH_SESSION_STORAGE_KEY);
    if (rawSession) {
      const session = hydrateSession(rawSession);
      if (session) {
        applySession(session);
        if (existingFcmToken?.trim()) {
          void registerFcmToken(session.accessToken, session.user.role, existingFcmToken);
        }
        void syncProfile(session);
        return;
      }
    }

    // Keep an anonymous backend session from the start.
    void guestApi()
      .then((session) => {
        applySession(session);
        if (existingFcmToken?.trim()) {
          void registerFcmToken(session.accessToken, session.user.role, existingFcmToken);
        }
        void syncProfile(session);
      })
      .catch(() => {
        // Silent fail - app can still work with limited local behavior.
      });
  }, [applySession, registerFcmToken, syncProfile]);

  useEffect(() => {
    if (!toast) return;
    const timeoutId = window.setTimeout(() => setToastMessage(null), toastDurationRef.current);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  useEffect(() => {
    const syncSessionAcrossTabs = (event: StorageEvent) => {
      if (event.key !== AUTH_SESSION_STORAGE_KEY) return;
      if (event.newValue === null) {
        clearLocalSession();
        setToast(dict.auth.toast.loggedOutOtherTab);
      }
    };

    window.addEventListener("storage", syncSessionAcrossTabs);
    return () => window.removeEventListener("storage", syncSessionAcrossTabs);
  }, [clearLocalSession, dict.auth.toast.loggedOutOtherTab]);

  const login = (session: AuthSession) => {
    applySession(session);
    if (storedFcmToken) {
      void registerFcmToken(session.accessToken, session.user.role, storedFcmToken);
    }
    void syncProfile(session);
  };

  const logout = async (message?: string) => {
    if (refreshToken) {
      try {
        await logoutApi(refreshToken);
      } catch {
        // Silent fail: local logout should work even when API is unavailable.
      }
    }

    clearLocalSession();
    localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);

    if (message) {
      setToast(message);
    }
  };

  const authorizedRequest = async <T,>(
    request: (accessToken: string) => Promise<T>
  ): Promise<T> => {
    if (!token) {
      throw new Error("Brak tokenu sesji.");
    }

    try {
      return await request(token);
    } catch (error) {
      if (!(error instanceof ApiError) || error.status !== 401 || !refreshToken) {
        throw error;
      }

      const refreshedSession = await refreshApi(refreshToken);
      if (storedFcmToken) {
        await registerFcmToken(
          refreshedSession.accessToken,
          refreshedSession.user.role,
          storedFcmToken
        );
      }
      const sessionWithFreshProfile = await syncProfile(refreshedSession);
      return request(sessionWithFreshProfile.accessToken);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        refreshToken,
        user,
        login,
        logout,
        authorizedRequest,
        registerWebPushToken,
        toast,
        setToast,
      }}
    >
      {children}
      {/* Global Toast */}
      {isClient && toast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 max-w-[calc(100vw-2rem)] bg-slate-800 dark:bg-slate-700 text-white px-6 py-3 rounded-xl shadow-xl shadow-slate-900/20 text-sm font-medium transition-all animate-bounce text-center">
          {toast}
        </div>
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
