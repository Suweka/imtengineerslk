import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") return null;
  return session;
}

// PUT /api/admin/testimonials/[id]
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const body = await req.json();
    const { customerName, rating, quote, isPublished, sortOrder } = body;

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        ...(customerName !== undefined && { customerName }),
        ...(rating !== undefined && { rating }),
        ...(quote !== undefined && { quote }),
        ...(isPublished !== undefined && { isPublished }),
        ...(sortOrder !== undefined && { sortOrder }),
      },
    });

    return NextResponse.json(testimonial);
  } catch (error) {
    console.error("Failed to update testimonial:", error);
    return NextResponse.json({ error: "Failed to update testimonial" }, { status: 500 });
  }
}

// DELETE /api/admin/testimonials/[id]
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    await prisma.testimonial.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete testimonial:", error);
    return NextResponse.json({ error: "Failed to delete testimonial" }, { status: 500 });
  }
}
