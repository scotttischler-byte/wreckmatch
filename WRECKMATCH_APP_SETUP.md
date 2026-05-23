# WreckMatch App Setup

The WreckMatch support app lives in this Next.js repo under the `(wreckmatch)` route group.

## Status checklist

| Item | Status |
|------|--------|
| All 9 app screens built | **Done** |
| Production build (`npm run build`) | **Done** |
| Supabase deps + clients + middleware | **Done** |
| SQL migrations (schema + attorney seeds) | **Done** — you run them in Supabase |
| Demo mode (browse without Supabase) | **Done** |
| Real auth (email + Google) | **Needs your Supabase keys** |
| Database live | **Needs migration run in Supabase** |
| Google OAuth | **Needs Supabase + Google Cloud setup** |

Run `npm run wreckmatch:check` anytime to see what's left.

## Quick start (demo — works now)

```bash
npm install
npm run dev
```

Open **http://localhost:3000/splash** → click **Explore demo (no account needed)** to browse the full app with sample data.

## Go live with real accounts

1. Copy env template:

```bash
cp .env.example .env.local
```

2. Add your Supabase values to `.env.local` (Dashboard → Project Settings → API):

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

3. Run migrations in Supabase SQL Editor (in order):

- `supabase/migrations/001_wreckmatch_initial.sql`
- `supabase/migrations/002_seed_attorneys.sql`

4. Restart dev server: `npm run dev`

5. Sign up at **http://localhost:3000/signup**

## Google OAuth (optional)

1. Supabase Dashboard → Authentication → Providers → enable Google
2. Redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `https://your-production-domain.com/auth/callback`
3. Add the same URLs in Google Cloud OAuth client

## Routes

| Path | Description |
|------|-------------|
| `/splash` | Welcome screen |
| `/onboarding` | 5-step onboarding wizard |
| `/login`, `/signup` | Email + Google auth |
| `/home` | Dashboard with quick actions and feeds |
| `/community` | Community feed |
| `/matches` | Peer support + attorney tabs |
| `/matches/attorney/[id]` | Attorney detail with legal disclaimer |
| `/resources` | Crisis and educational links |
| `/profile` | Anonymous mode, sign out |

## Notes

- **Demo mode** activates automatically when Supabase keys are missing or still placeholders.
- Protected routes require auth once Supabase is configured.
- Seed data powers feeds and matches until live Supabase rows exist.
- Marketing homepage (`/`) and mini-sites are unchanged.
- Crisis Help button links to `tel:988`.

## Folder structure

```
src/app/(wreckmatch)/      # App pages
src/components/wreckmatch/ # UI components
src/lib/wreckmatch/        # Models, Supabase, actions, seed data
supabase/migrations/       # Database schema + seeds
scripts/check-wreckmatch-setup.mjs
```
