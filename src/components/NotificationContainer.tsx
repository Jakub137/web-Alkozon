"use client";

import React from "react";
import { useNotification } from "@/context/NotificationContext";
import NotificationToast from "./NotificationToast";

export default function NotificationContainer() {
  const { notifications } = useNotification();

  // Zabezpieczamy renderowanie po stronie serwera - Toasty są wyłącznie warstwą klienta
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[110] flex flex-col gap-3 pointer-events-none items-end">
      {/* 
        pointer-events-none sprawia, że przez niewidzialny kontener 
        użytkownik wciąż może klikać elementy sklepu. 
        Musimy przywrócić pointer-events-auto na samych Toastach.
      */}
      {notifications.map((notification) => (
        <div key={notification.id} className="pointer-events-auto">
          <NotificationToast notification={notification} />
        </div>
      ))}
    </div>
  );
}
