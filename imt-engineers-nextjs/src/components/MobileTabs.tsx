"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "./Icon";

const TABS = [
  { label: "Home", icon: "home", href: "/" },
  { label: "Shop", icon: "grid_view", href: "/shop" },
  { label: "Cart", icon: "shopping_cart", href: "/cart" },
  { label: "Service", icon: "build", href: "/services" },
  { label: "Account", icon: "person", href: "/account" },
];

export default function MobileTabs() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-ui-line bg-white px-2 pb-3.5 pt-2 md:hidden">
      {TABS.map((t) => {
        const active = pathname === t.href;
        return (
          <Link
            key={t.label}
            href={t.href}
            className={`flex flex-col items-center gap-0.5 no-underline ${
              active ? "text-brand-blue" : "text-ui-faint"
            }`}
          >
            <Icon name={t.icon} size={22} />
            <span className={`text-[9.5px] ${active ? "font-semibold" : ""}`}>{t.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
