"use client";

import { useState } from "react";
import { siteSettings } from "@/data/testimonials";
import { Button } from "@/components/ui/Button";
import { ProductImageFrame } from "@/components/product/ProductImageFrame";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !phone || !message) return;
    setSent(true);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-wide text-imt-red">Get in touch</p>
      <h1 className="mt-2 text-3xl font-extrabold text-slate-900">Contact Us</h1>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          <ContactRow label="Hotline / WhatsApp" value={siteSettings.phone} href={`tel:${siteSettings.phone}`} />
          <ContactRow label="Email" value={siteSettings.email} href={`mailto:${siteSettings.email}`} />
          <ContactRow label="Head Office" value={siteSettings.headOfficeAddress} />
          <ContactRow label="Engineering Department" value={siteSettings.engineeringDeptAddress} />
          <ContactRow
            label="Business hours"
            value={`${siteSettings.businessHours.weekdays} · ${siteSettings.businessHours.saturday} · ${siteSettings.businessHours.sunday}`}
          />
          <ProductImageFrame alt="Map" label="Map" className="mt-6 aspect-[16/9] w-full" />
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          {sent ? (
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-600">✓</div>
              <h3 className="mt-3 font-bold text-slate-900">Message sent</h3>
              <p className="mt-1 text-sm text-slate-500">We&apos;ll get back to you at {phone} shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <h2 className="font-bold text-slate-900">Send us a message</h2>
              <label className="block text-xs text-slate-600">
                Name
                <input value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              </label>
              <label className="block text-xs text-slate-600">
                Phone
                <input value={phone} onChange={(e) => setPhone(e.target.value)} required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              </label>
              <label className="block text-xs text-slate-600">
                Message
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows={4} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              </label>
              <Button type="submit" className="w-full">Send message</Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function ContactRow({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-bold uppercase text-slate-400">{label}</p>
      {href ? (
        <a href={href} className="text-sm font-semibold text-imt-blue hover:underline">{value}</a>
      ) : (
        <p className="text-sm font-semibold text-slate-900">{value}</p>
      )}
    </div>
  );
}
