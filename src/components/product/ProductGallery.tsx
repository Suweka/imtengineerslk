"use client";

import { useState } from "react";
import { ProductImageFrame } from "./ProductImageFrame";

export function ProductGallery({ productName, images = [] }: { productName: string; images?: string[] }) {
  const [active, setActive] = useState(0);
  const hasImages = images.length > 0;

  return (
    <div>
      <ProductImageFrame
        src={hasImages ? images[active] : undefined}
        alt={productName}
        label="Main product shot"
        className="aspect-square w-full"
      />
      {hasImages && (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => setActive(i)}
              className={`rounded-lg border p-1 ${active === i ? "border-imt-blue ring-1 ring-imt-blue" : "border-slate-200"}`}
            >
              <ProductImageFrame src={src} alt={`${productName} view ${i + 1}`} className="aspect-square w-full" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
