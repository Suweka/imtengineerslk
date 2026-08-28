"use client";

import { useState } from "react";
import { Product } from "@/lib/types";
import { brands } from "@/data/brands";
import { categories } from "@/data/categories";
import { Button } from "@/components/ui/Button";
import { AdminImageUploader } from "./AdminImageUploader";

const blank: Omit<Product, "id" | "images" | "rating" | "reviewCount" | "specs"> = {
  slug: "",
  name: "",
  brandId: brands[0].id,
  categoryId: categories[0].id,
  capacityBTU: 12000,
  capacityHP: 1.5,
  energyRating: "5 star",
  acType: "inverter",
  refrigerant: "R32",
  price: 0,
  warrantyParts: "2 years",
  warrantyCompressor: "10 years",
  recommendedRoomSize: "",
  stock: 0,
  isFeatured: false,
  isBestSeller: false,
  installationFee: 12500,
  requiresSiteSurvey: false,
  description: "",
};

export function ProductForm({
  product,
  onSave,
  onCancel,
}: {
  product?: Product;
  onSave: (product: Product) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(
    product ?? { ...blank, id: `prod-${Date.now()}`, images: [], rating: 0, reviewCount: 0, specs: { coolingCapacity: "", compressor: "", noiseLevel: "", powerSupply: "", annualPowerConsumption: "", indoorUnitDimensions: "" } }
  );

  function set<K extends keyof Product>(key: K, value: Product[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // images are owned by the image upload endpoint (which processes
        // background removal and syncs Product.images itself) — never send
        // this form's stale copy back, or it will clobber real uploads.
        const { images: _images, ...rest } = form;
        onSave(rest as Product);
      }}
      className="space-y-5"
    >
      <div>
        <p className="mb-2 text-sm font-semibold text-slate-900">Product photos</p>
        <AdminImageUploader productId={product?.id} initial={form.images} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField label="Product name" value={form.name} onChange={(v) => set("name", v)} required />
        <TextField label="Slug" value={form.slug} onChange={(v) => set("slug", v)} required />

        <SelectField label="Brand" value={form.brandId} onChange={(v) => set("brandId", v)} options={brands.map((b) => ({ value: b.id, label: b.name }))} />
        <SelectField label="Category" value={form.categoryId} onChange={(v) => set("categoryId", v)} options={categories.map((c) => ({ value: c.id, label: c.name }))} />

        <NumberField label="Capacity (HP)" value={form.capacityHP} onChange={(v) => set("capacityHP", v)} step={0.5} />
        <NumberField label="Capacity (BTU/hr)" value={form.capacityBTU} onChange={(v) => set("capacityBTU", v)} />

        <SelectField
          label="AC type"
          value={form.acType}
          onChange={(v) => set("acType", v as Product["acType"])}
          options={[
            { value: "inverter", label: "Inverter" },
            { value: "non-inverter", label: "Non-inverter" },
            { value: "dual-inverter", label: "Dual inverter" },
          ]}
        />
        <SelectField
          label="Energy rating"
          value={form.energyRating}
          onChange={(v) => set("energyRating", v)}
          options={["5 star", "4 star", "3 star"].map((v) => ({ value: v, label: v }))}
        />

        <TextField label="Refrigerant" value={form.refrigerant} onChange={(v) => set("refrigerant", v)} />
        <TextField label="Recommended room size" value={form.recommendedRoomSize} onChange={(v) => set("recommendedRoomSize", v)} placeholder="e.g. 150-180 sq ft" />

        <NumberField label="Price (LKR)" value={form.price} onChange={(v) => set("price", v)} />
        <NumberField label="Discount price (LKR)" value={form.discountPrice ?? 0} onChange={(v) => set("discountPrice", v || undefined)} />

        <TextField label="Warranty (parts)" value={form.warrantyParts} onChange={(v) => set("warrantyParts", v)} />
        <TextField label="Warranty (compressor)" value={form.warrantyCompressor} onChange={(v) => set("warrantyCompressor", v)} />

        <NumberField label="Stock" value={form.stock} onChange={(v) => set("stock", v)} />
        <NumberField label="Installation fee (LKR)" value={form.installationFee} onChange={(v) => set("installationFee", v)} />
      </div>

      <label className="block text-xs text-slate-600">
        Description
        <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
      </label>

      <div className="flex flex-wrap gap-5">
        <Checkbox label="Featured on homepage" checked={form.isFeatured} onChange={(v) => set("isFeatured", v)} />
        <Checkbox label="Best seller badge" checked={form.isBestSeller} onChange={(v) => set("isBestSeller", v)} />
        <Checkbox label="Requires site survey (ceiling units)" checked={form.requiresSiteSurvey} onChange={(v) => set("requiresSiteSurvey", v)} />
      </div>

      <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save product</Button>
      </div>
    </form>
  );
}

function TextField({ label, value, onChange, required, placeholder }: { label: string; value: string; onChange: (v: string) => void; required?: boolean; placeholder?: string }) {
  return (
    <label className="block text-xs text-slate-600">
      {label}
      <input value={value} onChange={(e) => onChange(e.target.value)} required={required} placeholder={placeholder} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
    </label>
  );
}

function NumberField({ label, value, onChange, step = 1 }: { label: string; value: number; onChange: (v: number) => void; step?: number }) {
  return (
    <label className="block text-xs text-slate-600">
      {label}
      <input type="number" step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
    </label>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <label className="block text-xs text-slate-600">
      {label}
      <select value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 text-sm text-slate-700">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="rounded border-slate-300 text-imt-blue" />
      {label}
    </label>
  );
}
