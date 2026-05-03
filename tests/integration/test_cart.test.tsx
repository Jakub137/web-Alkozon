import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { CartProvider, useCart } from "@/context/CartContext";

// Tworzymy fałszywy komponent pomocniczy do przetestowania Hooka useCart wewnątrz CartProvidera
function TestCartComponent() {
  const { cartItems, cartItemsCount, addToCart, removeFromCart } = useCart();

  const mockProduct = {
    id: "100",
    name: "Testowe Wino",
    description: "Opis",
    price: 50,
    imageUrl: "/img",
    category: "wine",
    capacity: "500ml",
    stock: 10
  };

  return (
    <div>
      <span data-testid="item-count">{cartItemsCount}</span>
      <button onClick={() => addToCart(mockProduct as any)}>Dodaj</button>
      <button onClick={() => removeFromCart("100")}>Usuń</button>
    </div>
  );
}

describe("Integration Tests - CartContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("powinien zaczynać z pustym koszykiem", () => {
    render(
      <CartProvider>
        <TestCartComponent />
      </CartProvider>
    );
    expect(screen.getByTestId("item-count").textContent).toBe("0");
  });

  it("powinien dodać produkt do koszyka", () => {
    render(
      <CartProvider>
        <TestCartComponent />
      </CartProvider>
    );

    fireEvent.click(screen.getByText("Dodaj"));
    
    expect(screen.getByTestId("item-count").textContent).toBe("1");
  });

  it("powinien usunąć produkt z koszyka", () => {
    render(
      <CartProvider>
        <TestCartComponent />
      </CartProvider>
    );

    fireEvent.click(screen.getByText("Dodaj"));
    expect(screen.getByTestId("item-count").textContent).toBe("1");

    fireEvent.click(screen.getByText("Usuń"));
    expect(screen.getByTestId("item-count").textContent).toBe("0");
  });
});
