import { prisma } from "@/lib/prisma";
import { Product } from "@/lib/types";
import { brands } from "@/data/brands";
import type { Product as PrismaProduct } from "@prisma/client";

const brandPriority = new Map(brands.map((b, i) => [b.id, i]));
function brandRank(brandId: string) {
  return brandPriority.get(brandId) ?? brands.length;
}

// Default display order across the storefront: Panasonic/LG first,
// then Hisense/TCL/Sharp, then Midea/Teco/Daikin (per brands.ts order),
// then by capacity within a brand.
function sortByBrandPriority(products: Product[]): Product[] {
  return [...products].sort(
    (a, b) => brandRank(a.brandId) - brandRank(b.brandId) || a.capacityHP - b.capacityHP
  );
}

function toStorefrontProduct(p: PrismaProduct): Product {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    brandId: p.brandId,
    categoryId: p.categoryId,
    capacityBTU: p.capacityBTU,
    capacityHP: p.capacityHP,
    energyRating: p.energyRating,
    acType: p.acType as Product["acType"],
    refrigerant: p.refrigerant ?? "",
    price: Number(p.price),
    discountPrice: p.discountPrice ? Number(p.discountPrice) : undefined,
    warrantyParts: p.warrantyParts,
    warrantyCompressor: p.warrantyCompressor,
    recommendedRoomSize: p.recommendedRoomSize ?? "",
    images: p.images,
    stock: p.stock,
    isFeatured: p.isFeatured,
    isBestSeller: p.isBestSeller,
    isNew: p.isNew,
    // Reviews aren't collected yet — the storefront's rating UI renders
    // fine with zeros until a real review system exists.
    rating: 0,
    reviewCount: 0,
    soldThisYear: undefined,
    installationFee: Number(p.installationFee),
    requiresSiteSurvey: p.requiresSiteSurvey,
    description: p.description,
    specs: {
      coolingCapacity: `${p.capacityBTU.toLocaleString()} BTU/hr`,
      compressor: p.acType === "inverter" || p.acType === "dual-inverter" ? "Inverter" : "Non-inverter",
      noiseLevel: "-",
      powerSupply: "230V / 50Hz single phase",
      annualPowerConsumption: "-",
      indoorUnitDimensions: "-",
    },
  };
}

export async function getAllProducts(): Promise<Product[]> {
  const rows = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  return sortByBrandPriority(rows.map(toStorefrontProduct));
}

export async function getProductBySlugDb(slug: string): Promise<Product | null> {
  const row = await prisma.product.findUnique({ where: { slug } });
  return row ? toStorefrontProduct(row) : null;
}

export async function getProductsByCategoryDb(categoryId: string): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { categoryId },
    orderBy: { createdAt: "desc" },
  });
  return sortByBrandPriority(rows.map(toStorefrontProduct));
}

export async function getBestSellersDb(): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { isFeatured: true },
    orderBy: { createdAt: "desc" },
  });
  return sortByBrandPriority(rows.map(toStorefrontProduct));
}

export async function getSiblingProductsDb(product: Product): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { brandId: product.brandId, categoryId: product.categoryId, acType: product.acType },
    orderBy: { capacityHP: "asc" },
  });
  return rows.map(toStorefrontProduct);
}

export async function getRelatedProductsDb(product: Product, count = 4): Promise<Product[]> {
  const sameCategory = await prisma.product.findMany({
    where: { categoryId: product.categoryId, id: { not: product.id } },
    take: count,
  });
  if (sameCategory.length >= count) return sameCategory.map(toStorefrontProduct);

  const remaining = count - sameCategory.length;
  const others = await prisma.product.findMany({
    where: { categoryId: { not: product.categoryId }, id: { not: product.id } },
    take: remaining,
  });
  return [...sameCategory, ...others].map(toStorefrontProduct);
}
