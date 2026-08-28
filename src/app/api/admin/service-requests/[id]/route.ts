import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") return null;
  return session;
}

// PATCH /api/admin/service-requests/[id] - update status
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: "status is required" }, { status: 400 });
    }

    const request = await prisma.serviceRequest.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(request);
  } catch (error) {
    console.error("Failed to update service request:", error);
    return NextResponse.json({ error: "Failed to update service request" }, { status: 500 });
  }
}
