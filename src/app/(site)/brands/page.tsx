import { brands } from "@/data/brands";
import { getAllProducts } from "@/lib/products-db";
import { ProductImageFrame } from "@/components/product/ProductImageFrame";
import { ProductCard } from "@/components/product/ProductCard";

export const metadata = { title: "Brands | IMT Engineers" };
export const dynamic = "force-dynamic";

export default async function BrandsPage() {
  const products = await getAllProducts();
  return (
    <div className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6">
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-wide text-imt-red">Authorised Dealer</p>
        <h1 className="mt-2 text-3xl font-extrabold text-slate-900">Brands We Carry</h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">
          We supply genuine units backed by manufacturer warranty, sourced only through authorised channels.
        </p>
      </div>

      <div className="mt-12 space-y-16">
        {brands.map((brand) => {
          const brandProducts = products.filter((p) => p.brandId === brand.id);
          if (brandProducts.length === 0) return null;
          return (
            <section key={brand.id} id={brand.slug}>
              <div className="flex items-center gap-4">
                <ProductImageFrame src={brand.logo} alt={brand.name} label={brand.name} className="h-16 w-24" />
                <h2 className="text-xl font-extrabold text-slate-900">{brand.name}</h2>
              </div>
              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {brandProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
