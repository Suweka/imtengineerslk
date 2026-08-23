"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navGroups = [
  {
    title: "Overview",
    links: [{ href: "/admin", label: "Dashboard", icon: "grid" }],
  },
  {
    title: "Catalog",
    links: [
      { href: "/admin/products", label: "Products", icon: "box" },
      { href: "/admin/brands", label: "Brands", icon: "tag" },
      { href: "/admin/categories", label: "Categories", icon: "layers" },
    ],
  },
  {
    title: "Sales",
    links: [
      { href: "/admin/orders", label: "Orders", icon: "cart" },
      { href: "/admin/service-requests", label: "Service Requests", icon: "wrench" },
    ],
  },
  {
    title: "Content",
    links: [
      { href: "/admin/content/home", label: "Home Page", icon: "home" },
      { href: "/admin/content/testimonials", label: "Testimonials", icon: "star" },
      { href: "/admin/content/pages", label: "Site Pages", icon: "file" },
    ],
  },
  {
    title: "Configuration",
    links: [{ href: "/admin/settings", label: "Settings", icon: "settings" }],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-800 bg-imt-navy text-slate-300 lg:flex lg:flex-col">
      <div className="flex items-center gap-2 border-b border-white/10 px-5 py-5">
        <div className="inline-flex rounded-md bg-white px-2.5 py-1.5">
          <div className="relative h-7 w-[103px]">
            <Image src="/logo.png" alt="IMT Engineers Logo" fill className="object-contain" />
          </div>
        </div>
      </div>
      <div className="border-b border-white/10 px-5 py-2 text-[10px] uppercase tracking-widest text-slate-400">
        Control Panel
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {navGroups.map((group) => (
          <div key={group.title}>
            <p className="px-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">{group.title}</p>
            <div className="mt-2 space-y-0.5">
              {group.links.map((link) => {
                const active = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      active ? "bg-white/10 text-white" : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <NavIcon name={link.icon} />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 px-5 py-4">
        <Link href="/" className="text-xs font-medium text-slate-400 hover:text-white">
          ← Back to storefront
        </Link>
      </div>
    </aside>
  );
}

function NavIcon({ name }: { name: string }) {
  const props = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2 } as const;
  switch (name) {
    case "grid":
      return <svg {...props}><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>;
    case "box":
      return <svg {...props}><path d="M21 8l-9-5-9 5 9 5 9-5z" /><path d="M3 8v8l9 5 9-5V8" /><path d="M12 13v8" /></svg>;
    case "tag":
      return <svg {...props}><path d="M20.59 13.41L11 3.83A2 2 0 009.59 3.24H4a1 1 0 00-1 1v5.59a2 2 0 00.59 1.41l9.59 9.59a2 2 0 002.82 0l4.59-4.59a2 2 0 000-2.83z" /><circle cx="7.5" cy="7.5" r="1.5" /></svg>;
    case "layers":
      return <svg {...props}><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>;
    case "cart":
      return <svg {...props}><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" /></svg>;
    case "wrench":
      return <svg {...props}><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94z" /></svg>;
    case "home":
      return <svg {...props}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><path d="M9 22V12h6v10" /></svg>;
    case "star":
      return <svg {...props}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" /></svg>;
    case "file":
      return <svg {...props}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6" /></svg>;
    case "settings":
      return <svg {...props}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 00.34 1.87l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.7 1.7 0 00-1.87-.34 1.7 1.7 0 00-1 1.55V21a2 2 0 01-4 0v-.09A1.7 1.7 0 009 19.4a1.7 1.7 0 00-1.87.34l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.7 1.7 0 004.6 15a1.7 1.7 0 00-1.55-1H3a2 2 0 010-4h.09A1.7 1.7 0 004.6 9a1.7 1.7 0 00-.34-1.87l-.06-.06a2 2 0 112.83-2.83l.06.06A1.7 1.7 0 009 4.6a1.7 1.7 0 001-1.55V3a2 2 0 014 0v.09A1.7 1.7 0 0015 4.6a1.7 1.7 0 001.87-.34l.06-.06a2 2 0 112.83 2.83l-.06.06A1.7 1.7 0 0019.4 9a1.7 1.7 0 001.55 1H21a2 2 0 010 4h-.09a1.7 1.7 0 00-1.55 1z" /></svg>;
    default:
      return null;
  }
}
