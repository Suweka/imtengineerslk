const toneMap: Record<string, string> = {
  new: "bg-blue-50 text-blue-700",
  contacted: "bg-amber-50 text-amber-700",
  confirmed: "bg-indigo-50 text-indigo-700",
  delivered_installed: "bg-emerald-50 text-emerald-700",
  completed: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-slate-100 text-slate-500",
  pending: "bg-amber-50 text-amber-700",
  sent: "bg-emerald-50 text-emerald-700",
  failed: "bg-red-50 text-red-700",
};

const labelMap: Record<string, string> = {
  delivered_installed: "Delivered & Installed",
};

export function StatusBadge({ status }: { status: string }) {
  const tone = toneMap[status] ?? "bg-slate-100 text-slate-600";
  const label = labelMap[status] ?? status.charAt(0).toUpperCase() + status.slice(1);
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${tone}`}>{label}</span>;
}
