import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { SignOutLink } from "@/components/account/SignOutLink";

const navLinks = [
  { href: "/account", label: "Overview" },
  { href: "/account/orders", label: "My Orders" },
  { href: "/account/wishlist", label: "Wishlist" },
];

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  // Login/register pages render inside this same layout but must stay
  // reachable without a session; only guard everything else under /account.
  if (!session) {
    return <>{children}</>;
  }
  if (session.user.role !== "customer") {
    redirect("/");
  }

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-1">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              {l.label}
            </Link>
          ))}
          <SignOutLink />
        </aside>
        <div>{children}</div>
      </div>
    </div>
  );
}
