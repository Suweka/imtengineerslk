import { products } from "@/data/products";
import { ShopListing } from "@/components/shop/ShopListing";
import { InfoBar, trustItems } from "@/components/home/InfoBar";

export const metadata = { title: "Shop All Air Conditioners | IMT Engineers" };

export default function ShopPage() {
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
