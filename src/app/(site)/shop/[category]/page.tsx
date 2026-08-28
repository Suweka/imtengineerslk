import { notFound } from "next/navigation";
import { categories, getCategoryBySlug } from "@/data/categories";
import { getProductsByCategoryDb } from "@/lib/products-db";
import { ShopListing } from "@/components/shop/ShopListing";
import { InfoBar, trustItems } from "@/components/home/InfoBar";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);
  return { title: category ? `${category.name} | IMT Engineers` : "Shop | IMT Engineers" };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);
  if (!category) notFound();

  const categoryProducts = await getProductsByCategoryDb(category.id);

  return (
    <>
      <ShopListing
        title={category.name}
        products={categoryProducts}
        crumbs={[{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }, { label: category.name }]}
      />
      <InfoBar items={trustItems} tone="light" />
    </>
  );
}
