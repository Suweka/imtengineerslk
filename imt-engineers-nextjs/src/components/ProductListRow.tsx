import Link from "next/link";
import Icon from "./Icon";
import Placeholder from "./Placeholder";
import type { Product } from "@/data/products";
import { lkr, roomSizeLabel } from "@/lib/format";

export default function ProductListRow({ product }: { product: Product }) {
  const specs = [
    { k: "CAPACITY", v: product.hp + " HP" },
    { k: "TYPE", v: product.type },
    { k: "ROOM SIZE", v: roomSizeLabel(product.roomMin, product.roomMax) },
    { k: "ENERGY", v: product.energy + " star" },
  ];

  return (
    <article className="flex flex-col gap-4 rounded-[10px] border border-ui-line bg-white p-4 transition-shadow hover:shadow-card sm:flex-row sm:gap-5 sm:p-[18px]">
      <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-lg bg-ui-mist sm:h-[158px] sm:w-[210px]">
        <Placeholder label="Product" />
        {product.badge && (
          <span
            className="pointer-events-none absolute left-2.5 top-2.5 rounded px-2 py-1 text-[9.5px] font-semibold text-white"
            style={{ background: product.badgeColor }}
          >
            {product.badge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between gap-4 lg:flex-row lg:gap-5">
        <div className="flex-1">
          <div className="mb-1.5 text-[10px] font-semibold tracking-[0.9px] text-brand-blue">
            {product.brand.toUpperCase()}
          </div>
          <Link
            href={"/product/" + product.slug}
            className="mb-2 block text-[15px] font-medium text-brand-ink no-underline hover:text-brand-blue sm:text-[17px]"
          >
            {product.name}
          </Link>
          <div className="mb-3 flex flex-wrap items-center gap-2.5">
            <span className="text-[12.5px] text-brand-orange">
              {"★".repeat(Math.round(product.rating))}
              <span className="text-[#D9E1E8]">{"★".repeat(5 - Math.round(product.rating))}</span>
            </span>
            <span className="text-[11.5px] text-ui-faint">{product.reviews} reviews</span>
            <span className="hidden h-3 w-px bg-ui-border sm:block" />
            <span className="flex items-center gap-1 text-[11.5px] text-brand-green">
              <Icon name="check_circle" size={15} />
              In stock
            </span>
          </div>
          <div className="grid grid-cols-2 justify-start gap-x-6 gap-y-2 sm:flex sm:gap-x-[22px]">
            {specs.map((s) => (
              <div key={s.k}>
                <div className="text-[10px] tracking-[0.4px] text-[#95A2AE]">{s.k}</div>
                <div className="mt-0.5 text-[12.5px] font-medium text-brand-ink">{s.v}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 flex-col justify-between text-left lg:w-[190px] lg:text-right">
          <div>
            <div className="text-[20px] font-semibold text-brand-blue">{lkr(product.price)}</div>
            <div className="mt-0.5 text-[11.5px] text-[#95A2AE] line-through">{lkr(product.was)}</div>
            <div className="mt-1.5 text-[11px] text-ui-muted">+ install from LKR 12,500</div>
          </div>
          <div className="mt-3.5 flex gap-2 lg:justify-end">
            <button
              aria-label="Save"
              className="flex h-10 w-10 items-center justify-center rounded-[7px] border border-ui-border hover:border-brand-blue"
            >
              <Icon name="favorite_border" size={18} className="text-brand-ink" />
            </button>
            <button
              aria-label="Compare"
              className="flex h-10 w-10 items-center justify-center rounded-[7px] border border-ui-border hover:border-brand-blue"
            >
              <Icon name="compare_arrows" size={18} className="text-brand-blue" />
            </button>
            <button className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-[7px] bg-brand-blue px-5 text-[13px] font-semibold text-white transition-colors hover:bg-brand-red lg:flex-none">
              <Icon name="shopping_cart" size={18} />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
