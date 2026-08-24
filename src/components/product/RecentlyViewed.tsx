"use client";

import { useEffect, useState } from "react";
import { products } from "@/data/products";
import { ProductCard } from "./ProductCard";
import { getRecentlyViewed, recordViewed } from "@/lib/recently-viewed";

export function TrackViewed({ productId }: { productId: string }) {
  useEffect(() => {
    recordViewed(productId);
  }, [productId]);
  return null;
}

export function RecentlyViewed({ excludeId }: { excludeId?: string }) {
  const [ids, setIds] = useState<string[] | null>(null);

  useEffect(() => {
    setIds(getRecentlyViewed());
  }, []);

  if (!ids) return null;

  const items = ids
    .filter((id) => id !== excludeId)
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is (typeof products)[number] => Boolean(p))
    .slice(0, 4);

  if (items.length === 0) return null;

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
