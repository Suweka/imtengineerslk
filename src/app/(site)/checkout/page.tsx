"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatLKRShort } from "@/lib/format";
import { nextWorkingDays } from "@/lib/dates";
import { siteSettings } from "@/data/testimonials";
import { Button } from "@/components/ui/Button";
import { ProductImageFrame } from "@/components/product/ProductImageFrame";

const districts = [
  "Colombo", "Gampaha", "Kalutara", "Kandy", "Galle", "Matara", "Kurunegala", "Ratnapura", "Anuradhapura", "Jaffna",
];

export default function CheckoutPage() {
  const { items, subtotal, installationTotal, total } = useCart();
  const router = useRouter();
  const dates = useMemo(() => nextWorkingDays(4), []);

  const [fulfillment, setFulfillment] = useState<"delivery" | "showroom-pickup">("delivery");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [nic, setNic] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState(districts[0]);
  const [installDate, setInstallDate] = useState(dates[0]?.iso ?? "");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const deliveryFree = subtotal >= siteSettings.freeDeliveryThreshold;
  const deliveryFee = fulfillment === "delivery" && !deliveryFree ? 1500 : 0;
  const payable = total + deliveryFee;

  const canSubmit = name && phone && nic && (fulfillment === "showroom-pickup" || (address && city));

  const [submitError, setSubmitError] = useState("");

  async function handlePlaceOrder() {
    if (!canSubmit || items.length === 0) return;
    setSubmitting(true);
    setSubmitError("");

    const payload = {
      items,
      subtotal,
      installationTotal,
      deliveryFee,
      total: payable,
      fulfillment,
      customerName: name,
      phone,
      email,
      nicNumber: nic,
      address: fulfillment === "delivery" ? address : undefined,
      city: fulfillment === "delivery" ? city : undefined,
      district: fulfillment === "delivery" ? district : undefined,
      preferredInstallDate: installDate,
      notes,
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Order creation failed");
      const { id } = await res.json();

      window.localStorage.removeItem("imt-cart-v1");
      router.push(`/order-confirmation/${id}`);
    } catch (err) {
      console.error(err);
      setSubmitError("Something went wrong placing your order. Please try again or call us.");
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <h1 className="text-2xl font-extrabold text-slate-900">Nothing to check out</h1>
        <p className="mt-2 text-sm text-slate-500">Your cart is empty.</p>
        <Link href="/shop" className="mt-6 inline-flex rounded-lg bg-imt-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-imt-navy">
          Browse air conditioners
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Complete your order</h1>
          <p className="mt-1 text-sm text-slate-500">No payment is taken online. Confirm the details below and settle at our showroom or on delivery — cash or card.</p>
        </div>
        <span className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600">🔒 Secure checkout</span>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-8">
          <Section step={1} title="Your details">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Full name" value={name} onChange={setName} placeholder="Nuwan Perera" />
              <Field label="Mobile number" value={phone} onChange={setPhone} placeholder="077 456 7890" />
              <Field label="Email (for the order confirmation)" value={email} onChange={setEmail} placeholder="you@email.com" type="email" />
              <Field label="NIC / driving licence number" value={nic} onChange={setNic} placeholder="For installer verification" />
            </div>
          </Section>

          <Section step={2} title="How you want it">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FulfillmentCard
                selected={fulfillment === "delivery"}
                onClick={() => setFulfillment("delivery")}
                title="Deliver to my address"
                lines={["Islandwide, 2-4 working days", `Free over ${formatLKRShort(siteSettings.freeDeliveryThreshold)}`]}
              />
              <FulfillmentCard
                selected={fulfillment === "showroom-pickup"}
                onClick={() => setFulfillment("showroom-pickup")}
                title="Collect at showroom"
                lines={["Pay by cash or card in person", "Order held for 5 days after confirmation"]}
              />
            </div>

            {fulfillment === "delivery" && (
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Field label="Street address" value={address} onChange={setAddress} placeholder="44/2 Hospital Road, Kalubowila" />
                </div>
                <Field label="City" value={city} onChange={setCity} placeholder="Dehiwala" />
                <label className="text-xs text-slate-600">
                  District
                  <select value={district} onChange={(e) => setDistrict(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                    {districts.map((d) => <option key={d}>{d}</option>)}
                  </select>
                </label>
              </div>
            )}
          </Section>

          {items.some((i) => i.installation.selected) && (
            <Section step={3} title="Installation slot">
              <p className="mb-2 text-xs text-slate-500">
                {items.filter((i) => i.installation.selected).length} unit(s) need fitting
              </p>
              <div className="grid grid-cols-4 gap-2 sm:w-80">
                {dates.map((d) => (
                  <button
                    key={d.iso}
                    onClick={() => setInstallDate(d.iso)}
                    className={`rounded-lg border px-2 py-2 text-center text-xs ${
                      installDate === d.iso ? "border-imt-blue bg-imt-blue/5 font-semibold text-imt-navy" : "border-slate-200 text-slate-600"
                    }`}
                  >
                    <div>{d.label}</div>
                    <div className="font-semibold">{d.day}</div>
                  </button>
                ))}
              </div>
            </Section>
          )}

          <Section step={items.some((i) => i.installation.selected) ? 4 : 3} title="Anything we should know?">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Gate code, floor, wall type, preferred contact time..."
              rows={3}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </Section>
        </div>

        <div className="h-fit rounded-xl bg-imt-navy p-5 text-white lg:sticky lg:top-24">
          <h2 className="font-bold">Order summary</h2>
          <div className="mt-4 space-y-3">
            {items.map((item) => (
              <div key={item.productId} className="flex gap-3">
                <ProductImageFrame src={item.image} alt={item.name} className="h-12 w-12 shrink-0" />
                <div className="flex-1 text-sm">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-xs text-slate-300">Qty {item.qty}{item.installation.selected ? " · installation" : ""}</p>
                </div>
                <span className="text-sm font-semibold">{formatLKRShort(item.price * item.qty)}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-2 border-t border-white/10 pt-4 text-sm text-slate-300">
            <div className="flex justify-between"><span>Subtotal ({items.length} items)</span><span>{formatLKRShort(subtotal)}</span></div>
            <div className="flex justify-between"><span>Installation</span><span>{formatLKRShort(installationTotal)}</span></div>
            <div className="flex justify-between">
              <span>Delivery {fulfillment === "showroom-pickup" ? "(pickup)" : "(islandwide)"}</span>
              <span className={deliveryFee === 0 ? "text-emerald-400" : ""}>{deliveryFee === 0 ? "Free" : formatLKRShort(deliveryFee)}</span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
            <span className="font-semibold">Payable at store</span>
            <span className="text-xl font-extrabold text-imt-gold-start">{formatLKRShort(payable)}</span>
          </div>

          <div className="mt-4 rounded-lg bg-white/10 p-3 text-xs text-slate-200">
            💳 {fulfillment === "showroom-pickup" ? "Pay at our showroom — cash or card. Your order is held for 5 days." : "Payment is made on delivery or at our showroom — cash or card. Nothing is charged online."}
          </div>

          {submitError && (
            <div className="mt-4 rounded-lg bg-red-500/20 p-3 text-sm text-red-100">{submitError}</div>
          )}

          <Button
            className="mt-4 w-full bg-imt-gold-start text-imt-navy hover:bg-imt-gold-end"
            size="lg"
            disabled={!canSubmit || submitting}
            onClick={handlePlaceOrder}
          >
            {submitting ? "Placing order..." : "Place order →"}
          </Button>
          <p className="mt-2 text-center text-xs text-slate-400">
            By placing this order you agree to our terms of sale and installation policy.
          </p>
        </div>
      </div>
    </div>
  );
}

function Section({ step, title, children }: { step: number; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-imt-blue text-xs font-bold text-white">{step}</span>
        <h2 className="font-bold text-slate-900">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Field({
  label, value, onChange, placeholder, type = "text",
}: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <label className="text-xs text-slate-600">
      {label}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
      />
    </label>
  );
}

function FulfillmentCard({
  selected, onClick, title, lines,
}: { selected: boolean; onClick: () => void; title: string; lines: string[] }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl border p-4 text-left ${selected ? "border-imt-blue bg-imt-blue/5" : "border-slate-200"}`}
    >
      <div className="flex items-center gap-2">
        <span className={`flex h-4 w-4 items-center justify-center rounded-full border-2 ${selected ? "border-imt-blue" : "border-slate-300"}`}>
          {selected && <span className="h-2 w-2 rounded-full bg-imt-blue" />}
        </span>
        <span className="font-semibold text-slate-900">{title}</span>
      </div>
      <div className="mt-1.5 pl-6 text-xs text-slate-500">
        {lines.map((l) => <p key={l}>{l}</p>)}
      </div>
    </button>
  );
}
