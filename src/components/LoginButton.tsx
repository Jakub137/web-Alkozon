"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { LogOut, User } from "lucide-react";
import { useEffect, useState } from "react";

type LoginButtonProps = {
  compact?: boolean;
};

export default function LoginButton({ compact = false }: LoginButtonProps) {
  const { dict } = useLanguage();
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const buttonClass = `w-auto min-w-[7rem] px-4 py-2 flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition text-center ${
    theme === "dark"
      ? "bg-blue-600 text-white hover:bg-blue-700"
      : "bg-slate-900 text-white hover:bg-slate-800"
  }`;

  if (!mounted) {
    return (
      <div
        className={
          compact
            ? "w-10 h-10 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-full"
            : "w-28 h-9 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg"
        }
      />
    );
  }

  /** Sesja GUEST z API (JWT anonimowy) — w UI tylko przycisk „Zaloguj”, bez „Witaj, Gość”. */
  if (user && user.role !== "GUEST") {
    const shortUserName =
      user.username.length > 5 ? `${user.username.slice(0, 5)}...` : user.username;
    const welcomeLabel = `Witaj, ${user.username}`;
    if (compact) {
      return (
        <div className="flex items-center gap-1">
          <div
            className="h-10 w-10 inline-flex items-center justify-center rounded-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            title={welcomeLabel}
            aria-label={welcomeLabel}
          >
            <User className="w-4 h-4" />
          </div>
          <button
            onClick={() => void logout(dict.auth.toast.logoutSuccess)}
            className="h-9 w-9 inline-flex items-center justify-center rounded-full text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
            title="Wyloguj"
            aria-label="Wyloguj"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 min-w-0">
        <div className="text-sm font-medium text-slate-700 dark:text-slate-200 flex items-center gap-2 min-w-0">
          <User className="w-4 h-4" />
          <span
            className="hidden sm:inline max-w-[9rem] md:max-w-[12rem] truncate"
            title={welcomeLabel}
          >
            Witaj, {shortUserName}
          </span>
        </div>
        <button
          onClick={() => void logout(dict.auth.toast.logoutSuccess)}
          className="text-sm font-medium text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors flex items-center gap-1"
          title="Wyloguj"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      title={dict.navbar.login}
      aria-label={dict.navbar.login}
      className={
        compact
          ? "h-10 w-10 inline-flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          : buttonClass
      }
    >
      {compact ? <User className="w-4 h-4" /> : dict.navbar.login}
    </Link>
  );
}
