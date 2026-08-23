"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { CartItem } from "@/lib/types";

const STORAGE_KEY = "imt-cart-v1";

type CartContextValue = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  toggleInstallation: (productId: string, selected: boolean) => void;
  subtotal: number;
  installationTotal: number;
  itemCount: number;
  total: number;
  isReady: boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore corrupt storage
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    if (!isReady) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage unavailable, ignore
    }
  }, [items, isReady]);

  function addItem(newItem: CartItem) {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === newItem.productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === newItem.productId ? { ...i, qty: i.qty + newItem.qty } : i
        );
      }
      return [...prev, newItem];
    });
  }

  function removeItem(productId: string) {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }

  function updateQty(productId: string, qty: number) {
    if (qty < 1) return;
    setItems((prev) => prev.map((i) => (i.productId === productId ? { ...i, qty } : i)));
  }

  function toggleInstallation(productId: string, selected: boolean) {
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, installation: { ...i.installation, selected } } : i))
    );
  }

  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.price * i.qty, 0), [items]);
  const installationTotal = useMemo(
    () => items.reduce((sum, i) => sum + (i.installation.selected ? i.installation.fee : 0), 0),
    [items]
  );
  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items]);
  const total = subtotal + installationTotal;

  const value: CartContextValue = {
    items,
    addItem,
    removeItem,
    updateQty,
    toggleInstallation,
    subtotal,
    installationTotal,
    itemCount,
    total,
    isReady,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
