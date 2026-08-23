# Fix: Build Output Not Detected

## The Error
```
✘ [ERROR] Could not detect a directory containing static files 
(e.g. html, css and js) for the project
```

## What Happened
The Cloudflare Pages build system tried to deploy without building first. The `deploy:cf` script has been updated to include the build step.

## Solution

### Option 1: Use GitHub Integration (Recommended)

This is the easiest and most reliable approach:

1. Go to **Cloudflare Dashboard** → **Workers & Pages** → **Pages**
2. Connect your GitHub repository
3. Set **Build command** to: `npm run build:cf`
4. Set **Build output directory** to: `.open-next/assets`
5. Add environment variables (DATABASE_URL, NEXTAUTH_SECRET, etc.)
6. Click Save and Deploy

Cloudflare will automatically handle the build step.

### Option 2: Manual CLI Deployment

If you prefer to deploy from your local machine:

```bash
cd web

# This runs both build and deploy
npm run deploy:cf
```

The script now:
1. Builds the app with OpenNext (`npm run build:cf`)
2. Deploys to Cloudflare Pages (`wrangler pages deploy .open-next/assets`)

## Updated package.json

The `deploy:cf` script has been updated to:

```json
"deploy:cf": "npm run build:cf && wrangler pages deploy .open-next/assets"
```

This ensures the build step always runs before deployment.

## Next Steps

1. If using GitHub integration: Just push to main, Cloudflare will build and deploy automatically
2. If using CLI: Run `npm run deploy:cf` from the `web/` directory

Your site should now deploy successfully! 🚀
