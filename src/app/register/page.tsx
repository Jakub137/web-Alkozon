"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Lock, Mail, User, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useAge } from "@/context/AgeContext";
import { confirmAgeApi, registerApi } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/types";
import { SAFE_TEXT_REGEX, STRONG_PASSWORD_REGEX } from "@/lib/validation/backendPatterns";

const registerSchema = z.object({
  username: z.string().min(3, { message: "Nazwa użytkownika od 3 znaków" }).regex(SAFE_TEXT_REGEX, {
    message: "Niedozwolone znaki (np. cudzysłowy, nawiasy klamrowe) — zgodnie z walidacją API",
  }),
  email: z.string().email({ message: "Niepoprawny format adresu email" }),
  password: z.string().regex(STRONG_PASSWORD_REGEX, {
    message:
      "Hasło: 8–128 znaków, mała i wielka litera, cyfra oraz znak specjalny z zestawu @$!%*?&",
  }),
  ageConfirmed: z.boolean().refine((value) => value, {
    message: "Musisz potwierdzić pełnoletność, aby założyć konto klienta.",
  }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { login, setToast } = useAuth();
  const { setAgeStatus } = useAge();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      ageConfirmed: false,
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setErrorMsg("");
      setIsSubmitting(true);
      const [firstName, ...restNames] = data.username.trim().split(" ");
      const session = await registerApi({
        email: data.email,
        password: data.password,
        firstName,
        lastName: restNames.join(" ") || undefined,
        ageConfirmed: data.ageConfirmed,
      });
      const confirmedSession = await confirmAgeApi(session.accessToken).catch(() => session);
      login(confirmedSession);
      setAgeStatus("adult");
      setToast("Konto zostało pomyślnie utworzone! Zostałeś automatycznie zalogowany.");
      router.push("/");
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg("Nie udało się utworzyć konta. Spróbuj ponownie.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Weryfikacja & Rejestracja
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            lub{" "}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors"
            >
              zaloguj się
            </Link>
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-800 dark:text-red-300 font-medium">{errorMsg}</p>
          </div>
        )}
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Nazwa Użytkownika (Login)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400" />
              </div>
              <input
                {...register("username")}
                type="text"
                disabled={isSubmitting}
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white sm:text-sm transition-colors"
                placeholder="Janek123"
              />
            </div>
            {errors.username && (
              <p className="mt-1.5 text-sm text-red-500 font-medium animate-in fade-in">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Adres Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                {...register("email")}
                type="email"
                disabled={isSubmitting}
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white sm:text-sm transition-colors"
                placeholder="jan@kowalski.pl"
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 text-sm text-red-500 font-medium animate-in fade-in">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Bezpieczne Hasło
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                disabled={isSubmitting}
                className="block w-full pl-10 pr-10 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white sm:text-sm transition-colors"
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isSubmitting}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-500 transition-colors" />
                ) : (
                  <Eye className="h-5 w-5 text-slate-400 hover:text-slate-500 transition-colors" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1.5 text-sm text-red-500 font-medium animate-in fade-in">
                {errors.password.message}
              </p>
            )}

            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 font-medium bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2 rounded-md">
              Walidacja jak w API (bezpieczny tekst w nazwie, hasło z małą i wielką literą, cyfrą
              oraz znakiem @$!%*?&).
            </p>
          </div>

          <div>
            <label className="flex items-start gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-3 text-sm text-slate-700 dark:text-slate-300">
              <input
                {...register("ageConfirmed")}
                type="checkbox"
                disabled={isSubmitting}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
              />
              <span>Potwierdzam, że mam ukończone 18 lat i mogę założyć konto klienta.</span>
            </label>
            {errors.ageConfirmed && (
              <p className="mt-1.5 text-sm text-red-500 font-medium animate-in fade-in">
                {errors.ageConfirmed.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            {isSubmitting ? "Rejestracja..." : "Zarejestruj Konto"}
          </button>
        </form>
      </div>
    </div>
  );
}
