"use client";

import { useMemo, useState } from "react";
import {
  PRICE_BOUNDS,
  PRODUCTS,
  ROOM_SIZE_OPTIONS,
  type ACType,
  type Product,
  type SortOption,
} from "@/data/products";

export type Filters = {
  brands: string[];
  types: ACType[];
  capacities: number[];
  roomSizes: string[];
  energy: number[];
  price: [number, number];
};

const EMPTY: Filters = {
  brands: [],
  types: [],
  capacities: [],
  roomSizes: [],
  energy: [],
  price: [PRICE_BOUNDS.min, PRICE_BOUNDS.max],
};

const INITIAL: Filters = {
  ...EMPTY,
  brands: ["Daikin"],
  types: ["Inverter"],
  capacities: [1.5],
  price: [108000, 265000],
};

function sortProducts(list: Product[], sort: SortOption): Product[] {
  const out = [...list];
  switch (sort) {
    case "Price, low to high":
      return out.sort((a, b) => a.price - b.price);
    case "Price, high to low":
      return out.sort((a, b) => b.price - a.price);
    case "Top rated":
      return out.sort((a, b) => b.rating - a.rating);
    case "Newest":
      return out.sort((a, b) => Number(b.badge === "NEW") - Number(a.badge === "NEW"));
    default:
      return out.sort((a, b) => b.reviews - a.reviews);
  }
}

export function useShopFilters() {
  const [filters, setFilters] = useState<Filters>(INITIAL);
  const [sort, setSort] = useState<SortOption>("Popular");

  function toggle<K extends keyof Filters>(
    key: K,
    value: Filters[K] extends (infer U)[] ? U : never
  ) {
    setFilters((prev) => {
      const current = prev[key] as unknown as unknown[];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [key]: next } as Filters;
    });
  }

  function setPrice(price: [number, number]) {
    setFilters((prev) => ({ ...prev, price }));
  }

  function clearAll() {
    setFilters(EMPTY);
  }

  const results = useMemo(() => {
    const [min, max] = filters.price;
    const filtered = PRODUCTS.filter((p) => {
      if (p.price < min || p.price > max) return false;
      if (filters.brands.length && !filters.brands.includes(p.brand)) return false;
      if (filters.types.length && !filters.types.includes(p.type)) return false;
      if (filters.capacities.length && !filters.capacities.includes(p.hp)) return false;
      if (filters.energy.length && !filters.energy.includes(p.energy)) return false;
      if (filters.roomSizes.length) {
        const buckets = ROOM_SIZE_OPTIONS.filter((r) => filters.roomSizes.includes(r.label));
        const hit = buckets.some((r) => p.roomMax > r.min && p.roomMin <= r.max);
        if (!hit) return false;
      }
      return true;
    });
    return sortProducts(filtered, sort);
  }, [filters, sort]);

  /** Human-readable chips for the applied filters, with a remover for each. */
  const appliedChips = useMemo(() => {
    const chips: { label: string; clear: () => void }[] = [];
    filters.brands.forEach((b) =>
      chips.push({ label: b, clear: () => toggle("brands", b as never) })
    );
    filters.types.forEach((t) =>
      chips.push({ label: t, clear: () => toggle("types", t as never) })
    );
    filters.capacities.forEach((c) =>
      chips.push({
        label: (c % 1 === 0 ? c.toFixed(1) : String(c)) + " HP",
        clear: () => toggle("capacities", c as never),
      })
    );
    filters.roomSizes.forEach((r) =>
      chips.push({ label: r, clear: () => toggle("roomSizes", r as never) })
    );
    filters.energy.forEach((e) =>
      chips.push({ label: e + " star", clear: () => toggle("energy", e as never) })
    );
    if (filters.price[1] < PRICE_BOUNDS.max) {
      chips.push({
        label: "Under LKR " + filters.price[1].toLocaleString(),
        clear: () => setPrice([filters.price[0], PRICE_BOUNDS.max]),
      });
    }
    return chips;
  }, [filters]);

  return { filters, sort, setSort, toggle, setPrice, clearAll, results, appliedChips };
}
