# WreckMatch Support App (standalone)

**This is a separate product from www.wreckmatch.com.**

The marketing / compliance site (`wreckmatch` repo root) must **never** deploy this folder. This app gets its **own Vercel project** and **own domain** (e.g. `support.wreckmatch.com` or a new `.vercel.app` URL).

## Do NOT

- Attach `www.wreckmatch.com` or `wreckmatch.com` to this project
- Deploy to the `injuredhelp-ai` Vercel project
- Merge this back into the main site root `/`

## Quick start

```bash
cd wreckmatch-support
npm install
cp .env.example .env.local   # add Supabase, GHL, Retell keys
npm run dev
```

Open **http://localhost:3000/splash**

## Deploy (new Vercel project only)

1. In Vercel: **Add New Project** → import repo → set **Root Directory** to `wreckmatch-support`
2. Add env vars (`GHL_WEBHOOK_URL`, `GHL_API_KEY`, `NEXT_PUBLIC_SUPABASE_*`, Retell keys)
3. Assign a **new subdomain** (e.g. `support.wreckmatch.com`) — not the main domain
4. Deploy

```bash
cd wreckmatch-support
npx vercel --prod
```

## Routes

| Path | Description |
|------|-------------|
| `/splash` | Entry — English/Spanish |
| `/help` | Crisis support hub |
| `/home` | Dashboard (demo or signed in) |
| `/login`, `/signup` | Auth |

## Database

Run migrations in Supabase SQL editor:

- `supabase/migrations/001_wreckmatch_initial.sql`
- `supabase/migrations/002_seed_attorneys.sql`
