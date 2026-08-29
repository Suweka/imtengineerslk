"use client";

import { useMemo, useState } from "react";
import { Product } from "@/lib/types";
import { brands } from "@/data/brands";
import { FilterPanel, ShopFilters, emptyFilters } from "./FilterPanel";
import { ProductCard } from "@/components/product/ProductCard";
import { Breadcrumbs, Crumb } from "@/components/ui/Breadcrumbs";
import { RecentlyViewed } from "@/components/product/RecentlyViewed";

const brandPriority = new Map(brands.map((b, i) => [b.id, i]));
function brandRank(brandId: string) {
  return brandPriority.get(brandId) ?? brands.length;
}

export function ShopListing({ title, products, crumbs }: { title: string; products: Product[]; crumbs?: Crumb[] }) {
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState("popular");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const bounds = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 0 };
    const prices = products.map((p) => p.discountPrice ?? p.price);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [products]);

  const [filters, setFilters] = useState<ShopFilters>(() => emptyFilters(bounds.min, bounds.max));

  const filtered = products.filter((p) => {
    const price = p.discountPrice ?? p.price;
    if (price < filters.priceMin || price > filters.priceMax) return false;
    if (filters.brandIds.length > 0 && !filters.brandIds.includes(p.brandId)) return false;
    if (filters.acTypes.length > 0 && !filters.acTypes.includes(p.acType)) return false;
    if (filters.capacities.length > 0 && !filters.capacities.includes(p.capacityHP)) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "price-asc") return (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price);
    if (sort === "price-desc") return (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price);
    if (sort === "rating") return b.rating - a.rating;
    // "Popular" (default): brand priority first (Panasonic/LG, then
    // Hisense/TCL/Sharp, then Midea/Teco/Daikin), then capacity within brand.
    return brandRank(a.brandId) - brandRank(b.brandId) || a.capacityHP - b.capacityHP;
  });

  return (
    <div>
      {crumbs && <Breadcrumbs items={crumbs} className="pb-0" />}
      <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-extrabold text-slate-900">{title}</h1>
      <p className="mt-1 text-sm text-slate-500">{sorted.length} of {products.length} products</p>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
        <div className="hidden lg:block">
          <FilterPanel filters={filters} onChange={setFilters} bounds={bounds} />
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 sm:gap-4 sm:px-4">
            <button
              onClick={() => setFiltersOpen(true)}
              className="flex items-center gap-1.5 rounded border border-slate-200 px-2.5 py-1.5 text-sm font-medium text-slate-700 lg:hidden"
            >
              <FilterIcon /> Filters
            </button>
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
              <p className="col-span-full py-12 text-center text-sm text-slate-500">No products match the selected filters.</p>
            )}
          </div>
        </div>
      </div>
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close filters"
            onClick={() => setFiltersOpen(false)}
            className="absolute inset-0 bg-slate-900/50"
          />
          <div className="absolute inset-y-0 left-0 flex w-[85%] max-w-sm flex-col overflow-y-auto bg-white p-4 shadow-xl">
            <button
              onClick={() => setFiltersOpen(false)}
              aria-label="Close"
              className="mb-2 self-end text-slate-400 hover:text-slate-700"
            >
              ✕
            </button>
            <FilterPanel filters={filters} onChange={setFilters} bounds={bounds} />
          </div>
        </div>
      )}

      <RecentlyViewed />
    </div>
  );
}

function FilterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" />
    </svg>
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
