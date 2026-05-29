"""
Pick the best WreckMatch deep link for a prospect (city/state/topic aware).

Scans blog markdown slugs when BLOG_CONTENT_DIR is set (defaults to injuredhelp.ai).
"""

from __future__ import annotations

import os
import re
from dataclasses import dataclass
from pathlib import Path

from config import BRAND

PROJECT_ROOT = Path(__file__).resolve().parent
DEFAULT_BLOG_DIRS = [
    PROJECT_ROOT.parent.parent / "injuredhelp.ai" / "content" / "blog",
    PROJECT_ROOT.parent / "injuredhelp.ai" / "content" / "blog",
    PROJECT_ROOT.parent / "content" / "blog",
]

US_STATES = {
    "alabama": "alabama",
    "alaska": "alaska",
    "arizona": "arizona",
    "arkansas": "arkansas",
    "california": "california",
    "colorado": "colorado",
    "connecticut": "connecticut",
    "delaware": "delaware",
    "florida": "florida",
    "georgia": "georgia",
    "illinois": "illinois",
    "indiana": "indiana",
    "iowa": "iowa",
    "kansas": "kansas",
    "kentucky": "kentucky",
    "louisiana": "louisiana",
    "maine": "maine",
    "maryland": "maryland",
    "massachusetts": "massachusetts",
    "michigan": "michigan",
    "minnesota": "minnesota",
    "mississippi": "mississippi",
    "missouri": "missouri",
    "montana": "montana",
    "nebraska": "nebraska",
    "nevada": "nevada",
    "new-hampshire": "new-hampshire",
    "new-jersey": "new-jersey",
    "new-mexico": "new-mexico",
    "new-york": "new-york",
    "north-carolina": "north-carolina",
    "north-dakota": "north-dakota",
    "ohio": "ohio",
    "oklahoma": "oklahoma",
    "oregon": "oregon",
    "pennsylvania": "pennsylvania",
    "rhode-island": "rhode-island",
    "south-carolina": "south-carolina",
    "south-dakota": "south-dakota",
    "tennessee": "tennessee",
    "texas": "texas",
    "utah": "utah",
    "vermont": "vermont",
    "virginia": "virginia",
    "washington": "washington",
    "west-virginia": "west-virginia",
    "wisconsin": "wisconsin",
    "wyoming": "wyoming",
}

TRUCK_HINTS = ("truck", "semi", "18-wheeler", "fmcsa", "tractor", "commercial")
SEVERE_HINTS = ("wrongful-death", "catastrophic", "brain", "spinal", "severe")


@dataclass(frozen=True)
class LinkTarget:
    url: str
    slug: str
    reason: str


_slug_cache: list[str] | None = None


def _blog_dir() -> Path | None:
    env = os.getenv("BLOG_CONTENT_DIR", "").strip()
    if env:
        p = Path(env)
        return p if p.is_dir() else None
    for candidate in DEFAULT_BLOG_DIRS:
        if candidate.is_dir():
            return candidate
    return None


def _load_slugs() -> list[str]:
    global _slug_cache
    if _slug_cache is not None:
        return _slug_cache
    blog = _blog_dir()
    if not blog:
        _slug_cache = []
        return _slug_cache
    _slug_cache = sorted(
        f.stem for f in blog.glob("*.md") if f.name != "README.md"
    )
    return _slug_cache


def _normalize_place(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def _extract_geo(blob: str) -> tuple[str | None, str | None]:
    """Return (city_slug, state_slug) from URL/title/notes."""
    lower = blob.lower()
    state = None
    for key in sorted(US_STATES, key=len, reverse=True):
        if key.replace("-", " ") in lower or f"-{key}" in lower or f"in-{key}" in lower:
            state = key
            break
    city = None
    states_alt = "|".join(re.escape(k) for k in US_STATES.keys())
    m = re.search(rf"in-([a-z0-9-]+)-(?:{states_alt}|20\d{{2}})", lower)
    if m:
        city = m.group(1)
    if not city:
        m2 = re.search(r"in-([a-z0-9-]+)-", lower)
        if m2 and m2.group(1) not in US_STATES:
            city = m2.group(1)
    return city, state


def _score_slug(slug: str, *, city: str | None, state: str | None, truck: bool, severe: bool) -> int:
    s = slug.lower()
    score = 0
    if state and state in s:
        score += 40
    if city and city in s:
        score += 50
    if truck and any(h in s for h in TRUCK_HINTS):
        score += 35
    elif not truck and "what-to-do-after-a-car-accident-in-" in s:
        score += 25
    if severe and any(h in s for h in SEVERE_HINTS):
        score += 30
    if "2026" in s:
        score += 5
    return score


def pick_link_target(prospect: dict[str, str]) -> LinkTarget:
    """Best deep link for outreach — never only the homepage unless no match."""
    blob = " ".join(
        filter(
            None,
            [
                prospect.get("url", ""),
                prospect.get("title", ""),
                prospect.get("notes", ""),
                prospect.get("domain", ""),
            ],
        )
    )
    city, state = _extract_geo(blob)
    lower = blob.lower()
    truck = any(h in lower for h in TRUCK_HINTS)
    severe = any(h in lower for h in SEVERE_HINTS)

    slugs = _load_slugs()
    best_slug = ""
    best_score = -1
    for slug in slugs:
        sc = _score_slug(slug, city=city, state=state, truck=truck, severe=severe)
        if sc > best_score:
            best_score = sc
            best_slug = slug

    site = BRAND.website.rstrip("/")
    if best_slug and best_score >= 25:
        reason_parts = []
        if city:
            reason_parts.append(f"city:{city}")
        if state:
            reason_parts.append(f"state:{state}")
        if truck:
            reason_parts.append("truck")
        return LinkTarget(
            url=f"{site}/blog/{best_slug}",
            slug=best_slug,
            reason="matched blog slug (" + ", ".join(reason_parts) + ")",
        )

    if state:
        state_guide = f"{site}/what-to-do-after-a-car-accident-in-{state}"
        return LinkTarget(url=state_guide, slug="", reason=f"state hub ({state})")

    if truck:
        return LinkTarget(
            url=f"{site}/truck-accident-evidence-guide",
            slug="",
            reason="national truck evidence guide",
        )

    return LinkTarget(
        url=f"{site}/what-to-do-after-a-car-accident",
        slug="",
        reason="national pillar (no geo match)",
    )


def enrich_prospect_row(row: dict[str, str]) -> dict[str, str]:
    """Add suggested_link fields to a prospect dict."""
    target = pick_link_target(row)
    row = dict(row)
    row["suggested_replacement"] = target.url
    row["suggested_link"] = target.url
    row["suggested_link_reason"] = target.reason
    if target.slug:
        row["notes"] = (row.get("notes") or "").strip()
        note = f"Deep link: {target.url} ({target.reason})"
        row["notes"] = f"{row['notes']}\n{note}".strip() if row["notes"] else note
    return row
