# WreckMatch Link Builder

A **white-hat, semi-automated** backlink prospecting and outreach drafting tool for [WreckMatch.com](https://www.wreckmatch.com) — a free service connecting car accident victims with personal injury attorneys.

This tool **never sends emails automatically**. It finds prospects, drafts personalized outreach, and tracks results — with strict rate limiting and full audit logging.

---

## Scott's First Pilot — Run Today

Follow these steps to run your first safe outreach campaign in under 30 minutes (plus prospecting wait time).

### Step 1: One-time setup (5 min)

```bash
cd /Users/scott/wreckmatch/wreckmatch-link-builder

python3 -m venv .venv
source .venv/bin/activate

pip install -r requirements.txt

cp .env.example .env
```

Edit `.env` and add your Google Custom Search credentials:

```env
GOOGLE_CSE_API_KEY=your_api_key_here
GOOGLE_CSE_CX=your_search_engine_id_here

OUTREACH_SENDER_NAME=Scott
OUTREACH_SENDER_EMAIL=scott@wreckmatch.com
```

**Get CSE keys:** [Google Custom Search API](https://developers.google.com/custom-search/v1/overview) + [Programmable Search Engine](https://programmablesearchengine.google.com/) (search the entire web).

### Step 2: Run the pilot (10–20 min)

```bash
source .venv/bin/activate
python pilot.py
```

This will:
1. Search for **20–30 prospects** in the `"car accident lawyer" + "resources"` niche
2. Classify resource pages where possible
3. Pick a **city/state platinum blog URL** per prospect (not just homepage)
4. Generate **up to 25 personalized email drafts**
4. Save everything to the tracker (`data/prospects.csv`)
5. Write drafts to `data/drafts/pilot_YYYYMMDD_HHMMSS/`
6. Write a JSON report to `data/pilot_report_*.json`

**Alternative (via main CLI):**

```bash
python main.py pilot
```

**Prospects only (no emails):**

```bash
python pilot.py --no-emails
```

**Faster run (skip live page analysis):**

```bash
python pilot.py --skip-resource-analysis
```

### Step 3: Review drafts (15 min)

```bash
# List generated drafts
ls data/drafts/pilot_*/

# Open a draft
cat data/drafts/pilot_*/draft_*.txt
```

For each draft:
1. Find the site owner's email (contact page, About page, or Hunter.io)
2. Personalize the opening line — mention something specific from their page
3. Send manually from your email client
4. **Never bulk-send or auto-send**

### Step 4: Update tracker after sending

```bash
python main.py tracker --update-id PROSPECT_ID --status contacted --date-contacted 2026-05-24
```

Or use the **Tracker** tab in the dashboard to edit inline.

### Step 5: Launch the dashboard (optional UI)

```bash
python main.py dashboard
```

Or:

```bash
streamlit run dashboard.py
```

Open http://localhost:8501 — use tabs: **Dashboard → Prospecting → Email Generator → Tracker → Settings**

---

## Features

| Module | Purpose |
|--------|---------|
| `pilot.py` | **Start here** — safe first-pilot workflow |
| `prospector.py` | Google CSE search, broken links, resource pages, directories |
| `outreach_generator.py` | 4 professional email templates with WreckMatch CTAs |
| `tracker.py` | Google Sheets or local CSV tracking |
| `dashboard.py` | Tabbed Streamlit UI |
| `main.py` | Full CLI |

## Safety Rules (Built-In)

- **Rate limiting:** 6 requests/min, random 8–25 second delays
- **Human review:** All emails are drafts — never auto-sent
- **Audit logging:** Every request logged to `logs/link_builder_YYYYMMDD.log`
- **Blocked domains:** Social media, Google, wreckmatch.com excluded
- **Professional tone:** Helpful, trustworthy — focused on helping accident victims

## Dashboard Tabs

| Tab | Purpose |
|-----|---------|
| **Dashboard** | Stats, one-click pilot, quick search, export |
| **Prospecting** | Run pilot, one-click modes, advanced search |
| **Email Generator** | Single + batch draft generation |
| **Tracker** | View/edit all prospects with filters |
| **Social Posts** | Copy-paste LinkedIn / X / Reddit from blog syndication |
| **Firm Partners** | Mail-merge footer link asks for participating firms |
| **Settings** | Export, config status, query templates |

## CLI Reference

```bash
python main.py pilot                    # Run first pilot
python main.py prospect --mode search   # Custom prospecting
python main.py prospect --mode broken --urls https://example.com/resources
python main.py email --id abc12345 --save
python main.py tracker --stats
python main.py export -o backup.csv
python main.py dashboard
python main.py firm --limit 25
python main.py weekend
python main.py queries
```

See **`ops/LINK_BUILDING_OPS.md`** for weekly targets and weekend checklist.

## Google Sheets (Optional)

1. Create service account → download JSON to `credentials/google-service-account.json`
2. Share spreadsheet with service account email
3. Set `GOOGLE_SHEETS_SPREADSHEET_ID` in `.env`

Without Sheets, data lives in `data/prospects.csv`.

## Email Templates

1. **Broken Link** — Report dead link; suggest WreckMatch replacement
2. **Resource Addition** — Suggest WreckMatch for resource lists
3. **Unlinked Mention** — Thank sites mentioning WreckMatch
4. **Guest Post** — Offer educational content for accident victims

All include WreckMatch mission CTAs: free attorney matching, no upfront cost, 855-8-WRECKMATCH.

## Project Structure

```
wreckmatch-link-builder/
├── pilot.py                # ← Run this first
├── main.py
├── dashboard.py
├── prospector.py
├── outreach_generator.py
├── tracker.py
├── config.py
├── rate_limiter.py
├── logger_setup.py
├── data/                   # Tracker, drafts, pilot reports
├── logs/                   # Audit logs
└── credentials/            # Google service account (optional)
```

## Workflow

```
pilot.py  →  Review drafts  →  Send manually  →  Update tracker  →  Track links acquired
```

## Legal & Ethical Notes

- Only outreach with genuine value (broken link fixes, relevant resources)
- Use official Google Custom Search API — never scrape Google
- Personalize every email; no bulk unsolicited mail
- Keep logs for compliance review

## License

Internal tool for WreckMatch.com outreach operations.
