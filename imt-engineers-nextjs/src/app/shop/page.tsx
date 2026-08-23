import type { Metadata } from "next";
import ShopClient from "./ShopClient";

export const metadata: Metadata = {
  title: "Split Air Conditioners — IMT Engineers",
  description:
    "42 split air conditioners from 8 brands. Inverter and non-inverter, 0.75 HP to 3.0 HP, with islandwide installation.",
};

export default function ShopPage() {
  return <ShopClient />;
}
