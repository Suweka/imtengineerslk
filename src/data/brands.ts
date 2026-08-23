import { Brand } from "@/lib/types";

// NOTE: brand list is placeholder/draft content — confirm final list with client before launch.
export const brands: Brand[] = [
  { id: "brand-daikin", name: "Daikin", slug: "daikin" },
  { id: "brand-midea", name: "Midea", slug: "midea" },
  { id: "brand-panasonic", name: "Panasonic", slug: "panasonic" },
  { id: "brand-lg", name: "LG", slug: "lg" },
  { id: "brand-hitachi", name: "Hitachi", slug: "hitachi" },
  { id: "brand-samsung", name: "Samsung", slug: "samsung" },
];

export function getBrandBySlug(slug: string) {
  return brands.find((b) => b.slug === slug);
}

export function getBrandById(id: string) {
  return brands.find((b) => b.id === id);
}
