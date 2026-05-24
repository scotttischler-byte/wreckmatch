# WreckMatch Link Builder — Grok Handoff Report (v1.1)

**Date:** 2026-05-24  
**Project:** `wreckmatch-link-builder`  
**Location:** `/Users/scott/wreckmatch/wreckmatch-link-builder/`  
**Status:** Enhanced — pilot script, tabbed dashboard, improved templates, error handling

---

## Executive Summary

White-hat, semi-automated backlink tool for [WreckMatch.com](https://www.wreckmatch.com). Finds prospects, drafts outreach, tracks results. **Never auto-sends email.** Rate-limited HTTP, full audit logs, human-in-the-loop workflow.

**v1.1 additions:** `pilot.py` for first campaign, tabbed Streamlit UI, stronger WreckMatch email CTAs, improved error handling/logging.

---

## Commands for Scott (Copy-Paste)

### Start dashboard
```bash
cd /Users/scott/wreckmatch/wreckmatch-link-builder
source .venv/bin/activate
streamlit run dashboard.py
```
Or: `python main.py dashboard` → http://localhost:8501

### Run first pilot
```bash
cd /Users/scott/wreckmatch/wreckmatch-link-builder
source .venv/bin/activate
python pilot.py
```
Or: `python main.py pilot`

**Prerequisite:** `GOOGLE_CSE_API_KEY` and `GOOGLE_CSE_CX` in `.env`

---

## What Changed in v1.1

| Change | Details |
|--------|---------|
| **`pilot.py`** | End-to-end first pilot: 10–20 prospects, email drafts, tracker, JSON report |
| **Dashboard rewrite** | 5 tabs: Dashboard, Prospecting, Email Generator, Tracker, Settings |
| **One-click actions** | Run Pilot, Quick Search, Broken Link Scan, Directory Check |
| **Stats row** | Total, Links Acquired, New, Drafts Ready, Contacted |
| **Email templates** | Stronger CTAs about helping car accident victims; more professional tone |
| **Error handling** | `ProspectorError`, `TrackerError`, `log_error_with_context`, `log_operation` |
| **Prospector** | `find_pilot_prospects()`, `search_queries()`, CSE API error parsing |
| **Tracker** | `outreach_template` updates; safer load/save with exceptions |
| **README** | Step-by-step "Scott's First Pilot — Run Today" section |
| **main.py** | New `pilot` subcommand |

---

## File Inventory

```
wreckmatch-link-builder/
├── pilot.py                # NEW — first pilot runner
├── main.py                 # CLI (+ pilot command)
├── dashboard.py            # REWRITTEN — tabbed UI
├── prospector.py           # + find_pilot_prospects, search_queries
├── outreach_generator.py   # ENHANCED templates + _cta_block()
├── tracker.py              # Better error handling, stats
├── config.py               # + PILOT_SEARCH_QUERIES
├── logger_setup.py         # + log_operation, log_error_with_context
├── rate_limiter.py
├── requirements.txt
├── README.md               # UPDATED — Scott pilot guide
├── GROK_REPORT.md          # This file
├── data/
│   ├── prospects.csv
│   ├── drafts/pilot_*/
│   └── pilot_report_*.json
├── logs/
└── credentials/
```

---

## Architecture

```
pilot.py / dashboard.py
        │
        ├── prospector.py ──► rate_limiter.py (httpx, 6 req/min)
        ├── outreach_generator.py (drafts only)
        └── tracker.py ──► Google Sheets OR data/prospects.csv
```

---

## Pilot Workflow (`pilot.py`)

1. Runs 6 niche queries from `PILOT_SEARCH_QUERIES`:
   - `"car accident lawyer" "resources"`
   - `"car accident lawyer" "helpful links"`
   - etc.
2. Optionally analyzes pages as resource pages (live fetch, rate-limited)
3. Caps at 10–20 unique prospects
4. Saves to tracker (skips duplicate URLs)
5. Generates up to 10 email drafts → `data/drafts/pilot_TIMESTAMP/`
6. Writes JSON report → `data/pilot_report_TIMESTAMP.json`
7. Prints summary + next steps

**Flags:**
- `--no-emails` — prospects only
- `--skip-resource-analysis` — faster, CSE results only
- `--max-emails N` — cap drafts (default 10)

---

## Dashboard Tabs

| Tab | Features |
|-----|----------|
| **Dashboard** | Stats, Run Pilot, Quick Search, Export CSV, mission overview |
| **Prospecting** | One-click: Full Pilot, Search Resources, Broken Links, Directories; advanced mode |
| **Email Generator** | Single draft + batch generate (up to 20) |
| **Tracker** | Stats, filters, inline edit, save |
| **Settings** | Export, config status, query templates, setup help |

---

## Email Templates (Enhanced)

All templates include `_cta_block()` with mission-focused CTA:

> "Every referral helps a car accident victim find qualified legal help when they need it most — at no upfront cost."

| Template | Subject pattern |
|----------|-----------------|
| `broken_link` | Broken link on {site} — resource suggestion for your readers |
| `resource_addition` | A free resource for car accident victims on {site} |
| `unlinked_mention` | Thank you for mentioning WreckMatch — helping more accident victims find us |
| `guest_post` | Guest article to help car accident victims — idea for {site} |

**Brand embedded:** wreckmatch.com, 855-8-WRECKMATCH, free matching mission

---

## Tracker Schema (16 columns)

`id, url, domain, prospect_type, title, status, date_found, date_contacted, response, link_acquired, contact_email, contact_name, outreach_template, notes, broken_url, suggested_replacement`

**Statuses:** new → researched → email_drafted → contacted → follow_up → responded → link_acquired | declined | not_relevant

---

## Safety Rules

| Rule | Implementation |
|------|----------------|
| Rate limit | 6 req/min (configurable) |
| Delays | 8–25s random between requests |
| No auto-send | `review_required=True` always; pilot writes DRAFT headers |
| Logging | `logs/link_builder_YYYYMMDD.log` + structured OPERATION entries |
| Blocked domains | Social, Google, wreckmatch.com |
| User-Agent | Identifies bot + contact email |

---

## Configuration (.env)

```env
GOOGLE_CSE_API_KEY=
GOOGLE_CSE_CX=
GOOGLE_SHEETS_CREDENTIALS_PATH=credentials/google-service-account.json
GOOGLE_SHEETS_SPREADSHEET_ID=
OUTREACH_SENDER_NAME=Scott
OUTREACH_SENDER_EMAIL=scott@wreckmatch.com
MIN_DELAY_SECONDS=8
MAX_DELAY_SECONDS=25
MAX_REQUESTS_PER_MINUTE=6
```

---

## Known Limitations

1. CSE required for automated search (no Google scraping)
2. No email sending — by design
3. No contact email discovery — manual / Hunter.io
4. Broken link scans are slow (rate limits)
5. No robots.txt parser yet
6. Dashboard tab switching is manual (pilot runs inline on Dashboard tab)

---

## Recommended Next Steps

1. **Scott:** Configure `.env` with CSE keys
2. **Scott:** Run `python pilot.py`
3. Review 10 drafts in `data/drafts/pilot_*/`
4. Find contact emails, personalize, send manually
5. Update tracker status to `contacted`
6. Optional: Google Sheets for team visibility
7. Future: Hunter.io integration, robots.txt, follow-up reminders

---

## WreckMatch Brand Reference

| Field | Value |
|-------|-------|
| Website | https://www.wreckmatch.com |
| Phone | 855-8-WRECKMATCH (855-897-3262) |
| Mission | Connect car accident victims with top PI attorneys at no upfront cost |
| Tone | Professional, trustworthy, victim-focused |

---

## Open Questions

- Google Cloud project owner for CSE billing?
- Target states for first outreach wave?
- Competitor domains to block?
- Approval threshold before email-sending integration?

---

*v1.1 report — post-enhancement handoff for Grok.*
