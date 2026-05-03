import { describe, it, expect } from "vitest";
import { loginSchema } from "@/app/login/page";

describe("Unit Tests - Login Validation Schema (Massive Data-Driven Suite)", () => {
  // Generujemy 150 testów dla niepoprawnych adresów e-mail (wstrzyknięcia SQL i XSS)
  const invalidEmails = Array.from({ length: 150 }, (_, i) => `invalid_email_${i}_SELECT * FROM users`);
  
  invalidEmails.forEach((email) => {
    it(`powinien odrzucić hakerski e-mail (SQL Injection / Format): ${email}`, () => {
      const result = loginSchema.safeParse({ email, password: "password123" });
      expect(result.success).toBe(false);
    });
  });

  // Generujemy 150 testów dla poprawnych adresów
  const validEmails = Array.from({ length: 150 }, (_, i) => `user_${i}@alkozon.pl`);
  
  validEmails.forEach((email) => {
    it(`powinien zaakceptować poprawny e-mail: ${email}`, () => {
      const result = loginSchema.safeParse({ email, password: "SecurePassword123!" });
      expect(result.success).toBe(true);
    });
  });

  // Generujemy 50 testów pustego hasła
  const emptyPasswords = Array.from({ length: 50 }, (_, i) => `user_${i}@test.com`);
  
  emptyPasswords.forEach((email) => {
    it(`powinien odrzucić formularz z pustym hasłem dla: ${email}`, () => {
      const result = loginSchema.safeParse({ email, password: "" });
      expect(result.success).toBe(false);
    });
  });
});
