"use client";

import { useState } from "react";
import { brands as seedBrands } from "@/data/brands";
import { products } from "@/data/products";
import { Brand } from "@/lib/types";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { PreviewBanner } from "@/components/admin/PreviewBanner";
import { Modal } from "@/components/admin/Modal";
import { Button } from "@/components/ui/Button";
import { ProductImageFrame } from "@/components/product/ProductImageFrame";

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>(seedBrands);
  const [editing, setEditing] = useState<Brand | null>(null);
  const [creating, setCreating] = useState(false);

  function handleSave(brand: Brand) {
    setBrands((prev) => (prev.some((b) => b.id === brand.id) ? prev.map((b) => (b.id === brand.id ? brand : b)) : [brand, ...prev]));
    setEditing(null);
    setCreating(false);
  }

  function handleDelete(id: string) {
    const inUse = products.some((p) => p.brandId === id);
    if (inUse) {
      alert("This brand has products assigned to it — reassign those products before deleting.");
      return;
    }
    if (!confirm("Delete this brand?")) return;
    setBrands((prev) => prev.filter((b) => b.id !== id));
  }

  return (
    <>
      <AdminTopbar title="Brands" subtitle={`${brands.length} brands`} actions={<Button onClick={() => setCreating(true)}>+ Add brand</Button>} />
      <PreviewBanner>The brand list is a draft — confirm the final lineup with the client before launch.</PreviewBanner>

      <div className="flex-1 p-6">
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-slate-400">
              <tr>
                <th className="px-5 py-3">Logo</th>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Products</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {brands.map((b) => (
                <tr key={b.id} className="border-t border-slate-100">
                  <td className="px-5 py-3"><ProductImageFrame alt={b.name} label={b.name} className="h-10 w-16" /></td>
                  <td className="px-5 py-3 font-medium text-slate-900">{b.name}</td>
                  <td className="px-5 py-3 text-slate-600">{products.filter((p) => p.brandId === b.id).length}</td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => setEditing(b)} className="font-semibold text-imt-blue hover:underline">Edit</button>
                      <button onClick={() => handleDelete(b.id)} className="font-semibold text-imt-red hover:underline">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {(editing || creating) && (
        <Modal title={editing ? "Edit brand" : "Add brand"} onClose={() => { setEditing(null); setCreating(false); }}>
          <BrandForm brand={editing ?? undefined} onSave={handleSave} onCancel={() => { setEditing(null); setCreating(false); }} />
        </Modal>
      )}
    </>
  );
}

function BrandForm({ brand, onSave, onCancel }: { brand?: Brand; onSave: (b: Brand) => void; onCancel: () => void }) {
  const [name, setName] = useState(brand?.name ?? "");
  const [slug, setSlug] = useState(brand?.slug ?? "");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ id: brand?.id ?? `brand-${Date.now()}`, name, slug: slug || name.toLowerCase().replace(/\s+/g, "-") });
      }}
      className="space-y-4"
    >
      <label className="block text-xs text-slate-600">
        Brand name
        <input value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
      </label>
      <label className="block text-xs text-slate-600">
        Slug
        <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="auto-generated if left blank" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
      </label>
      <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save brand</Button>
      </div>
    </form>
  );
}
