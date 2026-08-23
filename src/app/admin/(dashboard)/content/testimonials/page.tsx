"use client";

import { useState } from "react";
import { testimonials as seedTestimonials } from "@/data/testimonials";
import { Testimonial } from "@/lib/types";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { PreviewBanner } from "@/components/admin/PreviewBanner";
import { Modal } from "@/components/admin/Modal";
import { Button } from "@/components/ui/Button";
import { StarRating } from "@/components/ui/StarRating";

type AdminTestimonial = Testimonial & { isPublished: boolean };

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<AdminTestimonial[]>(seedTestimonials.map((t) => ({ ...t, isPublished: true })));
  const [editing, setEditing] = useState<AdminTestimonial | null>(null);
  const [creating, setCreating] = useState(false);

  function handleSave(item: AdminTestimonial) {
    setItems((prev) => (prev.some((t) => t.id === item.id) ? prev.map((t) => (t.id === item.id ? item : t)) : [item, ...prev]));
    setEditing(null);
    setCreating(false);
  }

  function togglePublished(id: string) {
    setItems((prev) => prev.map((t) => (t.id === id ? { ...t, isPublished: !t.isPublished } : t)));
  }

  function remove(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    setItems((prev) => prev.filter((t) => t.id !== id));
  }

  function move(id: string, dir: -1 | 1) {
    setItems((prev) => {
      const idx = prev.findIndex((t) => t.id === id);
      const next = [...prev];
      const swap = idx + dir;
      if (swap < 0 || swap >= next.length) return prev;
      [next[idx], next[swap]] = [next[swap], next[idx]];
      return next;
    });
  }

  return (
    <>
      <AdminTopbar title="Testimonials" subtitle={`${items.length} testimonials`} actions={<Button onClick={() => setCreating(true)}>+ Add testimonial</Button>} />
      <PreviewBanner />

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
                <button onClick={() => togglePublished(t.id)} className="text-slate-500 hover:underline">{t.isPublished ? "Unpublish" : "Publish"}</button>
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
        onSave({ id: testimonial?.id ?? `t-${Date.now()}`, customerName, rating, quote, isPublished: testimonial?.isPublished ?? false });
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
