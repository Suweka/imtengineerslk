"use client";

import { useState } from "react";
import { siteSettings } from "@/data/testimonials";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { PreviewBanner } from "@/components/admin/PreviewBanner";
import { Button } from "@/components/ui/Button";
import { ProductImageFrame } from "@/components/product/ProductImageFrame";

export default function AdminSettingsPage() {
  const [form, setForm] = useState({
    phone: siteSettings.phone,
    whatsapp: siteSettings.whatsapp,
    email: siteSettings.email,
    headOfficeAddress: siteSettings.headOfficeAddress,
    engineeringDeptAddress: siteSettings.engineeringDeptAddress,
    weekdays: siteSettings.businessHours.weekdays,
    saturday: siteSettings.businessHours.saturday,
    sunday: siteSettings.businessHours.sunday,
    facebook: "",
    instagram: "",
    freeDeliveryThreshold: siteSettings.freeDeliveryThreshold,
  });
  const [saved, setSaved] = useState(false);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    // TODO (backend): PATCH /api/admin/settings — singleton SiteSettings row
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <>
      <AdminTopbar title="Settings" subtitle="Contact info, business hours, social links and site-wide values" actions={<Button onClick={handleSave}>{saved ? "Saved ✓" : "Save changes"}</Button>} />
      <PreviewBanner />

      <div className="flex-1 space-y-6 p-6">
        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="font-bold text-slate-900">Contact information</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Hotline / phone" value={form.phone} onChange={(v) => set("phone", v)} />
            <Field label="WhatsApp number" value={form.whatsapp} onChange={(v) => set("whatsapp", v)} />
            <Field label="Email" value={form.email} onChange={(v) => set("email", v)} />
            <Field label="Free delivery threshold (LKR)" value={String(form.freeDeliveryThreshold)} onChange={(v) => set("freeDeliveryThreshold", Number(v) || 0)} />
            <Field label="Head office address" value={form.headOfficeAddress} onChange={(v) => set("headOfficeAddress", v)} />
            <Field label="Engineering department address" value={form.engineeringDeptAddress} onChange={(v) => set("engineeringDeptAddress", v)} />
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="font-bold text-slate-900">Business hours</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Weekdays" value={form.weekdays} onChange={(v) => set("weekdays", v)} />
            <Field label="Saturday" value={form.saturday} onChange={(v) => set("saturday", v)} />
            <Field label="Sunday" value={form.sunday} onChange={(v) => set("sunday", v)} />
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="font-bold text-slate-900">Social links</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Facebook URL" value={form.facebook} onChange={(v) => set("facebook", v)} placeholder="https://facebook.com/..." />
            <Field label="Instagram URL" value={form.instagram} onChange={(v) => set("instagram", v)} placeholder="https://instagram.com/..." />
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="font-bold text-slate-900">Logo</h2>
          <div className="mt-4 flex items-center gap-4">
            <ProductImageFrame alt="Logo" label="Logo" className="h-20 w-20" />
            <Button variant="outline" size="sm">Upload new logo</Button>
          </div>
        </section>
      </div>
    </>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="block text-xs text-slate-600">
      {label}
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
    </label>
  );
}
