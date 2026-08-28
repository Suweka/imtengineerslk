import { Resend } from "resend";
import type { Order, ServiceRequest } from "@prisma/client";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const NOTIFY_EMAIL = process.env.IMT_NOTIFY_EMAIL || "imtengineersmd@gmail.com";
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "IMT Engineers <onboarding@resend.dev>";

type OrderItem = { name: string; qty: number; price: number };

export async function sendOrderOwnerAlert(order: Order) {
  if (!resend) {
    console.warn("RESEND_API_KEY not configured — skipping order email alert");
    return "skipped";
  }

  try {
    const items = order.items as unknown as OrderItem[];
    const itemsHtml = items
      .map((i) => `<li>${i.qty} x ${i.name} — LKR ${i.price.toLocaleString()}</li>`)
      .join("");

    await resend.emails.send({
      from: FROM_EMAIL,
      to: NOTIFY_EMAIL,
      subject: `New order ${order.orderNumber} — LKR ${Number(order.total).toLocaleString()}`,
      html: `
        <h2>New order received</h2>
        <p><strong>Order:</strong> ${order.orderNumber}</p>
        <p><strong>Customer:</strong> ${order.customerName} (${order.phone})</p>
        <p><strong>Fulfillment:</strong> ${order.fulfillment === "delivery" ? "Home Delivery" : "Showroom Pickup"}</p>
        ${order.address ? `<p><strong>Address:</strong> ${order.address}, ${order.city ?? ""} ${order.district ?? ""}</p>` : ""}
        <p><strong>Items:</strong></p>
        <ul>${itemsHtml}</ul>
        <p><strong>Total:</strong> LKR ${Number(order.total).toLocaleString()}</p>
        <p>View in admin: <a href="${process.env.NEXTAUTH_URL || ""}/admin/orders">Orders dashboard</a></p>
      `,
    });

    return "sent";
  } catch (err) {
    console.error("Order email alert failed:", err);
    return "failed";
  }
}

export async function sendServiceRequestOwnerAlert(req: ServiceRequest) {
  if (!resend) {
    console.warn("RESEND_API_KEY not configured — skipping service request email alert");
    return "skipped";
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: NOTIFY_EMAIL,
      subject: `New service request: ${req.type}`,
      html: `
        <h2>New service request</h2>
        <p><strong>Type:</strong> ${req.type}</p>
        <p><strong>Customer:</strong> ${req.customerName} (${req.phone})</p>
        <p><strong>Address:</strong> ${req.address}</p>
        <p><strong>Preferred date:</strong> ${req.preferredDate ? new Date(req.preferredDate).toLocaleDateString("en-GB") : "Not specified"}</p>
        <p>View in admin: <a href="${process.env.NEXTAUTH_URL || ""}/admin/service-requests">Service requests dashboard</a></p>
      `,
    });

    return "sent";
  } catch (err) {
    console.error("Service request email alert failed:", err);
    return "failed";
  }
}
