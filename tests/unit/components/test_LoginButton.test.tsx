import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import LoginButton from "@/components/LoginButton";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import pl from "@/dictionaries/pl.json";

vi.mock("@/context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/context/LanguageContext", () => ({
  useLanguage: vi.fn(),
}));

vi.mock("@/context/ThemeContext", () => ({
  useTheme: vi.fn(),
}));

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href} data-testid="login-link">
      {children}
    </a>
  ),
}));

describe("LoginButton Unit Tests", () => {
  beforeEach(() => {
    (useLanguage as any).mockReturnValue({
      dict: pl,
      lang: "pl",
    });

    (useTheme as any).mockReturnValue({
      theme: "light",
    });
  });

  it("powinien wyświetlić przycisk logowania dla niezalogowanego użytkownika", () => {
    (useAuth as any).mockReturnValue({
      user: null,
      logout: vi.fn(),
    });

    render(<LoginButton />);

    const loginLink = screen.getByTestId("login-link");
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveTextContent("Zaloguj");
    expect(loginLink).toHaveAttribute("href", "/login");
  });

  it("powinien wyświetlić nazwę użytkownika i przycisk wylogowania dla zalogowanego użytkownika", () => {
    const logoutMock = vi.fn();
    (useAuth as any).mockReturnValue({
      user: { username: "testuser" },
      logout: logoutMock,
    });

    render(<LoginButton />);

    expect(screen.getByText("Witaj, testu...")).toBeInTheDocument();
    expect(screen.getByTitle("Witaj, testuser")).toBeInTheDocument();

    const logoutBtn = screen.getByTitle("Wyloguj");
    expect(logoutBtn).toBeInTheDocument();

    fireEvent.click(logoutBtn);
    expect(logoutMock).toHaveBeenCalledWith(pl.auth.toast.logoutSuccess);
  });
});
