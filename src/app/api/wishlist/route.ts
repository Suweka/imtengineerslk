import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireCustomer() {
  const session = await getServerSession(authOptions);
  if (!session) return null;
  return session;
}

// GET /api/wishlist - list the logged-in customer's wishlist product IDs
export async function GET() {
  const session = await requireCustomer();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const items = await prisma.wishlist.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(items.map((i) => i.productId));
}

// POST /api/wishlist - add a product to the wishlist { productId }
export async function POST(req: NextRequest) {
  const session = await requireCustomer();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId } = await req.json();
  if (!productId) return NextResponse.json({ error: "productId is required" }, { status: 400 });

  await prisma.wishlist.upsert({
    where: { userId_productId: { userId: session.user.id, productId } },
    update: {},
    create: { userId: session.user.id, productId },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}

// DELETE /api/wishlist?productId=... - remove a product from the wishlist
export async function DELETE(req: NextRequest) {
  const session = await requireCustomer();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const productId = req.nextUrl.searchParams.get("productId");
  if (!productId) return NextResponse.json({ error: "productId is required" }, { status: 400 });

  await prisma.wishlist.deleteMany({ where: { userId: session.user.id, productId } });

  return NextResponse.json({ ok: true });
}
