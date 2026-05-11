"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { AuthSession } from "@/lib/api/types";
import { hydrateSession, logoutApi } from "@/lib/api/auth";

type User = AuthSession["user"] | null;

interface AuthContextType {
  token: string | null;
  refreshToken: string | null;
  user: User;
  login: (session: AuthSession) => void;
  logout: (message?: string) => Promise<void>;
  toast: string | null;
  setToast: (msg: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<User>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const rawSession = localStorage.getItem("alkozon_auth_session");
    if (!rawSession) return;

    const session = hydrateSession(rawSession);
    if (session) {
      setToken(session.accessToken);
      setRefreshToken(session.refreshToken);
      setUser(session.user);
    }
  }, []);

  const login = (session: AuthSession) => {
    setToken(session.accessToken);
    setRefreshToken(session.refreshToken);
    setUser(session.user);
    localStorage.setItem("alkozon_auth_session", JSON.stringify(session));
  };

  const logout = async (message?: string) => {
    if (refreshToken) {
      try {
        await logoutApi(refreshToken);
      } catch {
        // Silent fail: local logout should work even when API is unavailable.
      }
    }

    setToken(null);
    setRefreshToken(null);
    setUser(null);
    localStorage.removeItem("alkozon_auth_session");
    
    if (message) {
      setToast(message);
      setTimeout(() => setToast(null), 5000);
    }
  };

  return (
    <AuthContext.Provider value={{ token, refreshToken, user, login, logout, toast, setToast }}>
      {children}
      {/* Global Toast */}
      {isClient && toast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-slate-800 dark:bg-slate-700 text-white px-6 py-3 rounded-xl shadow-xl shadow-slate-900/20 text-sm font-medium transition-all animate-bounce">
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
