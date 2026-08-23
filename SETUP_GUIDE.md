# IMT Engineers — Backend Setup Guide

This covers everything needed to take the site from frontend-only (current state) to fully wired: database, admin auth, WhatsApp notifications, image background removal, file storage, and deployment.

Do these roughly in order — later steps depend on earlier ones.

---

## 1. Neon (PostgreSQL database)

1. Go to https://neon.tech, sign up (no credit card needed for the free tier).
2. Create a new project — name it `imt-engineers`, pick a region close to Sri Lanka (Singapore is usually closest).
3. In the Neon dashboard, open **Connection Details** and copy two things:
   - The pooled connection string (`postgresql://...`) — used by Prisma Migrate / normal tooling.
   - Your project's Neon **API host** — needed for the HTTP driver adapter used at runtime on Cloudflare Workers.
4. In `web/.env.local` (create this file, it's gitignored):
   ```
   DATABASE_URL="postgresql://<user>:<password>@<host>/<db>?sslmode=require"
   ```

### Install Prisma

```bash
cd web
npm install prisma @prisma/client
npm install @prisma/adapter-neon @neondatabase/serverless
npx prisma init
```

This creates `prisma/schema.prisma`. Replace its contents with the schema from the build brief (`Product`, `Brand`, `Category`, `Order`, `ServiceRequest`, `ProductImage`, `SiteSettings`, `Testimonial`, `PageContent`, plus a `User` model for admin auth):

```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["driverAdapters"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  role         String   @default("admin")
  createdAt    DateTime @default(now())
}

// ...paste the rest of the models from the build brief here...
```

### Why the Neon driver adapter matters

Cloudflare Workers can't open raw TCP sockets, so a normal `DATABASE_URL` Prisma client will fail at runtime once deployed (it works fine in local `next dev`, which is why this is easy to miss until deploy day). Wire up the HTTP-based adapter from the start:

```ts
// web/src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool } from "@neondatabase/serverless";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaNeon(pool);

export const prisma = new PrismaClient({ adapter });
```

Use `import { prisma } from "@/lib/prisma"` in every API route instead of instantiating `PrismaClient` directly.

### Migrate and seed

```bash
npx prisma migrate dev --name init
```

Write `prisma/seed.ts` using the placeholder data already in `web/src/data/*.ts` (products, brands, categories, testimonials, services) — those files are your seed content, just insert them via `prisma.product.createMany({...})` etc. Then:

```bash
npx prisma db seed
```

---

## 2. NextAuth (admin login)

```bash
cd web
npm install next-auth bcryptjs
npm install -D @types/bcryptjs
```

1. Create `web/src/lib/auth.ts` with a Credentials provider backed by the `User` model — compare `bcrypt.compare(password, user.passwordHash)`.
2. Create `web/src/app/api/auth/[...nextauth]/route.ts` exporting the NextAuth handler for GET and POST.
3. Add to `.env.local`:
   ```
   NEXTAUTH_SECRET=<run: openssl rand -base64 32>
   NEXTAUTH_URL=http://localhost:3000
   ```
4. Seed a single admin user (email + bcrypt-hashed password) in `prisma/seed.ts`.
5. Protect `/admin/*`: add `web/src/middleware.ts` that checks the NextAuth session token and redirects to a login page if absent. The admin UI already built (`web/src/app/admin/**`) doesn't have a login gate yet — add a `/admin/login` page with a simple credentials form, and wire the middleware to allow that one route through unauthenticated.

---

## 3. WhatsApp Business Cloud API

1. Go to https://developers.facebook.com, create an app of type **Business**.
2. Add the **WhatsApp** product to the app. Meta gives you a **test phone number** for free — good enough for development.
3. From the WhatsApp > API Setup page, copy:
   - Temporary access token (or generate a permanent one via a System User for production)
   - Phone Number ID
   - WhatsApp Business Account ID
4. Create a message template (Meta requires pre-approved templates for business-initiated messages) — e.g. `order_notification` with placeholders for order number, customer name, total. Submission takes a few hours to a day for approval.
5. Add to `.env.local`:
   ```
   WHATSAPP_API_TOKEN=...
   WHATSAPP_PHONE_NUMBER_ID=...
   WHATSAPP_BUSINESS_ACCOUNT_ID=...
   IMT_NOTIFY_NUMBER=94766644460
   WHATSAPP_ORDER_TEMPLATE=order_notification
   ```
6. Implement `web/src/lib/whatsapp.ts`:
   ```ts
   export async function sendOrderNotification(order: Order) {
     try {
       const res = await fetch(
         `https://graph.facebook.com/v20.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
         {
           method: "POST",
           headers: {
             Authorization: `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
             "Content-Type": "application/json",
           },
           body: JSON.stringify({
             messaging_product: "whatsapp",
             to: process.env.IMT_NOTIFY_NUMBER,
             type: "template",
             template: {
               name: process.env.WHATSAPP_ORDER_TEMPLATE,
               language: { code: "en" },
               components: [{ type: "body", parameters: [/* order fields */] }],
             },
           }),
         }
       );
       if (!res.ok) throw new Error(await res.text());
       return "sent" as const;
     } catch (err) {
       console.error("WhatsApp send failed", err);
       return "failed" as const;
     }
   }
   ```
7. Wire this into `POST /api/orders`: create the `Order` row first (always succeeds independently), then call `sendOrderNotification`, then update `whatsappStatus` based on the result. Same pattern for `sendServiceRequestNotification` on `POST /api/service-requests`.
8. The admin Orders page already has a "Retry" button wired to a `TODO` — point it at `POST /api/admin/orders/[id]/retry-whatsapp`, which just re-runs the same send function.

---

## 4. remove.bg (product photo background removal)

1. Sign up at https://www.remove.bg/api — free tier covers ~50 images/month at reduced resolution, paid tiers for full-res/volume.
2. Copy your API key into `.env.local`:
   ```
   REMOVE_BG_API_KEY=...
   ```
3. Implement `web/src/lib/background-removal.ts`:
   ```ts
   export async function removeBackground(imageUrl: string): Promise<string> {
     const res = await fetch("https://api.remove.bg/v1.0/removebg", {
       method: "POST",
       headers: {
         "X-Api-Key": process.env.REMOVE_BG_API_KEY!,
         "Content-Type": "application/json",
       },
       body: JSON.stringify({ image_url: imageUrl, size: "auto" }),
     });
     if (!res.ok) throw new Error(await res.text());
     const buffer = await res.arrayBuffer();
     // upload `buffer` (a PNG) to R2 and return its public URL
     return uploadToR2(buffer, "image/png");
   }
   ```
4. Wire this into `POST /api/admin/products/[id]/images`: store the raw upload to R2 first (`ProductImage.originalUrl`, `status: "pending"`), call `removeBackground`, then update `processedUrl` and `status: "processed"` (or `"failed"` — never block the upload on this step succeeding).
5. The admin Products page already has `AdminImageUploader` built with a simulated processing state (`web/src/components/admin/AdminImageUploader.tsx`) — swap its `setTimeout` fake with a real `fetch("/api/admin/products/[id]/images")` call.

---

## 5. Cloudflare R2 (image storage)

1. In the Cloudflare dashboard, go to **R2** and create a bucket, e.g. `imt-product-images`.
2. Create an **R2 API token** (Account > R2 > Manage API Tokens) with read/write access to that bucket.
3. Add to `.env.local`:
   ```
   R2_ACCOUNT_ID=...
   R2_ACCESS_KEY_ID=...
   R2_SECRET_ACCESS_KEY=...
   R2_BUCKET_NAME=imt-product-images
   R2_PUBLIC_URL=https://<your-r2-public-bucket-domain>
   ```
4. Enable **public access** on the bucket (or put a Cloudflare Worker / custom domain in front of it) so `processedUrl`/`originalUrl` can be plain public URLs the `<ProductImageFrame>` component can load directly.
5. Install the S3-compatible SDK (R2 speaks the S3 API):
   ```bash
   npm install @aws-sdk/client-s3
   ```
6. Implement `web/src/lib/r2.ts`:
   ```ts
   import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

   const s3 = new S3Client({
     region: "auto",
     endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
     credentials: {
       accessKeyId: process.env.R2_ACCESS_KEY_ID!,
       secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
     },
   });

   export async function uploadToR2(body: ArrayBuffer | Buffer, contentType: string) {
     const key = `${crypto.randomUUID()}.png`;
     await s3.send(new PutObjectCommand({
       Bucket: process.env.R2_BUCKET_NAME,
       Key: key,
       Body: Buffer.from(body),
       ContentType: contentType,
     }));
     return `${process.env.R2_PUBLIC_URL}/${key}`;
   }
   ```

---

## 6. Cloudflare Pages deployment

1. Install the OpenNext Cloudflare adapter:
   ```bash
   npm install --save-dev @opennextjs/cloudflare
   ```
2. Add a `wrangler.toml` in `web/`:
   ```toml
   name = "imt-engineers"
   compatibility_date = "2026-01-01"
   compatibility_flags = ["nodejs_compat"]

   [vars]
   # non-secret vars only — secrets go in the Cloudflare dashboard / `wrangler secret put`
   ```
3. Add build/deploy scripts to `package.json`:
   ```json
   {
     "scripts": {
       "build:cf": "opennextjs-cloudflare build",
       "deploy:cf": "opennextjs-cloudflare deploy"
     }
   }
   ```
4. In the Cloudflare dashboard: **Workers & Pages > Create > Pages > Connect to Git**, point it at this repo, set the build command to `npm run build:cf` and the output directory per the OpenNext adapter's docs (currently `.open-next/assets`, check the adapter's README for the exact path since it occasionally changes).
5. Add every secret from `.env.local` (`DATABASE_URL`, `NEXTAUTH_SECRET`, `WHATSAPP_API_TOKEN`, `REMOVE_BG_API_KEY`, `R2_*`, etc.) to the Pages project's **Settings > Environment Variables** — as *secrets*, not plaintext vars, for anything sensitive.
6. First deploy will be a Git push to your connected branch, or `npm run deploy:cf` locally.
7. Point your domain's DNS at the Cloudflare Pages project (CNAME to the `*.pages.dev` address, or use Cloudflare as your registrar's nameservers and add the custom domain directly in the Pages project settings).

---

## 7. Environment variable checklist

Everything that needs to exist in both `web/.env.local` (dev) and the Cloudflare Pages project settings (prod):

```
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
WHATSAPP_API_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_BUSINESS_ACCOUNT_ID=
IMT_NOTIFY_NUMBER=
WHATSAPP_ORDER_TEMPLATE=
REMOVE_BG_API_KEY=
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_URL=
```

---

## What's already built vs. what these steps wire up

The frontend (`web/src/app/**`) and admin panel (`web/src/app/admin/**`) are fully built with placeholder/local-state data and clearly marked `TODO (backend)` comments at every integration point:

- `web/src/app/checkout/page.tsx` — order creation (→ `POST /api/orders`)
- `web/src/components/services/ServiceRequestForm.tsx` — service requests (→ `POST /api/service-requests`)
- `web/src/components/admin/AdminImageUploader.tsx` — image upload + background removal (→ `POST /api/admin/products/[id]/images`)
- `web/src/app/admin/orders/page.tsx` — WhatsApp retry (→ `POST /api/admin/orders/[id]/retry-whatsapp`)
- All other admin pages (`products`, `brands`, `categories`, `content/*`, `settings`) hold their data in local React state — once Prisma is wired up, swap the `useState(seedData)` calls for a `fetch` to the corresponding `/api/admin/*` route.

Once steps 1–6 above are done, go through those files in order and replace the local-state/localStorage logic with real API calls.
