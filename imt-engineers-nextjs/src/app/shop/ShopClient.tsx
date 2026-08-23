"use client";

import { useState } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import ProductCard from "@/components/ProductCard";
import ProductListRow from "@/components/ProductListRow";
import FilterSidebar from "@/components/shop/FilterSidebar";
import { useShopFilters } from "@/components/shop/useShopFilters";
import { SORT_OPTIONS, type SortOption } from "@/data/products";

type View = "grid" | "list";

export default function ShopClient() {
  const { filters, sort, setSort, toggle, setPrice, clearAll, results, appliedChips } =
    useShopFilters();
  const [view, setView] = useState<View>("grid");
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      {/* ---------- Category header ---------- */}
      <div className="bg-gradient-to-r from-brand-blue to-brand-blue-dark px-4 py-5 text-white lg:px-[34px] lg:pb-8 lg:pt-[30px]">
        <nav className="mb-1.5 text-[11px] text-white/70 lg:mb-2 lg:text-[12.5px]">
          <Link href="/" className="text-white/70 no-underline hover:text-white">
            Home
          </Link>
          <span className="mx-1.5 opacity-60">›</span>
          <Link href="/shop" className="text-white/70 no-underline hover:text-white">
            Shop
          </Link>
          <span className="mx-1.5 opacity-60">›</span>
          <span className="text-white">Split Air Conditioners</span>
        </nav>
        <h1 className="mb-1.5 text-[21px] font-semibold lg:text-[30px]">Split Air Conditioners</h1>
        <p className="text-[11px] text-white/80 lg:text-[13px]">
          42 units from 8 brands · inverter and non-inverter · 0.75 HP to 3.0 HP
        </p>
      </div>

      {/* ---------- Mobile toolbar ---------- */}
      <div className="flex gap-2.5 border-b border-ui-line px-4 py-3 lg:hidden">
        <button
          onClick={() => setSheetOpen(true)}
          className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-[7px] border border-ui-border text-xs font-semibold text-brand-ink"
        >
          <Icon name="tune" size={17} />
          Filters
          {appliedChips.length > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand-blue text-[9.5px] text-white">
              {appliedChips.length}
            </span>
          )}
        </button>
        <SortSelect sort={sort} setSort={setSort} className="h-10 flex-1" />
        <button
          onClick={() => setView(view === "grid" ? "list" : "grid")}
          aria-label="Toggle view"
          className="flex h-10 w-10 items-center justify-center rounded-[7px] border border-ui-border"
        >
          <Icon name={view === "grid" ? "grid_view" : "view_list"} size={18} className="text-brand-blue" />
        </button>
      </div>

      {/* ---------- Body ---------- */}
      <div className="grid items-start gap-6 px-4 py-5 lg:grid-cols-[272px_1fr] lg:px-[34px] lg:pb-[46px] lg:pt-[26px]">
        <div className="hidden lg:block">
          <FilterSidebar
            filters={filters}
            toggle={toggle}
            setPrice={setPrice}
            clearAll={clearAll}
            resultCount={results.length}
          />
        </div>

        <section>
          <div className="mb-4 hidden items-center justify-between lg:flex">
            <p className="text-[13px] text-ui-muted">
              Showing <b className="text-brand-ink">{results.length}</b> of{" "}
              <b className="text-brand-ink">42</b> products
            </p>
            <div className="flex items-center gap-2.5">
              <SortSelect sort={sort} setSort={setSort} className="h-[42px] w-[230px]" />
              <div className="flex h-[42px] overflow-hidden rounded-lg border border-ui-border">
                <button
                  onClick={() => setView("grid")}
                  aria-label="Grid view"
                  className={`flex w-[42px] items-center justify-center ${
                    view === "grid" ? "bg-brand-blue text-white" : "text-ui-faint"
                  }`}
                >
                  <Icon name="grid_view" size={19} />
                </button>
                <button
                  onClick={() => setView("list")}
                  aria-label="List view"
                  className={`flex w-[42px] items-center justify-center border-l border-ui-border ${
                    view === "list" ? "bg-brand-blue text-white" : "text-ui-faint"
                  }`}
                >
                  <Icon name="view_list" size={19} />
                </button>
              </div>
            </div>
          </div>

          {appliedChips.length > 0 && (
            <div className="mb-4 flex flex-wrap items-center gap-2 lg:mb-5">
              <span className="hidden text-[11.5px] text-ui-faint lg:inline">Applied:</span>
              {appliedChips.map((c) => (
                <button
                  key={c.label}
                  onClick={c.clear}
                  className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-[#C9DEF0] bg-[#F0F7FC] px-2.5 py-1 text-[10.5px] text-[#1C5F99] lg:text-[11.5px]"
                >
                  {c.label}
                  <Icon name="close" size={13} />
                </button>
              ))}
            </div>
          )}

          {results.length === 0 ? (
            <div className="rounded-[10px] border border-ui-line bg-ui-mist px-6 py-16 text-center">
              <Icon name="search_off" size={40} className="mx-auto text-ui-faint" />
              <p className="mt-3 text-[15px] font-semibold text-brand-ink">
                No units match those filters
              </p>
              <p className="mt-1.5 text-[12.5px] text-ui-muted">
                Try widening the price range or clearing a brand.
              </p>
              <button
                onClick={clearAll}
                className="mt-5 h-11 rounded-lg bg-brand-blue px-6 text-[13px] font-semibold text-white hover:bg-brand-red"
              >
                Clear all filters
              </button>
            </div>
          ) : view === "grid" ? (
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-[18px]">
              {results.map((p) => (
                <ProductCard key={p.id} product={p} showSpecs />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3.5">
              {results.map((p) => (
                <ProductListRow key={p.id} product={p} />
              ))}
            </div>
          )}

          {results.length > 0 && (
            <nav className="mt-8 flex items-center justify-center gap-2">
              <button className="flex h-[38px] w-[38px] items-center justify-center rounded-[7px] border border-[#E1E7ED]">
                <Icon name="chevron_left" size={18} className="text-ui-faint" />
              </button>
              {["1", "2", "3", "…", "5"].map((label, i) => (
                <button
                  key={label + i}
                  className={`flex h-[38px] w-[38px] items-center justify-center rounded-[7px] text-[13px] ${
                    i === 0
                      ? "border border-brand-blue bg-brand-blue font-semibold text-white"
                      : label === "…"
                        ? "text-ui-faint"
                        : "border border-[#E1E7ED] bg-white text-brand-ink"
                  }`}
                >
                  {label}
                </button>
              ))}
              <button className="flex h-[38px] w-[38px] items-center justify-center rounded-[7px] border border-[#E1E7ED]">
                <Icon name="chevron_right" size={18} className="text-brand-ink" />
              </button>
            </nav>
          )}
        </section>
      </div>

      {/* ---------- Mobile filter sheet ---------- */}
      {sheetOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-brand-ink/40" onClick={() => setSheetOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 top-10 overflow-y-auto rounded-t-2xl bg-white">
            <div className="sticky top-0 flex items-center justify-between border-b border-ui-line bg-white px-4 py-3.5">
              <span className="text-[15px] font-semibold text-brand-ink">Filters</span>
              <div className="flex items-center gap-4">
                <button onClick={clearAll} className="text-[11.5px] font-medium text-brand-red">
                  Clear all
                </button>
                <button onClick={() => setSheetOpen(false)} aria-label="Close">
                  <Icon name="close" size={23} className="text-brand-ink" />
                </button>
              </div>
            </div>
            <div className="[&>aside]:rounded-none [&>aside]:border-0">
              <FilterSidebar
                filters={filters}
                toggle={toggle}
                setPrice={setPrice}
                clearAll={clearAll}
                resultCount={results.length}
                onApply={() => setSheetOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SortSelect({
  sort,
  setSort,
  className = "",
}: {
  sort: SortOption;
  setSort: (s: SortOption) => void;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value as SortOption)}
        aria-label="Sort products"
        className="h-full w-full cursor-pointer appearance-none rounded-[7px] border border-ui-border bg-white pl-3 pr-8 text-xs text-brand-ink outline-none focus:border-brand-blue lg:rounded-lg lg:pl-3.5 lg:text-[12.5px]"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <Icon
        name="expand_more"
        size={18}
        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-ui-faint"
      />
    </div>
  );
}
