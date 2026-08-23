import { prisma } from "@/lib/prisma";
import { sendOrderNotification } from "@/lib/whatsapp";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) return Response.json({ error: "Order not found" }, { status: 404 });

    const whatsappStatus = await sendOrderNotification(order);
    await prisma.order.update({
      where: { id },
      data: { whatsappStatus },
    });

    return Response.json({ whatsappStatus });
  } catch (error) {
    console.error("WhatsApp retry failed:", error);
    return Response.json({ error: "Retry failed" }, { status: 500 });
  }
}
