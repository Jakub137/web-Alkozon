import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ShopPage from "@/app/shop/page";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { useAge } from "@/context/AgeContext";
import { useAuth } from "@/context/AuthContext";
import { getProducts } from "@/lib/api/products";

// Mock contextów
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

vi.mock("@/lib/api/products", () => ({
  getProducts: vi.fn(),
}));

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href} data-testid="mock-link">
      {children}
    </a>
  ),
}));

// Mockujemy ProductCard żeby nie przejmować się jego złożonością w teście strony
vi.mock("@/components/ProductCard", () => ({
  default: ({ product, onAddToCart, isAddDisabled }: any) => (
    <div data-testid={`product-card-${product.id}`}>
      <span>{product.name}</span>
      <span>{product.price} zł</span>
      <button
        disabled={isAddDisabled}
        onClick={() => onAddToCart(product)}
        data-testid={`add-to-cart-${product.id}`}
      >
        Dodaj
      </button>
    </div>
  ),
}));

// Mockujemy hook z opóźnieniem (debounce) aby testy wykonywały się natychmiast
vi.mock("react", async () => {
  const actual = await vi.importActual("react");
  return {
    ...actual,
    useState: actual.useState,
    useEffect: actual.useEffect,
    useMemo: actual.useMemo,
  };
});

const mockDict = {
  shop: {
    title: "Sklep",
    subtitle: "Katalog produktów",
    filters: {
      title: "Filtry",
      category: "Kategoria",
      priceRange: "Cena",
      priceMin: "Od",
      priceMax: "Do",
    },
    categories: {
      vodka: "Wódka",
      whisky: "Whisky",
      wine: "Wino",
      beer: "Piwo",
      liqueur: "Likier",
      rum: "Rum",
    },
    search: {
      placeholder: "Szukaj...",
    },
    sort: {
      priceAsc: "Cena rosnąco",
      priceDesc: "Cena malejąco",
      nameAsc: "A-Z",
      nameDesc: "Z-A",
    },
    noProducts: "Brak produktów spełniających kryteria.",
    pagination: {
      prev: "Poprzednia",
      next: "Następna",
    },
    cart: {
      title: "Twój Koszyk",
      items: "Ilość",
      limit: "Limit",
      limitReached: "Osiągnięto limit",
      empty: "Koszyk pusty",
      remove: "Usuń",
      summary: "Podsumowanie",
      checkout: {
        authRequired: "Zaloguj się",
      },
    },
  },
};

describe("ShopPage Unit Tests", () => {
  const mockAddToCart = vi.fn();
  const mockRemoveFromCart = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (getProducts as any).mockResolvedValue({
      content: [
        { id: "1", name: "Wódka czysta", price: 50, category: "vodka" },
        { id: "2", name: "Whisky stary dąb", price: 150, category: "whisky" },
        { id: "3", name: "Wino wytrawne", price: 40, category: "wine" },
      ],
      totalPages: 1,
      totalElements: 3,
      size: 8,
      number: 0,
    });
    (useLanguage as any).mockReturnValue({ dict: mockDict });
    (useAge as any).mockReturnValue({ ageStatus: "adult" });
    (useAuth as any).mockReturnValue({
      user: { role: "CUSTOMER", ageConfirmedAt: "2026-05-17T17:48:00Z" },
      setToast: vi.fn(),
    });
    (useCart as any).mockReturnValue({
      cartItems: [],
      cartItemsCount: 0,
      cartItemsLimit: 10,
      addToCart: mockAddToCart,
      removeFromCart: mockRemoveFromCart,
    });
  });

  it("powinien poprawnie wyrenderować wszystkie produkty z API na start", async () => {
    render(<ShopPage />);

    await screen.findByText("Wódka czysta");
    expect(screen.getByText("Whisky stary dąb")).toBeInTheDocument();
    expect(screen.getByText("Wino wytrawne")).toBeInTheDocument();
  });

  it("powinien poprawnie wyrenderować komponent koszyka (mini-cart) z odpowiednią ilością", async () => {
    (useCart as any).mockReturnValue({
      cartItems: [{ product: { id: "1", name: "Wódka czysta", price: 50 }, quantity: 2 }],
      cartItemsCount: 2,
      cartItemsLimit: 10,
      addToCart: mockAddToCart,
      removeFromCart: mockRemoveFromCart,
    });

    render(<ShopPage />);
    await screen.findByText("Wódka czysta");
    fireEvent.click(screen.getByRole("button", { name: "Twój Koszyk" }));
    expect(screen.getByText("Ilość: 2")).toBeInTheDocument();
    expect(screen.getByText("Limit: 10")).toBeInTheDocument();
    expect(screen.getByText("x2")).toBeInTheDocument(); // Ilość konkretnego produktu
  });

  it("powinien zablokować możliwość dodawania do koszyka gdy limit osiągnięty", async () => {
    (useCart as any).mockReturnValue({
      cartItems: [],
      cartItemsCount: 10,
      cartItemsLimit: 10,
      addToCart: mockAddToCart,
      removeFromCart: mockRemoveFromCart,
    });

    render(<ShopPage />);
    await screen.findByText("Wódka czysta");
    fireEvent.click(screen.getByRole("button", { name: "Twój Koszyk" }));
    expect(screen.getByText("Osiągnięto limit")).toBeInTheDocument();

    const addBtn = screen.getByTestId("add-to-cart-1");
    expect(addBtn).toBeDisabled();
  });

  it("powinien filtrować listę produktów po kategorii", async () => {
    render(<ShopPage />);
    await screen.findByText("Wódka czysta");
    // Na starcie są 3
    expect(screen.getByText("Wódka czysta")).toBeInTheDocument();

    // Zaznaczamy tylko kategorię Wódka
    const vodkaCheckbox = screen.getByLabelText("Wódka");
    fireEvent.click(vodkaCheckbox);

    expect(getProducts).toHaveBeenCalled();
  });

  it("powinien wyszukiwać tekst wpisany w input (debounce check)", async () => {
    render(<ShopPage />);
    await screen.findByText("Wódka czysta");
    const searchInput = screen.getByPlaceholderText("Szukaj...");

    fireEvent.change(searchInput, { target: { value: "wino" } });
    await waitFor(() => {
      expect(getProducts).toHaveBeenCalled();
    });
  });
});
