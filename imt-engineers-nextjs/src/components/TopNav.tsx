"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "./Icon";
import Logo from "./Logo";
import { NAV_ITEMS, STORE } from "@/data/site";
import { lkr } from "@/lib/format";

export default function TopNav() {
  const pathname = usePathname();
  const cartCount = 2;
  const cartTotal = 85000;

  return (
    <header className="bg-white">
      {/* Announcement strip */}
      <div className="flex h-[38px] items-center justify-between bg-brand-blue px-4 text-[11.5px] text-white lg:px-[34px]">
        <div className="flex items-center gap-2">
          <Icon name="local_shipping" size={16} />
          <span>Free Delivery for Orders Over LKR {STORE.freeDeliveryOver.toLocaleString()}</span>
        </div>
        <div className="hidden items-center gap-4 lg:flex">
          <span className="flex items-center gap-1.5">
            <Icon name="call" size={15} />
            {STORE.phone}
          </span>
          <span className="opacity-40">|</span>
          <span className="flex items-center gap-1.5">
            <Icon name="mail" size={15} />
            {STORE.email}
          </span>
          <span className="ml-1 flex items-center gap-2.5 opacity-90">
            <Icon name="public" size={15} />
            <Icon name="photo_camera" size={15} />
            <Icon name="chat" size={15} />
          </span>
        </div>
      </div>

      {/* Main bar */}
      <div className="flex h-[74px] items-center justify-between border-b border-ui-line px-4 lg:px-[34px]">
        <div className="flex items-center gap-3">
          <button className="lg:hidden" aria-label="Open menu">
            <Icon name="menu" size={24} className="text-brand-ink" />
          </button>
          <Logo />
        </div>

        <nav className="hidden items-center gap-[26px] text-[13.5px] font-medium lg:flex">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-1 border-b-2 pb-[3px] no-underline transition-colors ${
                  active
                    ? "border-brand-blue font-semibold text-brand-blue"
                    : "border-transparent text-ui-text hover:border-brand-red hover:text-brand-red"
                }`}
              >
                {item.label}
                {item.caret && <Icon name="expand_more" size={16} className="opacity-70" />}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4 text-brand-ink lg:gap-5">
          <button aria-label="Search">
            <Icon name="search" size={22} />
          </button>
          <Link href="/account" aria-label="Account" className="hidden text-brand-ink lg:block">
            <Icon name="person" size={22} />
          </Link>
          <Link href="/cart" aria-label="Cart" className="relative flex text-brand-ink">
            <Icon name="shopping_cart" size={22} className="text-brand-blue" />
            <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-red px-1 text-[10px] font-semibold text-white">
              {cartCount}
            </span>
          </Link>
          <div className="hidden items-center gap-1.5 text-[13px] font-medium text-brand-ink lg:flex">
            <Icon name="account_balance_wallet" size={20} />
            <span>{lkr(cartTotal)}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
