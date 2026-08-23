"use client";

import Icon from "@/components/Icon";
import {
  BRAND_OPTIONS,
  CAPACITY_OPTIONS,
  ENERGY_OPTIONS,
  PRICE_BOUNDS,
  PRODUCTS,
  ROOM_SIZE_OPTIONS,
  TYPE_OPTIONS,
} from "@/data/products";
import { hpLabel } from "@/lib/format";
import type { Filters } from "./useShopFilters";

function countBy(predicate: (p: (typeof PRODUCTS)[number]) => boolean) {
  return PRODUCTS.filter(predicate).length;
}

function Checkbox({
  label,
  count,
  checked,
  onChange,
}: {
  label: string;
  count?: number;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5">
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border-[1.5px] ${
          checked ? "border-brand-blue bg-brand-blue" : "border-[#C6D0D9] bg-white"
        }`}
      >
        {checked && <Icon name="check" size={13} className="text-white" />}
      </span>
      <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
      <span className={`flex-1 text-[12.5px] ${checked ? "text-brand-ink" : "text-[#4A5A68]"}`}>
        {label}
      </span>
      {count !== undefined && <span className="text-[11px] text-[#95A2AE]">{count}</span>}
    </label>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-ui-line p-[18px]">
      <div className="mb-3.5 flex items-center justify-between">
        <div className="text-[12.5px] font-semibold text-brand-ink">{title}</div>
        <Icon name="expand_less" size={18} className="text-ui-faint" />
      </div>
      {children}
    </div>
  );
}

export default function FilterSidebar({
  filters,
  toggle,
  setPrice,
  clearAll,
  resultCount,
  onApply,
}: {
  filters: Filters;
  toggle: <K extends keyof Filters>(key: K, value: Filters[K] extends (infer U)[] ? U : never) => void;
  setPrice: (bounds: [number, number]) => void;
  clearAll: () => void;
  resultCount: number;
  onApply?: () => void;
}) {
  const [minPrice, maxPrice] = filters.price;

  return (
    <aside className="overflow-hidden rounded-[10px] border border-ui-line bg-white">
      <div className="flex items-center justify-between border-b border-ui-line px-[18px] py-[15px]">
        <div className="flex items-center gap-2 text-sm font-semibold text-brand-ink">
          <Icon name="tune" size={19} />
          Filters
        </div>
        <button onClick={clearAll} className="text-[11.5px] font-medium text-brand-red">
          Clear all
        </button>
      </div>

      {/* Price */}
      <div className="p-[18px]">
        <div className="mb-3.5 text-[12.5px] font-semibold text-brand-ink">Price range</div>
        <div className="mb-2 flex justify-between text-[11.5px] text-ui-muted">
          <span>LKR {PRICE_BOUNDS.min.toLocaleString()}</span>
          <span>LKR {PRICE_BOUNDS.max.toLocaleString()}</span>
        </div>
        <input
          type="range"
          min={PRICE_BOUNDS.min}
          max={PRICE_BOUNDS.max}
          step={1000}
          value={maxPrice}
          onChange={(e) => setPrice([minPrice, Number(e.target.value)])}
          className="mb-4 w-full accent-brand-blue"
          aria-label="Maximum price"
        />
        <div className="flex items-center gap-2.5">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setPrice([Number(e.target.value), maxPrice])}
            className="h-9 w-full rounded-md border border-ui-border px-2.5 text-[11.5px] text-brand-ink outline-none focus:border-brand-blue"
          />
          <span className="text-[#95A2AE]">–</span>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setPrice([minPrice, Number(e.target.value)])}
            className="h-9 w-full rounded-md border border-ui-border px-2.5 text-[11.5px] text-brand-ink outline-none focus:border-brand-blue"
          />
        </div>
      </div>

      <Group title="Brand">
        <div className="flex flex-col gap-[11px]">
          {BRAND_OPTIONS.map((b) => (
            <Checkbox
              key={b}
              label={b}
              count={countBy((p) => p.brand === b)}
              checked={filters.brands.includes(b)}
              onChange={() => toggle("brands", b)}
            />
          ))}
        </div>
      </Group>

      <Group title="AC type">
        <div className="flex flex-col gap-[11px]">
          {TYPE_OPTIONS.map((t) => (
            <Checkbox
              key={t}
              label={t}
              count={countBy((p) => p.type === t)}
              checked={filters.types.includes(t)}
              onChange={() => toggle("types", t)}
            />
          ))}
        </div>
      </Group>

      <Group title="Capacity">
        <div className="flex flex-wrap gap-[7px]">
          {CAPACITY_OPTIONS.map((hp) => {
            const on = filters.capacities.includes(hp);
            return (
              <button
                key={hp}
                onClick={() => toggle("capacities", hp)}
                className={`rounded-md px-[11px] py-1.5 text-[11.5px] ${
                  on
                    ? "border-[1.5px] border-brand-blue bg-[#F0F7FC] font-semibold text-[#1C5F99]"
                    : "border border-ui-border bg-white text-[#4A5A68]"
                }`}
              >
                {hpLabel(hp)}
              </button>
            );
          })}
        </div>
      </Group>

      <Group title="Room size">
        <div className="flex flex-col gap-[11px]">
          {ROOM_SIZE_OPTIONS.map((r) => (
            <Checkbox
              key={r.label}
              label={r.label}
              count={countBy((p) => p.roomMax > r.min && p.roomMin <= r.max)}
              checked={filters.roomSizes.includes(r.label)}
              onChange={() => toggle("roomSizes", r.label)}
            />
          ))}
        </div>
      </Group>

      <Group title="Energy rating">
        <div className="flex flex-wrap gap-[7px]">
          {ENERGY_OPTIONS.map((e) => {
            const on = filters.energy.includes(e);
            return (
              <button
                key={e}
                onClick={() => toggle("energy", e)}
                className={`rounded-md px-[11px] py-1.5 text-[11.5px] ${
                  on
                    ? "border-[1.5px] border-brand-blue bg-[#F0F7FC] font-semibold text-[#1C5F99]"
                    : "border border-ui-border bg-white text-[#4A5A68]"
                }`}
              >
                {e} star
              </button>
            );
          })}
        </div>
      </Group>

      <div className="border-t border-ui-line p-[18px]">
        <button
          onClick={onApply}
          className="h-11 w-full rounded-lg bg-brand-blue text-[13.5px] font-semibold text-white transition-colors hover:bg-brand-red"
        >
          Show {resultCount} {resultCount === 1 ? "result" : "results"}
        </button>
      </div>
    </aside>
  );
}
