import { prisma } from "@/lib/prisma";

export type HomeHeroContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryCta: string;
  secondaryCta: string;
  valueProps: { title: string; subtitle: string }[];
};

export const homeHeroDefault: HomeHeroContent = {
  eyebrow: "Engineering Comfort. Building Trust.",
  title: "Premium Air Conditioners\nfor Your Perfect Comfort",
  subtitle: "Choose from the best brands with energy-efficient cooling, professional installation and reliable after-sales service.",
  primaryCta: "Shop Now",
  secondaryCta: "View Deals",
  valueProps: [
    { title: "Cooling Performance", subtitle: "Powerful & Fast Cooling" },
    { title: "Energy Efficient", subtitle: "Save More on Bills" },
    { title: "Expert Installation", subtitle: "Certified Technicians" },
    { title: "Trusted Brands", subtitle: "100% Genuine Products" },
  ],
};

export const pageContentDefaults: Record<string, { title: string; body: string }> = {
  about: {
    title: "About IMT Engineers",
    body: "IMT Engineers (Pvt) Ltd is committed to building a professional and trusted name in the air-conditioning industry by combining engineering knowledge, quality products, skilled people, disciplined processes and customer-focused service.\n\nOur responsibility does not end when an AC is sold or installed. We believe true service begins with understanding the customer's requirement and continues throughout the equipment's useful life.\n\nOur head office is based in Karandeniya, with an engineering department in Moratuwa serving the greater Colombo area and beyond.",
  },
  installation: {
    title: "Fitted by our own engineers, not a subcontractor.",
    body: "Every unit we sell can be installed by an IMT-certified team, islandwide, within three working days. Annual maintenance contracts keep it running at rated efficiency.",
  },
  "room-size-guide": {
    title: "Room Size Guide",
    body: "Choosing the right capacity keeps your unit running efficiently — undersized units run constantly and wear out faster, while oversized units cool too quickly without properly dehumidifying the room. Use the calculator below, or check the table for a general guide.",
  },
  services: {
    title: "Keep your units running at their best",
    body: "From gas refills to full relocations, our engineers handle it — islandwide.",
  },
};

export async function getPageContent(pageKey: string): Promise<{ title: string; body: string }> {
  const fallback = pageContentDefaults[pageKey] ?? { title: "", body: "" };
  try {
    const row = await prisma.pageContent.findUnique({ where: { pageKey } });
    if (!row) return fallback;
    return { title: row.title ?? fallback.title, body: row.body };
  } catch (error) {
    console.error(`Failed to load page content for "${pageKey}":`, error);
    return fallback;
  }
}

export async function getHomeHeroContent(): Promise<HomeHeroContent> {
  try {
    const row = await prisma.pageContent.findUnique({ where: { pageKey: "home-hero" } });
    if (!row) return homeHeroDefault;
    return { ...homeHeroDefault, ...JSON.parse(row.body) };
  } catch (error) {
    console.error("Failed to load home hero content:", error);
    return homeHeroDefault;
  }
}
