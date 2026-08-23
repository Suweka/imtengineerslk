"use client";

import { useState } from "react";
import { products as seedProducts } from "@/data/products";
import { getBrandById } from "@/data/brands";
import { categories } from "@/data/categories";
import { Product } from "@/lib/types";
import { formatLKRShort } from "@/lib/format";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { PreviewBanner } from "@/components/admin/PreviewBanner";
import { Modal } from "@/components/admin/Modal";
import { ProductForm } from "@/components/admin/ProductForm";
import { Button } from "@/components/ui/Button";
import { ProductImageFrame } from "@/components/product/ProductImageFrame";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(seedProducts);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  function handleSave(product: Product) {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      return exists ? prev.map((p) => (p.id === product.id ? product : p)) : [product, ...prev];
    });
    setEditing(null);
    setCreating(false);
  }

  function handleDelete(id: string) {
    if (!confirm("Remove this product from the catalog?")) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <>
      <AdminTopbar
        title="Products"
        subtitle={`${products.length} products in catalog`}
        actions={<Button onClick={() => setCreating(true)}>+ Add product</Button>}
      />
      <PreviewBanner />

      <div className="flex-1 p-6">
        <div className="mb-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full max-w-sm rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-slate-400">
              <tr>
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Price</th>
                <th className="px-5 py-3">Stock</th>
                <th className="px-5 py-3">Flags</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const brand = getBrandById(p.brandId);
                const category = categories.find((c) => c.id === p.categoryId);
                return (
                  <tr key={p.id} className="border-t border-slate-100">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <ProductImageFrame src={p.images[0]} alt={p.name} className="h-12 w-12 shrink-0" />
                        <div>
                          <p className="font-medium text-slate-900">{p.name}</p>
                          <p className="text-xs text-slate-400">{brand?.name} · {p.capacityHP} HP</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{category?.name}</td>
                    <td className="px-5 py-3 text-slate-600">{formatLKRShort(p.discountPrice ?? p.price)}</td>
                    <td className="px-5 py-3">
                      <span className={p.stock === 0 ? "font-semibold text-red-600" : "text-slate-600"}>{p.stock}</span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1">
                        {p.isBestSeller && <Flag tone="emerald">Best seller</Flag>}
                        {p.isFeatured && <Flag tone="blue">Featured</Flag>}
                        {p.discountPrice && <Flag tone="red">Discount</Flag>}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-3 text-sm">
                        <button onClick={() => setEditing(p)} className="font-semibold text-imt-blue hover:underline">Edit</button>
                        <button onClick={() => handleDelete(p.id)} className="font-semibold text-imt-red hover:underline">Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-slate-400">No products match your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {(editing || creating) && (
        <Modal title={editing ? "Edit product" : "Add product"} onClose={() => { setEditing(null); setCreating(false); }} wide>
          <ProductForm product={editing ?? undefined} onSave={handleSave} onCancel={() => { setEditing(null); setCreating(false); }} />
        </Modal>
      )}
    </>
  );
}

function Flag({ tone, children }: { tone: "emerald" | "blue" | "red"; children: React.ReactNode }) {
  const cls = { emerald: "bg-emerald-50 text-emerald-700", blue: "bg-blue-50 text-blue-700", red: "bg-red-50 text-red-700" }[tone];
  return <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${cls}`}>{children}</span>;
}
