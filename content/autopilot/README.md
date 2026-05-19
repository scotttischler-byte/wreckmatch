# Accident Survival Guide — Autopilot Blog System

Production system to generate **one ultra-local 3,500–5,500+ word blog post per day** for [accidentsurvivalguide.com](https://www.accidentsurvivalguide.com).

## Quick start

```bash
# 1. Install Python deps
pip install -r scripts/autopilot_requirements.txt

# 2. Set OpenAI key (in .env.local or export)
export OPENAI_API_KEY=sk-...

# 3. Build / refresh cities list (~279–300 metros)
python scripts/build_cities_master.py

# 4. Generate one city
python scripts/accident_survival_guide_autopilot.py --city "Austin" --state "Texas"

# 5. Or run daily queue (next highest-priority city)
python scripts/accident_survival_guide_autopilot.py --next --publish-json
```

## Outputs per city

| Path | Purpose |
|------|---------|
| `content/{st}/{city_slug}/index.md` | Full markdown article + schema |
| `content/{st}/{city_slug}/images.md` | 8–10 AI image prompts |
| `content/blog/posts/{slug}.json` | Next.js blog (with `--publish-json`) |
| `content/autopilot/generation.log` | Run log |
| `content/autopilot/queue.json` | Completed cities tracker |

Example: `content/tx/austin-tx/index.md`

## CLI reference

```bash
# Specific city
python scripts/accident_survival_guide_autopilot.py --city "Miami" --state "Florida"

# Next N cities from queue (sorted by accident_hotspot_score)
python scripts/accident_survival_guide_autopilot.py --next
python scripts/accident_survival_guide_autopilot.py --batch 5 --publish-json

# Preview queue
python scripts/accident_survival_guide_autopilot.py --list-next 20

# Dry run (no API)
python scripts/accident_survival_guide_autopilot.py --next --dry-run
```

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `OPENAI_API_KEY` | — | **Required** for generation |
| `OPENAI_MODEL` | `gpt-4o` | Model (use `gpt-4o` for quality) |
| `AUTOPILOT_SITE_URL` | `https://www.accidentsurvivalguide.com` | CTA links |
| `AUTOPILOT_PHONE_DISPLAY` | `(978) 515-6063` | Hotline in CTAs |
| `BLOG_AUTO_PUBLISH` | `false` | `true` → JSON posts as `published` |

## Daily scheduling

### GitHub Actions (recommended)

Workflow: `.github/workflows/autopilot-blog-daily.yml`  
Runs daily at 14:00 UTC, generates **1 post**, commits to repo.  
Add `OPENAI_API_KEY` to GitHub repo secrets.

### Cron on a VPS

```cron
0 6 * * * cd /path/to/wreckmatch && /usr/bin/python3 scripts/accident_survival_guide_autopilot.py --next --publish-json >> /var/log/asg-autopilot.log 2>&1
```

### macOS launchd

Run `scripts/accident_survival_guide_autopilot.py --next` daily via `launchd` plist pointing at your repo.

## Post structure (every article)

1. Immediate steps (Austin/local)
2. City-specific laws, hospitals, hotspots, settlements
3. Insurance company tactics
4. Common injuries
5. Lawyer section + **8-question quiz funnel**
6. Local resources
7. FAQ (schema-ready) + conclusion CTAs

## Example post

See **`content/tx/austin-tx/index.md`** (hand-crafted reference quality).  
Run the script to generate other cities at the same depth.

## Scale math

- **279 cities** in master list (expand via `build_cities_master.py`)
- **1 post/day** ≈ full rotation in ~9 months
- **5 posts/day** (batch cron) ≈ ~56 days for full coverage

## Legal / compliance

All posts are **educational** only. WreckMatch LLC is a **referral service**, not a law firm. Do not present content as legal advice. Review high-risk settlement figures before publishing.

## Related

- Existing Node batch: `npm run blog:generate` (shorter JSON posts)
- Admin publish: `/accidentsurvivalguide/admin/blog`
- Cities TS source: `src/lib/blog/cities.ts`
