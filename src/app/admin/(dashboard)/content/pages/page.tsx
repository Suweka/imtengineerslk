"use client";

import { useState } from "react";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { PreviewBanner } from "@/components/admin/PreviewBanner";
import { Button } from "@/components/ui/Button";

type PageContent = { key: string; label: string; title: string; body: string };

const initialPages: PageContent[] = [
  {
    key: "about",
    label: "About Us",
    title: "About IMT Engineers",
    body: "IMT Engineers (Pvt) Ltd has been selling, installing and servicing domestic and central air conditioners across Sri Lanka since 2006. We work directly with leading brands and install every unit with our own in-house engineering team — not subcontractors.",
  },
  {
    key: "installation",
    label: "Installation",
    title: "Fitted by our own engineers, not a subcontractor.",
    body: "Every unit we sell can be installed by an IMT-certified team, islandwide, within three working days. Annual maintenance contracts keep it running at rated efficiency.",
  },
  {
    key: "room-size-guide",
    label: "Room Size Guide",
    title: "Room Size Guide",
    body: "Choosing the right capacity keeps your unit running efficiently — undersized units run constantly and wear out faster, while oversized units cool too quickly without properly dehumidifying the room.",
  },
  {
    key: "services",
    label: "Services",
    title: "Keep your units running at their best",
    body: "From gas refills to full relocations, our engineers handle it — islandwide.",
  },
];

export default function AdminPagesContentPage() {
  const [pages, setPages] = useState(initialPages);
  const [activeKey, setActiveKey] = useState(pages[0].key);
  const [saved, setSaved] = useState(false);

  const active = pages.find((p) => p.key === activeKey)!;

  function update(field: "title" | "body", value: string) {
    setPages((prev) => prev.map((p) => (p.key === activeKey ? { ...p, [field]: value } : p)));
  }

  function handleSave() {
    // TODO (backend): PATCH /api/admin/content/[pageKey]
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <>
      <AdminTopbar title="Site Pages" subtitle="Editable text blocks for About, Installation, Room Size Guide and Services" actions={<Button onClick={handleSave}>{saved ? "Saved ✓" : "Save changes"}</Button>} />
      <PreviewBanner />

      <div className="flex flex-1 gap-6 p-6">
        <div className="w-56 shrink-0 space-y-1">
          {pages.map((p) => (
            <button
              key={p.key}
              onClick={() => setActiveKey(p.key)}
              className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium ${activeKey === p.key ? "bg-imt-blue text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="flex-1 rounded-xl border border-slate-200 bg-white p-5">
          <label className="block text-xs text-slate-600">
            Page title
            <input value={active.title} onChange={(e) => update("title", e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </label>
          <label className="mt-4 block text-xs text-slate-600">
            Body (markdown)
            <textarea value={active.body} onChange={(e) => update("body", e.target.value)} rows={12} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm" />
          </label>
        </div>
      </div>
    </>
  );
}
