import Link from "next/link";
import Icon from "./Icon";
import Placeholder from "./Placeholder";
import Stars from "./Stars";
import type { Product } from "@/data/products";
import { lkr, roomSizeLabel } from "@/lib/format";

export default function ProductCard({
  product,
  showSpecs = false,
}: {
  product: Product;
  showSpecs?: boolean;
}) {
  return (
    <article className="overflow-hidden rounded-[10px] border border-ui-line bg-white transition-shadow hover:shadow-card">
      <div className="relative h-[112px] bg-ui-mist sm:h-[172px]">
        <Placeholder label="Product" />
        {product.badge && (
          <span
            className="pointer-events-none absolute left-2.5 top-2.5 rounded px-2 py-1 text-[9px] font-semibold tracking-[0.4px] text-white sm:text-[9.5px]"
            style={{ background: product.badgeColor }}
          >
            {product.badge}
          </span>
        )}
        <button
          aria-label="Save"
          className="absolute right-2.5 top-2.5 hidden h-[30px] w-[30px] items-center justify-center rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,.09)] sm:flex"
        >
          <Icon name="favorite_border" size={17} className="text-brand-ink" />
        </button>
      </div>

      <div className="p-3 sm:p-[15px]">
        {showSpecs && (
          <div className="mb-1.5 text-[10px] font-semibold tracking-[0.9px] text-brand-blue">
            {product.brand.toUpperCase()}
          </div>
        )}
        <Link
          href={"/product/" + product.slug}
          className="block h-[33px] text-[11.5px] font-medium leading-[1.45] text-brand-ink no-underline hover:text-brand-blue sm:h-10 sm:text-[13.5px] sm:leading-[1.5]"
        >
          {product.name}
        </Link>

        <div className="my-1.5 hidden sm:block">
          <Stars rating={product.rating} reviews={product.reviews} />
        </div>

        {showSpecs && (
          <div className="mb-3 mt-1.5 flex flex-wrap gap-1.5">
            {[product.hp + " HP", product.type, roomSizeLabel(product.roomMin, product.roomMax)].map(
              (chip, i) => (
                <span
                  key={chip}
                  className={`rounded-full border border-ui-line bg-ui-mist px-2 py-0.5 text-[9.5px] text-[#4A5A68] sm:text-[10.5px] ${
                    i === 2 ? "hidden sm:inline" : ""
                  }`}
                >
                  {chip}
                </span>
              )
            )}
          </div>
        )}

        <div className="mb-2.5 flex items-baseline gap-2">
          <span className="text-[13px] font-semibold text-brand-blue sm:text-[15px]">
            {lkr(product.price)}
          </span>
          <span className="hidden text-[11.5px] text-[#95A2AE] line-through sm:inline">
            {lkr(product.was)}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            aria-label="Compare"
            className="hidden h-[38px] w-11 items-center justify-center rounded-[7px] border border-ui-border hover:border-brand-blue sm:flex"
          >
            <Icon name="compare_arrows" size={18} className="text-brand-blue" />
          </button>
          <button className="h-[34px] flex-1 rounded-md bg-brand-blue text-[11.5px] font-semibold text-white transition-colors hover:bg-brand-red sm:h-[38px] sm:rounded-[7px] sm:text-[12.5px]">
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}
