import Link from "next/link";
import { getBestSellers } from "@/data/products";
import { ProductCard } from "@/components/product/ProductCard";

export function BestSellers() {
  const products = getBestSellers().slice(0, 4);
  return (
    <section className="bg-slate-50 py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-imt-red">This Month</p>
            <h2 className="mt-1 text-3xl font-extrabold text-slate-900">Best Selling Inverter ACs</h2>
          </div>
          <Link
            href="/shop"
            className="hidden rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-imt-blue hover:text-imt-blue sm:inline-flex"
          >
            View all products →
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
