"use client";

import { useState } from "react";
import { brands } from "@/data/brands";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/Button";

const capacities = ["0.75 HP", "1.0 HP", "1.5 HP", "2.0 HP", "2.5 HP", "3.0 HP"];
const roomSizes = ["Up to 120 sq ft", "120-180 sq ft", "180-250 sq ft", "250 sq ft and above"];
const energyRatings = ["5 star", "4 star", "3 star"];
const acTypes = ["Inverter", "Non-inverter", "Dual inverter"];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-slate-200 py-4">
      <button
        className="flex w-full items-center justify-between text-sm font-bold text-slate-900"
        onClick={() => setOpen((v) => !v)}
      >
        {title}
        <span className={`transition-transform ${open ? "rotate-180" : ""}`}>⌃</span>
      </button>
      {open && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );
}

export function FilterPanel() {
  return (
    <GlassPanel className="h-fit p-5">
      <Section title="Brand">
        {brands.map((b) => (
          <label key={b.id} className="flex items-center justify-between text-sm text-slate-700">
            <span className="flex items-center gap-2">
              <input type="checkbox" className="rounded border-slate-300 text-imt-blue" /> {b.name}
            </span>
          </label>
        ))}
      </Section>

      <Section title="AC type">
        {acTypes.map((t) => (
          <label key={t} className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" className="rounded border-slate-300 text-imt-blue" /> {t}
          </label>
        ))}
      </Section>

      <Section title="Capacity">
        <div className="grid grid-cols-2 gap-2">
          {capacities.map((c) => (
            <button key={c} className="rounded-lg border border-slate-300 px-2 py-1.5 text-xs font-medium text-slate-700 hover:border-imt-blue hover:text-imt-blue">
              {c}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Room size">
        {roomSizes.map((r) => (
          <label key={r} className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" className="rounded border-slate-300 text-imt-blue" /> {r}
          </label>
        ))}
      </Section>

      <Section title="Energy rating">
        <div className="flex gap-2">
          {energyRatings.map((e) => (
            <button key={e} className="rounded-lg border border-slate-300 px-2 py-1.5 text-xs font-medium text-slate-700 hover:border-imt-blue hover:text-imt-blue">
              {e}
            </button>
          ))}
        </div>
      </Section>

      <Button className="mt-4 w-full" size="md">
        Apply filters
      </Button>
    </GlassPanel>
  );
}
