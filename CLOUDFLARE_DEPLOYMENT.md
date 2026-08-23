# Cloudflare Pages Deployment Guide

This guide covers deploying the IMT Engineers website to Cloudflare Pages.

## Prerequisites

- Cloudflare account with Pages enabled
- Git repository (GitHub, GitLab, or Bitbucket)
- All environment variables configured

## Deployment Methods

### Method 1: GitHub Integration (Recommended)

**Automatic deployments on every push to main branch.**

1. **Connect GitHub to Cloudflare:**
   - Go to Cloudflare Dashboard → Workers & Pages → Pages → Create Application
   - Select "Connect to Git"
   - Authorize GitHub
   - Select your repository

2. **Configure Build Settings:**
   - **Build command:** `npm run build:cf`
   - **Build output directory:** `.open-next/assets`
   - **Node.js version:** 20 (or higher)

3. **Add Environment Variables:**
   - In Cloudflare Pages project settings → Environment Variables
   - Add ALL variables from `.env.example`:
     - `DATABASE_URL`
     - `NEXTAUTH_SECRET`
     - `NEXTAUTH_URL` (set to your production domain)
     - `CLOUDINARY_*` credentials
     - `REMOVE_BG_API_KEY`
     - Any other optional services

4. **Set Secrets (sensitive values):**
   - In Environment Variables, mark as "Secret" for:
     - `DATABASE_URL`
     - `NEXTAUTH_SECRET`
     - All `CLOUDINARY_*` values
     - `REMOVE_BG_API_KEY`

5. **Custom Domain:**
   - In project settings → Custom domain
   - Add `imtengineers.lk` (or your domain)
   - Update DNS with Cloudflare nameservers

---

### Method 2: Manual Deployment (wrangler CLI)

**For testing or one-off deployments.**

1. **Install Wrangler CLI:**
   ```bash
   npm install -g wrangler
   ```

2. **Authenticate:**
   ```bash
   wrangler login
   ```

3. **Build:**
   ```bash
   npm run build:cf
   ```

4. **Deploy:**
   ```bash
   npm run deploy:cf
   ```

---

## Environment Variables for Production

Set these in Cloudflare Pages → Environment Variables:

### Required
- `DATABASE_URL` — Neon PostgreSQL connection string
- `NEXTAUTH_SECRET` — Random 32+ character secret
- `NEXTAUTH_URL` — https://imtengineers.lk (or your domain)

### Image & Background Removal
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `REMOVE_BG_API_KEY`

### Optional (if enabled)
- `WHATSAPP_API_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`
- `WHATSAPP_BUSINESS_ACCOUNT_ID`

---

## Post-Deployment Checklist

After deploying, verify:

- [ ] Site loads at imtengineers.lk
- [ ] Admin login works (`/admin/login`)
- [ ] Products load from database
- [ ] Image uploads process (Cloudinary + remove.bg)
- [ ] WhatsApp button on order confirmation works
- [ ] Database queries are fast (check Neon dashboard)
- [ ] No console errors (browser DevTools)

---

## Monitoring & Troubleshooting

### Check Build Status
- Go to Cloudflare Pages → Deployments
- View build logs for any errors

### Common Issues

**Build fails with "OpenNext not found":**
```bash
# Rebuild locally and push
npm run build:cf
git add .open-next
git commit -m "Add OpenNext build output"
git push
```

**Database connection timeout:**
- Verify `DATABASE_URL` is correct in Cloudflare
- Check Neon dashboard for connection limits
- Ensure `@prisma/adapter-neon` is installed

**Images not loading:**
- Verify Cloudinary credentials are set
- Check CORS settings in Cloudinary dashboard
- Ensure `cloudinary.com` is allowed in CSP

**Admin pages show "Unauthorized":**
- Verify `NEXTAUTH_SECRET` is set (must be same for all servers)
- Clear browser cookies and retry login
- Check CloudFlare Pages logs for auth errors

---

## Rollback

To rollback to a previous deployment:
- Go to Cloudflare Pages → Deployments
- Find the previous successful deployment
- Click "Rollback" to revert

---

## Cost Estimate

**Cloudflare Pages:**
- First 500 deployments/month: Free
- Additional deployments: $0.15 each
- Unlimited requests, bandwidth, and execution time

**Neon (Database):**
- Free tier: 0.5 GB storage, 5 branches
- Paid: From $14/month for production use

**Cloudinary (Images):**
- Free tier: 25 GB storage, 25 GB monthly transformations
- Paid: Usage-based pricing from $99/month

---

## Next Steps

1. Push your repository to GitHub
2. Connect to Cloudflare Pages via GitHub integration
3. Configure environment variables
4. Monitor first deployment in Cloudflare dashboard
5. Test all critical flows (shop, cart, checkout, admin)
