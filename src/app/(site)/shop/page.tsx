import { getAllProducts } from "@/lib/products-db";
import { ShopListing } from "@/components/shop/ShopListing";
import { InfoBar, trustItems } from "@/components/home/InfoBar";

export const metadata = { title: "Shop All Air Conditioners | IMT Engineers" };
export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const products = await getAllProducts();
  return (
    <>
      <ShopListing
        title="All Air Conditioners"
        products={products}
        crumbs={[{ label: "Home", href: "/" }, { label: "Shop" }]}
      />
      <InfoBar items={trustItems} tone="light" />
    </>
  );
}
