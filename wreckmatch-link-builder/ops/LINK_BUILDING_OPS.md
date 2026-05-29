# Link building ops — week of May 22–28, 2026

## This week (completed)

### Product & content (injuredhelp.ai → wreckmatch.com)
- **334 platinum blogs** EN + ES (3,000+ words, quality score 100)
- **644 PowerPoints** (EN + ES) live on `/blog/presentations/`
- **Bilingual blog** (`/es/blog`) + readability updates
- **12 new Colorado truck posts** (Denver, Fort Collins, Lakewood) — published & deployed (`bb0d7f7`)
- Blog autopilot: template → gold → platinum pipeline **without API key**

### Conversion & calls (deployed)
- **Press-1 team IVR** — one call, press 1 to connect (fixes back-to-back rings)
- **Sarah / Retell outbound** on new leads (`RETELL_PHONE_NUMBER` + agent ID)
- GHL: suppress duplicate team-call steps in workflows

### Link building (this repo)
- Link builder tool v1.1 (pilot, dashboard, 4 templates)
- Weekly GitHub Action (Mondays) — needs `GOOGLE_CSE_*` secrets
- **Upgraded today:** 30 prospects, 25 drafts, smart deep links, social tab, firm mail-merge

---

## Today (May 28)

| Done | Item |
|------|------|
| ✅ | Platinum ES padding → all posts 3,000+ words |
| ✅ | 12 Colorado platinum posts + syndication + PPTs |
| ✅ | Deploy `bb0d7f7` to production |
| ✅ | Link builder: `link_targets.py`, syndication tab, firm outreach, pilot 30/25 |
| ✅ | Firm draft generator + weekend social markdown export |
| ⏳ | **You:** Add Google CSE keys → run first live `python pilot.py` |
| ⏳ | **You:** Paste real emails into `data/firm_partners.csv` |

---

## Weekend plan (Sat–Sun May 30–31)

### Saturday AM (90 min) — outreach
1. `cd wreckmatch-link-builder && source .venv/bin/activate`
2. `python pilot.py` (or review CI drafts Monday if CSE not set)
3. Send **15** resource/broken-link emails (personalize first line)
4. Send **10** firm partner emails from `data/drafts/firm_*`
5. Update tracker: `python main.py tracker --update-id … --status contacted`

### Saturday PM (30 min) — social
1. `streamlit run dashboard.py` → **Social Posts** tab
2. Post **LinkedIn** + **X** for latest Colorado truck guide (copy from syndication)
3. Download `data/weekend_social.md` if generated locally:
   ```bash
   python -c "from syndication_reader import format_weekend_queue, load_all; from pathlib import Path; Path('data/weekend_social.md').write_text(format_weekend_queue(load_all(6)))"
   ```

### Sunday (60 min) — press & follow-up
1. **3 Denver/local pitches** using `injuredhelp.ai/content/press/OUTREACH_TEMPLATES.md` + new blog URLs
2. Follow up any **May 22 PR** pieces — ask for a dofollow link to the cited guide
3. Reddit: **1** helpful comment only where rules allow (use syndication `reddit_body`, no spam)

### Monday auto
- GitHub Action runs pilot again (if secrets set)
- Review `wreckmatch-link-builder/data/drafts/` in PR or locally

---

## Weekly targets (ongoing)

| Channel | Per week | Owner |
|---------|----------|--------|
| Resource/broken-link email | 25 sends | Scott |
| Firm footer link ask | 20 firms | Scott |
| Social (LI + X) | 3 posts | Scott/Kathy |
| Press/local | 5 pitches | Scott |
| Reddit | 1–2 quality only | Scott |

**Goal:** 8–15 new referring domains / month at this pace.

---

## Commands cheat sheet

```bash
cd /Users/scott/wreckmatch/wreckmatch-link-builder
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

python pilot.py                          # 30 prospects, 25 drafts
python firm_outreach.py --limit 25       # firm mail-merge
streamlit run dashboard.py               # all tabs incl. Social + Firms
python main.py export -o backup.csv
```

**Env:** `GOOGLE_CSE_API_KEY`, `GOOGLE_CSE_CX`, optional `SYNDICATION_DIR=/Users/scott/injuredhelp.ai/content/syndication`, `BLOG_CONTENT_DIR=/Users/scott/injuredhelp.ai/content/blog`
