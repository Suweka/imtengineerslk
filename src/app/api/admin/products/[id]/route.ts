import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") return null;
  return session;
}

// PUT /api/admin/products/[id] - update product
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const body = await req.json();
    const {
      name, brandId, categoryId, capacityBTU, capacityHP, energyRating, acType,
      refrigerant, price, discountPrice, warrantyParts, warrantyCompressor,
      recommendedRoomSize, images, stock, isFeatured, isBestSeller, isNew,
      installationFee, requiresSiteSurvey, description,
    } = body;

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(brandId !== undefined && { brandId }),
        ...(categoryId !== undefined && { categoryId }),
        ...(capacityBTU !== undefined && { capacityBTU }),
        ...(capacityHP !== undefined && { capacityHP }),
        ...(energyRating !== undefined && { energyRating }),
        ...(acType !== undefined && { acType }),
        ...(refrigerant !== undefined && { refrigerant }),
        ...(price !== undefined && { price }),
        ...(discountPrice !== undefined && { discountPrice }),
        ...(warrantyParts !== undefined && { warrantyParts }),
        ...(warrantyCompressor !== undefined && { warrantyCompressor }),
        ...(recommendedRoomSize !== undefined && { recommendedRoomSize }),
        ...(images !== undefined && { images }),
        ...(stock !== undefined && { stock }),
        ...(isFeatured !== undefined && { isFeatured }),
        ...(isBestSeller !== undefined && { isBestSeller }),
        ...(isNew !== undefined && { isNew }),
        ...(installationFee !== undefined && { installationFee }),
        ...(requiresSiteSurvey !== undefined && { requiresSiteSurvey }),
        ...(description !== undefined && { description }),
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Failed to update product:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

// DELETE /api/admin/products/[id] - delete product
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    await prisma.productImage.deleteMany({ where: { productId: id } });
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete product:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
