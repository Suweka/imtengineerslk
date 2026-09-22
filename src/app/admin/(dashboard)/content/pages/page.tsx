"use client";

import { useEffect, useState } from "react";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { PreviewBanner } from "@/components/admin/PreviewBanner";
import { Button } from "@/components/ui/Button";
import { pageContentDefaults } from "@/lib/page-content-defaults";

type PageContent = { key: string; label: string; title: string; body: string };

const pageLabels: Record<string, string> = {
  about: "About Us",
  installation: "Installation",
  "room-size-guide": "Room Size Guide",
  services: "Services",
};

const initialPages: PageContent[] = Object.entries(pageContentDefaults).map(([key, v]) => ({
  key,
  label: pageLabels[key] ?? key,
  title: v.title,
  body: v.body,
}));

export default function AdminPagesContentPage() {
  const [pages, setPages] = useState(initialPages);
  const [activeKey, setActiveKey] = useState(pages[0].key);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/content")
      .then((res) => res.json())
      .then((rows: { pageKey: string; title: string | null; body: string }[]) => {
        setPages((prev) =>
          prev.map((p) => {
            const row = rows.find((r) => r.pageKey === p.key);
            return row ? { ...p, title: row.title ?? p.title, body: row.body } : p;
          })
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const active = pages.find((p) => p.key === activeKey)!;

  function update(field: "title" | "body", value: string) {
    setPages((prev) => prev.map((p) => (p.key === activeKey ? { ...p, [field]: value } : p)));
  }

  async function handleSave() {
    setSaving(true);
    try {
      await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageKey: active.key, title: active.title, body: active.body }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <AdminTopbar title="Site Pages" subtitle="Editable text blocks for About, Installation, Room Size Guide and Services" actions={<Button onClick={handleSave} disabled={loading || saving}>{saved ? "Saved ✓" : saving ? "Saving…" : "Save changes"}</Button>} />
      <PreviewBanner>Changes here save live and appear on the public site immediately.</PreviewBanner>

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
