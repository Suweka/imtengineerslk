import { Product } from "@/lib/types";

type PriceRow = {
  brandId: string;
  brandLabel: string;
  origin: string;
  inverter?: number;
  nonInverter?: number;
};

type BtuTier = {
  btu: number;
  hp: number;
  roomSize: string;
  rows: PriceRow[];
};

// Sourced from the August 2026 IMT Engineers price list.
const tiers: BtuTier[] = [
  {
    btu: 9000,
    hp: 1.0,
    roomSize: "100-130 sq ft",
    rows: [
      { brandId: "brand-panasonic", brandLabel: "Panasonic", origin: "Malaysia", inverter: 245000, nonInverter: 235000 },
      { brandId: "brand-lg", brandLabel: "LG", origin: "Thailand", inverter: 210000 },
      { brandId: "brand-hisense", brandLabel: "Hisense", origin: "China", inverter: 165000 },
      { brandId: "brand-tcl", brandLabel: "TCL", origin: "China", inverter: 160000, nonInverter: 145000 },
      { brandId: "brand-midea", brandLabel: "Midea", origin: "China", inverter: 175000, nonInverter: 160000 },
      { brandId: "brand-daikin", brandLabel: "Daikin", origin: "China", inverter: 175000, nonInverter: 145000 },
      { brandId: "brand-teco", brandLabel: "Teco", origin: "China", inverter: 148000, nonInverter: 135000 },
    ],
  },
  {
    btu: 12000,
    hp: 1.5,
    roomSize: "150-190 sq ft",
    rows: [
      { brandId: "brand-panasonic", brandLabel: "Panasonic", origin: "Malaysia", inverter: 255000, nonInverter: 245000 },
      { brandId: "brand-lg", brandLabel: "LG", origin: "Thailand", inverter: 240000 },
      { brandId: "brand-hisense", brandLabel: "Hisense", origin: "China", inverter: 175000, nonInverter: 165000 },
      { brandId: "brand-sharp", brandLabel: "Sharp", origin: "China", inverter: 165000, nonInverter: 155000 },
      { brandId: "brand-tcl", brandLabel: "TCL", origin: "China", inverter: 165000, nonInverter: 155000 },
      { brandId: "brand-midea", brandLabel: "Midea", origin: "China", inverter: 195000, nonInverter: 175000 },
      { brandId: "brand-daikin", brandLabel: "Daikin", origin: "China", inverter: 198000, nonInverter: 185000 },
      { brandId: "brand-teco", brandLabel: "Teco", origin: "China", inverter: 172000, nonInverter: 155000 },
    ],
  },
  {
    btu: 18000,
    hp: 2.0,
    roomSize: "220-260 sq ft",
    rows: [
      { brandId: "brand-panasonic", brandLabel: "Panasonic", origin: "Malaysia", inverter: 329000, nonInverter: 298000 },
      { brandId: "brand-lg", brandLabel: "LG", origin: "Thailand", inverter: 295000 },
      { brandId: "brand-hisense", brandLabel: "Hisense", origin: "China", inverter: 230000, nonInverter: 210000 },
      { brandId: "brand-sharp", brandLabel: "Sharp", origin: "China", inverter: 230000, nonInverter: 210000 },
      { brandId: "brand-tcl", brandLabel: "TCL", origin: "China", inverter: 230000, nonInverter: 210000 },
      { brandId: "brand-midea", brandLabel: "Midea", origin: "China", inverter: 240000, nonInverter: 230000 },
      { brandId: "brand-daikin", brandLabel: "Daikin", origin: "China", inverter: 245000, nonInverter: 220000 },
      { brandId: "brand-teco", brandLabel: "Teco", origin: "China", inverter: 235000, nonInverter: 210000 },
    ],
  },
  {
    btu: 24000,
    hp: 2.5,
    roomSize: "280-330 sq ft",
    rows: [
      { brandId: "brand-panasonic", brandLabel: "Panasonic", origin: "Malaysia", inverter: 399000, nonInverter: 375000 },
      { brandId: "brand-lg", brandLabel: "LG", origin: "Thailand", inverter: 340000 },
      { brandId: "brand-hisense", brandLabel: "Hisense", origin: "China", inverter: 275000, nonInverter: 255000 },
      { brandId: "brand-sharp", brandLabel: "Sharp", origin: "China", inverter: 265000, nonInverter: 255000 },
      { brandId: "brand-tcl", brandLabel: "TCL", origin: "China", inverter: 265000, nonInverter: 255000 },
      { brandId: "brand-midea", brandLabel: "Midea", origin: "China", inverter: 280000, nonInverter: 270000 },
      { brandId: "brand-daikin", brandLabel: "Daikin", origin: "China", inverter: 298000, nonInverter: 255000 },
      { brandId: "brand-teco", brandLabel: "Teco", origin: "China", inverter: 260000, nonInverter: 255000 },
    ],
  },
];

function warrantyFor(origin: string): { parts: string; compressor: string } {
  if (origin === "Malaysia" || origin === "Thailand") {
    return { parts: "2 years full set", compressor: "10 years compressor" };
  }
  // China-made units: 10yr compressor for home use, 5yr for hotel/shop/office use.
  return { parts: "2 years full set", compressor: "10 years compressor (home) / 5 years (commercial)" };
}

function slugify(...parts: (string | number)[]) {
  return parts
    .join("-")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function buildProducts(): Product[] {
  const list: Product[] = [];

  for (const tier of tiers) {
    for (const row of tier.rows) {
      const variants: { acType: Product["acType"]; price: number }[] = [];
      if (row.inverter) variants.push({ acType: "inverter", price: row.inverter });
      if (row.nonInverter) variants.push({ acType: "non-inverter", price: row.nonInverter });

      for (const variant of variants) {
        const warranty = warrantyFor(row.origin);
        const typeLabel = variant.acType === "inverter" ? "Inverter" : "Non-Inverter";
        const name = `${row.brandLabel} ${tier.hp}HP ${typeLabel} Split AC`;

        list.push({
          id: slugify("prod", row.brandId.replace("brand-", ""), tier.btu, variant.acType),
          slug: slugify(row.brandLabel, tier.hp, "hp", typeLabel, "split-ac"),
          name,
          brandId: row.brandId,
          categoryId: "cat-split",
          capacityBTU: tier.btu,
          capacityHP: tier.hp,
          energyRating: variant.acType === "inverter" ? "5 star" : "3 star",
          acType: variant.acType,
          refrigerant: "R32",
          price: variant.price,
          warrantyParts: warranty.parts,
          warrantyCompressor: warranty.compressor,
          recommendedRoomSize: tier.roomSize,
          images: [],
          stock: 10,
          isFeatured: variant.acType === "inverter" && tier.btu === 12000,
          isBestSeller: false,
          rating: 4,
          reviewCount: 0,
          soldThisYear: 0,
          installationFee: 0,
          requiresSiteSurvey: false,
          description: `${row.brandLabel} ${tier.hp}HP ${typeLabel.toLowerCase()} split air conditioner (${row.origin}-made). Free installation included: 3m copper piping, transport, 3 free services, and outdoor bracket. ${warranty.compressor}, ${warranty.parts}.`,
          specs: {
            coolingCapacity: `${tier.btu.toLocaleString()} BTU/hr`,
            compressor: variant.acType === "inverter" ? "Inverter" : "Non-inverter",
            noiseLevel: variant.acType === "inverter" ? "19-42 dB" : "38-48 dB",
            powerSupply: "230V / 50Hz single phase",
            annualPowerConsumption: "-",
            indoorUnitDimensions: "-",
          },
        });
      }
    }
  }

  return list;
}

export const products: Product[] = buildProducts();

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categoryId: string) {
  return products.filter((p) => p.categoryId === categoryId);
}

export function getBestSellers() {
  return products.filter((p) => p.isFeatured);
}

export function getRelatedProducts(product: Product, count = 4) {
  return products
    .filter((p) => p.id !== product.id && p.categoryId === product.categoryId)
    .slice(0, count)
    .concat(products.filter((p) => p.id !== product.id && p.categoryId !== product.categoryId))
    .slice(0, count);
}
