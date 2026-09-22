import { prisma } from "@/lib/prisma";
import { sendServiceRequestNotification } from "@/lib/callmebot";
import { sendServiceRequestOwnerAlert } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.type || typeof body.type !== "string") {
      return Response.json({ error: "type is required" }, { status: 400 });
    }
    if (!body.customerName || typeof body.customerName !== "string") {
      return Response.json({ error: "customerName is required" }, { status: 400 });
    }
    if (!body.phone || typeof body.phone !== "string") {
      return Response.json({ error: "phone is required" }, { status: 400 });
    }
    if (!body.address || typeof body.address !== "string") {
      return Response.json({ error: "address is required" }, { status: 400 });
    }

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
    await sendServiceRequestOwnerAlert(serviceRequest);
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
