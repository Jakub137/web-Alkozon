"use client";

import { useEffect, useRef } from "react";
import { setupWebPushToken } from "@/lib/firebase/webPush";
import { useAuth } from "@/context/AuthContext";

export default function WebPushBootstrap() {
  const { user, registerWebPushToken } = useAuth();
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!user?.role || user.role === "GUEST") return;
    if (initializedRef.current) return;
    initializedRef.current = true;

    void setupWebPushToken().then((token) => {
      if (token) {
        void registerWebPushToken(token);
      }
    });
  }, [registerWebPushToken, user]);

  return null;
}
