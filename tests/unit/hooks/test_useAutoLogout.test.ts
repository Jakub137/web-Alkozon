import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useAutoLogout } from "@/hooks/useAutoLogout";
import * as AuthContextModule from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import pl from "@/dictionaries/pl.json";

vi.mock("@/context/LanguageContext", () => ({
  useLanguage: vi.fn(),
}));

describe("Unit Tests - useAutoLogout Hook", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    (useLanguage as any).mockReturnValue({ dict: pl, lang: "pl" });
    vi.spyOn(AuthContextModule, "useAuth").mockReturnValue({
      user: { email: "test@alkozon.pl", role: "CUSTOMER" } as any,
      logout: vi.fn(),
      login: vi.fn(),
      isAuthenticated: true,
    } as any);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("nie robi nic, gdy użytkownik nie jest zalogowany", () => {
    // Mockujemy że user = null
    vi.spyOn(AuthContextModule, "useAuth").mockReturnValue({
      user: null,
      logout: vi.fn(),
      login: vi.fn(),
      isAuthenticated: false,
    } as any);

    renderHook(() => useAutoLogout());
    const mockLogout = AuthContextModule.useAuth().logout;

    vi.advanceTimersByTime(3600000);
    expect(mockLogout).not.toHaveBeenCalled();
  });

  it("nie wylogowuje przy roli GUEST (sesja gościa)", () => {
    const mockLogout = vi.fn();
    vi.spyOn(AuthContextModule, "useAuth").mockReturnValue({
      user: { email: "guest@local", role: "GUEST" } as any,
      logout: mockLogout,
      login: vi.fn(),
      isAuthenticated: true,
    } as any);

    renderHook(() => useAutoLogout());
    vi.advanceTimersByTime(15 * 60 * 1000 + 5000);
    expect(mockLogout).not.toHaveBeenCalled();
  });

  it("wylogowuje użytkownika po przekroczeniu czasu bezczynności", () => {
    const mockLogout = vi.fn();
    vi.spyOn(AuthContextModule, "useAuth").mockReturnValue({
      user: { email: "test@alkozon.pl", role: "CUSTOMER" } as any,
      logout: mockLogout,
      login: vi.fn(),
      isAuthenticated: true,
    } as any);

    renderHook(() => useAutoLogout());

    vi.advanceTimersByTime(15 * 60 * 1000 + 5000);
    expect(mockLogout).toHaveBeenCalledWith(pl.auth.toast.loggedOutInactivity);
  });

  it("resetuje licznik po aktywności użytkownika (mousemove)", () => {
    const mockLogout = vi.fn();
    vi.spyOn(AuthContextModule, "useAuth").mockReturnValue({
      user: { email: "test@alkozon.pl", role: "CUSTOMER" } as any,
      logout: mockLogout,
      login: vi.fn(),
      isAuthenticated: true,
    } as any);

    renderHook(() => useAutoLogout());

    vi.advanceTimersByTime(10 * 60 * 1000);
    act(() => {
      window.dispatchEvent(new MouseEvent("mousemove"));
    });

    vi.advanceTimersByTime(10 * 60 * 1000);
    expect(mockLogout).not.toHaveBeenCalled();
  });
});
