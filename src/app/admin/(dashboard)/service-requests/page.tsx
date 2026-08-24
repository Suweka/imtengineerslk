"use client";

import { useEffect, useState } from "react";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Modal } from "@/components/admin/Modal";

type RequestStatus = "new" | "contacted" | "confirmed" | "completed" | "cancelled";

type ServiceRequest = {
  id: string;
  type: string;
  customerName: string;
  phone: string;
  address: string;
  preferredDate: string | null;
  status: RequestStatus;
  whatsappStatus: "pending" | "sent" | "failed";
  createdAt: string;
};

const statusOptions: RequestStatus[] = ["new", "contacted", "confirmed", "completed", "cancelled"];

export default function AdminServiceRequestsPage() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ServiceRequest | null>(null);

  useEffect(() => {
    fetch("/api/admin/service-requests")
      .then((res) => res.json())
      .then((data) => setRequests(data))
      .finally(() => setLoading(false));
  }, []);

  async function updateStatus(id: string, status: RequestStatus) {
    const res = await fetch(`/api/admin/service-requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) return;
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    setSelected((prev) => (prev && prev.id === id ? { ...prev, status } : prev));
  }

  return (
    <>
      <AdminTopbar title="Service Requests" subtitle={loading ? "Loading…" : `${requests.length} requests`} />

      <div className="flex-1 p-6">
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-slate-400">
              <tr>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Address</th>
                <th className="px-5 py-3">Preferred date</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id} className="border-t border-slate-100">
                  <td className="px-5 py-3 font-medium text-slate-900">{r.type}</td>
                  <td className="px-5 py-3 text-slate-600">{r.customerName}<div className="text-xs text-slate-400">{r.phone}</div></td>
                  <td className="px-5 py-3 text-slate-600">{r.address}</td>
                  <td className="px-5 py-3 text-slate-600">{r.preferredDate ? new Date(r.preferredDate).toLocaleDateString("en-GB") : "—"}</td>
                  <td className="px-5 py-3"><StatusBadge status={r.status} /></td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => setSelected(r)} className="font-semibold text-imt-blue hover:underline">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <Modal title={selected.type} onClose={() => setSelected(null)}>
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-xs font-bold uppercase text-slate-400">Customer</p>
              <p className="text-slate-900">{selected.customerName} · {selected.phone}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-slate-400">Address</p>
              <p className="text-slate-700">{selected.address}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-slate-400">Preferred date</p>
              <p className="text-slate-700">{selected.preferredDate ? new Date(selected.preferredDate).toLocaleDateString("en-GB") : "—"}</p>
            </div>
            <div>
              <p className="mb-1.5 text-xs font-bold uppercase text-slate-400">Status</p>
              <select
                value={selected.status}
                onChange={(e) => updateStatus(selected.id, e.target.value as RequestStatus)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
