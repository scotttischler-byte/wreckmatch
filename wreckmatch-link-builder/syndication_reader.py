"""Load blog syndication JSON for copy-paste social posting."""

from __future__ import annotations

import json
import os
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path

from config import SYNDICATION_DIR_DEFAULT


@dataclass
class SyndicationPost:
    slug: str
    title: str
    url: str
    generated_at: str
    vertical: str
    twitter: str
    linkedin: str
    facebook: str
    reddit_body: str


def syndication_dir() -> Path:
    env = os.getenv("SYNDICATION_DIR", "").strip()
    if env:
        return Path(env)
    return SYNDICATION_DIR_DEFAULT


def load_latest() -> SyndicationPost | None:
    path = syndication_dir() / "latest.json"
    if not path.exists():
        return None
    return _parse(path.read_text(encoding="utf-8"))


def load_all(limit: int = 50) -> list[SyndicationPost]:
    root = syndication_dir()
    if not root.is_dir():
        return []
    posts: list[SyndicationPost] = []
    for f in sorted(root.glob("*.json"), key=lambda p: p.stat().st_mtime, reverse=True):
        if f.name == "latest.json":
            continue
        try:
            posts.append(_parse(f.read_text(encoding="utf-8")))
        except (json.JSONDecodeError, KeyError):
            continue
        if len(posts) >= limit:
            break
    return posts


def _parse(raw: str) -> SyndicationPost:
    data = json.loads(raw)
    return SyndicationPost(
        slug=str(data.get("slug", "")),
        title=str(data.get("title", "")),
        url=str(data.get("url", "")),
        generated_at=str(data.get("generated_at", "")),
        vertical=str(data.get("vertical", "auto")),
        twitter=str(data.get("twitter", "")),
        linkedin=str(data.get("linkedin", "")),
        facebook=str(data.get("facebook", "")),
        reddit_body=str(data.get("reddit_body", "")),
    )


def format_weekend_queue(posts: list[SyndicationPost]) -> str:
    """Plain-text checklist for Sat/Sun posting."""
    lines = [
        "# WreckMatch — Weekend social queue",
        f"Generated {datetime.now().strftime('%Y-%m-%d %H:%M')}",
        "",
    ]
    for i, p in enumerate(posts[:6], 1):
        day = "Saturday" if i <= 3 else "Sunday"
        slot = ["AM LinkedIn", "PM Reddit", "AM Twitter"][ (i - 1) % 3 ]
        lines.extend(
            [
                f"## {day} — Post {((i - 1) % 3) + 1} ({slot})",
                f"**{p.title}**",
                f"URL: {p.url}",
                "",
                "### LinkedIn (copy)",
                p.linkedin or "(empty)",
                "",
                "### Reddit (copy — follow sub rules)",
                p.reddit_body or "(empty)",
                "",
                "### X / Twitter (copy)",
                p.twitter or "(empty)",
                "",
                "---",
                "",
            ]
        )
    return "\n".join(lines)
