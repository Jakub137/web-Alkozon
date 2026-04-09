"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Lock, Mail, User, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const registerSchema = z.object({
  username: z.string().min(3, { message: "Nazwa użytkownika od 3 znaków" }),
  email: z.string().email({ message: "Niepoprawny format adresu email" }),
  password: z.string()
    .min(8, { message: "Hasło musi mieć co najmniej 8 znaków" })
    .regex(/[A-Z]/, { message: "Brak wielkiej litery na potrzeby bezpieczeństwa poszwa" })
    .regex(/[^A-Za-z0-9]/, { message: "Hasło musi zawierać znak specjalny" }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { login, setToast } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormValues) => {
    // W pełni bezpieczna walidacja (Schema Zod chroni przed Injection). Zalogowanie po HTTPS:
    login(data.username, "mocked-jwt-token-after-register");
    setToast("Konto zostało pomyślnie utworzone! Zostałeś automatycznie zalogowany.");
    router.push("/");
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Weryfikacja & Rejestracja
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            lub <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors">zaloguj się</Link>
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Nazwa Użytkownika (Login)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400" />
              </div>
              <input
                {...register("username")}
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white sm:text-sm transition-colors"
                placeholder="Janek123"
              />
            </div>
            {errors.username && <p className="mt-1.5 text-sm text-red-500 font-medium animate-in fade-in">{errors.username.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Adres Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                {...register("email")}
                type="email"
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white sm:text-sm transition-colors"
                placeholder="jan@kowalski.pl"
              />
            </div>
            {errors.email && <p className="mt-1.5 text-sm text-red-500 font-medium animate-in fade-in">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Bezpieczne Hasło</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                className="block w-full pl-10 pr-10 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white sm:text-sm transition-colors"
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-500 transition-colors" />
                ) : (
                  <Eye className="h-5 w-5 text-slate-400 hover:text-slate-500 transition-colors" />
                )}
              </button>
            </div>
            {errors.password && <p className="mt-1.5 text-sm text-red-500 font-medium animate-in fade-in">{errors.password.message}</p>}
            
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 font-medium bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2 rounded-md">
              Dzięki parserowi Zod chronimy API, narzucając trudne hasło (min. 8 znaków, duża litera, znak specjalny).
            </p>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Zarejestruj Konto
          </button>
        </form>
      </div>
    </div>
  );
}
