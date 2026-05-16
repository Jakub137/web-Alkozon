import type { Metadata } from "next";
import Image from "next/image";
import "./globals.css";
import LanguageSwitcher from "../components/LanguageSwitcher";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import LoginButton from "@/components/LoginButton";
import { Suspense } from "react";
import BackHomeButton from "@/components/BackHomeButton";
import HeaderNavLinks from "@/components/HeaderNavLinks";
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
          <header className="w-full bg-white dark:bg-slate-800 shadow-sm py-4 px-4 md:px-6 h-20 transition-colors">
            
            <div className="mx-auto w-full max-w-[1400px] h-full grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
              {/* Lewa strona - Logo i nazwa */}
              <div className="min-w-0 text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-3">
                <Image
                  src="/logo.png"
                  alt="Alkozon Logo"
                  width={56}
                  height={56}
                  className="w-10 h-10 md:w-14 md:h-14 rounded-2xl object-cover shrink-0"
                />
                <span className="hidden md:inline">Alkozon</span>
              </div>
              
              <div className="min-w-0 flex justify-center px-2">
                <Suspense fallback={null}>
                  <HeaderNavLinks />
                </Suspense>
              </div>

              {/* Prawa strona */}
              <div className="min-w-0 flex gap-2 items-center justify-end">
                <Suspense fallback={null}>
                  <BackHomeButton />
                </Suspense>
                <LanguageSwitcher />           
                <ThemeSwitcher />
                <LoginButton />
              </div>
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