import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CustomOrderPage from "@/app/custom-order/page";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { useAge } from "@/context/AgeContext";
import { useAuth } from "@/context/AuthContext";

vi.mock("@/context/LanguageContext", () => ({
  useLanguage: vi.fn(),
}));
vi.mock("@/context/CartContext", () => ({
  useCart: vi.fn(),
}));
vi.mock("@/context/AgeContext", () => ({
  useAge: vi.fn(),
}));
vi.mock("@/context/AuthContext", () => ({
  useAuth: vi.fn(),
}));
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

const mockDict = {
  shop: {
    categories: { vodka: "Wódka", whisky: "Whisky", wine: "Wino", liqueur: "Likier" },
    cart: { checkout: { authRequired: "Zaloguj się" } },
  },
  customOrderPage: {
    title: "Twój Trunek",
    subtitle: "Opis",
    steps: { step1: "Baza", step2: "Smak", step3: "Nazwa" },
    sections: { base: "Baza", flavor: "Smak", finish: "Koniec" },
    fields: {
      base: "Baza",
      capacity: "Poj",
      strength: "Moc",
      flavors: "Smaki",
      intensity: "Intensywność",
      customName: "Nazwa",
      customNamePlaceholder: "Wpisz",
      note: "Notatka",
      notePlaceholder: "Wpisz notatkę",
    },
    flavors: {
      sweet: "Słodki",
      dry: "Wytrawny",
      fruity: "Owocowy",
      smoky: "Dymny",
      herbal: "Ziołowy",
      barrel: "Beczka",
    },
    validation: { nameHint: "Podpowiedź", wordsLabel: "słów" },
    buttons: {
      back: "Wstecz",
      next: "Dalej",
      addToCart: "Dodaj do koszyka",
      goToSummary: "Podsumowanie",
    },
    summary: {
      title: "Podsumowanie",
      base: "Baza",
      capacity: "Poj",
      strength: "Moc",
      intensity: "Int",
      flavors: "Smaki",
      estimatedPrice: "Cena",
    },
    pricing: { base: "Baza", capacity: "Poj", strength: "Moc", flavors: "Smaki", intensity: "Int" },
    messages: { added: "Dodano", limitTotalReached: "Limit1", limitCustomReached: "Limit2" },
  },
};

describe("CustomOrderPage Unit Tests", () => {
  const mockAddToCart = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useLanguage as any).mockReturnValue({ dict: mockDict });
    (useCart as any).mockReturnValue({
      cartItemsCount: 0,
      cartItemsLimit: 10,
      customOrderItemsCount: 0,
      customOrderItemsLimit: 5,
      addToCart: mockAddToCart,
    });
    (useAge as any).mockReturnValue({ ageStatus: "verified" });
    (useAuth as any).mockReturnValue({
      user: { role: "CUSTOMER", ageConfirmedAt: "2026-05-17T17:48:00Z" },
    });
  });

  it("powinien pozwalać na przejście przez kroki kreatora", () => {
    render(<CustomOrderPage />);

    // Krok 1
    expect(screen.getByText("Wódka")).toBeInTheDocument();

    // Zmieniamy baze na wodke
    fireEvent.click(screen.getByText("Wódka"));

    // Przejście do kroku 2
    fireEvent.click(screen.getByRole("button", { name: "Dalej" }));
    expect(screen.getByText("Słodki")).toBeInTheDocument();

    // Wybór smaku
    fireEvent.click(screen.getByText("Słodki"));

    // Przejście do kroku 3
    fireEvent.click(screen.getByRole("button", { name: "Dalej" }));
    expect(screen.getByPlaceholderText("Wpisz")).toBeInTheDocument();
  });

  it("powinien zablokować dodanie do koszyka bez nazwy", () => {
    render(<CustomOrderPage />);

    // idź do kroku 3
    fireEvent.click(screen.getByRole("button", { name: "Dalej" }));
    fireEvent.click(screen.getByRole("button", { name: "Dalej" }));

    const addBtn = screen.getByRole("button", { name: "Dodaj do koszyka" });
    expect(addBtn).toBeDisabled();

    fireEvent.change(screen.getByPlaceholderText("Wpisz"), { target: { value: "Moje wino" } });
    expect(addBtn).not.toBeDisabled();

    mockAddToCart.mockReturnValue({ ok: true });
    fireEvent.click(addBtn);
    expect(mockAddToCart).toHaveBeenCalled();
  });
});
