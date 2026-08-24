import { brands } from "@/data/brands";
import { ProductImageFrame } from "@/components/product/ProductImageFrame";

export function BrandStrip() {
  return (
    <section className="bg-slate-50 py-12">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-500">Authorised Dealer For</p>
        <div className="mt-6 grid grid-cols-3 gap-4 sm:grid-cols-6">
          {brands.map((b) => (
            <ProductImageFrame key={b.id} src={b.logo} alt={b.name} label={b.name} className="aspect-[3/2] w-full" />
          ))}
        </div>
      </div>
    </section>
  );
}
