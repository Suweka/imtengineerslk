import { notFound } from "next/navigation";
import { categories, getCategoryBySlug } from "@/data/categories";
import { getProductsByCategory } from "@/data/products";
import { ShopListing } from "@/components/shop/ShopListing";
import { InfoBar, trustItems } from "@/components/home/InfoBar";

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export function generateMetadata({ params }: { params: { category: string } }) {
  const category = getCategoryBySlug(params.category);
  return { title: category ? `${category.name} | IMT Engineers` : "Shop | IMT Engineers" };
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const category = getCategoryBySlug(params.category);
  if (!category) notFound();

  const categoryProducts = getProductsByCategory(category.id);

  return (
    <>
      <ShopListing title={category.name} products={categoryProducts} />
      <InfoBar items={trustItems} tone="light" />
    </>
  );
}
