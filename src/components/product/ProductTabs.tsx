"use client";

import { useState } from "react";
import { Product } from "@/lib/types";
import { StarRating } from "@/components/ui/StarRating";

const tabs = ["Description", "Specifications", "Warranty", "Reviews"] as const;

export function ProductTabs({ product }: { product: Product }) {
  const [active, setActive] = useState<(typeof tabs)[number]>("Description");

  return (
    <div className="mt-10">
      <div className="flex gap-6 border-b border-slate-200">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActive(t)}
            className={`border-b-2 pb-3 text-sm font-semibold ${
              active === t ? "border-imt-blue text-imt-blue" : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {t}
            {t === "Reviews" ? ` (${product.reviewCount})` : ""}
          </button>
        ))}
      </div>

      <div className="py-6 text-sm text-slate-700">
        {active === "Description" && <p className="max-w-3xl leading-relaxed">{product.description}</p>}

        {active === "Specifications" && (
          <div className="grid grid-cols-1 gap-x-12 gap-y-3 sm:grid-cols-2">
            <SpecRow label="Cooling capacity" value={product.specs.coolingCapacity} />
            <SpecRow label="Recommended room size" value={product.recommendedRoomSize} />
            <SpecRow label="Compressor" value={product.specs.compressor} />
            <SpecRow label="Energy rating" value={`${product.energyRating} (SLSEA)`} />
            <SpecRow label="Refrigerant" value={product.refrigerant + ", eco-friendly"} />
            <SpecRow label="Annual power consumption" value={product.specs.annualPowerConsumption} />
            <SpecRow label="Noise level (indoor)" value={product.specs.noiseLevel} />
            <SpecRow label="Indoor unit (WxHxD)" value={product.specs.indoorUnitDimensions} />
            <SpecRow label="Power supply" value={product.specs.powerSupply} />
            <SpecRow label="Warranty" value={`${product.warrantyParts} unit, ${product.warrantyCompressor} compressor`} />
          </div>
        )}

        {active === "Warranty" && (
          <div className="max-w-2xl space-y-3">
            <p>This unit is covered by a <strong>{product.warrantyParts}</strong> parts warranty and a <strong>{product.warrantyCompressor}</strong> compressor warranty when registered with the brand within 30 days of installation.</p>
            <p>Warranty covers manufacturing defects only and does not cover damage from incorrect voltage, unauthorised repairs, or lack of routine maintenance.</p>
          </div>
        )}

        {active === "Reviews" && (
          <div className="max-w-2xl space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-extrabold text-slate-900">{product.rating.toFixed(1)}</span>
              <div>
                <StarRating rating={product.rating} />
                <p className="text-xs text-slate-500">{product.reviewCount} reviews</p>
              </div>
            </div>
            <p className="text-slate-500">Customer reviews will appear here once submitted.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-slate-100 py-2">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-900">{value}</span>
    </div>
  );
}
