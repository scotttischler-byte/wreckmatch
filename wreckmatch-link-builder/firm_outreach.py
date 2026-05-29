#!/usr/bin/env python3
"""
Mail-merge drafts for participating firm footer / resource-page backlinks.

Reads data/firm_partners.csv — never sends email automatically.
"""

from __future__ import annotations

import argparse
import csv
import re
from datetime import datetime, timezone
from pathlib import Path

from config import BRAND, AppConfig, FIRM_PARTNERS_CSV

FIRM_COLUMNS = [
    "firm_name",
    "contact_name",
    "contact_email",
    "city",
    "state",
    "firm_website",
    "status",
    "notes",
]

TEMPLATE = """Subject: Quick favor — free victim resource link for {firm_name}

Hi {contact_name},

Hope you're well. We're updating partner resources at WreckMatch and wanted to ask a small favor that helps crash victims find help faster.

Would you add a single line to your website footer or "Resources for clients" page?

  Free post-accident guide (not legal advice): {resource_url}
  Free attorney matching for victims: {brand_site}

WreckMatch is a referral service — not a law firm. There's no cost to your firm for the link; it simply helps people who land on your site after a crash.

If you'd like approved wording or a logo, reply and we'll send it. Thank you for being part of our network.

Best,
{sender_name}
{sender_email}
WreckMatch LLC · {brand_phone}
"""


def _resource_url(state: str) -> str:
    site = BRAND.website.rstrip("/")
    st = (state or "").strip().lower().replace(" ", "-")
    if st and st not in ("", "national"):
        return f"{site}/what-to-do-after-a-car-accident-in-{st}"
    return f"{site}/what-to-do-after-a-car-accident"


def load_firms(config: AppConfig) -> list[dict[str, str]]:
    path = config.data_dir / FIRM_PARTNERS_CSV
    if not path.exists():
        return []
    with path.open(newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def generate_drafts(config: AppConfig | None = None, limit: int = 50) -> Path:
    config = config or AppConfig.from_env()
    firms = load_firms(config)
    if not firms:
        raise FileNotFoundError(
            f"No firms in {config.data_dir / FIRM_PARTNERS_CSV}. "
            "Copy firm_partners.template.csv and add contacts."
        )

    ts = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
    out_dir = config.data_dir / "drafts" / f"firm_{ts}"
    out_dir.mkdir(parents=True, exist_ok=True)

    count = 0
    for row in firms:
        if count >= limit:
            break
        status = (row.get("status") or "pending").lower()
        if status in ("linked", "declined", "skip"):
            continue
        email = (row.get("contact_email") or "").strip()
        name = (row.get("contact_name") or "there").strip()
        firm = (row.get("firm_name") or "your firm").strip()
        body = TEMPLATE.format(
            firm_name=firm,
            contact_name=name,
            resource_url=_resource_url(row.get("state", "")),
            brand_site=BRAND.website,
            brand_phone=BRAND.phone_display,
            sender_name=config.outreach_sender_name,
            sender_email=config.outreach_sender_email,
        )
        safe = re.sub(r"[^a-z0-9]+", "_", firm.lower())[:40]
        draft_path = out_dir / f"firm_{safe}.txt"
        header = (
            "=== FIRM PARTNER OUTREACH (DRAFT) ===\n"
            f"To: {email or '(add email)'}\n"
            "DO NOT AUTO-SEND\n\n"
        )
        draft_path.write_text(header + body, encoding="utf-8")
        count += 1

    summary = out_dir / "_README.txt"
    summary.write_text(
        f"Generated {count} firm partner drafts.\n"
        "Send manually from scott@wreckmatch.com after personalizing.\n",
        encoding="utf-8",
    )
    return out_dir


def main() -> int:
    parser = argparse.ArgumentParser(description="Firm partner backlink mail-merge")
    parser.add_argument("--limit", type=int, default=50)
    args = parser.parse_args()
    try:
        out = generate_drafts(limit=args.limit)
        print(f"Firm drafts ready: {out}")
        return 0
    except FileNotFoundError as exc:
        print(exc)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
