"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import { Product } from "@/types/product";

export type CartItem = {
  product: Product;
  quantity: number;
};

type AddToCartResult =
  | { ok: true }
  | { ok: false; reason: "total_limit" | "custom_limit" };

interface CartContextType {
  cartItems: CartItem[];
  cartItemsCount: number;
  customOrderItemsCount: number;
  cartItemsLimit: number;
  customOrderItemsLimit: number;
  addToCart: (product: Product) => AddToCartResult;
  removeFromCart: (productId: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_ITEMS_LIMIT = 20;
const CUSTOM_ORDER_ITEMS_LIMIT = 3;
const CUSTOM_PRODUCT_ID_PREFIX = "custom-";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const cartItemsCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );
  const customOrderItemsCount = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) =>
          item.product.id.startsWith(CUSTOM_PRODUCT_ID_PREFIX) ? sum + item.quantity : sum,
        0
      ),
    [cartItems]
  );

  const addToCart = (product: Product) => {
    const isCustomProduct = product.id.startsWith(CUSTOM_PRODUCT_ID_PREFIX);
    if (cartItemsCount >= CART_ITEMS_LIMIT) {
      return { ok: false, reason: "total_limit" } as const;
    }
    if (isCustomProduct && customOrderItemsCount >= CUSTOM_ORDER_ITEMS_LIMIT) {
      return { ok: false, reason: "custom_limit" } as const;
    }

    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });

    return { ok: true } as const;
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartItemsCount,
        customOrderItemsCount,
        cartItemsLimit: CART_ITEMS_LIMIT,
        customOrderItemsLimit: CUSTOM_ORDER_ITEMS_LIMIT,
        addToCart,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart musi być użyte wewnątrz CartProvider");
  }
  return context;
}
