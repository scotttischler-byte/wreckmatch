# QUICK-DEPLOY.md

Fastest path to get WreckMatch live on Vercel.

## 1) One-time setup (2 minutes)

1. Open terminal:

```bash
cd /Users/scott/wreckmatch
```

1. Make sure `.env.local` has real values (no placeholders).
2. Run a quick production check:

```bash
npm install
npm run build
```

If build fails, fix that before deploying.

---

## 2) Push to GitHub (fastest commands)

## If this repo is already connected to GitHub:

```bash
git add .
git commit -m "Production deploy prep"
git push
```

## If this repo is NOT connected yet:

1. Create a new empty GitHub repo first (no README needed).
2. Then run:

```bash
git init
git add .
git commit -m "Initial production-ready commit"
git branch -M main
git remote add origin <YOUR_GITHUB_REPO_URL>
git push -u origin main
```

---

## 3) Deploy on Vercel (UI path, fastest for beginners)

1. Go to [https://vercel.com/new](https://vercel.com/new)
2. Sign in with GitHub
3. Select your `wreckmatch` repo
4. Click **Import**
5. Framework should auto-detect as **Next.js**
6. Before clicking deploy, add these environment variables:

- `NEXT_PUBLIC_RETELL_PUBLIC_KEY`
- `NEXT_PUBLIC_RETELL_CHAT_AGENT_ID`
- `NEXT_PUBLIC_RETELL_VOICE_AGENT_ID`
- `NEXT_PUBLIC_RETELL_PHONE_NUMBER`
- `GHL_WEBHOOK_URL`
- `NEXT_PUBLIC_SITE_URL`

Use the same values from `.env.local`.

1. Click **Deploy**

---

## 4) Optional: deploy from CLI (one command)

Install Vercel CLI once:

```bash
npm i -g vercel
```

Then deploy production:

```bash
npm run deploy
```

(`deploy` script already runs `npm run build && vercel --prod`)

---

## 5) Connect your domain (wreckmatch.com)

1. In Vercel project: **Settings -> Domains**
2. Add:
  - `wreckmatch.com`
  - `www.wreckmatch.com`
3. Copy DNS records Vercel gives you
4. Add those records in your domain provider (GoDaddy/Cloudflare/etc.)
5. Wait until Vercel shows **Valid Configuration**

---

## 6) 3-minute post-deploy smoke test

Open live URL and verify:

1. Homepage loads
2. Main button opens Retell chat
3. Mobile floating button opens callback
4. 8-step form submits
5. Redirect goes to `/thank-you`
6. GHL receives a test lead

If all pass, you are live.