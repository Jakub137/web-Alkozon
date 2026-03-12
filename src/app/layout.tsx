import type { Metadata } from "next";
import "./globals.css";

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
        <header className="w-full bg-white shadow-sm py-4 px-6 flex justify-between items-center">
          {/* Lewa strona - Logo */}
          <div className="text-2xl font-bold text-slate-800 tracking-tight">
            Alkozon
          </div>
          
          {/* Środek - Linki (na razie ukryte na bardzo małych ekranach) */}
          <nav className="hidden md:flex gap-6 text-slate-600 font-medium">
            <a href="#" className="hover:text-blue-600">Sklep</a>
            <a href="#" className="hover:text-blue-600">O alkoholach</a>
            <a href="#" className="hover:text-blue-600">Zamówienie własne</a>
          </nav>

          {/* Prawa strona - Akcje */}
          <div className="flex gap-4 items-center">
            <button className="text-sm font-medium text-slate-600">PL/EN</button>
            <button className="text-sm font-medium text-slate-600">Dark</button>
            <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition">
              Zaloguj się
            </button>
          </div>
        </header>

        {/* Główna treść strony */}
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}