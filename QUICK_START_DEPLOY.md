# Cloudflare Pages Deployment — Quick Start

**TL;DR**: 5-minute setup for deploying to Cloudflare Pages.

## 1. Prepare Your Environment

```bash
# Generate production NEXTAUTH_SECRET (run on your machine)
openssl rand -base64 32

# Build locally to verify (in web/ directory)
npm run build:cf
```

## 2. Push to GitHub

```bash
cd web
git add .
git commit -m "Add Cloudflare deployment configuration"
git push origin main
```

## 3. Connect to Cloudflare Pages

1. Go to **[Cloudflare Dashboard](https://dash.cloudflare.com)**
2. **Workers & Pages** → **Pages** → **Create Application**
3. Select **Connect to Git** → Authorize GitHub → Select repository
4. Choose branch: **main**

## 4. Configure Build Settings

- **Build command:** `npm run build:cf`
- **Build output directory:** `.open-next/assets`
- **Node.js version:** 20

## 5. Add Environment Variables

Click **Settings** → **Environment variables** → Add these:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Your Neon connection string |
| `NEXTAUTH_SECRET` | Generated secret from step 1 |
| `NEXTAUTH_URL` | `https://imtengineers.lk` |
| `CLOUDINARY_CLOUD_NAME` | `m0vxataf` |
| `CLOUDINARY_API_KEY` | `189445543762553` |
| `CLOUDINARY_API_SECRET` | `U9XxTKxiSUkp4jTkwbuIp7wOdXw` |
| `REMOVE_BG_API_KEY` | `pW5HRrnDnrDBMERWw4anfRHx` |

**Mark as "Secret"**: DATABASE_URL, NEXTAUTH_SECRET, all API keys

## 6. Deploy (GitHub Integration — Recommended)

- Cloudflare automatically starts build when you add project
- Monitor **Deployments** tab in Cloudflare dashboard
- Build takes ~2-3 minutes
- ✓ Done! Site is live

**Alternative:** Manual deployment from CLI:

```bash
cd web
npm run deploy:cf
```

(This builds locally, then deploys to Cloudflare Pages)

## 7. Add Custom Domain

1. **Settings** → **Custom domain**
2. Add `imtengineers.lk`
3. Update nameservers at your domain registrar

## Test Login

- URL: `https://imtengineers.lk/admin/login`
- Email: `admin@imtengineers.lk`
- Password: `changeme123`

⚠️ **Change this password immediately in production!**

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails | Run `npm run build:cf` locally to see error |
| "Origin Unreachable" | Check DATABASE_URL in Cloudflare env vars |
| Images don't load | Verify Cloudinary credentials are set |
| Admin login fails | Clear cookies; verify NEXTAUTH_SECRET matches |

---

See **CLOUDFLARE_DEPLOYMENT.md** for detailed docs.
