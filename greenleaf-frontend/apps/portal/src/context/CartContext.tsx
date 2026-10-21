'use client';

// MOCK ONLY — BACKEND_REQUIRED_LATER
// Cart state is held in memory. When API is ready, replace INITIAL_CART
// with a call to GET /cart and persist changes via POST /cart/items etc.

import { createContext, useContext, useState } from 'react';
import { INITIAL_CART } from '@/data/mock/cart';
import type { CartItem } from '@/types/cart';

interface CartContextValue {
  items:        CartItem[];
  addItem:      (productId: string) => void;
  decreaseItem: (productId: string) => void;
  removeItem:   (productId: string) => void;
  clearCart:    () => void;
  getQty:       (productId: string) => number;
  totalQty:     number;
}

const CartContext = createContext<CartContextValue>({
  items:        [],
  addItem:      () => {},
  decreaseItem: () => {},
  removeItem:   () => {},
  clearCart:    () => {},
  getQty:       () => 0,
  totalQty:     0,
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(INITIAL_CART);

  function addItem(productId: string) {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) return prev.map((i) => i.productId === productId ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { productId, qty: 1 }];
    });
  }

  function decreaseItem(productId: string) {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (!existing) return prev;
      if (existing.qty <= 1) return prev.filter((i) => i.productId !== productId);
      return prev.map((i) => i.productId === productId ? { ...i, qty: i.qty - 1 } : i);
    });
  }

  function removeItem(productId: string) {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }

  function clearCart() {
    setItems([]);
  }

  function getQty(productId: string): number {
    return items.find((i) => i.productId === productId)?.qty ?? 0;
  }

  const totalQty = items.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, decreaseItem, removeItem, clearCart, getQty, totalQty }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
