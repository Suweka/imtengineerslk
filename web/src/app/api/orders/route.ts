import { prisma } from "@/lib/prisma";
import { sendOrderNotification } from "@/lib/whatsapp";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const orderNumber = `IMT-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
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
