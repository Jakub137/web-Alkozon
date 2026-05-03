"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/context/AuthContext";
import { Lock, Mail, Eye, EyeOff, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const loginSchema = z.object({
  email: z.string().email({ message: "Niepoprawny format adresu email" }),
  password: z.string().min(1, { message: "Hasło jest wymagane" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const MAX_ATTEMPTS = 5;

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  
  const [showPassword, setShowPassword] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    const savedAttempts = parseInt(localStorage.getItem("login_attempts") || "0");
    if (savedAttempts >= MAX_ATTEMPTS) {
      setIsLocked(true);
      setErrorMsg("Konto zablokowane ze względów bezpieczeństwa. Zrestartuj sesję (wyczyść klucze przeglądarki).");
    }
    setAttempts(savedAttempts);
  }, []);

  const onSubmit = (data: LoginFormValues) => {
    if (isLocked) return;

    // TODO: Zastąpić prawdziwym wywołaniem API po HTTPS
    // Na potrzeby MVP Desktopu/Weba mockujemy poprawne passy.
    if (data.email === "test@test.pl" && data.password === "Test1234!") {
      login("TestUser", "mocked-jwt-token-from-brute-force-safe-login");
      localStorage.removeItem("login_attempts"); // reset na sukces
      router.push("/");
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      localStorage.setItem("login_attempts", newAttempts.toString());
      
      if (newAttempts >= MAX_ATTEMPTS) {
        setIsLocked(true);
        setErrorMsg("Konto zablokowane z powodu zbyt wielu nieudanych prób logowania.");
      } else {
        setErrorMsg(`Błędne dane. Ochrona Brute-Force: Pozostało prób ${MAX_ATTEMPTS - newAttempts}`);
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Portal Logowania
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            lub <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors">zarejestruj nowe konto</Link>
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 flex items-start gap-3 transition-all animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-800 dark:text-red-300 font-medium">{errorMsg}</p>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Adres Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                {...register("email")}
                type="email"
                disabled={isLocked}
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white sm:text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="test@test.pl"
              />
            </div>
            {errors.email && <p className="mt-1.5 text-sm text-red-500 font-medium animate-in fade-in">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Hasło</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                disabled={isLocked}
                className="block w-full pl-10 pr-10 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white sm:text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLocked}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-500 transition-colors" />
                ) : (
                  <Eye className="h-5 w-5 text-slate-400 hover:text-slate-500 transition-colors" />
                )}
              </button>
            </div>
            {errors.password && <p className="mt-1.5 text-sm text-red-500 font-medium animate-in fade-in">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLocked}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:dark:bg-slate-700 disabled:text-slate-300 disabled:cursor-not-allowed transition-colors"
          >
            {isLocked ? "System Zablokowany" : "Zaloguj się"}
          </button>
          
          <div className="text-center mt-4">
              <p className="text-xs text-slate-500 dark:text-slate-500">Do testów użyj: test@test.pl / Test1234!</p>
          </div>
        </form>
      </div>
    </div>
  );
}
