import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") return null;
  return session;
}

// GET /api/admin/settings - fetch the singleton site settings row
export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

// PATCH /api/admin/settings - update the singleton site settings row
export async function PATCH(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const {
      phone, whatsapp, email, headOfficeAddress, engineeringDeptAddress,
      businessHours, socialLinks, freeDeliveryThreshold, logoUrl,
    } = body;

    const settings = await prisma.siteSettings.upsert({
      where: { id: 1 },
      update: {
        ...(phone !== undefined && { phone }),
        ...(whatsapp !== undefined && { whatsapp }),
        ...(email !== undefined && { email }),
        ...(headOfficeAddress !== undefined && { headOfficeAddress }),
        ...(engineeringDeptAddress !== undefined && { engineeringDeptAddress }),
        ...(businessHours !== undefined && { businessHours }),
        ...(socialLinks !== undefined && { socialLinks }),
        ...(freeDeliveryThreshold !== undefined && { freeDeliveryThreshold }),
        ...(logoUrl !== undefined && { logoUrl }),
      },
      create: {
        id: 1,
        phone: phone ?? "",
        whatsapp: whatsapp ?? "",
        email: email ?? "",
        headOfficeAddress: headOfficeAddress ?? "",
        engineeringDeptAddress: engineeringDeptAddress ?? "",
        businessHours: businessHours ?? {},
        socialLinks: socialLinks ?? {},
        freeDeliveryThreshold: freeDeliveryThreshold ?? 0,
        logoUrl: logoUrl ?? null,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Failed to update settings:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
