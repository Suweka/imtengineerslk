"use client";

import { useState } from "react";
import { ServiceType } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { GlassPanel } from "@/components/ui/GlassPanel";

export function ServiceRequestForm({ service }: { service: ServiceType }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !phone || !address) return;

    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/service-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: service.name,
          customerName: name,
          phone,
          address,
          preferredDate: preferredDate || null,
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again or call us directly.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <GlassPanel className="p-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-600">✓</div>
        <h3 className="mt-3 font-bold text-slate-900">Request received</h3>
        <p className="mt-1 text-sm text-slate-500">
          Our team will call you at {phone} within 2 hours to confirm your {service.name.toLowerCase()} appointment.
        </p>
      </GlassPanel>
    );
  }

  return (
    <GlassPanel className="p-6">
      <h3 className="font-bold text-slate-900">Request {service.name}</h3>
      <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
        <Field label="Full name" value={name} onChange={setName} />
        <Field label="Mobile number" value={phone} onChange={setPhone} />
        <Field label="Address" value={address} onChange={setAddress} />
        <label className="block text-xs text-slate-600">
          Preferred date
          <input type="date" value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        </label>
        {error && <p className="text-xs text-red-600">{error}</p>}
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Submitting…" : "Request Service"}
        </Button>
      </form>
    </GlassPanel>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block text-xs text-slate-600">
      {label}
      <input value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" required />
    </label>
  );
}
