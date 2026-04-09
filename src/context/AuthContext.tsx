"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type User = { username: string; email?: string } | null;

interface AuthContextType {
  token: string | null;
  user: User;
  login: (username: string, token: string) => void;
  logout: (message?: string) => void;
  toast: string | null;
  setToast: (msg: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Load from local storage
    const storedToken = localStorage.getItem("jwt_token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (username: string, newToken: string) => {
    setToken(newToken);
    const u = { username };
    setUser(u);
    localStorage.setItem("jwt_token", newToken);
    localStorage.setItem("user", JSON.stringify(u));
  };

  const logout = (message?: string) => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("user");
    
    if (message) {
      setToast(message);
      setTimeout(() => setToast(null), 5000);
    }
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, toast, setToast }}>
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
