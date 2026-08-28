import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") return null;
  return session;
}

// GET /api/admin/products - fetch all products
export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// POST /api/admin/products - create product
export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const {
      name, brandId, categoryId, capacityBTU, capacityHP, energyRating, acType,
      refrigerant, price, discountPrice, warrantyParts, warrantyCompressor,
      recommendedRoomSize, images, stock, isFeatured, isBestSeller, isNew,
      installationFee, requiresSiteSurvey, description,
    } = body;

    if (!name || !brandId || !categoryId || price === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        brandId,
        categoryId,
        capacityBTU: capacityBTU ?? 0,
        capacityHP: capacityHP ?? 0,
        energyRating: energyRating ?? "",
        acType: acType ?? "inverter",
        refrigerant: refrigerant ?? null,
        price,
        discountPrice: discountPrice ?? null,
        warrantyParts: warrantyParts ?? "",
        warrantyCompressor: warrantyCompressor ?? "",
        recommendedRoomSize: recommendedRoomSize ?? null,
        images: images ?? [],
        stock: stock ?? 0,
        isFeatured: isFeatured ?? false,
        isBestSeller: isBestSeller ?? false,
        isNew: isNew ?? false,
        installationFee: installationFee ?? 0,
        requiresSiteSurvey: requiresSiteSurvey ?? false,
        description: description ?? "",
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Failed to create product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
