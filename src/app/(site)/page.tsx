import { Hero } from "@/components/home/Hero";
import { ValueProps } from "@/components/home/ValueProps";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { RoomSizeWidget } from "@/components/home/RoomSizeWidget";
import { BestSellers } from "@/components/home/BestSellers";
import { InstallationBand } from "@/components/home/InstallationBand";
import { BrandStrip } from "@/components/home/BrandStrip";
import { Testimonials } from "@/components/home/Testimonials";
import { InfoBar, secureItems, trustItems } from "@/components/home/InfoBar";
import { getHomeHeroContent } from "@/lib/page-content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const heroContent = await getHomeHeroContent();

  return (
    <>
      <Hero content={heroContent} />
      <ValueProps valueProps={heroContent.valueProps} />
      <CategoryGrid />
      <RoomSizeWidget />
      <InfoBar items={secureItems} tone="dark" />
      <BestSellers />
      <InstallationBand />
      <BrandStrip />
      <InfoBar items={trustItems} tone="light" />
      <Testimonials />
    </>
  );
}
