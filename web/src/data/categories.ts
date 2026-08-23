import { Category } from "@/lib/types";

export const categories: Category[] = [
  { id: "cat-split", name: "Split Air Conditioners", slug: "split", fromPrice: 89900 },
  { id: "cat-cassette", name: "Cassette Air Conditioners", slug: "cassette", fromPrice: 199900 },
  { id: "cat-ducted", name: "Ducted Air Conditioners", slug: "ducted", fromPrice: 249900 },
  { id: "cat-floor-standing", name: "Floor Standing Units", slug: "floor-standing", fromPrice: 154900 },
  { id: "cat-portable", name: "Portable Air Conditioners", slug: "portable", fromPrice: 69900 },
];

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug);
}
