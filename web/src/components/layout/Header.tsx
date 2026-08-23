"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { TopBar } from "./TopBar";
import { categories } from "@/data/categories";
import { brands } from "@/data/brands";
import { useCart } from "@/lib/cart-context";
import { formatLKRShort } from "@/lib/format";

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

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <TopBar />
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <button className="text-slate-700 lg:hidden" aria-label="Menu" onClick={() => setMobileOpen((v) => !v)}>
            <MenuIcon />
          </button>
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-14 w-14 sm:h-16 sm:w-16">
              <Image
                src="/logo.jpg"
                alt="IMT Engineers Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>
        </div>

        <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-700 lg:flex">
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
              Shop <Chevron />
            </Link>
            <div className="invisible absolute left-0 top-full z-50 min-w-[220px] rounded-lg border border-slate-100 bg-white py-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
              {categories.map((c) => (
                <Link key={c.id} href={`/shop/${c.slug}`} className="block px-4 py-2 text-sm hover:bg-slate-50 hover:text-imt-blue">
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="group relative">
            <Link href="/brands" className="flex items-center gap-1 hover:text-imt-blue">
              Brands <Chevron />
            </Link>
            <div className="invisible absolute left-0 top-full z-50 min-w-[180px] rounded-lg border border-slate-100 bg-white py-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
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
            <SearchIcon />
          </button>
          <Link href="/admin" aria-label="Account" className="hidden text-slate-600 hover:text-imt-blue sm:block">
            <UserIcon />
          </Link>
          <Link href="/cart" aria-label="Cart" className="relative text-slate-600 hover:text-imt-blue">
            <CartIcon />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-imt-red text-[10px] font-bold text-white">
                {itemCount}
              </span>
            )}
          </Link>
          <span className="hidden items-center gap-1.5 text-sm font-medium text-imt-navy lg:flex">
            <WalletIcon />
            {formatLKRShort(total)}
          </span>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-100 bg-white px-4 py-3 lg:hidden">
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
      )}
    </header>
  );
}

function Chevron() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
    </svg>
  );
}
function WalletIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12V7H5a2 2 0 010-4h14v4" />
      <path d="M3 5v14a2 2 0 002 2h16v-5" />
      <path d="M18 12a2 2 0 000 4h4v-4z" />
    </svg>
  );
}
function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 12h18M3 6h18M3 18h18" />
    </svg>
  );
}
