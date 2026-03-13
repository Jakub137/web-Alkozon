import type { Metadata } from "next";
import "./globals.css";
// Link usunięty z importów, bo już go tu nie używamy
import LanguageSwitcher from "../components/LanguageSwitcher";
import ThemeSwitcher from "@/components/ThemeSwitcher";

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
        {/* Pasek Nawigacji */}
        <header className="w-full bg-white shadow-sm py-4 px-6 flex justify-between items-center h-20">
          
          {/* Lewa strona - Logo i nazwa */}
          <div className="w-48 text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
            {/* Poprawione klasy zaokrąglające */}
            <img src="/logo.png" alt="Alkozon Logo" className="w-14 h-14 rounded-2xl object-cover shrink-0" /> 
            Alkozon
          </div>
          
          {/* Środek - pusta, elastyczna przestrzeń */}
          <div className="flex-1"></div>

          {/* Prawa strona - Akcje */}
          <div className="w-auto flex gap-2 items-center justify-end">
            <LanguageSwitcher />           
            <ThemeSwitcher />
            
            <button className="w-28 bg-slate-900 text-white px-0 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition text-center">
              Zaloguj się
            </button>
          </div>
        </header>

        {/* Główna treść strony */}
        <main className="grow flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}