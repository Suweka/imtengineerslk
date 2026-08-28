import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AccountOverviewPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/account/login");

  const [orderCount, wishlistCount] = await Promise.all([
    prisma.order.count({ where: { userId: session.user.id } }),
    prisma.wishlist.count({ where: { userId: session.user.id } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">My Account</h1>
        <p className="mt-1 text-sm text-slate-500">{session.user.email}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link href="/account/orders" className="rounded-xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-md">
          <p className="text-3xl font-extrabold text-imt-blue">{orderCount}</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">Orders placed</p>
          <p className="text-xs text-slate-500">View your order history →</p>
        </Link>
        <Link href="/account/wishlist" className="rounded-xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-md">
          <p className="text-3xl font-extrabold text-imt-red">{wishlistCount}</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">Saved items</p>
          <p className="text-xs text-slate-500">View your wishlist →</p>
        </Link>
      </div>
    </div>
  );
}
