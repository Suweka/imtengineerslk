"use client";

import { useEffect, useState } from "react";
import { Product } from "@/lib/types";
import { getBrandById } from "@/data/brands";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { PreviewBanner } from "@/components/admin/PreviewBanner";
import { Button } from "@/components/ui/Button";
import { homeHeroDefault, HomeHeroContent } from "@/lib/page-content";

export default function AdminHomeContentPage() {
  const [hero, setHero] = useState(homeHeroDefault);
  const [valueProps, setValueProps] = useState(homeHeroDefault.valueProps);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingContent, setLoadingContent] = useState(true);
  const [savingFeatured, setSavingFeatured] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .finally(() => setLoadingProducts(false));

    fetch("/api/admin/content")
      .then((res) => res.json())
      .then((rows: { pageKey: string; body: string }[]) => {
        const row = rows.find((r) => r.pageKey === "home-hero");
        if (row) {
          const parsed: HomeHeroContent = { ...homeHeroDefault, ...JSON.parse(row.body) };
          setHero(parsed);
          setValueProps(parsed.valueProps);
        }
      })
      .finally(() => setLoadingContent(false));
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

  async function handleSave() {
    setSaving(true);
    try {
      const content: HomeHeroContent = { ...hero, valueProps };
      await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageKey: "home-hero", body: JSON.stringify(content) }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <AdminTopbar title="Home Page" subtitle="Hero banner, value props and best-seller picks" actions={<Button onClick={handleSave} disabled={loadingContent || saving}>{saved ? "Saved ✓" : saving ? "Saving…" : "Save changes"}</Button>} />
      <PreviewBanner>Changes here save live and appear on the homepage immediately. Best-seller picks save live to the database.</PreviewBanner>

      <div className="flex-1 space-y-6 p-6">
        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="font-bold text-slate-900">Hero banner</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Eyebrow text" value={hero.eyebrow} onChange={(v) => setHero({ ...hero, eyebrow: v })} />
            <Field label="Primary button label" value={hero.primaryCta} onChange={(v) => setHero({ ...hero, primaryCta: v })} />
            <div className="sm:col-span-2">
              <label className="block text-xs text-slate-600">
                Headline (add a line break to split it into two styled lines)
                <textarea value={hero.title} onChange={(e) => setHero({ ...hero, title: e.target.value })} rows={2} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              </label>
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
