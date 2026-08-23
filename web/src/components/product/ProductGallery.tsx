"use client";

import { useState } from "react";
import { ProductImageFrame } from "./ProductImageFrame";

const views = ["View 1", "View 2", "Indoor", "Outdoor", "Remote"];

export function ProductGallery({ productName }: { productName: string }) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <ProductImageFrame alt={productName} label="Main product shot" className="aspect-square w-full" />
      <div className="mt-3 grid grid-cols-5 gap-2">
        {views.map((v, i) => (
          <button
            key={v}
            onClick={() => setActive(i)}
            className={`rounded-lg border p-1 ${active === i ? "border-imt-blue ring-1 ring-imt-blue" : "border-slate-200"}`}
          >
            <ProductImageFrame alt={`${productName} ${v}`} label={v} className="aspect-square w-full" />
          </button>
        ))}
      </div>
    </div>
  );
}
