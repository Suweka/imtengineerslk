"use client";

import { brands } from "@/data/brands";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Checkbox } from "@/components/ui/Checkbox";
import { Icon } from "@/components/ui/Icon";
import { formatLKRShort } from "@/lib/format";

const acTypes: { value: "inverter" | "non-inverter" | "dual-inverter"; label: string }[] = [
  { value: "inverter", label: "Inverter" },
  { value: "non-inverter", label: "Non-inverter" },
  { value: "dual-inverter", label: "Dual inverter" },
];

const capacities = [1.0, 1.5, 2.0, 2.5];

export type ShopFilters = {
  priceMin: number;
  priceMax: number;
  brandIds: string[];
  acTypes: string[];
  capacities: number[];
};

export function emptyFilters(priceMin: number, priceMax: number): ShopFilters {
  return { priceMin, priceMax, brandIds: [], acTypes: [], capacities: [] };
}

export function isFiltersActive(filters: ShopFilters, bounds: { min: number; max: number }) {
  return (
    filters.priceMin > bounds.min ||
    filters.priceMax < bounds.max ||
    filters.brandIds.length > 0 ||
    filters.acTypes.length > 0 ||
    filters.capacities.length > 0
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-slate-200 py-4 first:border-t-0 first:pt-0">
      <p className="text-sm font-bold text-slate-900">{title}</p>
      <div className="mt-3 space-y-2">{children}</div>
    </div>
  );
}

function toggleValue<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export function FilterPanel({
  filters,
  onChange,
  bounds,
}: {
  filters: ShopFilters;
  onChange: (filters: ShopFilters) => void;
  bounds: { min: number; max: number };
}) {
  const active = isFiltersActive(filters, bounds);

  return (
    <GlassPanel className="h-fit p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon name="tune" size={20} className="text-imt-blue" />
          <h2 className="font-bold text-slate-900">Filters</h2>
        </div>
        {active && (
          <button
            onClick={() => onChange(emptyFilters(bounds.min, bounds.max))}
            className="text-xs font-semibold text-imt-red hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      <Section title="Price range">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>{formatLKRShort(bounds.min)}</span>
          <span>{formatLKRShort(bounds.max)}</span>
        </div>
        <div className="relative h-1.5 rounded-full bg-slate-200">
          <div
            className="absolute h-1.5 rounded-full bg-imt-blue"
            style={{
              left: `${((filters.priceMin - bounds.min) / (bounds.max - bounds.min || 1)) * 100}%`,
              right: `${100 - ((filters.priceMax - bounds.min) / (bounds.max - bounds.min || 1)) * 100}%`,
            }}
          />
          <input
            type="range"
            min={bounds.min}
            max={bounds.max}
            value={filters.priceMin}
            onChange={(e) => {
              const value = Math.min(Number(e.target.value), filters.priceMax);
              onChange({ ...filters, priceMin: value });
            }}
            className="range-thumb pointer-events-none absolute inset-0 h-1.5 w-full appearance-none bg-transparent"
          />
          <input
            type="range"
            min={bounds.min}
            max={bounds.max}
            value={filters.priceMax}
            onChange={(e) => {
              const value = Math.max(Number(e.target.value), filters.priceMin);
              onChange({ ...filters, priceMax: value });
            }}
            className="range-thumb pointer-events-none absolute inset-0 h-1.5 w-full appearance-none bg-transparent"
          />
        </div>
        <div className="mt-3 flex items-center gap-2">
          <input
            type="number"
            value={filters.priceMin}
            min={bounds.min}
            max={filters.priceMax}
            onChange={(e) => onChange({ ...filters, priceMin: Math.min(Number(e.target.value), filters.priceMax) })}
            className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm text-slate-700"
          />
          <span className="text-slate-400">–</span>
          <input
            type="number"
            value={filters.priceMax}
            min={filters.priceMin}
            max={bounds.max}
            onChange={(e) => onChange({ ...filters, priceMax: Math.max(Number(e.target.value), filters.priceMin) })}
            className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm text-slate-700"
          />
        </div>
      </Section>

      <Section title="Brand">
        {brands.map((b) => (
          <label key={b.id} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700 hover:text-imt-blue">
            <Checkbox
              checked={filters.brandIds.includes(b.id)}
              onChange={() => onChange({ ...filters, brandIds: toggleValue(filters.brandIds, b.id) })}
            />
            {b.name}
          </label>
        ))}
      </Section>

      <Section title="AC type">
        {acTypes.map((t) => (
          <label key={t.value} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700 hover:text-imt-blue">
            <Checkbox
              checked={filters.acTypes.includes(t.value)}
              onChange={() => onChange({ ...filters, acTypes: toggleValue(filters.acTypes, t.value) })}
            />
            {t.label}
          </label>
        ))}
      </Section>

      <Section title="Capacity">
        <div className="grid grid-cols-2 gap-2">
          {capacities.map((c) => {
            const selected = filters.capacities.includes(c);
            return (
              <button
                key={c}
                onClick={() => onChange({ ...filters, capacities: toggleValue(filters.capacities, c) })}
                className={`rounded-lg border px-2 py-1.5 text-xs font-medium transition-colors ${
                  selected ? "border-imt-blue bg-imt-blue/5 text-imt-blue" : "border-slate-300 text-slate-700 hover:border-imt-blue hover:text-imt-blue"
                }`}
              >
                {c} HP
              </button>
            );
          })}
        </div>
      </Section>
    </GlassPanel>
  );
}
