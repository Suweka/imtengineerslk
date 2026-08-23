"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { formatLKRShort } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { ProductImageFrame } from "@/components/product/ProductImageFrame";
import { siteSettings } from "@/data/testimonials";

export default function CartPage() {
  const { items, removeItem, updateQty, toggleInstallation, subtotal, installationTotal, total, isReady } = useCart();
  const router = useRouter();
  const deliveryFree = subtotal >= siteSettings.freeDeliveryThreshold;

  if (isReady && items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <h1 className="text-2xl font-extrabold text-slate-900">Your cart is empty</h1>
        <p className="mt-2 text-sm text-slate-500">Browse our range of inverter air conditioners to get started.</p>
        <Link href="/shop" className="mt-6 inline-flex rounded-lg bg-imt-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-imt-navy">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-extrabold text-slate-900">
        Shopping Cart <span className="ml-2 text-base font-normal text-slate-400">{items.length} items</span>
      </h1>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.productId} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex gap-4">
                <ProductImageFrame src={item.image} alt={item.name} className="h-24 w-24 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold uppercase text-imt-blue">{item.brand}</span>
                      <h3 className="font-semibold text-slate-900">{item.name}</h3>
                      <p className="text-xs text-slate-500">{item.spec}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-900">{formatLKRShort(item.price * item.qty)}</div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center rounded-lg border border-slate-300">
                      <button onClick={() => updateQty(item.productId, item.qty - 1)} className="px-2.5 py-1 text-slate-600">−</button>
                      <span className="w-8 text-center text-sm">{item.qty}</span>
                      <button onClick={() => updateQty(item.productId, item.qty + 1)} className="px-2.5 py-1 text-slate-600">+</button>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <button className="text-slate-500 hover:text-imt-blue">♡ Save for later</button>
                      <button onClick={() => removeItem(item.productId)} className="text-imt-red hover:underline">🗑 Remove</button>
                    </div>
                  </div>
                </div>
              </div>

              <label className="mt-3 flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-xs">
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={item.installation.selected}
                    onChange={(e) => toggleInstallation(item.productId, e.target.checked)}
                    className="rounded border-slate-300 text-imt-blue"
                  />
                  Professional installation
                  {item.installation.requiresSiteSurvey && !item.installation.selected && (
                    <span className="text-slate-400"> — ceiling units need a site survey</span>
                  )}
                </span>
                <span className={item.installation.selected ? "font-semibold text-imt-blue" : "font-semibold text-orange-600"}>
                  {item.installation.selected ? formatLKRShort(item.installation.fee) : `Add — ${formatLKRShort(item.installation.fee)}`}
                </span>
              </label>
            </div>
          ))}

          <div className="flex flex-col gap-3 sm:flex-row">
            <input placeholder="Promo code" className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm" />
            <Button variant="outline">Apply</Button>
          </div>

          <Link href="/shop" className="inline-flex items-center gap-1 text-sm font-semibold text-imt-blue hover:underline">
            ← Continue shopping
          </Link>
        </div>

        <div className="space-y-4">
          <GlassPanel className="p-5">
            <h2 className="font-bold text-slate-900">Order Summary</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <Row label={`Subtotal (${items.length} items)`} value={formatLKRShort(subtotal)} />
              <Row label="Installation" value={formatLKRShort(installationTotal)} />
              <Row label="Delivery (islandwide)" value={deliveryFree ? "Free" : formatLKRShort(1500)} valueClass={deliveryFree ? "text-emerald-600" : ""} />
            </dl>
            <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
              <span className="font-bold text-slate-900">Total</span>
              <span className="text-xl font-extrabold text-imt-blue">
                {formatLKRShort(total + (deliveryFree ? 0 : 1500))}
              </span>
            </div>
            <Button className="mt-4 w-full" size="lg" onClick={() => router.push("/checkout")}>
              Proceed to Checkout →
            </Button>
            <p className="mt-3 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
              💳 Pay at our showroom — <strong>cash or card</strong>. No online payment needed; we hold your order for 5 days.
            </p>
          </GlassPanel>

          <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-600">
            <p>🛡 2 year warranty on all products</p>
            <p>👷 Installation by IMT-certified technicians</p>
            <p>🔄 7 day return policy, unopened units</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, valueClass = "" }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-500">{label}</span>
      <span className={`font-medium text-slate-900 ${valueClass}`}>{value}</span>
    </div>
  );
}
