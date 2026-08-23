# Pre-Deployment Checklist for Cloudflare Pages

Complete these steps before deploying to production.

## 1. Environment & Secrets Setup

- [ ] Generate new `NEXTAUTH_SECRET` for production:
  ```bash
  # On your machine (not in code)
  openssl rand -base64 32
  ```
  Save this value — you'll add it to Cloudflare Pages

- [ ] Verify all credentials in `.env.local`:
  - [ ] `DATABASE_URL` — Neon connection string (with `?sslmode=require&channel_binding=require`)
  - [ ] `CLOUDINARY_CLOUD_NAME`
  - [ ] `CLOUDINARY_API_KEY`
  - [ ] `CLOUDINARY_API_SECRET`
  - [ ] `REMOVE_BG_API_KEY`

- [ ] **NEVER commit `.env.local`** — it's in `.gitignore`, keep it that way

## 2. Local Testing

- [ ] Run `npm run dev` and test:
  - [ ] Homepage loads
  - [ ] Shop page filters by category
  - [ ] Cart adds/removes items
  - [ ] Checkout completes
  - [ ] Order confirmation shows WhatsApp button
  - [ ] Admin login works (`/admin/login`)
  - [ ] Admin can view products, orders, categories
  - [ ] Image upload processes (Cloudinary + background removal)

- [ ] Run `npm run build:cf` locally:
  ```bash
  cd web
  npm run build:cf
  ```
  ✓ Build should complete without errors
  ✓ `.open-next/` directory should be created

## 3. Database Readiness

- [ ] Neon database is created and seeded:
  ```bash
  npm run db:seed
  ```
  ✓ 13 products loaded
  ✓ 6 brands loaded
  ✓ 5 categories loaded
  ✓ Default admin user created (admin@imtengineers.lk / changeme123)

- [ ] Test database connection:
  ```bash
  npm run db:studio
  ```
  ✓ Prisma Studio opens and shows all tables

## 4. GitHub Repository Setup

- [ ] Repository is public or has Cloudflare as collaborator
- [ ] All untracked files are committed:
  ```bash
  git status
  ```
  ✓ Only `node_modules/`, `.next/`, `.open-next/` should be untracked (in .gitignore)

- [ ] `.env.local` is NOT committed (check `.gitignore` includes it)
- [ ] Latest changes are pushed to main branch:
  ```bash
  git push origin main
  ```

## 5. Cloudflare Account Setup

- [ ] Cloudflare account exists with Pages enabled
- [ ] Domain `imtengineers.lk` is added to Cloudflare:
  - [ ] Nameservers updated at domain registrar
  - [ ] DNS propagated (can take up to 24 hours)

## 6. Create Cloudflare Pages Project

1. Go to **Cloudflare Dashboard** → **Workers & Pages** → **Pages**
2. Click **Create Application** → **Connect to Git**
3. Authorize GitHub and select your repository
4. Choose branch: **main**

### Build Configuration
- **Build command:** `npm run build:cf`
- **Build output directory:** `.open-next/assets`
- **Node.js version:** 20.x (or latest)

### Environment Variables
In **Settings** → **Environment variables**, add ALL of these:

**Production (if deploying to production)**
```
DATABASE_URL = (paste your Neon URL)
NEXTAUTH_SECRET = (paste generated secret from step 1)
NEXTAUTH_URL = https://imtengineers.lk
CLOUDINARY_CLOUD_NAME = m0vxataf
CLOUDINARY_API_KEY = 189445543762553
CLOUDINARY_API_SECRET = U9XxTKxiSUkp4jTkwbuIp7wOdXw
REMOVE_BG_API_KEY = pW5HRrnDnrDBMERWw4anfRHx
```

For sensitive values (DATABASE_URL, NEXTAUTH_SECRET, API keys), mark them as **Secret** so they don't appear in logs.

### Preview Environment (optional)
- [ ] Add same variables to Preview environment if you want preview branches to work

## 7. Deploy

- [ ] Push main branch (if not already)
- [ ] Cloudflare should automatically trigger a build
- [ ] Monitor **Deployments** tab for build progress
- [ ] Once build completes, click the deployment to view it

## 8. Post-Deploy Verification

After deployment, test these flows in production:

- [ ] Homepage loads at https://imtengineers.lk
- [ ] Products and images display correctly
- [ ] Admin login works at https://imtengineers.lk/admin/login
  - Username: `admin@imtengineers.lk`
  - Password: `changeme123` (change this immediately in production!)
- [ ] Cart functionality works
- [ ] Checkout creates order
- [ ] Order confirmation page loads
- [ ] WhatsApp button on order confirmation works
- [ ] Admin dashboard loads
- [ ] Check browser console for errors (DevTools → Console)
- [ ] Check Cloudflare logs (Pages → Deployments → build logs)

## 9. Post-Deploy Configuration

- [ ] **Change admin password** immediately:
  - Log in to admin panel
  - Go to Settings
  - Change from default `changeme123` to a secure password

- [ ] Test email notifications (if implementing):
  - Create test order
  - Verify confirmation email sent

- [ ] Monitor Neon database performance:
  - Go to Neon dashboard
  - Check connection pool usage
  - Set up alerts if needed

- [ ] Monitor Cloudinary usage:
  - Check storage and transformation limits
  - Set up alerts if near free tier limits

## 10. Rollback Plan

If deployment has critical issues:

1. Go to Cloudflare Pages → Deployments
2. Find the last stable deployment
3. Click "Rollback" to restore previous version
4. Fix the issue locally
5. Push new commit to trigger rebuild

## 11. Monitoring & Alerts

- [ ] Set up Cloudflare Analytics:
  - Track requests, bandwidth, errors
  - Set up alerts for spike in errors

- [ ] Monitor Neon database:
  - Check active connections
  - Monitor query performance
  - Set up connection alerts

- [ ] Monitor Cloudinary:
  - Track monthly transformations
  - Set alerts for approaching free tier limit (25 GB)

## Troubleshooting

**Build fails:**
```
Check: npm run build:cf locally to see error
Usually: missing env var, TypeScript error, or dependency issue
```

**Site shows "Error 523 - Origin Unreachable":**
```
Check: Database connection (DATABASE_URL in Cloudflare)
Usually: Database is down or connection string is wrong
```

**Images don't load:**
```
Check: Cloudinary credentials in Cloudflare Pages env vars
Check: CORS settings in Cloudinary dashboard
```

**Admin login fails:**
```
Check: NEXTAUTH_SECRET matches between Cloudflare and local
Clear browser cookies and try again
Check: User exists in database
```

---

**After completing all steps, your site is live at https://imtengineers.lk** ✓
