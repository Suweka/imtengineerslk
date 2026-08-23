import { CartItem } from "@/lib/types";

export type Order = {
  id: string;
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
  installationTotal: number;
  deliveryFee: number;
  total: number;
  fulfillment: "delivery" | "showroom-pickup";
  customerName: string;
  phone: string;
  email: string;
  nicNumber: string;
  address?: string;
  city?: string;
  district?: string;
  preferredInstallDate?: string;
  notes?: string;
  createdAt: string;
};

const STORAGE_KEY = "imt-orders-v1";

export function saveOrder(order: Order) {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const existing: Order[] = raw ? JSON.parse(raw) : [];
    existing.push(order);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch {
    // ignore storage failure — order object is still passed via navigation state
  }
}

export function getOrder(id: string): Order | undefined {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const existing: Order[] = raw ? JSON.parse(raw) : [];
    return existing.find((o) => o.id === id);
  } catch {
    return undefined;
  }
}

export function generateOrderNumber() {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `IMT-${year}-${rand}`;
}
