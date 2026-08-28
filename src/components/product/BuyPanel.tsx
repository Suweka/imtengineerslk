"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Product } from "@/lib/types";
import { getBrandById } from "@/data/brands";
import { formatLKRShort } from "@/lib/format";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/Button";
import { MistPuff } from "@/components/ui/MistPuff";

export function BuyPanel({ product, siblings = [] }: { product: Product; siblings?: Product[] }) {
  const router = useRouter();
  const { data: session } = useSession();
  const brand = getBrandById(product.brandId);
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [installSelected, setInstallSelected] = useState(!product.requiresSiteSurvey);
  const [added, setAdded] = useState(false);
  const [puffKey, setPuffKey] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const [wishlistBusy, setWishlistBusy] = useState(false);

  useEffect(() => {
    if (session?.user?.role !== "customer") return;
    fetch("/api/wishlist")
      .then((res) => (res.ok ? res.json() : []))
      .then((ids: string[]) => setWishlisted(ids.includes(product.id)))
      .catch(() => {});
  }, [session, product.id]);

  async function handleToggleWishlist() {
    if (session?.user?.role !== "customer") {
      router.push("/account/login");
      return;
    }
    setWishlistBusy(true);
    try {
      if (wishlisted) {
        await fetch(`/api/wishlist?productId=${product.id}`, { method: "DELETE" });
        setWishlisted(false);
      } else {
        await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product.id }),
        });
        setWishlisted(true);
      }
    } finally {
      setWishlistBusy(false);
    }
  }

  const price = product.discountPrice ?? product.price;
  const savings = product.discountPrice ? product.price - product.discountPrice : 0;

  function handleAddToCart() {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      brand: brand?.name ?? "",
      qty,
      price,
      image: product.images[0] ?? "",
      spec: `${product.capacityHP} HP · ${product.refrigerant} · Model ${product.id.toUpperCase()}`,
      installation: { selected: installSelected, fee: product.installationFee, requiresSiteSurvey: product.requiresSiteSurvey },
    });
    setPuffKey((k) => k + 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleReserve() {
    handleAddToCart();
    router.push("/cart");
  }

  return (
    <div className="lg:sticky lg:top-24">
      <div className="mb-3 flex flex-wrap gap-2 text-xs">
        <Chip>Energy Saving</Chip>
        <Chip>{product.acType === "non-inverter" ? "Non-inverter" : "Inverter"}</Chip>
        <Chip>{product.refrigerant} Refrigerant</Chip>
        <Chip>{product.specs.noiseLevel.split("-")[0]} dB Quiet</Chip>
      </div>

      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-extrabold text-imt-blue">{formatLKRShort(price)}</span>
        {product.discountPrice && (
          <>
            <span className="text-lg text-slate-400 line-through">{formatLKRShort(product.price)}</span>
            <span className="rounded bg-orange-100 px-2 py-1 text-xs font-bold text-orange-700">
              Save {formatLKRShort(savings)}
            </span>
          </>
        )}
      </div>
      <p className="mt-1 text-xs text-slate-500">Inclusive of all taxes.</p>

      {siblings.length > 1 && (
        <div className="mt-5">
          <p className="text-sm font-semibold text-slate-900">Capacity</p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {siblings.map((s) => (
              <a
                key={s.id}
                href={`/product/${s.slug}`}
                className={`rounded-lg border px-3 py-2 text-center text-sm ${
                  s.id === product.id ? "border-imt-blue bg-imt-blue/5 font-semibold text-imt-navy" : "border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                <div>{s.capacityHP} HP</div>
                <div className="text-xs text-slate-400">{formatLKRShort(s.discountPrice ?? s.price)}</div>
              </a>
            ))}
          </div>
        </div>
      )}

      <label className="mt-5 flex items-start gap-3 rounded-lg border border-imt-blue/30 bg-imt-blue/5 p-3">
        <input
          type="checkbox"
          checked={installSelected}
          onChange={(e) => setInstallSelected(e.target.checked)}
          className="mt-0.5 rounded border-slate-300 text-imt-blue"
        />
        <span className="flex-1 text-sm">
          <span className="flex items-center justify-between font-semibold text-slate-900">
            Add professional installation
            <span className="text-imt-blue">+ {formatLKRShort(product.installationFee)}</span>
          </span>
          <span className="mt-1 block text-xs text-slate-500">
            {product.requiresSiteSurvey
              ? "Ceiling-mounted units need a site survey before installation is confirmed."
              : "Islandwide, within 3 working days. Includes bracket, up to 3m copper piping, gas charging and testing."}
          </span>
        </span>
      </label>

      <div className="mt-5 flex items-center gap-3">
        <div className="flex items-center rounded-lg border border-slate-300">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-2.5 text-slate-600">−</button>
          <span className="w-8 text-center text-sm font-semibold">{qty}</span>
          <button onClick={() => setQty((q) => q + 1)} className="px-3 py-2.5 text-slate-600">+</button>
        </div>
        <div className="relative flex-1">
          <Button className="w-full" onClick={handleAddToCart}>
            {added ? "Added ✓" : "🛒 Add to Cart"}
          </Button>
          <MistPuff triggerKey={puffKey} />
        </div>
        <button
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          onClick={handleToggleWishlist}
          disabled={wishlistBusy}
          className={`rounded-lg border p-2.5 transition-colors disabled:opacity-50 ${
            wishlisted ? "border-imt-red bg-imt-red/5 text-imt-red" : "border-slate-300 text-slate-500 hover:text-imt-red"
          }`}
        >
          {wishlisted ? "♥" : "♡"}
        </button>
      </div>

      <button
        onClick={handleReserve}
        className="mt-3 w-full rounded-lg border border-imt-blue px-4 py-2.5 text-sm font-semibold text-imt-blue hover:bg-imt-blue/5"
      >
        🏪 Reserve &amp; Pay at Store
      </button>

      <div className="mt-5 space-y-3 border-t border-slate-100 pt-4 text-sm">
        <Feature title="Free islandwide delivery" subtitle="2-4 working days, tracked" />
        <Feature title="Pay at store — cash or card" subtitle="Reserve online, settle at our showroom" />
        <Feature
          title={`${product.warrantyParts} warranty + ${product.warrantyCompressor} compressor`}
          subtitle="Registered with the brand in Sri Lanka"
        />
      </div>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full border border-slate-200 px-2.5 py-1 font-medium text-slate-600">{children}</span>;
}

function Feature({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 text-imt-blue">✓</span>
      <div>
        <p className="font-semibold text-slate-900">{title}</p>
        <p className="text-xs text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}
