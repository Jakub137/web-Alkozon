import { describe, it, expect } from "vitest";
import { mapAuthApiErrorMessage } from "@/lib/api/mapApiErrorMessage";
import { ApiError } from "@/lib/api/types";
import pl from "@/dictionaries/pl.json";
import en from "@/dictionaries/en.json";

describe("mapAuthApiErrorMessage", () => {
  it("maps invalid credentials to localized message", () => {
    const error = new ApiError("Invalid credentials", 401, {
      status: 401,
      message: "Invalid credentials",
    });

    expect(mapAuthApiErrorMessage(error, pl.auth.errors)).toBe(
      pl.auth.errors.invalidCredentials
    );
    expect(mapAuthApiErrorMessage(error, en.auth.errors)).toBe(
      en.auth.errors.invalidCredentials
    );
  });

  it("maps email already registered to localized message", () => {
    const error = new ApiError("Email already registered", 409, {
      status: 409,
      message: "Email already registered",
    });

    expect(mapAuthApiErrorMessage(error, pl.auth.errors)).toBe(
      pl.auth.errors.emailAlreadyRegistered
    );
  });
});
