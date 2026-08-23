import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug, getRelatedProducts, products } from "@/data/products";
import { getBrandById } from "@/data/brands";
import { categories } from "@/data/categories";
import { ProductGallery } from "@/components/product/ProductGallery";
import { BuyPanel } from "@/components/product/BuyPanel";
import { ProductTabs } from "@/components/product/ProductTabs";
import { RoomSizeCalculator } from "@/components/product/RoomSizeCalculator";
import { ProductCard } from "@/components/product/ProductCard";
import { StarRating } from "@/components/ui/StarRating";
import { Badge } from "@/components/ui/Badge";
import { InfoBar, trustItems } from "@/components/home/InfoBar";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);
  return { title: product ? `${product.name} | IMT Engineers` : "Product | IMT Engineers" };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const brand = getBrandById(product.brandId);
  const category = categories.find((c) => c.id === product.categoryId);
  const related = getRelatedProducts(product);
  const isCeilingMounted = product.categoryId === "cat-cassette" || product.categoryId === "cat-ducted";

  return (
    <>
      <div className="mx-auto max-w-[1600px] px-4 pt-4 text-xs text-slate-500 sm:px-6">
        <Link href="/">Home</Link> › <Link href="/shop">Shop</Link> ›{" "}
        {category && <Link href={`/shop/${category.slug}`}>{category.name}</Link>} › {product.name}
      </div>

      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <ProductGallery productName={product.name} images={product.images} />

          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {product.isBestSeller && <Badge tone="bestseller">Best Seller</Badge>}
                <span className="text-xs font-bold uppercase tracking-wide text-imt-blue">{brand?.name}</span>
              </div>
              <span className="text-xs text-slate-400">SKU: {product.id.toUpperCase()}</span>
            </div>
            <h1 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">{product.name}</h1>
            <div className="mt-2 flex items-center gap-3">
              <StarRating rating={product.rating} reviewCount={product.reviewCount} />
              {product.soldThisYear && <span className="text-xs text-slate-500">{product.soldThisYear} sold this year</span>}
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">✓ In stock</span>
            </div>

            <div className="mt-6">
              <BuyPanel product={product} />
            </div>
          </div>
        </div>

        {(category?.slug === "split" || isCeilingMounted) && (
          <div className="mt-8 rounded-xl border border-imt-blue/20 bg-imt-blue/5 p-4 text-sm text-slate-700">
            <strong className="text-imt-navy">Installation required.</strong>{" "}
            {isCeilingMounted
              ? "This is a ceiling-mounted unit — a site survey is required before installation can be scheduled."
              : "Split units are installed by IMT-certified technicians, islandwide, within 3 working days."}
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
          <ProductTabs product={product} />
          <div className="mt-10 lg:mt-16">
            <RoomSizeCalculator />
          </div>
        </div>
      </div>

      <section className="bg-slate-50 py-14">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6">
          <div className="flex items-end justify-between">
            <h2 className="text-xl font-extrabold text-slate-900">Customers also viewed</h2>
            {category && (
              <Link href={`/shop/${category.slug}`} className="text-sm font-semibold text-imt-blue hover:underline">
                View all {category.name.toLowerCase()} →
              </Link>
            )}
          </div>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <InfoBar items={trustItems} tone="light" />
    </>
  );
}
