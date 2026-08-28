export type Category = {
  id: string;
  name: string;
  slug: string;
  fromPrice: number;
  image?: string;
};

export type Brand = {
  id: string;
  name: string;
  slug: string;
  logo?: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  brandId: string;
  categoryId: string;
  capacityBTU: number;
  capacityHP: number;
  energyRating: string;
  acType: "inverter" | "non-inverter" | "dual-inverter";
  refrigerant: string;
  price: number;
  discountPrice?: number;
  warrantyParts: string;
  warrantyCompressor: string;
  recommendedRoomSize: string;
  images: string[];
  stock: number;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNew?: boolean;
  rating: number;
  reviewCount: number;
  soldThisYear?: number;
  installationFee: number;
  requiresSiteSurvey: boolean;
  description: string;
  specs: {
    coolingCapacity: string;
    compressor: string;
    noiseLevel: string;
    powerSupply: string;
    annualPowerConsumption: string;
    indoorUnitDimensions: string;
  };
};

export type Testimonial = {
  id: string;
  customerName: string;
  rating: number;
  quote: string;
};

export type ServiceType = {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
};

export type CartInstallation = {
  selected: boolean;
  fee: number;
  requiresSiteSurvey: boolean;
};

export type CartItem = {
  productId: string;
  name: string;
  slug: string;
  brand: string;
  qty: number;
  price: number;
  image: string;
  spec: string;
  installation: CartInstallation;
};
