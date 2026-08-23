import Link from "next/link";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { PreviewBanner } from "@/components/admin/PreviewBanner";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { adminOrders, adminServiceRequests } from "@/data/admin-seed";
import { formatLKRShort } from "@/lib/format";

export default function AdminDashboard() {
  const failedWhatsapp = [...adminOrders.filter((o) => o.whatsappStatus === "failed")];
  const newOrders = adminOrders.filter((o) => o.status === "new").length;
  const newRequests = adminServiceRequests.filter((r) => r.status === "new").length;
  const revenue30d = adminOrders.reduce((sum, o) => sum + o.total, 0);

  return (
    <>
      <AdminTopbar title="Dashboard" subtitle="Overview of orders, service requests and WhatsApp delivery health." />
      <PreviewBanner>This dashboard is wired to placeholder data — connect it to the database in the next build phase.</PreviewBanner>

      <div className="flex-1 space-y-6 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="New orders" value={newOrders.toString()} tone="blue" />
          <StatCard label="New service requests" value={newRequests.toString()} tone="indigo" />
          <StatCard label="WhatsApp failures" value={failedWhatsapp.length.toString()} tone="red" />
          <StatCard label="Order value (recent)" value={formatLKRShort(revenue30d)} tone="emerald" />
        </div>

        {failedWhatsapp.length > 0 && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5">
            <h2 className="flex items-center gap-2 font-bold text-red-800">⚠ Orders needing attention</h2>
            <p className="mt-1 text-sm text-red-700">The WhatsApp notification failed to send for these orders — follow up manually or retry.</p>
            <div className="mt-4 space-y-2">
              {failedWhatsapp.map((o) => (
                <div key={o.id} className="flex items-center justify-between rounded-lg bg-white px-4 py-3 text-sm shadow-sm">
                  <div>
                    <span className="font-semibold text-slate-900">{o.orderNumber}</span>{" "}
                    <span className="text-slate-500">— {o.customerName} · {o.phone}</span>
                  </div>
                  <Link href="/admin/orders" className="font-semibold text-imt-blue hover:underline">
                    Review →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 className="font-bold text-slate-900">Recent orders</h2>
            <Link href="/admin/orders" className="text-sm font-semibold text-imt-blue hover:underline">View all →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-slate-400">
                <tr>
                  <th className="px-5 py-3">Order</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Total</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">WhatsApp</th>
                </tr>
              </thead>
              <tbody>
                {adminOrders.slice(0, 5).map((o) => (
                  <tr key={o.id} className="border-t border-slate-100">
                    <td className="px-5 py-3 font-medium text-slate-900">{o.orderNumber}</td>
                    <td className="px-5 py-3 text-slate-600">{o.customerName}</td>
                    <td className="px-5 py-3 text-slate-600">{formatLKRShort(o.total)}</td>
                    <td className="px-5 py-3"><StatusBadge status={o.status} /></td>
                    <td className="px-5 py-3"><StatusBadge status={o.whatsappStatus} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 className="font-bold text-slate-900">Recent service requests</h2>
            <Link href="/admin/service-requests" className="text-sm font-semibold text-imt-blue hover:underline">View all →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-slate-400">
                <tr>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Preferred date</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {adminServiceRequests.map((r) => (
                  <tr key={r.id} className="border-t border-slate-100">
                    <td className="px-5 py-3 font-medium text-slate-900">{r.type}</td>
                    <td className="px-5 py-3 text-slate-600">{r.customerName}</td>
                    <td className="px-5 py-3 text-slate-600">{r.preferredDate}</td>
                    <td className="px-5 py-3"><StatusBadge status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

function StatCard({ label, value, tone }: { label: string; value: string; tone: "blue" | "indigo" | "red" | "emerald" }) {
  const toneClasses = {
    blue: "text-imt-blue bg-blue-50",
    indigo: "text-indigo-600 bg-indigo-50",
    red: "text-red-600 bg-red-50",
    emerald: "text-emerald-600 bg-emerald-50",
  }[tone];
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className={`mt-2 inline-flex rounded-lg px-2 py-1 text-2xl font-extrabold ${toneClasses}`}>{value}</p>
    </div>
  );
}
