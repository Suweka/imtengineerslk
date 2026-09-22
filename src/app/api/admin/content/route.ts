import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") return null;
  return session;
}

// GET /api/admin/content - fetch all page content blocks
export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const pages = await prisma.pageContent.findMany();
    return NextResponse.json(pages);
  } catch (error) {
    console.error("Failed to fetch content:", error);
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}

// PUT /api/admin/content - upsert a single page content block by pageKey
export async function PUT(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { pageKey, title, body: pageBody } = body;

    if (!pageKey || typeof pageBody !== "string") {
      return NextResponse.json({ error: "pageKey and body are required" }, { status: 400 });
    }

    const page = await prisma.pageContent.upsert({
      where: { pageKey },
      update: { title: title ?? null, body: pageBody },
      create: { pageKey, title: title ?? null, body: pageBody },
    });

    return NextResponse.json(page);
  } catch (error) {
    console.error("Failed to save content:", error);
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 });
  }
}
