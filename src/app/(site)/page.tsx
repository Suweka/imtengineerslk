import { Hero } from "@/components/home/Hero";
import { ValueProps } from "@/components/home/ValueProps";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { RoomSizeWidget } from "@/components/home/RoomSizeWidget";
import { BestSellers } from "@/components/home/BestSellers";
import { InstallationBand } from "@/components/home/InstallationBand";
import { BrandStrip } from "@/components/home/BrandStrip";
import { Testimonials } from "@/components/home/Testimonials";
import { InfoBar, secureItems, trustItems } from "@/components/home/InfoBar";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <Hero />
      <ValueProps />
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
