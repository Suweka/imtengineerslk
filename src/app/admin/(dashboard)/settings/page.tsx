"use client";

import { useEffect, useState } from "react";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { Button } from "@/components/ui/Button";
import { ProductImageFrame } from "@/components/product/ProductImageFrame";

const emptyForm = {
  phone: "",
  whatsapp: "",
  email: "",
  headOfficeAddress: "",
  engineeringDeptAddress: "",
  weekdays: "",
  saturday: "",
  sunday: "",
  facebook: "",
  instagram: "",
  freeDeliveryThreshold: 0,
};

export default function AdminSettingsPage() {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (!data) return;
        const businessHours = (data.businessHours as Record<string, string>) ?? {};
        const socialLinks = (data.socialLinks as Record<string, string>) ?? {};
        setForm({
          phone: data.phone ?? "",
          whatsapp: data.whatsapp ?? "",
          email: data.email ?? "",
          headOfficeAddress: data.headOfficeAddress ?? "",
          engineeringDeptAddress: data.engineeringDeptAddress ?? "",
          weekdays: businessHours.weekdays ?? "",
          saturday: businessHours.saturday ?? "",
          sunday: businessHours.sunday ?? "",
          facebook: socialLinks.facebook ?? "",
          instagram: socialLinks.instagram ?? "",
          freeDeliveryThreshold: Number(data.freeDeliveryThreshold) || 0,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: form.phone,
          whatsapp: form.whatsapp,
          email: form.email,
          headOfficeAddress: form.headOfficeAddress,
          engineeringDeptAddress: form.engineeringDeptAddress,
          businessHours: { weekdays: form.weekdays, saturday: form.saturday, sunday: form.sunday },
          socialLinks: { facebook: form.facebook, instagram: form.instagram },
          freeDeliveryThreshold: form.freeDeliveryThreshold,
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <AdminTopbar
        title="Settings"
        subtitle={loading ? "Loading…" : "Contact info, business hours, social links and site-wide values"}
        actions={<Button onClick={handleSave} disabled={saving}>{saved ? "Saved ✓" : saving ? "Saving…" : "Save changes"}</Button>}
      />

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
