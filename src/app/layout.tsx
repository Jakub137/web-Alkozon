import type { Metadata } from "next";
import "./globals.css";
import LanguageSwitcher from "../components/LanguageSwitcher";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import LoginButton from "@/components/LoginButton";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Alkozon",
  description: "Twój sklep monopolowy",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body className="min-h-screen flex flex-col bg-white text-slate-900 font-sans antialiased">
        <Providers>
          {/* Pasek Nawigacji */}
          <header className="w-full bg-white shadow-sm py-4 px-6 flex justify-between items-center h-20">
            
            {/* Lewa strona - Logo i nazwa */}
            <div className="w-48 text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
              <img src="/logo.png" alt="Alkozon Logo" className="w-14 h-14 rounded-2xl object-cover shrink-0" /> 
              Alkozon
            </div>
            
            {/* Środek - pusta, elastyczna przestrzeń */}
            <div className="flex-1"></div>

            {/* Prawa strona - Akcje */}
            <div className="w-auto flex gap-2 items-center justify-end">
              <LanguageSwitcher />           
              <ThemeSwitcher />
              <LoginButton />
            </div>
          </header>

          {/* Główna treść strony */}
          <main className="grow flex flex-col">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}