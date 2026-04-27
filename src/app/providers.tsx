"use client";

import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { AgeProvider } from "@/context/AgeContext";
import { AutoLogoutListener } from "@/hooks/useAutoLogout";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <AgeProvider>
            <CartProvider>
              {children}
              <AutoLogoutListener />
            </CartProvider>
          </AgeProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
