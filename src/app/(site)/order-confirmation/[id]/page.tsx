"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { CartItem } from "@/lib/types";
import { formatLKRShort } from "@/lib/format";
import { siteSettings } from "@/data/testimonials";
import { ProductImageFrame } from "@/components/product/ProductImageFrame";
import { Button } from "@/components/ui/Button";

type Order = {
  id: string;
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
  installationTotal: number;
  deliveryFee: number;
  total: number;
  fulfillment: "delivery" | "showroom-pickup";
  customerName: string;
  phone: string;
  email: string | null;
  address: string | null;
  city: string | null;
  district: string | null;
  preferredInstallDate: string | null;
  createdAt: string;
};

export default function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) =>
        setOrder(
          data
            ? {
                ...data,
                subtotal: Number(data.subtotal),
                installationTotal: Number(data.installationTotal),
                deliveryFee: Number(data.deliveryFee),
                total: Number(data.total),
              }
            : null
        )
      )
      .catch(() => setOrder(null));
  }, [id]);

  if (order === undefined) return null;

  if (order === null) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <h1 className="text-2xl font-extrabold text-slate-900">Order not found</h1>
        <p className="mt-2 text-sm text-slate-500">This confirmation link may have expired on this device.</p>
        <Link href="/shop" className="mt-6 inline-flex rounded-lg bg-imt-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-imt-navy">
          Continue shopping
        </Link>
      </div>
    );
  }

  const isPickup = order.fulfillment === "showroom-pickup";
  const heldUntil = new Date(order.createdAt);
  heldUntil.setDate(heldUntil.getDate() + 5);

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-600">✓</div>
        <h1 className="mt-4 text-2xl font-extrabold text-slate-900 sm:text-3xl">
          {isPickup ? "Order placed. We're holding your units." : "Order placed. We'll deliver soon."}
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Order <strong className="text-slate-900">{order.orderNumber}</strong> is confirmed. A copy has been sent to{" "}
          {order.email || "your email"} and our team will call you within 2 hours to confirm the {isPickup ? "installation slot" : "delivery details"}.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <WhatsAppButton order={order} />
          <Button variant="outline">⬇ Download invoice</Button>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
            <h2 className="flex items-center gap-2 font-bold text-slate-900">
              🏪 {isPickup ? "Pay at our showroom — cash or card" : "Pay on delivery — cash or card"}
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <p className="text-xs font-bold uppercase text-slate-500">Where</p>
                <p className="text-sm text-slate-700">IMT Engineers (Pvt) Ltd<br />{siteSettings.headOfficeAddress}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-slate-500">When</p>
                <p className="text-sm text-slate-700">
                  {siteSettings.businessHours.weekdays}<br />
                  {isPickup ? `Held until ${heldUntil.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}` : `Preferred install date: ${order.preferredInstallDate}`}
                </p>
              </div>
            </div>
            <div className="mt-4 border-t border-amber-200 pt-4 text-xs text-amber-800">
              <p className="font-bold uppercase">Bring with you</p>
              <p className="mt-1">✓ This order number &nbsp; ✓ Your NIC or driving licence &nbsp; ✓ Cash, or any Visa / Mastercard</p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="font-bold text-slate-900">What happens next</h2>
            <ul className="mt-4 space-y-4 text-sm">
              <Step done title="Order placed" subtitle={new Date(order.createdAt).toLocaleString("en-GB")} />
              <Step title="We call to confirm" subtitle={`Within 2 hours on ${order.phone}`} />
              <Step title={isPickup ? "Pay at the showroom" : "Delivery"} subtitle={isPickup ? `Any time before ${heldUntil.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}` : "2-4 working days"} />
              {order.installationTotal > 0 && <Step title="Installation" subtitle={order.preferredInstallDate ? `On ${order.preferredInstallDate}` : "We'll confirm a slot"} />}
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-bold text-slate-900">Order details</h2>
              <span className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
            </div>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.productId} className="flex gap-3">
                  <ProductImageFrame src={item.image} alt={item.name} className="h-12 w-12 shrink-0" />
                  <div className="flex-1 text-sm">
                    <p className="font-medium text-slate-900">{item.name}</p>
                    <p className="text-xs text-slate-500">Qty {item.qty}</p>
                  </div>
                  <span className="text-sm font-semibold">{formatLKRShort(item.price * item.qty)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-4 text-sm text-slate-600">
              <div className="flex justify-between"><span>Subtotal ({order.items.length} items)</span><span>{formatLKRShort(order.subtotal)}</span></div>
              <div className="flex justify-between"><span>Installation</span><span>{formatLKRShort(order.installationTotal)}</span></div>
              <div className="flex justify-between"><span>Delivery</span><span className={order.deliveryFee === 0 ? "text-emerald-600" : ""}>{order.deliveryFee === 0 ? "Free" : formatLKRShort(order.deliveryFee)}</span></div>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3">
              <span className="font-bold text-slate-900">Payable at store</span>
              <span className="text-lg font-extrabold text-imt-blue">{formatLKRShort(order.total)}</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="font-bold text-slate-900">{isPickup ? "Collecting" : "Delivering to"}</h2>
            <p className="mt-2 text-sm text-slate-600">
              {order.customerName}<br />
              {!isPickup && <>{order.address}<br />{order.city}, {order.district}<br /></>}
              {order.phone}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
            📱 Questions about this order? Call {siteSettings.phone} or WhatsApp us.
          </div>
        </div>
      </div>
    </div>
  );
}

function WhatsAppButton({ order }: { order: Order }) {
  const itemsText = order.items.map(item => `${item.qty}x ${item.name}`).join(", ");
  const message = `Hi, my order number is ${order.orderNumber}. I would like to order: ${itemsText}. Total: LKR ${order.total}`;
  const whatsappLink = `https://wa.me/94766644460?text=${encodeURIComponent(message)}`;
  
  return (
    <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-600 transition-colors">
      💬 Continue to WhatsApp
    </a>
  );
}

function Step({ title, subtitle, done = false }: { title: string; subtitle: string; done?: boolean }) {
  return (
    <li className="flex gap-3">
      <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs ${done ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"}`}>
        {done ? "✓" : "•"}
      </span>
      <div>
        <p className="font-semibold text-slate-900">{title}</p>
        <p className="text-xs text-slate-500">{subtitle}</p>
      </div>
    </li>
  );
}
