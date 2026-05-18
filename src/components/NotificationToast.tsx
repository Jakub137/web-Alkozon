"use client";

import React, { useState } from "react";
import { AppNotification, useNotification } from "@/context/NotificationContext";
import { X, CheckCircle, Info, AlertTriangle, XCircle } from "lucide-react";

export default function NotificationToast({ notification }: { notification: AppNotification }) {
  const { removeNotification } = useNotification();
  const [isClosing, setIsClosing] = useState(false);

  // Funkcja wywoływana przy ręcznym kliknięciu "X"
  const handleClose = () => {
    setIsClosing(true);
    // Czekamy na zakończenie animacji (300ms) przed faktycznym usunięciem z kontekstu
    setTimeout(() => {
      removeNotification(notification.id);
    }, 300);
  };

  const getIcon = () => {
    switch (notification.type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case "info":
        return <Info className="w-5 h-5 text-blue-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getBgColor = () => {
    switch (notification.type) {
      case "success":
        return "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800";
      case "info":
        return "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800";
      case "warning":
        return "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800";
      case "error":
        return "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800";
    }
  };

  return (
    <div
      className={`
        flex items-start gap-3 p-4 rounded-xl border shadow-lg max-w-sm w-full
        ${getBgColor()}
        transition-all duration-300
        ${isClosing ? "opacity-0 translate-x-full" : "animate-in slide-in-from-right-full"}
      `}
    >
      <div className="shrink-0 mt-0.5">{getIcon()}</div>
      <div className="flex-1 text-sm font-medium text-slate-800 dark:text-slate-200">
        {notification.message}
      </div>
      <button
        onClick={handleClose}
        className="shrink-0 p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
