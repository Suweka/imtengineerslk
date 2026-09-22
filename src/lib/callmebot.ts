import { Order, ServiceRequest } from "@prisma/client";
import { CartItem } from "@/lib/types";

const BASE_URL = "https://api.callmebot.com/whatsapp.php";

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

async function sendCallMeBotMessage(text: string) {
  if (!process.env.CALLMEBOT_PHONE || !process.env.CALLMEBOT_API_KEY) {
    console.warn("CallMeBot credentials not configured");
    return "skipped";
  }

  try {
    const url = `${BASE_URL}?phone=${process.env.CALLMEBOT_PHONE}&text=${encodeURIComponent(text)}&apikey=${process.env.CALLMEBOT_API_KEY}`;
    const res = await fetch(url);
    const body = await res.text();

    if (!res.ok || body.toLowerCase().includes("error")) {
      console.error("CallMeBot send failed:", body);
      return "failed";
    }

    return "sent";
  } catch (err) {
    console.error("CallMeBot send error:", err);
    return "failed";
  }
}

export async function sendOrderNotification(order: Order) {
  const { productLines, servicesText } = summarizeItems(order);

  const text = [
    `New order received!`,
    `Customer: ${order.customerName}`,
    `Order #: ${order.orderNumber}`,
    `Items: ${productLines}`,
    `Total: LKR ${order.total}`,
    `Fulfillment: ${order.fulfillment === "delivery" ? "Home Delivery" : "Showroom Pickup"}`,
    `Installation: ${servicesText}`,
    `Phone: ${order.phone}`,
  ].join("\n");

  const status = await sendCallMeBotMessage(text);
  if (status === "sent") console.log(`CallMeBot notification sent for order ${order.orderNumber}`);
  return status;
}

export async function sendServiceRequestNotification(req: ServiceRequest) {
  const text = [
    `New service request received!`,
    `Type: ${req.type}`,
    `Customer: ${req.customerName}`,
    `Phone: ${req.phone}`,
    `Address: ${req.address}`,
    `Preferred date: ${req.preferredDate?.toISOString().split("T")[0] || "Not specified"}`,
  ].join("\n");

  const status = await sendCallMeBotMessage(text);
  if (status === "sent") console.log(`CallMeBot notification sent for service request ${req.id}`);
  return status;
}
