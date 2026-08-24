"use client";

import { useEffect, useState } from "react";
import { formatLKRShort } from "@/lib/format";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Modal } from "@/components/admin/Modal";
import { Button } from "@/components/ui/Button";

type OrderStatus = "new" | "contacted" | "confirmed" | "delivered_installed" | "cancelled";
type WhatsappStatus = "pending" | "sent" | "failed";

type OrderItem = { name: string; qty: number };

type Order = {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  items: OrderItem[];
  total: number;
  fulfillment: "delivery" | "showroom-pickup";
  status: OrderStatus;
  whatsappStatus: WhatsappStatus;
  createdAt: string;
};

const statusOptions: OrderStatus[] = ["new", "contacted", "confirmed", "delivered_installed", "cancelled"];

function itemsSummary(items: OrderItem[]) {
  return items.map((i) => `${i.qty}x ${i.name}`).join(", ");
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Order | null>(null);
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");
  const [retrying, setRetrying] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  async function updateStatus(id: string, status: OrderStatus) {
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) return;
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    setSelected((prev) => (prev && prev.id === id ? { ...prev, status } : prev));
  }

  async function retryWhatsapp(id: string) {
    setRetrying(id);
    try {
      const res = await fetch(`/api/admin/orders/${id}/retry-whatsapp`, { method: "POST" });
      const data = await res.json();
      const whatsappStatus: WhatsappStatus = data.whatsappStatus ?? "failed";
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, whatsappStatus } : o)));
      setSelected((prev) => (prev && prev.id === id ? { ...prev, whatsappStatus } : prev));
    } finally {
      setRetrying(null);
    }
  }

  return (
    <>
      <AdminTopbar title="Orders" subtitle={loading ? "Loading…" : `${orders.length} orders`} />

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
              <p className="text-slate-700">{itemsSummary(selected.items)}</p>
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
                onChange={(e) => updateStatus(selected.id, e.target.value as OrderStatus)}
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
