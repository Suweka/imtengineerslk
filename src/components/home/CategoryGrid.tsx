import Link from "next/link";
import { categories } from "@/data/categories";
import { formatLKRShort } from "@/lib/format";
import { ProductImageFrame } from "@/components/product/ProductImageFrame";
import { Reveal } from "@/components/ui/Reveal";

export function CategoryGrid() {
  return (
    <section className="mx-auto max-w-[1600px] px-4 pb-8 pt-8 text-center sm:px-6 lg:pb-[50px] lg:pt-[46px]">
      <Reveal>
        <p className="mb-1.5 text-[11.5px] font-semibold uppercase tracking-[1.4px] text-imt-red">Browse Categories</p>
        <h2 className="mb-2.5 text-2xl font-semibold text-[#172B3A] lg:mb-3 lg:text-[30px]">Shop Air Conditioners</h2>
        <div className="mx-auto mb-5 flex h-1 w-16 overflow-hidden rounded-full lg:mb-[34px]">
          <span className="w-1/2 bg-imt-blue" />
          <span className="w-1/2 bg-imt-red" />
        </div>
      </Reveal>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {categories.map((c, i) => (
          <Reveal key={c.id} delay={i * 60}>
            <Link
              href={`/shop/${c.slug}`}
              className={`group relative block overflow-hidden rounded-xl bg-gradient-to-br from-white via-sky-50/70 to-sky-100/50 p-3 text-left shadow-[inset_0_0_0_1.5px_rgba(56,189,248,0.45),0_4px_14px_rgba(28,117,188,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[inset_0_0_0_1.5px_rgba(56,189,248,0.9),inset_0_0_28px_4px_rgba(56,189,248,0.4),0_16px_32px_rgba(28,117,188,0.2)] ${
                i === categories.length - 1 ? "col-span-2 sm:col-span-1" : ""
              }`}
            >
              {/* Icy shine highlight, top-left */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -left-8 -top-8 h-24 w-24 rounded-full bg-white/70 blur-2xl transition-opacity duration-300 group-hover:opacity-90"
              />

              <div className="relative overflow-hidden rounded-lg bg-white/60 ring-1 ring-inset ring-sky-200/60">
                <ProductImageFrame
                  src={c.image}
                  alt={c.name}
                  label={c.name.split(" ")[0]}
                  className="aspect-square w-full transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="relative mt-3">
                <h3 className="font-semibold text-slate-900">{c.name}</h3>
                <p className="text-xs text-slate-500">From {formatLKRShort(c.fromPrice)}</p>
                <span className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-imt-blue transition-all group-hover:gap-2 group-hover:underline">
                  Shop Now →
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
