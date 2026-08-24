"use client";

import { useEffect, useState } from "react";
import { Brand } from "@/lib/types";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { Modal } from "@/components/admin/Modal";
import { Button } from "@/components/ui/Button";
import { ProductImageFrame } from "@/components/product/ProductImageFrame";

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Brand | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetch("/api/admin/brands")
      .then((res) => res.json())
      .then((data) => setBrands(data))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(brand: Brand) {
    const exists = brands.some((b) => b.id === brand.id);
    const res = await fetch(exists ? `/api/admin/brands/${brand.id}` : "/api/admin/brands", {
      method: exists ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(brand),
    });
    const saved = await res.json();

    setBrands((prev) => {
      const alreadyExists = prev.some((b) => b.id === saved.id);
      return alreadyExists ? prev.map((b) => (b.id === saved.id ? saved : b)) : [saved, ...prev];
    });
    setEditing(null);
    setCreating(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this brand?")) return;
    const res = await fetch(`/api/admin/brands/${id}`, { method: "DELETE" });
    if (!res.ok) {
      alert("This brand has products assigned to it — reassign those products before deleting.");
      return;
    }
    setBrands((prev) => prev.filter((b) => b.id !== id));
  }

  return (
    <>
      <AdminTopbar title="Brands" subtitle={loading ? "Loading…" : `${brands.length} brands`} actions={<Button onClick={() => setCreating(true)}>+ Add brand</Button>} />

      <div className="flex-1 p-6">
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-slate-400">
              <tr>
                <th className="px-5 py-3">Logo</th>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {brands.map((b) => (
                <tr key={b.id} className="border-t border-slate-100">
                  <td className="px-5 py-3"><ProductImageFrame alt={b.name} label={b.name} className="h-10 w-16" /></td>
                  <td className="px-5 py-3 font-medium text-slate-900">{b.name}</td>
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
        onSave({ id: brand?.id ?? "", name, slug: slug || name.toLowerCase().replace(/\s+/g, "-") });
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
