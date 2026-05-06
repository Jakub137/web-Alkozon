import type { Metadata } from "next";
import Image from "next/image";
import "./globals.css";
import LanguageSwitcher from "../components/LanguageSwitcher";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import LoginButton from "@/components/LoginButton";
import { Suspense } from "react";
import BackHomeButton from "@/components/BackHomeButton";
import { Providers } from "./providers";
import AgeVerificationModal from "@/components/AgeVerificationModal";
import NotificationContainer from "@/components/NotificationContainer";

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
    <html lang="pl" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const isDark = theme === 'dark' || (!theme && prefersDark);
                if (isDark) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col overflow-y-scroll overflow-x-hidden bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans antialiased transition-colors">
        <Providers>
          <AgeVerificationModal />
          <NotificationContainer />
          {/* Pasek Nawigacji */}
          <header className="w-full bg-white dark:bg-slate-800 shadow-sm py-4 px-6 flex justify-between items-center h-20 transition-colors">
            
            {/* Lewa strona - Logo i nazwa */}
            <div className="w-48 text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Alkozon Logo"
                width={56}
                height={56}
                className="w-14 h-14 rounded-2xl object-cover shrink-0"
              />
              Alkozon
            </div>
            
            {/* Środek - pusta, elastyczna przestrzeń */}
            <div className="flex-1"></div>

            {/* Prawa strona */}
            <div className="w-auto flex gap-2 items-center justify-end">
              <Suspense fallback={null}>
                <BackHomeButton />
              </Suspense>
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