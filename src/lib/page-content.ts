import { prisma } from "@/lib/prisma";
import { homeHeroDefault, pageContentDefaults, HomeHeroContent } from "@/lib/page-content-defaults";

export type { HomeHeroContent };
export { homeHeroDefault, pageContentDefaults };

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
