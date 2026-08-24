"use client";

import { useEffect, useState } from "react";
import { Category } from "@/lib/types";
import { formatLKRShort } from "@/lib/format";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { Modal } from "@/components/admin/Modal";
import { Button } from "@/components/ui/Button";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Category | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(category: Category) {
    const exists = categories.some((c) => c.id === category.id);
    const res = await fetch(exists ? `/api/admin/categories/${category.id}` : "/api/admin/categories", {
      method: exists ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(category),
    });
    const saved = await res.json();

    setCategories((prev) => {
      const alreadyExists = prev.some((c) => c.id === saved.id);
      return alreadyExists ? prev.map((c) => (c.id === saved.id ? saved : c)) : [saved, ...prev];
    });
    setEditing(null);
    setCreating(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this category?")) return;
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    if (!res.ok) {
      alert("This category has products assigned to it — reassign those products before deleting.");
      return;
    }
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <>
      <AdminTopbar title="Categories" subtitle={loading ? "Loading…" : `${categories.length} categories`} actions={<Button onClick={() => setCreating(true)}>+ Add category</Button>} />

      <div className="flex-1 p-6">
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-slate-400">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Slug</th>
                <th className="px-5 py-3">Starting price</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} className="border-t border-slate-100">
                  <td className="px-5 py-3 font-medium text-slate-900">{c.name}</td>
                  <td className="px-5 py-3 text-slate-500">/shop/{c.slug}</td>
                  <td className="px-5 py-3 text-slate-600">{formatLKRShort(c.fromPrice)}</td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => setEditing(c)} className="font-semibold text-imt-blue hover:underline">Edit</button>
                      <button onClick={() => handleDelete(c.id)} className="font-semibold text-imt-red hover:underline">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {(editing || creating) && (
        <Modal title={editing ? "Edit category" : "Add category"} onClose={() => { setEditing(null); setCreating(false); }}>
          <CategoryForm category={editing ?? undefined} onSave={handleSave} onCancel={() => { setEditing(null); setCreating(false); }} />
        </Modal>
      )}
    </>
  );
}

function CategoryForm({ category, onSave, onCancel }: { category?: Category; onSave: (c: Category) => void; onCancel: () => void }) {
  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [fromPrice, setFromPrice] = useState(category?.fromPrice ?? 0);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ id: category?.id ?? "", name, slug: slug || name.toLowerCase().replace(/\s+/g, "-"), fromPrice });
      }}
      className="space-y-4"
    >
      <label className="block text-xs text-slate-600">
        Category name
        <input value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
      </label>
      <label className="block text-xs text-slate-600">
        Slug
        <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="auto-generated if left blank" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
      </label>
      <label className="block text-xs text-slate-600">
        &ldquo;From&rdquo; price shown on the homepage category card (LKR)
        <input type="number" value={fromPrice} onChange={(e) => setFromPrice(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
      </label>
      <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save category</Button>
      </div>
    </form>
  );
}
