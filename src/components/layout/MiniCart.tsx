"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatLKRShort } from "@/lib/format";

export function MiniCart() {
  const { items, itemCount, total } = useCart();

  if (itemCount === 0) return null;

  const shown = items.slice(0, 4);
  const extra = items.length - shown.length;

  return (
    <div className="invisible absolute right-0 top-full z-50 w-80 -translate-y-1 rounded-lg border border-slate-100 bg-white p-3 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
      <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
        {shown.map((item) => (
          <Link
            key={item.productId}
            href={`/product/${item.slug}`}
            className="flex items-center gap-3 rounded-md p-1 hover:bg-slate-50"
          >
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md border border-slate-200 bg-slate-50">
              {item.image && <Image src={item.image} alt={item.name} fill className="object-contain p-1" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-800">{item.name}</p>
              <p className="text-xs text-slate-500">
                Qty {item.qty} · {formatLKRShort(item.price)}
              </p>
            </div>
          </Link>
        ))}
        {extra > 0 && <p className="px-1 text-xs text-slate-400">+{extra} more item{extra > 1 ? "s" : ""}</p>}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="text-sm font-semibold text-slate-700">Total</span>
        <span className="text-base font-bold text-imt-blue">{formatLKRShort(total)}</span>
      </div>

      <Link
        href="/cart"
        className="mt-3 block w-full rounded-lg bg-imt-blue py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-imt-navy"
      >
        View Cart
      </Link>
    </div>
  );
}
