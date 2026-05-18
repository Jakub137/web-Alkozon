import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ProductCard from "@/components/ProductCard";

// Mockujemy nawigację i hooki używane w komponencie
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href} data-testid="mock-link">
      {children}
    </a>
  ),
}));

vi.mock("@/context/CartContext", () => ({
  useCart: () => ({ addToCart: vi.fn() }),
}));

vi.mock("@/context/AgeContext", () => ({
  useAge: () => ({ ageStatus: "adult" }),
}));

vi.mock("@/context/LanguageContext", () => ({
  useLanguage: () => ({
    dict: {
      shop: {
        product: {
          pricePerUnit: "Cena za",
          addToCart: "Dodaj do koszyka",
          inCart: "W koszyku",
          unavailable: "Niedostępne",
        },
      },
    },
  }),
}));

describe("UI Tests - ProductCard", () => {
  const mockProduct: any = {
    id: "1",
    name: "Wino wytrawne",
    description: "Idealne na wieczór",
    price: 49.99,
    imageUrl: "/wino.jpg",
    category: "wine",
    stock: 10,
    capacity: "0.75L",
    image: "/wino.jpg",
    alcoholContent: 12,
  };

  it("powinien wyrenderować wszystkie informacje o produkcie", () => {
    render(<ProductCard product={mockProduct} />);

    // Sprawdzamy czy nazwa istnieje
    expect(screen.getByText("Wino wytrawne")).toBeInTheDocument();

    // Sprawdzamy czy cena renderuje się z przecinkiem/walutą
    expect(screen.getByText("49.99 zł")).toBeInTheDocument();
  });

  it("powinien zawierać link do strony szczegółów produktu", () => {
    render(<ProductCard product={mockProduct} />);

    // Szukamy po data-testid dodanym w mocku Link z Next.js
    const link = screen.getByTestId("mock-link");
    expect(link).toHaveAttribute("href", "/shop/1");
  });
});
