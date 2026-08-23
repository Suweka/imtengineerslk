import Link from "next/link";
import { categories } from "@/data/categories";
import { formatLKRShort } from "@/lib/format";
import { ProductImageFrame } from "@/components/product/ProductImageFrame";

export function CategoryGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-8 pt-8 text-center sm:px-6 lg:pb-[50px] lg:pt-[46px]">
      <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-imt-red">Browse Categories</p>
      <h2 className="mb-2.5 text-2xl font-bold text-slate-900 lg:mb-3 lg:text-3xl">Shop Air Conditioners</h2>
      <div className="mx-auto mb-5 flex h-1 w-16 overflow-hidden rounded-full lg:mb-[34px]">
        <span className="w-1/2 bg-imt-blue" />
        <span className="w-1/2 bg-imt-red" />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {categories.map((c) => (
          <Link key={c.id} href={`/shop/${c.slug}`} className="group rounded-xl border border-slate-200 bg-white p-3 text-left transition-shadow hover:shadow-md">
            <ProductImageFrame alt={c.name} label={c.name.split(" ")[0]} className="aspect-square w-full" />
            <div className="mt-3">
              <h3 className="font-semibold text-slate-900">{c.name}</h3>
              <p className="text-xs text-slate-500">From {formatLKRShort(c.fromPrice)}</p>
              <span className="mt-1 inline-block text-sm font-semibold text-imt-blue group-hover:underline">
                Shop Now →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
