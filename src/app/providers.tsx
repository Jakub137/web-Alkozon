"use client";

import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { AgeProvider } from "@/context/AgeContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { AutoLogoutListener } from "@/hooks/useAutoLogout";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <AgeProvider>
            <NotificationProvider>
              <CartProvider>
                {children}
                <AutoLogoutListener />
              </CartProvider>
            </NotificationProvider>
          </AgeProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
