import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatLKRShort } from "@/lib/format";

export default async function AccountOrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/account/login");

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-900">My Orders</h1>

      {orders.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">
          You haven&rsquo;t placed any orders yet.{" "}
          <Link href="/shop" className="font-semibold text-imt-blue hover:underline">Start shopping →</Link>
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {orders.map((o) => (
            <Link
              key={o.id}
              href={`/order-confirmation/${o.id}`}
              className="block rounded-xl border border-slate-200 bg-white p-4 transition-shadow hover:shadow-md"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold text-slate-900">{o.orderNumber}</p>
                  <p className="text-xs text-slate-500">{new Date(o.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={o.status} />
                  <span className="font-bold text-imt-blue">{formatLKRShort(Number(o.total))}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const toneMap: Record<string, string> = {
    new: "bg-blue-50 text-blue-700",
    contacted: "bg-amber-50 text-amber-700",
    confirmed: "bg-indigo-50 text-indigo-700",
    delivered_installed: "bg-emerald-50 text-emerald-700",
    cancelled: "bg-slate-100 text-slate-500",
  };
  const labelMap: Record<string, string> = { delivered_installed: "Delivered & Installed" };
  const tone = toneMap[status] ?? "bg-slate-100 text-slate-600";
  const label = labelMap[status] ?? status.charAt(0).toUpperCase() + status.slice(1);
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${tone}`}>{label}</span>;
}
