"use client";

import { useEffect, useState } from "react";
import { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";
import { getRecentlyViewed, recordViewed } from "@/lib/recently-viewed";

export function TrackViewed({ productId }: { productId: string }) {
  useEffect(() => {
    recordViewed(productId);
  }, [productId]);
  return null;
}

export function RecentlyViewed({ excludeId }: { excludeId?: string }) {
  const [items, setItems] = useState<Product[] | null>(null);

  useEffect(() => {
    const ids = getRecentlyViewed().filter((id) => id !== excludeId).slice(0, 4);
    if (ids.length === 0) {
      setItems([]);
      return;
    }
    fetch(`/api/products?ids=${ids.join(",")}`)
      .then((res) => res.json())
      .then(setItems)
      .catch(() => setItems([]));
  }, [excludeId]);

  if (!items || items.length === 0) return null;

  return (
    <section className="bg-white py-14">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6">
        <h2 className="text-xl font-extrabold text-slate-900">Recently viewed</h2>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
