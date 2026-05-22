import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ProductCard from "@/components/ProductCard";

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

    expect(screen.getByText("Wino wytrawne")).toBeInTheDocument();
    expect(screen.getByText("49.99 zł")).toBeInTheDocument();
  });

  it("nie powinien zawierać linku do strony szczegółów produktu", () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
