"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { TopBar } from "./TopBar";
import { categories } from "@/data/categories";
import { brands } from "@/data/brands";
import { useCart } from "@/lib/cart-context";
import { formatLKRShort } from "@/lib/format";
import { Icon } from "@/components/ui/Icon";
import { MiniCart } from "@/components/layout/MiniCart";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/installation", label: "Installation" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
];

export function Header() {
  const { itemCount, total } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [cartBump, setCartBump] = useState(false);
  const prevCount = useRef(itemCount);
  useEffect(() => {
    if (itemCount > prevCount.current) {
      setCartBump(true);
      const t = setTimeout(() => setCartBump(false), 350);
      prevCount.current = itemCount;
      return () => clearTimeout(t);
    }
    prevCount.current = itemCount;
  }, [itemCount]);

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <TopBar />
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <button className="text-slate-700 lg:hidden" aria-label="Menu" onClick={() => setMobileOpen((v) => !v)}>
            <Icon name="menu" size={24} />
          </button>
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-9 w-[132px] sm:h-11 sm:w-[161px]">
              <Image
                src="/logo.png"
                alt="IMT Engineers Logo"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>
        </div>

        <nav className="hidden items-center gap-6 text-[13.5px] font-medium text-slate-700 lg:flex">
          <Link
            href="/"
            className={`border-b-2 pb-1 ${
              isHome ? "border-imt-blue font-semibold text-imt-blue" : "border-transparent hover:text-imt-blue"
            }`}
          >
            Home
          </Link>
          <div className="group relative">
            <Link href="/shop" className="flex items-center gap-1 hover:text-imt-blue">
              Shop <Icon name="expand_more" size={16} className="transition-transform duration-200 group-hover:rotate-180" />
            </Link>
            <div className="invisible absolute left-0 top-full z-50 min-w-[220px] -translate-y-1 rounded-lg border border-slate-100 bg-white py-2 opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              {categories.map((c) => (
                <Link key={c.id} href={`/shop/${c.slug}`} className="block px-4 py-2 text-sm hover:bg-slate-50 hover:text-imt-blue">
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="group relative">
            <Link href="/brands" className="flex items-center gap-1 hover:text-imt-blue">
              Brands <Icon name="expand_more" size={16} className="transition-transform duration-200 group-hover:rotate-180" />
            </Link>
            <div className="invisible absolute left-0 top-full z-50 min-w-[180px] -translate-y-1 rounded-lg border border-slate-100 bg-white py-2 opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              {brands.map((b) => (
                <Link key={b.id} href={`/brands#${b.slug}`} className="block px-4 py-2 text-sm hover:bg-slate-50 hover:text-imt-blue">
                  {b.name}
                </Link>
              ))}
            </div>
          </div>
          {navLinks.slice(1).map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-imt-blue">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button aria-label="Search" className="text-slate-600 hover:text-imt-blue">
            <Icon name="search" size={20} />
          </button>
          <Link href="/admin" aria-label="Account" className="hidden text-slate-600 hover:text-imt-blue sm:block">
            <Icon name="person" size={20} />
          </Link>
          <div className="group relative">
            <Link
              href="/cart"
              aria-label="Cart"
              className={`relative block text-slate-600 transition-colors hover:text-imt-blue ${cartBump ? "animate-bump" : ""}`}
            >
              <Icon name="shopping_cart" size={22} />
              {itemCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-imt-red text-[10px] font-bold text-white transition-transform">
                  {itemCount}
                </span>
              )}
            </Link>
            <MiniCart />
          </div>
          <span className="hidden items-center gap-1.5 text-sm font-medium text-imt-navy lg:flex">
            <Icon name="account_balance_wallet" size={18} />
            {formatLKRShort(total)}
          </span>
        </div>
      </div>

      <div
        className={`grid overflow-hidden border-slate-100 bg-white transition-all duration-300 ease-out lg:hidden ${
          mobileOpen ? "grid-rows-[1fr] border-t opacity-100" : "grid-rows-[0fr] border-t-0 opacity-0"
        }`}
      >
        <div className="min-h-0 px-4 py-3">
          <div className="flex flex-col gap-1">
            {[{ href: "/", label: "Home" }, { href: "/shop", label: "Shop" }, { href: "/brands", label: "Brands" }, ...navLinks.slice(1)].map(
              (l) => (
                <Link key={l.href} href={l.href} className="rounded px-2 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" onClick={() => setMobileOpen(false)}>
                  {l.label}
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
