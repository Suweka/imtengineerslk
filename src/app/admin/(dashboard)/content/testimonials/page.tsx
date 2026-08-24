"use client";

import { useEffect, useState } from "react";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { Modal } from "@/components/admin/Modal";
import { Button } from "@/components/ui/Button";
import { StarRating } from "@/components/ui/StarRating";

type AdminTestimonial = {
  id: string;
  customerName: string;
  rating: number;
  quote: string;
  isPublished: boolean;
  sortOrder: number;
};

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<AdminTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<AdminTestimonial | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetch("/api/admin/testimonials")
      .then((res) => res.json())
      .then((data) => setItems(data))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(item: AdminTestimonial) {
    const exists = items.some((t) => t.id === item.id);
    const res = await fetch(exists ? `/api/admin/testimonials/${item.id}` : "/api/admin/testimonials", {
      method: exists ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    const saved = await res.json();

    setItems((prev) => {
      const alreadyExists = prev.some((t) => t.id === saved.id);
      return alreadyExists ? prev.map((t) => (t.id === saved.id ? saved : t)) : [saved, ...prev];
    });
    setEditing(null);
    setCreating(false);
  }

  async function togglePublished(t: AdminTestimonial) {
    const res = await fetch(`/api/admin/testimonials/${t.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: !t.isPublished }),
    });
    const saved = await res.json();
    setItems((prev) => prev.map((item) => (item.id === saved.id ? saved : item)));
  }

  async function remove(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((t) => t.id !== id));
  }

  async function move(id: string, dir: -1 | 1) {
    const idx = items.findIndex((t) => t.id === id);
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= items.length) return;

    const a = items[idx];
    const b = items[swapIdx];

    const next = [...items];
    [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
    setItems(next);

    await Promise.all([
      fetch(`/api/admin/testimonials/${a.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortOrder: b.sortOrder }),
      }),
      fetch(`/api/admin/testimonials/${b.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortOrder: a.sortOrder }),
      }),
    ]);
  }

  return (
    <>
      <AdminTopbar title="Testimonials" subtitle={loading ? "Loading…" : `${items.length} testimonials`} actions={<Button onClick={() => setCreating(true)}>+ Add testimonial</Button>} />

      <div className="flex-1 space-y-3 p-6">
        {items.map((t, i) => (
          <div key={t.id} className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex flex-col gap-1 pt-1">
              <button onClick={() => move(t.id, -1)} disabled={i === 0} className="text-slate-400 hover:text-imt-blue disabled:opacity-30">▲</button>
              <button onClick={() => move(t.id, 1)} disabled={i === items.length - 1} className="text-slate-400 hover:text-imt-blue disabled:opacity-30">▼</button>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-slate-900">{t.customerName}</p>
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${t.isPublished ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                  {t.isPublished ? "Published" : "Hidden"}
                </span>
              </div>
              <StarRating rating={t.rating} />
              <p className="mt-1 text-sm text-slate-600">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-2 flex gap-3 text-xs font-semibold">
                <button onClick={() => setEditing(t)} className="text-imt-blue hover:underline">Edit</button>
                <button onClick={() => togglePublished(t)} className="text-slate-500 hover:underline">{t.isPublished ? "Unpublish" : "Publish"}</button>
                <button onClick={() => remove(t.id)} className="text-imt-red hover:underline">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(editing || creating) && (
        <Modal title={editing ? "Edit testimonial" : "Add testimonial"} onClose={() => { setEditing(null); setCreating(false); }}>
          <TestimonialForm testimonial={editing ?? undefined} onSave={handleSave} onCancel={() => { setEditing(null); setCreating(false); }} />
        </Modal>
      )}
    </>
  );
}

function TestimonialForm({ testimonial, onSave, onCancel }: { testimonial?: AdminTestimonial; onSave: (t: AdminTestimonial) => void; onCancel: () => void }) {
  const [customerName, setCustomerName] = useState(testimonial?.customerName ?? "");
  const [rating, setRating] = useState(testimonial?.rating ?? 5);
  const [quote, setQuote] = useState(testimonial?.quote ?? "");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave({
          id: testimonial?.id ?? "",
          customerName,
          rating,
          quote,
          isPublished: testimonial?.isPublished ?? false,
          sortOrder: testimonial?.sortOrder ?? 0,
        });
      }}
      className="space-y-4"
    >
      <label className="block text-xs text-slate-600">
        Customer name
        <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
      </label>
      <label className="block text-xs text-slate-600">
        Rating
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
          {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} stars</option>)}
        </select>
      </label>
      <label className="block text-xs text-slate-600">
        Quote
        <textarea value={quote} onChange={(e) => setQuote(e.target.value)} rows={3} required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
      </label>
      <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}
