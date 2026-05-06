# DEPLOY.md - WreckMatch Production Deployment Guide

This guide takes you from local project to live production on Vercel.

## 1) Prerequisites

1. GitHub account
2. Vercel account (connected to GitHub)
3. Access to:
   - Retell Dashboard
   - GoHighLevel account
   - Domain registrar/DNS provider (for `wreckmatch.com`)

## 2) Prepare Environment Variables

Open `.env.local` and replace all `REPLACE_WITH_...` placeholders.

You will need these exact keys in Vercel:

- `NEXT_PUBLIC_RETELL_PUBLIC_KEY`
- `NEXT_PUBLIC_RETELL_CHAT_AGENT_ID`
- `NEXT_PUBLIC_RETELL_VOICE_AGENT_ID`
- `NEXT_PUBLIC_RETELL_PHONE_NUMBER`
- `GHL_WEBHOOK_URL`
- `DOCUHUB_TEMPLATE_ID`
- `DOCUHUB_TEMPLATE_LINK`
- `NEXT_PUBLIC_SITE_URL`

## 3) Final Local Validation

Run these commands:

```bash
cd /Users/scott/wreckmatch
npm install
npm run lint
npm run build
```

Expected result: all commands pass with no errors.

## 4) Push to GitHub

If repo is already connected, just commit/push latest changes.

```bash
git add .
git commit -m "Production deployment prep"
git push
```

If this is a brand-new repo:

```bash
git init
git add .
git commit -m "Initial production-ready build"
git branch -M main
git remote add origin <YOUR_GITHUB_REPO_URL>
git push -u origin main
```

## 5) Create Project in Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Click **Add New...** -> **Project**
3. Select your GitHub repo
4. Click **Import**
5. Keep framework detected as **Next.js**

## 6) Add Environment Variables in Vercel

In Vercel project:

1. Go to **Settings** -> **Environment Variables**
2. Add each key/value from `.env.local`
3. Add each variable for:
   - Production
   - Preview
   - Development (optional)
4. Click **Save**

Important:
- `NEXT_PUBLIC_SITE_URL` should be your final production URL, e.g. `https://wreckmatch.com`

## 7) Deploy

Option A (Vercel UI):
1. Go to **Deployments**
2. Click **Redeploy** (or deploy from first import)

Option B (CLI):
1. Install CLI once:
   ```bash
   npm i -g vercel
   ```
2. Deploy:
   ```bash
   npm run deploy
   ```

## 8) Connect Custom Domain

1. In Vercel, go to **Settings** -> **Domains**
2. Add:
   - `wreckmatch.com`
   - `www.wreckmatch.com`
3. Vercel will show required DNS records
4. In your DNS provider, add records exactly as shown
5. Return to Vercel and wait until status is **Valid Configuration**

## 9) Post-Deployment Smoke Test

Test on live site:

1. Homepage loads correctly
2. Main CTA opens Retell chat
3. Mobile button opens callback flow
4. 8-step form validates and submits
5. Redirect to `/thank-you` works
6. GHL webhook receives payload

## 10) Fast Recovery Plan

If something breaks:

1. Go to **Vercel -> Deployments**
2. Open previous successful deployment
3. Click **Promote to Production** (or rollback path in UI)
4. Fix issue in code and redeploy

## 11) Notes

- `vercel.json` is already added for predictable install/build configuration.
- `deploy` script is available in `package.json`:
  - `npm run deploy` = build + Vercel production deploy.
