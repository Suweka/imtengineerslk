import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { brands } from "../src/data/brands";
import { categories } from "../src/data/categories";
import { products } from "../src/data/products";
import { testimonials, siteSettings } from "../src/data/testimonials";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding brands...");
  for (const b of brands) {
    await prisma.brand.upsert({
      where: { id: b.id },
      update: { logoUrl: b.logo ?? null },
      create: { id: b.id, name: b.name, slug: b.slug, logoUrl: b.logo ?? null },
    });
  }

  console.log("Seeding categories...");
  for (const c of categories) {
    await prisma.category.upsert({
      where: { id: c.id },
      update: {},
      create: { id: c.id, name: c.name, slug: c.slug, fromPrice: c.fromPrice },
    });
  }

  console.log("Seeding products...");
  for (const p of products) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: {},
      create: {
        id: p.id,
        slug: p.slug,
        name: p.name,
        brandId: p.brandId,
        categoryId: p.categoryId,
        capacityBTU: p.capacityBTU,
        capacityHP: p.capacityHP,
        energyRating: p.energyRating,
        acType: p.acType,
        refrigerant: p.refrigerant,
        price: p.price,
        discountPrice: p.discountPrice,
        warrantyParts: p.warrantyParts,
        warrantyCompressor: p.warrantyCompressor,
        recommendedRoomSize: p.recommendedRoomSize,
        images: p.images,
        stock: p.stock,
        isFeatured: p.isFeatured,
        isBestSeller: p.isBestSeller,
        isNew: p.isNew ?? false,
        installationFee: p.installationFee,
        requiresSiteSurvey: p.requiresSiteSurvey,
        description: p.description,
      },
    });
  }

  console.log("Seeding testimonials...");
  for (const [i, t] of testimonials.entries()) {
    await prisma.testimonial.upsert({
      where: { id: t.id },
      update: {},
      create: {
        id: t.id,
        customerName: t.customerName,
        rating: t.rating,
        quote: t.quote,
        isPublished: true,
        sortOrder: i,
      },
    });
  }

  console.log("Seeding site settings...");
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      phone: siteSettings.phone,
      whatsapp: siteSettings.whatsapp,
      email: siteSettings.email,
      headOfficeAddress: siteSettings.headOfficeAddress,
      engineeringDeptAddress: siteSettings.engineeringDeptAddress,
      businessHours: siteSettings.businessHours,
      socialLinks: {},
      freeDeliveryThreshold: siteSettings.freeDeliveryThreshold,
    },
  });

  console.log("Seeding page content...");
  const pages = [
    { pageKey: "about", title: "About IMT Engineers", body: "IMT Engineers (Pvt) Ltd has been selling, installing and servicing domestic and central air conditioners across Sri Lanka since 2006." },
    { pageKey: "installation", title: "Fitted by our own engineers, not a subcontractor.", body: "Every unit we sell can be installed by an IMT-certified team, islandwide, within three working days." },
    { pageKey: "room-size-guide", title: "Room Size Guide", body: "Choosing the right capacity keeps your unit running efficiently." },
    { pageKey: "services", title: "Keep your units running at their best", body: "From gas refills to full relocations, our engineers handle it — islandwide." },
  ];
  for (const page of pages) {
    await prisma.pageContent.upsert({
      where: { pageKey: page.pageKey },
      update: {},
      create: page,
    });
  }

  console.log("Seeding admin user...");
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@imtengineers.lk";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "changeme123";
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, passwordHash, role: "admin" },
  });
  console.log(`Admin user ready: ${adminEmail} (password: ${adminPassword} — change this after first login)`);

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
