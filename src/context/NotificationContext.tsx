"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

export type NotificationType = "success" | "info" | "warning" | "error";

export interface AppNotification {
  id: string;
  message: string;
  type: NotificationType;
}

interface NotificationContextType {
  notifications: AppNotification[];
  addNotification: (message: string, type?: NotificationType) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const enableMockWs = process.env.NEXT_PUBLIC_ENABLE_NOTIFICATION_MOCK_WS === "true";

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const addNotification = useCallback(
    (message: string, type: NotificationType = "info") => {
      const id = Math.random().toString(36).substring(2, 9);
      setNotifications((prev) => [...prev, { id, message, type }]);

      // Automatyczne ukrywanie po 3.5 sekundach
      setTimeout(() => {
        removeNotification(id);
      }, 3500);
    },
    [removeNotification]
  );

  // Optional mock feed for development demos.
  useEffect(() => {
    if (!enableMockWs) return;

    const mockMessages = [
      "Zmieniono status zamówienia ALK-2026-0002 na: W realizacji",
      "Nowa promocja na sekcję Wina!",
      "Kurier wyruszył w drogę. Spodziewaj się dostawy w ciągu 2h.",
      "Osiągnięto limit zamówień (ostrzeżenie z serwera)",
    ];

    const interval = setInterval(() => {
      // Losujemy jedno ze sztucznych powiadomień
      const randomMsg = mockMessages[Math.floor(Math.random() * mockMessages.length)];
      const type: NotificationType = randomMsg.includes("limit") ? "warning" : "info";

      addNotification(`[MOCK WS] ${randomMsg}`, type);
    }, 15000); // Wyzwalamy co 15 sekund dla celów demonstracyjnych

    return () => clearInterval(interval);
  }, [addNotification, enableMockWs]);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
}
