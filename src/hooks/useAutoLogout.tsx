"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";

const INACTIVITY_LIMIT_MS = 15 * 60 * 1000; // 15 minutes

export function useAutoLogout() {
  const { user, logout } = useAuth();
  const lastActive = useRef<number>(0);

  useEffect(() => {
    // Sesja gościa (JWT GUEST) — bez agresywnego wylogowania przy bezczynności.
    if (!user?.role || user.role === "GUEST") return;

    lastActive.current = Date.now();

    const trackActivity = () => {
      lastActive.current = Date.now();
    };

    window.addEventListener("mousemove", trackActivity);
    window.addEventListener("keydown", trackActivity);
    window.addEventListener("click", trackActivity);
    window.addEventListener("scroll", trackActivity);

    const interval = setInterval(() => {
      if (Date.now() - lastActive.current > INACTIVITY_LIMIT_MS) {
        void logout("Wylogowano ze względów bezpieczeństwa (Brak aktywności).");
      }
    }, 5000);

    return () => {
      window.removeEventListener("mousemove", trackActivity);
      window.removeEventListener("keydown", trackActivity);
      window.removeEventListener("click", trackActivity);
      window.removeEventListener("scroll", trackActivity);
      clearInterval(interval);
    };
  }, [user, logout]);
}

export function AutoLogoutListener() {
  useAutoLogout();
  return null;
}
