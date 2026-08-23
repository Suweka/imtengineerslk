# Build Prompt — IMT Engineers Website

Paste this into Claude Code (or another AI coding agent) as the starting instruction. It's self-contained — no need to attach the plan or mockups separately.

---

## Project

Build a **Next.js 14 (App Router, TypeScript)** e-commerce catalog website for **IMT Engineers (Pvt) Ltd**, a Sri Lankan company selling, installing, and servicing domestic & central air conditioners, in business since 2006.

This is a **catalog + cart site with no online payment gateway**. When a customer checks out, their order is saved to the database and automatically pushed to the business's WhatsApp via the WhatsApp Business API. Payment happens offline (cash/card at delivery or at the showroom).

## Tech Stack

This is a real client project on a domain-only budget — every piece below is genuinely free at this scale **and** licensed for commercial use, not just free for personal projects.

- Next.js 14, App Router, TypeScript
- Tailwind CSS
- **PostgreSQL via Neon** (free tier: 0.5GB storage, 100 compute-hours/month, scale-to-zero, no credit card, commercial use allowed) + Prisma ORM
- NextAuth.js — admin login only (no customer accounts)
- WhatsApp Business Cloud API — server-side order push
- **Deploy target: Cloudflare Pages** (not Vercel — Vercel's Hobby/free plan explicitly prohibits commercial or client work; Cloudflare Pages' free tier explicitly allows it). Use the OpenNext Cloudflare adapter (or `@cloudflare/next-on-pages`) to run the Next.js app on Workers.
- **Image storage: Cloudflare R2** (10GB + 1M+ ops/month free, zero egress fees — pairs naturally with Cloudflare Pages)

**Important Prisma + Cloudflare Workers note:** Workers don't support raw TCP connections the way Node does, so Prisma needs Neon's HTTP-based driver adapter (`@prisma/adapter-neon` + `@neondatabase/serverless`) instead of a standard `DATABASE_URL` TCP connection. This is a standard, documented pattern for the Next.js + Cloudflare + Neon + Prisma combination — set it up this way from the start rather than defaulting to the normal Prisma client setup and hitting a wall later.

## Brand & Design Tokens

```css
--imt-blue: #1C75BC;        /* primary */
--imt-navy: #1a3f8c;        /* headers, CTAs */
--imt-red: #ED1C24;         /* accent, badges */
--imt-gold-start: #F5B642;  /* gradient start — logo, best-seller badges */
--imt-gold-end: #F58220;    /* gradient end (approx — refine against logo) */
--imt-bg: #F7F9FC;          /* light background */
```

- Mobile-first. Build one responsive component library, not separate mobile/desktop designs.
- Clean corporate look overall (this is a trades/engineering business — prioritize trust and readability).
- Use a light glassmorphism treatment (frosted background blur, soft border) **only** on: the filter panel, the cart drawer, and modals. Keep product cards, prices, and CTA buttons solid and high-contrast — don't apply glass effects there.
- Typography: a clean system sans-serif (e.g. Inter). Bold, blue headings for section titles, matching the mockups.

## Sitemap & Pages

```
/                          Home
/shop                      All products — filter/sort/grid
/shop/[category]           Split | Cassette | Ducted | Floor Standing | Portable
/product/[slug]            Product detail
/brands                    Brand listing
/installation              Installation info page
/services                  Services overview
/services/[type]           Gas Refill | Duct Cleaning | AMC | Relocation | Emergency | Disposal
/room-size-guide           Sizing help content
/about                     About Us
/contact                   Contact Us
/cart                      Cart
/checkout                  Checkout form
/order-confirmation/[id]   Order confirmation
/admin                     Admin dashboard (protected, NextAuth) — see Admin Panel section below
```

### Home
Hero banner, value-props bar (cooling performance / energy efficient / quiet / trusted brands), category grid (5 categories), best-seller strip, trust bar (secure payments / easy returns / 24/7 support / price guarantee), testimonials band above the footer, WhatsApp CTA.

### Shop / Category listing
Filters: brand, BTU capacity, price range, AC type (inverter/non-inverter), energy rating. Sort: popular / price / rating. Grid/list toggle. Product cards show badges (Best Seller, % Off), star rating, price with strikethrough for discounts, Add to Cart.

### Product Detail
Image gallery (main shot + secondary views). Four tabs: **Description, Specifications, Warranty, Reviews**. Specs table: cooling capacity, power supply, refrigerant (R32), compressor type, energy rating, AC type, recommended room size. A **room-size calculator** in the sidebar (input room dimensions → suggests BTU capacity). Related products section. Since installation is a required step (not optional) for split/cassette/ducted units, show this clearly on the page — for ceiling-mounted units (cassette/ducted), note that a site survey is required before installation.

### Services
One card per service type (gas refill, duct cleaning, AMC, relocation/uninstall, emergency same-day, old unit disposal), each with a "Request Service" CTA opening a request form (saved to DB, same WhatsApp-push pattern as orders).

### Cart / Checkout
Checkout form fields: name, phone, NIC/driving licence number (for installer verification), preferred install date, and a **fulfillment choice**:
- **Deliver to my address** — collects delivery address, notes "islandwide, within 3 working days."
- **Collect at showroom** — notes "pay by cash or card in person," "order held for 5 days after confirmation."

On submit: save the order to the database first (always, regardless of what happens next), then attempt the WhatsApp push. Show the customer an order confirmation page with an order number and a message like "we call to confirm."

## Admin Panel

The admin panel controls the entire site — no page copy or catalog change should require a code deploy. Protect all `/admin/*` routes with a NextAuth session check.

```
/admin                          Dashboard — orders, service requests, and any
                                 WhatsApp-push failures needing attention
/admin/products                 Product list, create/edit, image upload
                                 (with background removal — see below)
/admin/brands                   Brand CRUD
/admin/categories               Category CRUD
/admin/orders                   Order list/detail, status updates,
                                 whatsappStatus flag with manual retry button
/admin/service-requests         Service request list/detail, status updates
/admin/content/home              Hero banner text/image, value props,
                                 best-seller picks
/admin/content/testimonials      Testimonial CRUD (add/edit/reorder/publish)
/admin/content/pages             Editable text blocks for About, Installation,
                                 Room Size Guide, and Services descriptions
/admin/settings                  Contact info, business hours, social links,
                                 free-delivery threshold, logo upload
/admin/users                     Admin user management (only build this if
                                 more than one staff member needs a login —
                                 otherwise a single seeded admin account is fine)
```

Build product/brand/category/order/service-request CRUD as standard admin table + form views. For the content sections (`/admin/content/*`), a simple rich-text or markdown editor per field is enough — don't build a full page-builder.

## Product Photo Background Removal

When an admin uploads a product photo, it should be processed automatically so every product photo looks consistent on the site — no manual photo editing per upload.

**Flow:**
1. Admin uploads a raw image via `/admin/products` (or a dedicated image manager).
2. The raw file is stored (e.g. to Vercel Blob/Cloudinary) and a `ProductImage` row is created with `status: "pending"`.
3. A server-side call sends the image to the background-removal provider and gets back a **transparent PNG**.
4. The transparent PNG is stored as `processedUrl`, and `status` is updated to `"processed"` (or `"failed"` if the call errors — never block the upload flow on this succeeding).
5. Show the admin a before/after preview so they can retry the upload if the cutout came out wrong (glare, busy background, etc.).

**Provider:** implement this behind a single interface, e.g. `lib/background-removal.ts` exporting `removeBackground(imageUrl: string): Promise<string>`, so the provider is swappable via config/env var rather than hardcoded. Use **remove.bg** (`REMOVE_BG_API_KEY` env var) — free tier covers low volume, dedicated product-photo background removal, and there's no reason to add Cloudinary as a second vendor just for this since image storage is already on Cloudflare R2.

**Display — the standard product-image frame:** the transparent PNG is displayed everywhere (shop cards, PDP gallery, admin previews) inside a shared component, e.g. `<ProductImageFrame>`, that applies this styling as a CSS wrapper — **do not bake this into the stored image file**:

```css
.product-image-frame {
  background: #F2F5F8;
  border: 1px solid #E5EAF0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border-radius: 8px; /* adjust to match the rest of the card system */
}
```

Keeping this as a display-time wrapper (rather than compositing the background into the saved file) means the background color/border/shadow can be adjusted globally later without reprocessing every product photo, and the same cutout can be reused on a differently-styled background elsewhere (e.g. a promo banner) if needed.

## Data Model (Prisma schema — implement close to this)

```prisma
model Product {
  id                String   @id @default(cuid())
  slug              String   @unique
  name              String
  brand             Brand    @relation(fields: [brandId], references: [id])
  brandId           String
  category          Category @relation(fields: [categoryId], references: [id])
  categoryId        String
  capacityBTU       Int
  energyRating      String
  acType            String   // "inverter" | "non-inverter"
  refrigerant       String?  // e.g. "R32"
  price             Decimal
  discountPrice     Decimal?
  warrantyParts     String   // e.g. "2 years"
  warrantyCompressor String  // e.g. "10 years" (inverter) / "5 years" (non-inverter)
  recommendedRoomSize String? // e.g. "Up to 120 sq ft"
  images            String[] // display order of processed ProductImage URLs
  stock             Int      @default(0)
  isFeatured        Boolean  @default(false)
  isBestSeller      Boolean  @default(false)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

model Brand {
  id       String    @id @default(cuid())
  name     String    @unique
  logoUrl  String?
  products Product[]
}

model Category {
  id       String    @id @default(cuid())
  name     String    @unique // Split | Cassette | Ducted | Floor Standing | Portable
  slug     String    @unique
  products Product[]
}

model Order {
  id                   String   @id @default(cuid())
  orderNumber          String   @unique
  items                Json     // [{ productId, name, qty, price }]
  total                Decimal
  deliveryFee          Decimal  @default(0)
  fulfillment          String   // "delivery" | "showroom-pickup"
  customerName         String
  phone                String
  nicNumber            String?
  address              String?
  preferredInstallDate DateTime?
  whatsappStatus       String   @default("pending") // pending | sent | failed
  status               String   @default("new")      // new | contacted | confirmed | delivered_installed
  createdAt            DateTime @default(now())
}

model ServiceRequest {
  id            String   @id @default(cuid())
  type          String   // gas-refill | duct-cleaning | amc | relocation | emergency | disposal
  customerName  String
  phone         String
  address       String
  preferredDate DateTime?
  status        String   @default("new")
  createdAt     DateTime @default(now())
}

model ProductImage {
  id           String   @id @default(cuid())
  product      Product  @relation(fields: [productId], references: [id])
  productId    String
  originalUrl  String   // raw upload, kept for reprocessing/touch-up
  processedUrl String?  // background-removed transparent PNG
  status       String   @default("pending") // pending | processed | failed
  sortOrder    Int      @default(0)
}

model SiteSettings {
  id                     Int      @id @default(1) // singleton row
  phone                  String
  whatsapp               String
  email                  String
  headOfficeAddress      String
  engineeringDeptAddress String
  businessHours          Json
  socialLinks            Json
  freeDeliveryThreshold  Decimal
  logoUrl                String?
}

model Testimonial {
  id            String  @id @default(cuid())
  customerName  String
  rating        Int
  quote         String
  isPublished   Boolean @default(false)
  sortOrder     Int     @default(0)
}

model PageContent {
  id        String   @id @default(cuid())
  pageKey   String   @unique // "about" | "installation" | "room-size-guide" | "home-hero" | ...
  title     String?
  body      String   // markdown or rich-text JSON, editor's choice
  updatedAt DateTime @updatedAt
}
```

Admin auth: use NextAuth with a Credentials provider backed by a `User` model (email, passwordHash, role). A single seeded admin account is enough to start — only build out a full user-management UI if the client confirms more than one staff member needs a login.

## API Routes

- `POST /api/orders` — validate input, create `Order` row (status `pending` for whatsappStatus), then call the WhatsApp push helper. Update `whatsappStatus` to `sent` or `failed` based on the result. **Never block order creation on the WhatsApp call succeeding** — the DB write must always happen first and independently.
- `POST /api/service-requests` — same pattern.
- `POST /api/admin/products/[id]/images` — accepts a raw image upload, stores it, creates a `ProductImage` row, calls the background-removal helper, and returns both `originalUrl` and `processedUrl` (or `status: "failed"`) so the admin UI can show the before/after preview.
- `GET/POST/PATCH /api/admin/products`, `/brands`, `/categories` — protected CRUD.
- `GET/PATCH /api/admin/orders`, `/service-requests` — list/detail + status updates; a retry endpoint (`POST /api/admin/orders/[id]/retry-whatsapp`) for anything stuck on `whatsappStatus: failed`.
- `GET/PATCH /api/admin/content/[pageKey]` — read/update a `PageContent` row.
- `GET/POST/PATCH /api/admin/testimonials` — CRUD.
- `GET/PATCH /api/admin/settings` — read/update the singleton `SiteSettings` row.

All `/api/admin/*` routes require an authenticated NextAuth session.

## WhatsApp Business API Integration

- Use environment variables: `WHATSAPP_API_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_BUSINESS_ACCOUNT_ID`, `IMT_NOTIFY_NUMBER` (the number that receives notifications — currently 0766644460).
- Also: `REMOVE_BG_API_KEY` — see the Product Photo Background Removal section above. Plus `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_ACCOUNT_ID` for Cloudflare R2 (image storage), and `DATABASE_URL` / Neon adapter config per the Tech Stack section above.
- Write a single helper, e.g. `lib/whatsapp.ts`, exporting `sendOrderNotification(order)` and `sendServiceRequestNotification(request)`, both calling the WhatsApp Cloud API `messages` endpoint with an approved message template (template name/params are a config value, not hardcoded, since the approved template content may change).
- Wrap every call in try/catch; on failure, log the error and set `whatsappStatus: "failed"` rather than throwing — the customer-facing order confirmation should succeed either way.
- In the admin dashboard, surface any order with `whatsappStatus: "failed"` so it can be retried or handled manually.

## Seed / Placeholder Content

Until final content arrives, seed the database with realistic placeholder data drawn from the mockups so the site isn't empty during development:

- **Brands:** Daikin, Midea, Panasonic, LG, Hitachi, Samsung (⚠️ not yet confirmed as final — see note below).
- **Sample products/prices:** e.g. Daikin 1.0–2.5HP Inverter Split AC, LG 1.5–2.0HP Dual Inverter AC, Panasonic 1.5HP Deluxe Inverter AC, Midea 1.5–3.0HP (Split/Cassette), roughly spanning LKR 69,900–349,800 depending on capacity/type.
- **Trust copy (draft, not yet client-confirmed):** "IMT-certified technicians, not subcontractors," "Registered with Daikin Sri Lanka."
- **Real contact info to use everywhere (don't use the mockup's placeholder numbers 076 123 4567 / 077 456 7890):** hotline/WhatsApp **0766644460**, email **imtengineersmd@gmail.com**, head office **59/A Panapitiya, Karandeniya**, engineering dept **222 Egodauyana, Modara, Moratuwa**. Business hours: Mon–Fri 8:00–5:00, Sat 8:00–1:00, Sun closed.

⚠️ **Do not treat the following as final — flag them back to the client before launch:** the brand list (has changed across every draft so far), the "Colombo 04" showroom mentioned in one mockup (doesn't match either real address on file), and the trust-copy claims above.

## Explicitly Out of Scope for This Build

- No online payment gateway (no PayHere, no Stripe, nothing card-related).
- No customer accounts/login — cart is session-based only.
- No multi-language support for now (Sinhala content may come later — structure text so it *could* be extracted to a translation file later, but don't build the i18n system now).

## Suggested Build Order

1. Account setup: Cloudflare (Pages + R2), Neon (database), remove.bg — all free, all before writing code.
2. Project scaffold with the Cloudflare adapter configured from the start, Prisma schema + migrations using the Neon driver adapter, seed script with placeholder data above.
3. Home, Shop, Category, Product Detail pages (static/read-only first).
4. Cart (client-side state) → Checkout form → `/api/orders` → Order Confirmation.
5. WhatsApp API helper + wiring into the orders/service-requests routes.
6. Admin auth (NextAuth, single seeded account) + `/admin` shell.
7. Admin: Products/Brands/Categories CRUD, then the image upload + background-removal pipeline (`ProductImage`, `<ProductImageFrame>` component, storing to R2).
8. Admin: Orders and Service Requests views, including the WhatsApp-retry action.
9. Admin: content editing (`/admin/content/*`, `/admin/settings`) — wire these into the public Home, About, Installation, Services, and Room Size Guide pages so they read from the database instead of hardcoded copy.
10. Domain: point the purchased domain's DNS at Cloudflare Pages.
11. Polish: SEO metadata, analytics, accessibility pass.
