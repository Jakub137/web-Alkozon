"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";

const INACTIVITY_LIMIT_MS = 30 * 1000; // 30 seconds

export function useAutoLogout() {
  const { user, logout } = useAuth();
  const lastActive = useRef<number>(0);

  useEffect(() => {
    if (!user) return; // Only track if logged in
    
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
        logout("Wylogowano ze względów bezpieczeństwa (Brak aktywności).");
      }
    }, 5000); // sprawdzamy co 5 sekund

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
