"use client";

import { useEffect, useState } from "react";
import { Product } from "@/lib/types";
import { getBrandById } from "@/data/brands";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { PreviewBanner } from "@/components/admin/PreviewBanner";
import { Button } from "@/components/ui/Button";

const initialHero = {
  eyebrow: "Stay Cool. Stay Comfortable.",
  title: "Premium Air Conditioners for Your Perfect Comfort",
  subtitle: "Choose from the best brands with energy-efficient cooling, professional installation and reliable after-sales service.",
  primaryCta: "Shop Now",
  secondaryCta: "View Deals",
};

const initialValueProps = [
  { title: "Cooling Performance", subtitle: "Powerful & Fast Cooling" },
  { title: "Energy Efficient", subtitle: "Save More on Bills" },
  { title: "Quiet Operation", subtitle: "Peaceful Comfort" },
  { title: "Trusted Brands", subtitle: "100% Genuine Products" },
];

export default function AdminHomeContentPage() {
  const [hero, setHero] = useState(initialHero);
  const [valueProps, setValueProps] = useState(initialValueProps);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [savingFeatured, setSavingFeatured] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .finally(() => setLoadingProducts(false));
  }, []);

  async function toggleFeatured(product: Product) {
    setSavingFeatured(product.id);
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !product.isFeatured }),
      });
      const saved = await res.json();
      setProducts((prev) => prev.map((p) => (p.id === saved.id ? saved : p)));
    } finally {
      setSavingFeatured(null);
    }
  }

  function handleSave() {
    // TODO (backend): PATCH /api/admin/content/home-hero — hero copy and
    // value props aren't stored anywhere yet; this section stays preview-only.
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <>
      <AdminTopbar title="Home Page" subtitle="Hero banner, value props and best-seller picks" actions={<Button onClick={handleSave}>{saved ? "Saved ✓" : "Save changes"}</Button>} />
      <PreviewBanner>Hero banner and value props below are held in local state only for this preview. Best-seller picks save live to the database.</PreviewBanner>

      <div className="flex-1 space-y-6 p-6">
        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="font-bold text-slate-900">Hero banner</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Eyebrow text" value={hero.eyebrow} onChange={(v) => setHero({ ...hero, eyebrow: v })} />
            <Field label="Primary button label" value={hero.primaryCta} onChange={(v) => setHero({ ...hero, primaryCta: v })} />
            <div className="sm:col-span-2">
              <Field label="Headline" value={hero.title} onChange={(v) => setHero({ ...hero, title: v })} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs text-slate-600">
                Subtitle
                <textarea value={hero.subtitle} onChange={(e) => setHero({ ...hero, subtitle: e.target.value })} rows={2} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              </label>
            </div>
            <Field label="Secondary button label" value={hero.secondaryCta} onChange={(v) => setHero({ ...hero, secondaryCta: v })} />
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="font-bold text-slate-900">Value props bar</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {valueProps.map((vp, i) => (
              <div key={i} className="rounded-lg border border-slate-100 p-3">
                <Field label={`Item ${i + 1} title`} value={vp.title} onChange={(v) => setValueProps((prev) => prev.map((p, idx) => (idx === i ? { ...p, title: v } : p)))} />
                <div className="mt-2">
                  <Field label="Subtitle" value={vp.subtitle} onChange={(v) => setValueProps((prev) => prev.map((p, idx) => (idx === i ? { ...p, subtitle: v } : p)))} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="font-bold text-slate-900">Best-seller picks</h2>
          <p className="mt-1 text-xs text-slate-500">Choose which products appear in the &ldquo;Best Selling Inverter ACs&rdquo; strip on the homepage.</p>
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {loadingProducts && <p className="text-sm text-slate-400">Loading products…</p>}
            {products.map((p) => (
              <label key={p.id} className="flex items-center gap-2 rounded-lg border border-slate-100 px-3 py-2 text-sm">
                <input
                  type="checkbox"
                  checked={p.isFeatured}
                  disabled={savingFeatured === p.id}
                  onChange={() => toggleFeatured(p)}
                  className="rounded border-slate-300 text-imt-blue"
                />
                <span>{p.name} <span className="text-xs text-slate-400">({getBrandById(p.brandId)?.name})</span></span>
              </label>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block text-xs text-slate-600">
      {label}
      <input value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
    </label>
  );
}
