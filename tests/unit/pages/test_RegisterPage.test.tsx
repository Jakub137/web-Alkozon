import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegisterPage from "@/app/register/page";
import { useAuth } from "@/context/AuthContext";
import { useAge } from "@/context/AgeContext";
import { useRouter } from "next/navigation";
import { confirmAgeApi, registerApi } from "@/lib/api/auth";

vi.mock("@/context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/context/AgeContext", () => ({
  useAge: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

vi.mock("@/lib/api/auth", () => ({
  registerApi: vi.fn(),
  confirmAgeApi: vi.fn(),
}));

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("RegisterPage Unit Tests", () => {
  const mockLogin = vi.fn();
  const mockSetToast = vi.fn();
  const mockSetAgeStatus = vi.fn();
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as any).mockReturnValue({ login: mockLogin, setToast: mockSetToast });
    (useAge as any).mockReturnValue({ setAgeStatus: mockSetAgeStatus });
    (useRouter as any).mockReturnValue({ push: mockPush });
    const session = {
      accessToken: "mocked-jwt-token",
      refreshToken: "mocked-refresh-token",
      tokenType: "Bearer",
      expiresAt: Date.now() + 1000 * 60,
      user: { username: "Tester", email: "test@test.pl", role: "CUSTOMER" },
    };
    (registerApi as any).mockResolvedValue(session);
    (confirmAgeApi as any).mockResolvedValue(session);
  });

  it("powinien pokazać błędy walidacji dla pustego formularza", async () => {
    render(<RegisterPage />);

    const submitBtn = screen.getByRole("button", { name: "Zarejestruj Konto" });
    fireEvent.submit(submitBtn.closest("form")!);

    await waitFor(() => {
      expect(screen.getByText("Nazwa użytkownika od 3 znaków")).toBeInTheDocument();
      expect(screen.getByText("Niepoprawny format adresu email")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Hasło: 8–128 znaków, mała i wielka litera, cyfra oraz znak specjalny z zestawu @$!%*?&"
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText("Musisz potwierdzić pełnoletność, aby założyć konto klienta.")
      ).toBeInTheDocument();
    });
  });

  it("powinien poprawnie zarejestrować przy prawidłowych danych", async () => {
    render(<RegisterPage />);

    fireEvent.change(screen.getByPlaceholderText("Janek123"), { target: { value: "Tester" } });
    fireEvent.change(screen.getByPlaceholderText("jan@kowalski.pl"), {
      target: { value: "test@test.pl" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "SilneHaslo123!" },
    });
    fireEvent.click(
      screen.getByLabelText("Potwierdzam, że mam ukończone 18 lat i mogę założyć konto klienta.")
    );

    fireEvent.submit(screen.getByRole("button", { name: "Zarejestruj Konto" }).closest("form")!);

    await waitFor(() => {
      expect(registerApi).toHaveBeenCalledWith({
        email: "test@test.pl",
        password: "SilneHaslo123!",
        firstName: "Tester",
        lastName: undefined,
        ageConfirmed: true,
      });
      expect(confirmAgeApi).toHaveBeenCalledWith("mocked-jwt-token");
      expect(mockLogin).toHaveBeenCalled();
      expect(mockSetAgeStatus).toHaveBeenCalledWith("adult");
      expect(mockSetToast).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });
});
