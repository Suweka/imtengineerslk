export type ACType = "Inverter" | "Non-inverter" | "Dual inverter";

export type Product = {
  id: string;
  slug: string;
  brand: string;
  name: string;
  price: number;
  was: number;
  reviews: number;
  rating: number;
  hp: number;
  type: ACType;
  roomMin: number;
  roomMax: number;
  energy: 3 | 4 | 5;
  badge?: string;
  badgeColor?: string;
  bestSeller?: boolean;
};

export const PRODUCTS: Product[] = [
  {
    id: "dkn-15-inv", slug: "daikin-1-5hp-inverter-split-ac", brand: "Daikin",
    name: "Daikin 1.5HP Inverter Split AC", price: 149900, was: 159900, reviews: 128, rating: 4.6,
    hp: 1.5, type: "Inverter", roomMin: 150, roomMax: 180, energy: 5,
    badge: "BEST SELLER", badgeColor: "#2FA84F", bestSeller: true,
  },
  {
    id: "pan-15-inv", slug: "panasonic-1-5hp-deluxe-inverter-ac", brand: "Panasonic",
    name: "Panasonic 1.5HP Deluxe Inverter AC", price: 143900, was: 159900, reviews: 96, rating: 4.5,
    hp: 1.5, type: "Inverter", roomMin: 150, roomMax: 180, energy: 5,
    badge: "10% OFF", badgeColor: "#ED1C24", bestSeller: true,
  },
  {
    id: "lg-15-dual", slug: "lg-1-5hp-dual-inverter-ac", brand: "LG",
    name: "LG 1.5HP Dual Inverter AC", price: 139900, was: 147900, reviews: 74, rating: 4.4,
    hp: 1.5, type: "Dual inverter", roomMin: 160, roomMax: 190, energy: 5, bestSeller: true,
  },
  {
    id: "dkn-10-inv", slug: "daikin-1-0hp-inverter-split-ac", brand: "Daikin",
    name: "Daikin 1.0HP Inverter Split AC", price: 119900, was: 125900, reviews: 63, rating: 4.5,
    hp: 1.0, type: "Inverter", roomMin: 100, roomMax: 120, energy: 5,
  },
  {
    id: "mid-15-non", slug: "midea-1-5hp-non-inverter-split-ac", brand: "Midea",
    name: "Midea 1.5HP Non-Inverter Split AC", price: 108900, was: 114900, reviews: 38, rating: 4.1,
    hp: 1.5, type: "Non-inverter", roomMin: 140, roomMax: 170, energy: 3,
    badge: "BUDGET PICK", badgeColor: "#F7941D",
  },
  {
    id: "pan-20-inv", slug: "panasonic-2-0hp-inverter-split-ac", brand: "Panasonic",
    name: "Panasonic 2.0HP Inverter Split AC", price: 186900, was: 199900, reviews: 52, rating: 4.5,
    hp: 2.0, type: "Inverter", roomMin: 200, roomMax: 240, energy: 5,
  },
  {
    id: "lg-20-dual", slug: "lg-2-0hp-dual-inverter-ac", brand: "LG",
    name: "LG 2.0HP Dual Inverter AC", price: 192900, was: 204900, reviews: 44, rating: 4.4,
    hp: 2.0, type: "Dual inverter", roomMin: 210, roomMax: 250, energy: 5,
    badge: "NEW", badgeColor: "#1C75BC",
  },
  {
    id: "dkn-25-inv", slug: "daikin-2-5hp-inverter-split-ac", brand: "Daikin",
    name: "Daikin 2.5HP Inverter Split AC", price: 234900, was: 249900, reviews: 29, rating: 4.6,
    hp: 2.5, type: "Inverter", roomMin: 260, roomMax: 300, energy: 5,
  },
  {
    id: "mid-30-inv", slug: "midea-3-0hp-inverter-split-ac", brand: "Midea",
    name: "Midea 3.0HP Inverter Split AC", price: 262900, was: 274900, reviews: 21, rating: 4.2,
    hp: 3.0, type: "Inverter", roomMin: 310, roomMax: 360, energy: 4,
  },
  {
    id: "mid-20-cas", slug: "midea-2-0hp-cassette-ac", brand: "Midea",
    name: "Midea 2.0HP Cassette AC", price: 199900, was: 209900, reviews: 41, rating: 4.3,
    hp: 2.0, type: "Inverter", roomMin: 220, roomMax: 260, energy: 4,
    badge: "NEW", badgeColor: "#1C75BC", bestSeller: true,
  },
];

export const BEST_SELLERS = PRODUCTS.filter((p) => p.bestSeller);

/* ---- Filter vocabulary, kept next to the data it describes ---- */

export const BRAND_OPTIONS = ["Daikin", "Panasonic", "LG", "Midea"] as const;
export const TYPE_OPTIONS: ACType[] = ["Inverter", "Non-inverter", "Dual inverter"];
export const CAPACITY_OPTIONS = [0.75, 1.0, 1.5, 2.0, 2.5, 3.0];
export const ENERGY_OPTIONS = [5, 4, 3] as const;

export const ROOM_SIZE_OPTIONS = [
  { label: "Up to 120 sq ft", min: 0, max: 120 },
  { label: "120 – 180 sq ft", min: 120, max: 180 },
  { label: "180 – 250 sq ft", min: 180, max: 250 },
  { label: "250 sq ft and above", min: 250, max: Infinity },
];

export const PRICE_BOUNDS = { min: 60000, max: 400000 };

export const SORT_OPTIONS = [
  "Popular",
  "Price, low to high",
  "Price, high to low",
  "Top rated",
  "Newest",
] as const;
export type SortOption = (typeof SORT_OPTIONS)[number];
