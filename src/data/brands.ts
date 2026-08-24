import { Brand } from "@/lib/types";

// NOTE: brand list is placeholder/draft content — confirm final list with client before launch.
export const brands: Brand[] = [
  { id: "brand-daikin", name: "Daikin", slug: "daikin", logo: "/daikin-logo-png.png" },
  { id: "brand-midea", name: "Midea", slug: "midea", logo: "/midea-logo.png" },
  { id: "brand-panasonic", name: "Panasonic", slug: "panasonic", logo: "/panasonic-logo.png" },
  { id: "brand-lg", name: "LG", slug: "lg", logo: "/LG-LOGO.png" },
  { id: "brand-hitachi", name: "Hitachi", slug: "hitachi", logo: "/Hitachi-AC-logo.png" },
  { id: "brand-samsung", name: "Samsung", slug: "samsung", logo: "/samsung-logo.png" },
];

export function getBrandBySlug(slug: string) {
  return brands.find((b) => b.slug === slug);
}

export function getBrandById(id: string) {
  return brands.find((b) => b.id === id);
}
