"use client";

import { useState } from "react";
import { Product } from "@/lib/types";
import { FilterPanel } from "./FilterPanel";
import { ProductCard } from "@/components/product/ProductCard";

export function ShopListing({ title, products }: { title: string; products: Product[] }) {
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState("popular");

  const sorted = [...products].sort((a, b) => {
    if (sort === "price-asc") return (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price);
    if (sort === "price-desc") return (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price);
    if (sort === "rating") return b.rating - a.rating;
    return (b.soldThisYear ?? 0) - (a.soldThisYear ?? 0);
  });

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-extrabold text-slate-900">{title}</h1>
      <p className="mt-1 text-sm text-slate-500">{products.length} products</p>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
        <FilterPanel />

        <div>
          <div className="mb-4 flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white px-4 py-2.5">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded border border-slate-200 px-2 py-1.5 text-sm text-slate-700"
            >
              <option value="popular">Sort: Popular</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Rating</option>
            </select>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setLayout("grid")}
                className={`rounded p-1.5 ${layout === "grid" ? "bg-imt-blue text-white" : "text-slate-500"}`}
                aria-label="Grid view"
              >
                <GridIcon />
              </button>
              <button
                onClick={() => setLayout("list")}
                className={`rounded p-1.5 ${layout === "list" ? "bg-imt-blue text-white" : "text-slate-500"}`}
                aria-label="List view"
              >
                <ListIcon />
              </button>
            </div>
          </div>

          <div className={layout === "grid" ? "grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3" : "flex flex-col gap-4"}>
            {sorted.map((p) => (
              <ProductCard key={p.id} product={p} layout={layout} />
            ))}
            {sorted.length === 0 && (
              <p className="col-span-full py-12 text-center text-sm text-slate-500">No products match this category yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function GridIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
    </svg>
  );
}
function ListIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
  );
}
