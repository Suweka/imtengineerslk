"use client";

import Link from "next/link";
import { Product } from "@/lib/types";
import { getBrandById } from "@/data/brands";
import { ProductImageFrame } from "./ProductImageFrame";
import { Badge } from "@/components/ui/Badge";
import { StarRating } from "@/components/ui/StarRating";
import { formatLKRShort } from "@/lib/format";
import { useCart } from "@/lib/cart-context";

export function ProductCard({ product, layout = "grid" }: { product: Product; layout?: "grid" | "list" }) {
  const brand = getBrandById(product.brandId);
  const { addItem } = useCart();
  const price = product.discountPrice ?? product.price;
  const discountPct = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : null;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      brand: brand?.name ?? "",
      qty: 1,
      price,
      image: product.images[0] ?? "",
      spec: `${product.capacityHP} HP · ${product.refrigerant}`,
      installation: {
        selected: !product.requiresSiteSurvey,
        fee: product.installationFee,
        requiresSiteSurvey: product.requiresSiteSurvey,
      },
    });
  }

  return (
    <Link
      href={`/product/${product.slug}`}
      className={`group flex ${layout === "list" ? "flex-row gap-4" : "flex-col"} rounded-xl bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
    >
      <div className={`relative ${layout === "list" ? "w-40 shrink-0" : "w-full"}`}>
        <ProductImageFrame src={product.images[0]} alt={product.name} className="aspect-square w-full" />
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {product.isBestSeller && <Badge tone="bestseller">Best Seller</Badge>}
          {discountPct && <Badge tone="discount">{discountPct}% Off</Badge>}
          {product.isNew && <Badge tone="new">New</Badge>}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 pt-3">
        <span className="text-xs font-bold uppercase tracking-wide text-imt-blue">{brand?.name}</span>
        <h3 className="font-semibold text-slate-900">{product.name}</h3>
        <StarRating rating={product.rating} reviewCount={product.reviewCount} />

        <div className="mt-1 grid grid-cols-4 gap-x-2 text-xs text-slate-500">
          <div>
            <div className="uppercase">Capacity</div>
            <div className="font-medium text-slate-800">{product.capacityHP} HP</div>
          </div>
          <div>
            <div className="uppercase">Type</div>
            <div className="font-medium text-slate-800 capitalize">{product.acType}</div>
          </div>
          <div>
            <div className="uppercase">Room size</div>
            <div className="font-medium text-slate-800">{product.recommendedRoomSize}</div>
          </div>
          <div>
            <div className="uppercase">Energy</div>
            <div className="font-medium text-slate-800 capitalize">{product.energyRating}</div>
          </div>
        </div>

        <div className="mt-2 flex items-end justify-between gap-2">
          <div>
            <div className="text-lg font-bold text-imt-blue">{formatLKRShort(price)}</div>
            {product.discountPrice && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-400 line-through">{formatLKRShort(product.price)}</span>
                <span className="text-xs font-semibold text-emerald-600">
                  Save {formatLKRShort(product.price - product.discountPrice)}
                </span>
              </div>
            )}
            {product.installationFee > 0 && (
              <div className="text-xs text-slate-500">+ install from {formatLKRShort(product.installationFee)}</div>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-1.5 rounded-lg bg-imt-blue px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-imt-navy"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
}
