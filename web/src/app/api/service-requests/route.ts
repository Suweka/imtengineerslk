import { prisma } from "@/lib/prisma";
import { sendServiceRequestNotification } from "@/lib/whatsapp";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const serviceRequest = await prisma.serviceRequest.create({
      data: {
        type: body.type,
        customerName: body.customerName,
        phone: body.phone,
        address: body.address,
        preferredDate: body.preferredDate ? new Date(body.preferredDate) : null,
      },
    });

    const whatsappStatus = await sendServiceRequestNotification(serviceRequest);
    await prisma.serviceRequest.update({
      where: { id: serviceRequest.id },
      data: { whatsappStatus },
    });

    return Response.json({ id: serviceRequest.id });
  } catch (error) {
    console.error("Service request creation failed:", error);
    return Response.json({ error: "Failed to create service request" }, { status: 500 });
  }
}
