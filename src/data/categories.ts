import { Category } from "@/lib/types";

export const categories: Category[] = [
  { id: "cat-split", name: "Split Air Conditioners", slug: "split", fromPrice: 135000, image: "/category-split.png" },
  { id: "cat-cassette", name: "Cassette Air Conditioners", slug: "cassette", fromPrice: 199900, image: "/category-cassette.png" },
  { id: "cat-ducted", name: "Ducted Air Conditioners", slug: "ducted", fromPrice: 249900, image: "/category-ducted.png" },
  { id: "cat-floor-standing", name: "Floor Standing Units", slug: "floor-standing", fromPrice: 154900, image: "/category-floor-standing.png" },
  { id: "cat-portable", name: "Portable Air Conditioners", slug: "portable", fromPrice: 69900, image: "/category-portable.png" },
];

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug);
}
