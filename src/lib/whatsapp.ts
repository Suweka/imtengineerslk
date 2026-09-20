import { Order, ServiceRequest } from "@prisma/client";
import { CartItem } from "@/lib/types";

const API_VERSION = "v20.0";
const BASE_URL = `https://graph.facebook.com/${API_VERSION}`;

function summarizeItems(order: Order) {
  const items = order.items as unknown as CartItem[];

  const productLines = items
    .map((item) => `${item.qty}x ${item.brand} ${item.name} (${item.spec}) - LKR ${item.price.toLocaleString()}`)
    .join(", ");

  const installLines = items.filter((item) => item.installation.selected);
  const servicesText =
    installLines.length > 0
      ? installLines.map((item) => `Installation for ${item.name}`).join(", ")
      : "None requested";

  return { productLines, servicesText };
}

export async function sendOrderNotification(order: Order) {
  if (!process.env.WHATSAPP_API_TOKEN || !process.env.WHATSAPP_PHONE_NUMBER_ID) {
    console.warn("WhatsApp credentials not configured");
    return "skipped";
  }

  try {
    const phone = process.env.IMT_NOTIFY_NUMBER || "94766653639";
    const templateName = process.env.WHATSAPP_ORDER_TEMPLATE || "order_confirmation";
    const { productLines, servicesText } = summarizeItems(order);

    const res = await fetch(
      `${BASE_URL}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: phone,
          type: "template",
          template: {
            name: templateName,
            language: { code: "en" },
            components: [
              {
                type: "body",
                parameters: [
                  { type: "text", text: order.customerName },
                  { type: "text", text: order.orderNumber },
                  { type: "text", text: productLines },
                  { type: "text", text: `LKR ${order.total}` },
                  { type: "text", text: order.fulfillment === "delivery" ? "Home Delivery" : "Showroom Pickup" },
                  { type: "text", text: servicesText },
                  { type: "text", text: order.phone },
                ],
              },
            ],
          },
        }),
      }
    );

    if (!res.ok) {
      const error = await res.text();
      console.error("WhatsApp send failed:", error);
      return "failed";
    }

    console.log(`WhatsApp notification sent for order ${order.orderNumber}`);
    return "sent";
  } catch (err) {
    console.error("WhatsApp send error:", err);
    return "failed";
  }
}

export async function sendServiceRequestNotification(req: ServiceRequest) {
  if (!process.env.WHATSAPP_API_TOKEN || !process.env.WHATSAPP_PHONE_NUMBER_ID) {
    console.warn("WhatsApp credentials not configured");
    return "skipped";
  }

  try {
    const phone = process.env.IMT_NOTIFY_NUMBER || "94766653639";
    const templateName = process.env.WHATSAPP_SERVICE_TEMPLATE || "service_request_confirmation";

    const res = await fetch(
      `${BASE_URL}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: phone,
          type: "template",
          template: {
            name: templateName,
            language: { code: "en" },
            components: [
              {
                type: "body",
                parameters: [
                  { type: "text", text: req.customerName },
                  { type: "text", text: req.id },
                  { type: "text", text: req.preferredDate?.toISOString().split("T")[0] || "Not specified" },
                  { type: "text", text: req.type },
                ],
              },
            ],
          },
        }),
      }
    );

    if (!res.ok) {
      const error = await res.text();
      console.error("WhatsApp send failed:", error);
      return "failed";
    }

    console.log(`WhatsApp notification sent for service request ${req.id}`);
    return "sent";
  } catch (err) {
    console.error("WhatsApp send error:", err);
    return "failed";
  }
}
