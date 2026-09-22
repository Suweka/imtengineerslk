import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendOrderNotification } from "@/lib/callmebot";
import { sendOrderOwnerAlert } from "@/lib/email";

const validFulfillments = ["delivery", "showroom-pickup"];

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return Response.json({ error: "items is required" }, { status: 400 });
    }
    if (typeof body.subtotal !== "number" || typeof body.total !== "number") {
      return Response.json({ error: "subtotal and total are required" }, { status: 400 });
    }
    if (!validFulfillments.includes(body.fulfillment)) {
      return Response.json({ error: "fulfillment must be 'delivery' or 'showroom-pickup'" }, { status: 400 });
    }
    if (!body.customerName || typeof body.customerName !== "string") {
      return Response.json({ error: "customerName is required" }, { status: 400 });
    }
    if (!body.phone || typeof body.phone !== "string") {
      return Response.json({ error: "phone is required" }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    const userId = session?.user?.role === "customer" ? session.user.id : undefined;

    const orderNumber = `IMT-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        items: body.items,
        subtotal: body.subtotal,
        installationTotal: body.installationTotal,
        total: body.total,
        deliveryFee: body.deliveryFee,
        fulfillment: body.fulfillment,
        customerName: body.customerName,
        phone: body.phone,
        email: body.email,
        nicNumber: body.nicNumber,
        address: body.address,
        city: body.city,
        district: body.district,
        preferredInstallDate: body.preferredInstallDate ? new Date(body.preferredInstallDate) : null,
        notes: body.notes,
      },
    });

    const whatsappStatus = await sendOrderNotification(order);
    await sendOrderOwnerAlert(order);
    await prisma.order.update({
      where: { id: order.id },
      data: { whatsappStatus },
    });

    return Response.json({ id: order.id, orderNumber: order.orderNumber });
  } catch (error) {
    console.error("Order creation failed:", error);
    return Response.json({ error: "Failed to create order" }, { status: 500 });
  }
}
