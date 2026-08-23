# IMT Engineers — Website Development Plan

## 1. Project Snapshot

| | |
|---|---|
| **Business** | IMT Engineers (Pvt) Ltd — domestic & central AC sales, service, installation |
| **Since** | 2006 (~20 years in business) |
| **Head Office** | 59/A Panapitiya, Karandeniya |
| **Engineering Dept.** | 222 Egodauyana, Modara, Moratuwa |
| **Hotline / WhatsApp** | 0766644460 |
| **Email** | imtengineersmd@gmail.com |
| **Coverage** | Island-wide delivery & installation |
| **Business Hours** | Mon–Fri 8:00–5:00, Sat 8:00–1:00, Sun closed |

---

## 2. The Site's Core Model

The mockups show "Add to Cart," LKR pricing, and a cart badge — a **full product catalog with cart**, matching how AC sales actually happen locally: no online payment gateway. Instead, once a customer submits their order, the full order details (products, quantities, price, customer name/phone/address) are formatted and sent straight to **IMT Engineers' WhatsApp** (0766644460), where the team follows up to confirm and arrange payment/delivery/installation directly with the customer.

This keeps the build simple and fast to ship, while still giving customers the full browse → cart → order experience the mockups show.

---

## 3. Sitemap

```
Home
Shop
 ├─ All Products (filter/sort/grid)
 ├─ Split AC
 ├─ Cassette AC
 ├─ Ducted AC
 ├─ Floor Standing
 └─ Portable AC
Product Detail Page
Brands (see brand-list note in §8 — not yet finalized)
Installation
Services
 ├─ Gas Refill
 ├─ Duct Cleaning
 ├─ Annual Maintenance Contract (AMC)
 ├─ Relocation / Uninstall
 ├─ Emergency Same-Day
 └─ Old Unit Disposal
Room Size Guide
About Us
Contact Us
Cart
Checkout (customer details form → order sent to IMT Engineers WhatsApp)
Order Confirmation (order number, hold/response-time info, no payment step)
Admin Dashboard (separate, not public-facing)
```

---

## 4. Page-by-Page Feature Breakdown

**Home**
Hero banner + value props bar (cooling performance, energy efficient, quiet, trusted brands), category grid, best-seller strip, trust bar (secure payments, easy returns, 24/7 support, price guarantee), WhatsApp CTA — all already sketched in your mockups.

**Shop / Category listing**
Filters (brand, BTU capacity, price range, AC type, energy rating), sort (popular/price/rating), grid/list toggle, product cards with badges (Best Seller, % Off), rating, price with strikethrough for discounts.

**Product Detail**
Image gallery (main shot + secondary views), four tabs — **Description, Specifications, Warranty, Reviews**. Specs table covers cooling capacity, power supply, refrigerant (R32), compressor type, energy rating, AC type (inverter/non-inverter), recommended room size. A room-size calculator in the sidebar helps customers pick the right capacity. Related products shown below.

**Services**
One card per service (gas refill, duct cleaning, AMC, relocation, emergency, disposal) each with a "Request Service" CTA that opens a form or WhatsApp chat.

**Installation**
Explains the professional install process and islandwide coverage — a trust-building page since this is a stated differentiator.

**About Us**
Company history (2006–present), mission, "why buy from us." *(Content needed — see §8.)*

**Contact**
Both addresses on an embedded map, phone/WhatsApp/email, business hours, contact form.

**Cart / Checkout**
Cart summary → checkout form (name, phone, delivery address or "collect at showroom," preferred install date, NIC/driving licence number for installer verification) → on submit, the order is saved to the database and automatically pushed to IMT Engineers' WhatsApp via the WhatsApp Business API — no action needed from the customer. Free-delivery threshold logic still applies (LKR 50,000+, per your banner) and shows in the order summary.

Two fulfillment paths, matching the mockup:
- **Deliver to my address** — islandwide, within 3 working days.
- **Collect at showroom** — pay by cash or card in person; order is held for 5 days after confirmation.

**Order Confirmation** — shows an order number and sets expectations ("we call to confirm," a response-time SLA). Since installation is treated as a required step (not an optional add-on) for split/cassette/ducted units, the confirmation should be clear that a technician visit or site survey may follow for ceiling-mounted units.

**Admin Dashboard**
Not just a product/order CRUD screen — this controls the whole site, so no page copy needs a code change or redeploy to update:
- **Products** — CRUD, including image upload with automatic background removal (see §6a).
- **Brands & Categories** — CRUD.
- **Orders** — list/detail, status updates, and a flag on any order stuck with `whatsappStatus: failed` for manual retry.
- **Service Requests** — list/detail, status updates.
- **Homepage content** — hero banner text/image, value props, best-seller picks, testimonials (add/edit/reorder/publish).
- **Page content** — About Us, Installation, Services descriptions, Room Size Guide — editable text blocks.
- **Site settings** — contact info, business hours, social links, free-delivery threshold, logo.
- **Admin users** — if more than one staff member needs access, role-based login via NextAuth.

---

## 5. Design System

Pulled from your logo and mockups:

- **Primary blue:** ~`#1C75BC` (navy `#1a3f8c` for headers/CTAs)
- **Accent red:** ~`#ED1C24`
- **Gold/orange gradient:** ~`#F5B642` → orange (used in logo lettering, could work well for "Best Seller" / discount badges)
- **Background:** white / light gray
- Mobile-first — your Image 2 mockup is the mobile layout, Image 3 is desktop; keep both in sync as breakpoints of one component library rather than two designs.
- You've mentioned liking **glassmorphism** — this brand skews corporate/trustworthy, so I'd use it sparingly: frosted-glass effect on the filter panel, cart drawer, and modals, while keeping product cards and CTAs solid and high-contrast for readability and trust.
- Two notes found embedded directly in the latest mockup file (design intent worth carrying through): **add a testimonials band above the footer**, and **treat installation as a required step, not an optional add-on** — for ceiling-mounted units (cassette/ducted) this should read as "requires a site survey," not just a checkbox at checkout.
- **Product image container** — every standalone product photo (shop cards, PDP gallery, admin previews) sits inside a consistent frame, so cutout product shots look uniform across the catalog:
  ```css
  background: #F2F5F8;
  border: 1px solid #E5EAF0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  ```
  This is applied as a CSS wrapper around the image, not baked into the stored file — see §6a for why.

---

## 6. Recommended Tech Stack

Since this is a real client project and the budget is domain-only, the stack below is chosen so hosting, database, and image storage are all genuinely free **and** licensed for commercial/client use — not just free until you read the fine print.

- **Next.js 14** (App Router) — handles both frontend and backend (API routes); no separate backend to host.
- **Cloudflare Pages** — hosting. ⚠️ Not Vercel: Vercel's free Hobby plan explicitly restricts to personal, non-commercial use, and their terms call out "fulfilling a paid client engagement" as commercial use requiring the paid Pro plan ($20/month). Cloudflare Pages' free tier explicitly permits commercial use, with unlimited bandwidth/requests. Next.js runs on it via an adapter (OpenNext's Cloudflare adapter, or `@cloudflare/next-on-pages`) rather than natively — a well-documented extra setup step. *(If the budget ever allows $20/month, Vercel Pro is the honest paid alternative and would need no architecture change from what's already planned.)*
- **Neon** — PostgreSQL database, free tier. Permanent (not a trial), no credit card: 0.5 GB storage, 100 compute-hours/month, scales to zero after 5 minutes idle. Standard Postgres, works directly with Prisma, commercial use allowed. Chosen over Supabase's free tier, which pauses the whole project after 7 days of inactivity — risky for a live client site.
- **PostgreSQL + Prisma ORM** — talking to the Neon database above. Note: from Cloudflare Workers, Prisma needs Neon's HTTP-based driver adapter rather than a normal TCP connection, since Workers don't support raw TCP the way Node does — a standard, documented pattern for this combo.
- **NextAuth.js** — admin login (for managing products, orders, and service requests)
- **Tailwind CSS**
- **Cloudflare R2** — product image storage. 10GB storage and 1M+ monthly operations free, and — useful for a photo-heavy catalog — zero egress fees, so serving product images all day doesn't generate a bandwidth bill.
- **WhatsApp Business Platform (Cloud API)** — on order/service-request submission, the backend calls the WhatsApp API to automatically push the order to IMT Engineers' WhatsApp, no customer action needed

### WhatsApp Business API — what needs setting up before this works

This is more involved than a click-to-chat link, so worth planning for up front:

1. **Meta Business account + verification** — the business (IMT Engineers) needs a verified Meta Business Manager account.
2. **A dedicated sending number.** This is the important operational catch: a phone number connected to the WhatsApp Business Platform (Cloud API) **can't simultaneously run the regular WhatsApp app** the way 0766644460 does today for customer chats. Recommended setup: keep **0766644460** exactly as-is for customer-facing WhatsApp chat/support, and register a **separate number** purely as the automated sender that pushes order notifications *to* 0766644460. That way nothing changes about how the business currently uses its main WhatsApp line.
3. **Message template approval.** WhatsApp requires business-initiated messages (i.e., not a reply to a customer texting first) to use a pre-approved template. You'd submit something like an "New Order Received" template (order #, items, total, customer name/phone) to Meta for approval — usually takes a day or two.
4. **Provider choice:** either Meta's Cloud API directly (free usage tier, more setup yourself) or a Business Solution Provider like Twilio, 360dialog, or Gupshup (paid, but faster onboarding and a simpler dashboard). Worth deciding based on how much setup you want to handle yourself.
5. **Backend wiring:** a Next.js API route triggered on order/service-request submission calls the WhatsApp API with the approved template, filled with that order's details.

### 5a. Domain setup

The domain doesn't need to be bought through Cloudflare — buy it anywhere (e.g. a local Sri Lankan registrar), then point its DNS at Cloudflare Pages once the site is deployed. Custom domains on Cloudflare Pages' free tier work the same regardless of where the domain was registered.

### 6a. Product photo background removal

When you upload a product photo in the admin panel, it should come out the other end as a clean cutout on the standard catalog background — no manual photo editing needed per product.

**How it works:** raw upload → sent to a background-removal service → the result is a **transparent PNG** (subject only, no background) → that transparent PNG is what gets stored and shown everywhere. The `#F2F5F8` background, `#E5EAF0` border, and subtle shadow you specified are applied as a **CSS wrapper** around the image at display time, not baked into the file. That's the better approach here: it keeps every product photo consistent even if you tweak the background color later, and the same transparent cutout can sit on a different background elsewhere (e.g., a promo banner) without reprocessing.

**Provider options (pick one to start with):**

| Option | Cost | Notes |
|---|---|---|
| **remove.bg API** | Free tier (50/month), then pay-per-image | Dedicated background-removal API, handles well-lit product photos (like white AC units) reliably. |
| **Cloudinary AI Background Removal** | Paid add-on, ~per-image | Only worth it if you'd rather manage image storage there instead of Cloudflare R2 — otherwise it's a second vendor for no real benefit. |
| **@imgly/background-removal** (open source) | Free — runs via WebAssembly, no API cost | No recurring cost, more setup work, slightly slower processing. Good fallback if per-image API costs become a concern as the catalog grows. |

Given IMT's catalog is likely tens rather than thousands of products, I'd start with **remove.bg** — the reliability is worth the small per-image cost at this volume (and it stays free at low volume), and you can always switch to the open-source route later if it matters. The processed (transparent PNG) result gets stored in Cloudflare R2 alongside the original.

**Admin UX:** after the background is removed, show the admin a before/after preview before saving — automated cutouts occasionally need a retry (glare on curved plastic, a busy original background). Keep the original raw upload stored alongside the processed version so a photo can be reprocessed or manually touched up later without needing to re-upload.

---

## 7. Data Model (high level)

```
Product        id, name, brandId, categoryId, capacityBTU, energyRating,
               acType (inverter/non-inverter), price, discountPrice,
               warrantyParts, warrantyCompressor, images[], stock,
               isFeatured, isBestSeller

Category       Split | Cassette | Ducted | Floor Standing | Portable

Brand          name, logo

ServiceRequest type, customerName, phone, address, preferredDate, status

Inquiry        source (cart/contact form), payload, status

Order          items[], total, deliveryFee, customerName, phone, address,
               preferredInstallDate, whatsappStatus (pending/sent/failed),
               status (New → Contacted → Confirmed → Delivered/Installed)

ProductImage   productId, originalUrl (raw upload), processedUrl (bg-removed),
               status (pending/processed/failed), sortOrder

SiteSettings   (singleton) phone, whatsapp, email, headOfficeAddress,
               engineeringDeptAddress, businessHours, socialLinks,
               freeDeliveryThreshold, logoUrl

Testimonial    customerName, rating, quote, isPublished, sortOrder

PageContent    pageKey (about / installation / room-size-guide / home-hero / …),
               title, body, updatedAt

AdminUser      email, passwordHash, role — managed via NextAuth
```

---

## 8. Gaps to Resolve Before/During Build

From your intake form and the mockups, a few things are still open:

- **Brand list keeps changing across drafts** — the intake form lists LG, Panasonic, Hisence, Sharp, TCL; an earlier mockup showed Daikin, Panasonic, LG, Midea; this latest mockup shows **Daikin, Midea, Panasonic, LG, Hitachi, Samsung** (with a "show 4 more brands" pattern, implying even more). This needs to be locked down before building the Brands filter and seeding product data — it's the one gap that actually blocks meaningful progress on the Shop pages.
- **A "Colombo 04" showroom** appears in this mockup's checkout ("collect at showroom," "pay by cash or card at Colombo 04") but doesn't match either address in the intake form (Panapitiya/Karandeniya or Egodauyana/Modara/Moratuwa). Confirm whether this is a real pickup location or just placeholder content from the mockup.
- **"Why buy from us"** — the intake form left this blank, but the latest mockup includes candidate trust copy: "IMT-certified technicians, not subcontractors" and "Registered with Daikin Sri Lanka." Treat these as drafts to confirm, not confirmed facts, before publishing.
- **Full price list** — not yet supplied (though the mockup's sample prices, e.g. LKR 89,900–349,800 across units, can serve as realistic placeholder ranges for now).
- **Room Size Guide content** — referenced in the intake form (Section 4/8) and again as a sidebar calculator in the mockup, but no actual sizing data/table has been supplied yet.
- **Social media links** — left blank.
- **Final logo file** — note said "I'll send an updated version"; the version in Image 1 (first upload) can be used as a placeholder until then.
- **Product photography/specs** for each brand and model you'll actually list.
- **Placeholder phone numbers in the mockup** (076 123 4567, 077 456 7890) don't match the real hotline (0766644460) — make sure these get swapped for the real number everywhere during content population.

---

## 9. Build Phases & Rough Timeline

| Phase | Scope | Estimate |
|---|---|---|
| 0 — Setup | Repo, DB schema, auth, Vercel pipeline, Meta Business verification, WhatsApp API number registration & template submission (can run in parallel with dev) | 2–5 days (template approval is the variable) |
| 1 — Core Site | Home, Shop, Product Detail, Services, Installation, About, Contact | 1 week |
| 2 — Cart, Orders & Admin | Cart, checkout form, WhatsApp API order push, order logging; full admin dashboard (products/brands/categories/orders/service requests, image upload with background removal, homepage & page content editing, site settings) | 1.5–2 weeks |
| 3 — Polish | SEO, analytics, testimonials content, Room Size Guide content, performance/accessibility pass | Few days |

> **Reliability note:** since the WhatsApp push depends on an external API, every order should always be saved to the database first regardless of whether the WhatsApp message succeeds — that way nothing gets lost if the API call fails, and the admin dashboard can flag/retry any order stuck on `whatsappStatus: failed`.

---

## 10. Immediate Next Steps

1. Set up accounts on the free stack: Cloudflare (Pages + R2), Neon (database), remove.bg (background removal) — all can be created immediately, before any code is written.
2. Set up the Meta Business account and decide on a WhatsApp provider (Meta Cloud API direct vs. a BSP like Twilio/360dialog/Gupshup) — this can start in parallel with development.
3. Get a dedicated phone number for the API sender (separate from 0766644460, which keeps working as-is for customer chats) and submit the order-notification message template to Meta for approval.
4. Confirm the final brand list.
5. Set up the Next.js project + Prisma schema based on §7, connected to Neon via the driver adapter noted in §6.
6. Build out the Home and Shop pages first, since the mockups already give a clear design direction to implement against.
