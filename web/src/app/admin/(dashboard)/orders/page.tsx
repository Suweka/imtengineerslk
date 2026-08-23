"use client";

import { useState } from "react";
import { adminOrders as seedOrders, AdminOrder } from "@/data/admin-seed";
import { formatLKRShort } from "@/lib/format";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { PreviewBanner } from "@/components/admin/PreviewBanner";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Modal } from "@/components/admin/Modal";
import { Button } from "@/components/ui/Button";

const statusOptions: AdminOrder["status"][] = ["new", "contacted", "confirmed", "delivered_installed", "cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>(seedOrders);
  const [selected, setSelected] = useState<AdminOrder | null>(null);
  const [filter, setFilter] = useState<"all" | AdminOrder["status"]>("all");
  const [retrying, setRetrying] = useState<string | null>(null);

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  function updateStatus(id: string, status: AdminOrder["status"]) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    setSelected((prev) => (prev && prev.id === id ? { ...prev, status } : prev));
  }

  function retryWhatsapp(id: string) {
    setRetrying(id);
    // TODO (backend): POST /api/admin/orders/[id]/retry-whatsapp
    setTimeout(() => {
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, whatsappStatus: "sent" } : o)));
      setSelected((prev) => (prev && prev.id === id ? { ...prev, whatsappStatus: "sent" } : prev));
      setRetrying(null);
    }, 1200);
  }

  return (
    <>
      <AdminTopbar title="Orders" subtitle={`${orders.length} orders`} />
      <PreviewBanner>Order status changes and WhatsApp retries update local state only in this preview.</PreviewBanner>

      <div className="flex-1 p-6">
        <div className="mb-4 flex flex-wrap gap-2">
          {(["all", ...statusOptions] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${filter === s ? "bg-imt-blue text-white" : "bg-white text-slate-600 border border-slate-200"}`}
            >
              {s === "all" ? "All" : s.replace("_", " ")}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-slate-400">
              <tr>
                <th className="px-5 py-3">Order</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Fulfillment</th>
                <th className="px-5 py-3">Total</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">WhatsApp</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="border-t border-slate-100">
                  <td className="px-5 py-3 font-medium text-slate-900">{o.orderNumber}</td>
                  <td className="px-5 py-3 text-slate-600">{o.customerName}<div className="text-xs text-slate-400">{o.phone}</div></td>
                  <td className="px-5 py-3 text-slate-600 capitalize">{o.fulfillment.replace("-", " ")}</td>
                  <td className="px-5 py-3 text-slate-600">{formatLKRShort(o.total)}</td>
                  <td className="px-5 py-3"><StatusBadge status={o.status} /></td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={o.whatsappStatus} />
                      {o.whatsappStatus === "failed" && (
                        <button
                          onClick={() => retryWhatsapp(o.id)}
                          disabled={retrying === o.id}
                          className="text-xs font-semibold text-imt-blue hover:underline disabled:opacity-50"
                        >
                          {retrying === o.id ? "Retrying…" : "Retry"}
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => setSelected(o)} className="font-semibold text-imt-blue hover:underline">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <Modal title={selected.orderNumber} onClose={() => setSelected(null)}>
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-xs font-bold uppercase text-slate-400">Customer</p>
              <p className="text-slate-900">{selected.customerName} · {selected.phone}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-slate-400">Items</p>
              <p className="text-slate-700">{selected.itemsSummary}</p>
            </div>
            <div className="flex justify-between">
              <div>
                <p className="text-xs font-bold uppercase text-slate-400">Fulfillment</p>
                <p className="capitalize text-slate-700">{selected.fulfillment.replace("-", " ")}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-slate-400">Total</p>
                <p className="font-bold text-imt-blue">{formatLKRShort(selected.total)}</p>
              </div>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-bold uppercase text-slate-400">Status</p>
              <select
                value={selected.status}
                onChange={(e) => updateStatus(selected.id, e.target.value as AdminOrder["status"])}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                {statusOptions.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
              </select>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
              <div>
                <p className="text-xs font-bold uppercase text-slate-400">WhatsApp notification</p>
                <StatusBadge status={selected.whatsappStatus} />
              </div>
              {selected.whatsappStatus === "failed" && (
                <Button size="sm" onClick={() => retryWhatsapp(selected.id)} disabled={retrying === selected.id}>
                  {retrying === selected.id ? "Retrying…" : "Retry send"}
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
