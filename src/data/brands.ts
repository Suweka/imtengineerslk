import { Brand } from "@/lib/types";

export const brands: Brand[] = [
  { id: "brand-panasonic", name: "Panasonic", slug: "panasonic", logo: "/panasonic-logo.png" },
  { id: "brand-lg", name: "LG", slug: "lg", logo: "/LG-LOGO.png" },
  { id: "brand-hisense", name: "Hisense", slug: "hisense" },
  { id: "brand-sharp", name: "Sharp", slug: "sharp" },
  { id: "brand-tcl", name: "TCL", slug: "tcl" },
  { id: "brand-midea", name: "Midea", slug: "midea", logo: "/midea-logo.png" },
  { id: "brand-daikin", name: "Daikin", slug: "daikin", logo: "/daikin-logo-png.png" },
  { id: "brand-teco", name: "Teco", slug: "teco" },
];

export function getBrandBySlug(slug: string) {
  return brands.find((b) => b.slug === slug);
}

export function getBrandById(id: string) {
  return brands.find((b) => b.id === id);
}
