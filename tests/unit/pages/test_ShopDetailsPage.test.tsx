import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import ShopProductPage from "@/app/shop/[id]/page";
import { useLanguage } from "@/context/LanguageContext";
import { useAge } from "@/context/AgeContext";
import { useParams } from "next/navigation";
import { getProductById } from "@/lib/api/products";
import { ApiError } from "@/lib/api/types";

vi.mock("@/context/LanguageContext", () => ({
  useLanguage: vi.fn(),
}));
vi.mock("@/context/AgeContext", () => ({
  useAge: vi.fn(),
}));
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));
vi.mock("@/lib/api/products", () => ({
  getProductById: vi.fn(),
}));
vi.mock("next/navigation", () => ({
  useParams: vi.fn(() => ({ id: "1" })),
}));

describe("ShopDetailsPage Unit Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useLanguage as any).mockReturnValue({
      dict: {
        shop: {
          noProducts: "Nie znaleziono produktu",
          details: {
            productNotFound: "Nie znaleziono produktu",
            backToShop: "Wróć do sklepu",
            capacity: "Pojemność",
            alcoholContent: "Zawartość alkoholu",
            descriptionTitle: "Opis",
            historyTitle: "Historia",
          },
          product: { addToCart: "Dodaj" },
        },
      },
    });
    (useAge as any).mockReturnValue({ ageStatus: "adult" });
    (getProductById as any).mockResolvedValue({
      id: "1",
      name: "Wódka czysta",
      capacity: "0.5L",
      price: 50,
      alcoholContent: 40,
      image: "/img.png",
    });
  });

  it("powinien wyrenderować błąd gdy produkt nie istnieje", async () => {
    (getProductById as any).mockRejectedValue(
      new ApiError("Not found", 404, { status: 404, message: "Not found" })
    );

    (useParams as any).mockReturnValue({ id: "999" });
    render(<ShopProductPage />);
    expect(await screen.findByText("Nie znaleziono produktu")).toBeInTheDocument();
  });

  it("powinien wyrenderować szczegóły produktu gdy istnieje", async () => {
    (useParams as any).mockReturnValue({ id: "1" });
    render(<ShopProductPage />);
    expect(await screen.findByText("Wódka czysta")).toBeInTheDocument();
    expect(screen.getAllByText("0.5L").length).toBeGreaterThan(0);
    expect(screen.getByText("50.00 zł")).toBeInTheDocument();
    expect(screen.getByText("40%")).toBeInTheDocument();
  });
});
