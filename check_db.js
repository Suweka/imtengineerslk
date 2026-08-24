require("dotenv").config({ path: ".env.local" });
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // Check categories
  const categories = await prisma.category.findMany();
  console.log("=== CATEGORIES ===");
  categories.forEach(c => console.log(`${c.id}: ${c.name} (slug: ${c.slug})`));

  // Check split AC products
  const splitProducts = await prisma.product.findMany({
    where: { categoryId: "cat-split" },
  });
  console.log(`\n=== SPLIT AC PRODUCTS: ${splitProducts.length} found ===`);
  splitProducts.forEach(p => console.log(`- ${p.name} (LKR ${p.price})`));
}

main()
  .catch(e => console.error(e))
  .finally(() => process.exit(0));
