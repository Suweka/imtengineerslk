import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadImage, deleteImage } from "@/lib/storage";
import { removeBackground } from "@/lib/background-removal";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") return null;
  return session;
}

async function syncProductImages(productId: string) {
  const images = await prisma.productImage.findMany({
    where: { productId },
    orderBy: { sortOrder: "asc" },
  });
  const urls = images.map((img) => img.processedUrl ?? img.originalUrl);
  await prisma.product.update({ where: { id: productId }, data: { images: urls } });
}

async function processBackgroundRemoval(imageId: string, source: string | Buffer) {
  try {
    const buffer = await removeBackground(source);
    const processedUrl = await uploadImage(buffer, `${imageId}-processed`);
    return prisma.productImage.update({
      where: { id: imageId },
      data: { processedUrl, status: "processed" },
    });
  } catch (err) {
    console.error("Background removal failed for image", imageId, err);
    return prisma.productImage.update({
      where: { id: imageId },
      data: { status: "failed" },
    });
  }
}

// POST: new upload (multipart "file") or retry (JSON { imageId })
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: productId } = await params;
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  const contentType = req.headers.get("content-type") ?? "";

  // Retry path: re-run background removal on an existing image's original file.
  if (contentType.includes("application/json")) {
    const body = await req.json();
    const imageId = body.imageId as string | undefined;
    if (!imageId) return NextResponse.json({ error: "imageId is required for retry" }, { status: 400 });

    const existing = await prisma.productImage.findUnique({ where: { id: imageId } });
    if (!existing || existing.productId !== productId) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    await prisma.productImage.update({ where: { id: imageId }, data: { status: "pending" } });
    const updated = await processBackgroundRemoval(imageId, existing.originalUrl);
    await syncProductImages(productId);
    return NextResponse.json(updated);
  }

  // New upload path.
  const formData = await req.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file is required" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const count = await prisma.productImage.count({ where: { productId } });

  let originalUrl: string;
  try {
    originalUrl = await uploadImage(buffer);
  } catch (err) {
    console.error("Original image upload failed", err);
    return NextResponse.json({ error: "Failed to store the uploaded image" }, { status: 500 });
  }

  const created = await prisma.productImage.create({
    data: { productId, originalUrl, status: "pending", sortOrder: count },
  });

  const updated = await processBackgroundRemoval(created.id, buffer);
  await syncProductImages(productId);

  return NextResponse.json(updated);
}

// DELETE: remove an image (and its Cloudinary assets) so no orphaned rows/files remain.
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: productId } = await params;
  const { searchParams } = new URL(req.url);
  const imageId = searchParams.get("imageId");
  if (!imageId) return NextResponse.json({ error: "imageId is required" }, { status: 400 });

  const existing = await prisma.productImage.findUnique({ where: { id: imageId } });
  if (!existing || existing.productId !== productId) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }

  await Promise.all([
    deleteImage(existing.originalUrl),
    existing.processedUrl ? deleteImage(existing.processedUrl) : Promise.resolve(),
  ]);
  await prisma.productImage.delete({ where: { id: imageId } });
  await syncProductImages(productId);

  return NextResponse.json({ ok: true });
}

// GET: list a product's images (used to hydrate the admin uploader on load).
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: productId } = await params;
  const images = await prisma.productImage.findMany({
    where: { productId },
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(images);
}
