#!/usr/bin/env python3
"""
Accident Survival Guide — Autopilot Blog Generation System
==========================================================
Generates one ultra-local, SEO-optimized 3,500–5,500+ word blog post per run.

Usage:
  python scripts/accident_survival_guide_autopilot.py --city Austin --state Texas
  python scripts/accident_survival_guide_autopilot.py --next
  python scripts/accident_survival_guide_autopilot.py --batch 3 --publish-json
  python scripts/accident_survival_guide_autopilot.py --list-next 10

Environment:
  OPENAI_API_KEY          (required for generation)
  OPENAI_MODEL            (default: gpt-4o)
  AUTOPILOT_PHONE_DISPLAY (default: (978) 515-6063)
  AUTOPILOT_SITE_URL      (default: https://www.accidentsurvivalguide.com)
  BLOG_AUTO_PUBLISH       (true → write content/blog/posts/*.json as published)

Outputs per city:
  content/{state_abbrev}/{city_slug}/index.md
  content/{state_abbrev}/{city_slug}/images.md
  content/blog/posts/{slug}.json  (when --publish-json)
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import textwrap
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

try:
    from dotenv import load_dotenv
except ImportError:
    load_dotenv = None  # type: ignore

ROOT = Path(__file__).resolve().parents[1]
CITIES_PATH = ROOT / "content/autopilot/cities_master.json"
QUEUE_PATH = ROOT / "content/autopilot/queue.json"
LOG_PATH = ROOT / "content/autopilot/generation.log"
CONTENT_ROOT = ROOT / "content"
BLOG_POSTS_DIR = ROOT / "content/blog/posts"

TARGET_WORDS_MIN = 3500
TARGET_WORDS_MAX = 5500
MODEL = os.getenv("OPENAI_MODEL", "gpt-4o")
PHONE = os.getenv("AUTOPILOT_PHONE_DISPLAY", "(978) 515-6063")
SITE_URL = os.getenv("AUTOPILOT_SITE_URL", "https://www.accidentsurvivalguide.com").rstrip("/")


# ---------------------------------------------------------------------------
# Utilities
# ---------------------------------------------------------------------------

def log(msg: str) -> None:
    line = f"[{datetime.now(timezone.utc).isoformat()}] {msg}"
    print(line)
    LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
    with LOG_PATH.open("a", encoding="utf-8") as f:
        f.write(line + "\n")


def load_env() -> None:
    if load_dotenv:
        load_dotenv(ROOT / ".env.local")
        load_dotenv(ROOT / ".env")


def slugify(text: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return re.sub(r"-+", "-", s)


def city_key(city: dict[str, Any]) -> str:
    return f"{city['city_slug']}|{city['state_abbrev']}"


def word_count(text: str) -> int:
    return len(re.findall(r"\b\w+\b", text))


def load_cities() -> list[dict[str, Any]]:
    if not CITIES_PATH.exists():
        raise FileNotFoundError(
            f"Missing {CITIES_PATH}. Run: python scripts/build_cities_master.py"
        )
    data = json.loads(CITIES_PATH.read_text(encoding="utf-8"))
    return data["cities"]


def load_queue() -> dict[str, Any]:
    if QUEUE_PATH.exists():
        return json.loads(QUEUE_PATH.read_text(encoding="utf-8"))
    return {"version": 1, "completed_city_keys": [], "last_city_key": None}


def save_queue(queue: dict[str, Any]) -> None:
    queue["last_run_at"] = datetime.now(timezone.utc).isoformat()
    QUEUE_PATH.write_text(json.dumps(queue, indent=2) + "\n", encoding="utf-8")


def find_city(cities: list[dict], city_name: str, state_name: str) -> dict | None:
    cn, sn = city_name.strip().lower(), state_name.strip().lower()
    for c in cities:
        if c["city"].lower() == cn and (
            c["state"].lower() == sn or c["state_abbrev"].lower() == sn
        ):
            return c
    return None


def next_cities(cities: list[dict], queue: dict, count: int = 1) -> list[dict]:
    done = set(queue.get("completed_city_keys", []))
    pending = [c for c in cities if city_key(c) not in done]
    pending.sort(key=lambda c: c.get("priority_rank", 9999))
    return pending[:count]


# ---------------------------------------------------------------------------
# OpenAI generation
# ---------------------------------------------------------------------------

def get_openai_client():
    load_env()
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY is required. Set it in .env.local or environment.")
    from openai import OpenAI

    return OpenAI(api_key=api_key)


def chat_json(client, system: str, user: str, max_tokens: int = 8000) -> dict:
    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
        response_format={"type": "json_object"},
        temperature=0.55,
        max_tokens=max_tokens,
    )
    content = response.choices[0].message.content or "{}"
    return json.loads(content)


def generate_post_data(client, city: dict[str, Any]) -> dict[str, Any]:
    """Multi-pass generation for depth and local accuracy."""
    loc = f"{city['city']}, {city['state']} ({city['state_abbrev']})"
    base_system = textwrap.dedent(f"""
        You are an expert legal-adjacent EDUCATIONAL content strategist for AccidentSurvivalGuide.com
        (operated by WreckMatch LLC — a legal REFERRAL service, NOT a law firm). Write for someone
        who just had a car crash in {loc}. Tone: calm, empathetic, authoritative, non-salesy but
        conversion-aware. NEVER give specific legal advice. Use phrases like "general education only"
        and "consult a licensed attorney in {city['state']}".

        Output valid JSON only. Be hyper-local: real highway names, hospitals, neighborhoods,
        insurance rules for {city['state']}, statute of limitations, PIP/no-fault/at-fault as applicable.
        Target total article length when rendered: {TARGET_WORDS_MIN}-{TARGET_WORDS_MAX} words.
    """).strip()

    log(f"Generating outline + local facts for {loc}...")
    outline = chat_json(
        client,
        base_system,
        f"""Create JSON with keys:
        - primary_keyword, secondary_keywords (array 8-12)
        - meta_description (155 chars max)
        - intro_hook (2 paragraphs, empathetic)
        - toc_anchors (array of {{id, label}} for 7 main sections)
        - local_hotspots (array 6-8 strings: real roads/intersections in {city['city']})
        - hospitals (array 5-7: real trauma centers/ERs in {city['city']})
        - insurance_summary (3-4 paragraphs worth of bullet strings about {city['state']} laws)
        - statute_of_limitations (detailed educational summary)
        - settlement_ranges (educational ranges for {city['city']} area 2025-2026, with disclaimers)
        - police_dmv (object with contacts/resources)
        """,
        max_tokens=4000,
    )

    log(f"Generating main sections 1-4 for {loc}...")
    sections_1_4 = chat_json(
        client,
        base_system,
        f"""Using this outline context: {json.dumps(outline)[:6000]}
        Return JSON: {{ "sections": [
          {{ "number": 1, "title": "Immediate Steps After a Crash in {city['city']}, {city['state']}",
             "subsections": [{{ "heading": "...", "paragraphs": ["..."], "list": ["..."] }}] }},
          {{ "number": 2, "title": "{city['city']}-Specific Information You Must Know", ... }},
          {{ "number": 3, "title": "How to Deal with Insurance Companies After a {city['city']} Crash", ... }},
          {{ "number": 4, "title": "Common Injuries & What to Expect", ... }}
        ]}}
        Each section needs rich detail. paragraphs arrays should have 3-6 long paragraphs each.
        Include mid-article CTA placeholder: "[CTA_QUIZ_MID]" in section 2 or 3.
        """,
        max_tokens=12000,
    )

    log(f"Generating sections 5-7, FAQ, quiz for {loc}...")
    sections_5_7 = chat_json(
        client,
        base_system,
        f"""Outline: {json.dumps(outline)[:4000]}
        Return JSON with:
        - section_5: lawyer CTA section with "[CTA_QUIZ_FULL]" placeholder, educational
        - quiz: {{ "title", "intro", "questions": [8 questions with field_name and label] }}
          Questions: full name, phone, email, accident date, injury yes/no, medical treatment,
          other driver insurance, police report filed, best time to call
        - section_6: local resources (police, medical, legal aid)
        - section_7_faq: array 12-15 of {{question, answer}} — snippet-ready, local keywords
        - conclusion: 2-3 paragraphs + final CTA
        - internal_links: array 5 suggested anchor texts linking to other city guides
        """,
        max_tokens=12000,
    )

    log(f"Generating image prompts for {loc}...")
    images = chat_json(
        client,
        base_system,
        f"""Return JSON {{ "images": [8-10 items] }} each with:
        title, prompt (detailed for Grok Imagine/Flux/Midjourney), aspect_ratio, usage_note.
        Include: hero crash on {city['city']} street, checklist infographic, local landmark,
        compassionate medical scene, insurance/documents, timeline graphic, attorney consultation
        (educational), mobile quiz CTA mockup. Photorealistic, diverse, respectful, no gore.
        """,
        max_tokens=4000,
    )

    return {
        "outline": outline,
        "sections_1_4": sections_1_4,
        "sections_5_7": sections_5_7,
        "images": images,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "city": city,
    }


# ---------------------------------------------------------------------------
# Markdown assembly
# ---------------------------------------------------------------------------

def render_quiz_block(quiz: dict) -> str:
    lines = [
        "### Free Case Evaluation – Answer 8 Quick Questions",
        "",
        quiz.get("intro", "Take 60 seconds to see if you may qualify for a free attorney consultation."),
        "",
        "| # | Question | Your answer |",
        "|---|----------|-------------|",
    ]
    for i, q in enumerate(quiz.get("questions", [])[:8], 1):
        label = q.get("label", q.get("question", f"Question {i}"))
        lines.append(f"| {i} | {label} | _____________ |")
    lines.extend([
        "",
        f"**→ [Start your free case quiz now]({SITE_URL}/#download)** · **Call 24/7: {PHONE}**",
        "",
        "*Quiz submits to WreckMatch LLC (legal referral service). Not legal advice. No obligation.*",
        "",
    ])
    return "\n".join(lines)


def render_faq_schema(faq: list[dict]) -> str:
    schema_items = []
    for item in faq:
        schema_items.append({
            "@type": "Question",
            "name": item["question"],
            "acceptedAnswer": {"@type": "Answer", "text": item["answer"]},
        })
    schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": schema_items,
    }
    return (
        "\n\n<!-- FAQPage JSON-LD -->\n"
        f"<script type=\"application/ld+json\">\n{json.dumps(schema, indent=2)}\n</script>\n"
    )


def render_article_schema(title: str, description: str, city: dict) -> str:
    schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "description": description,
        "author": {"@type": "Organization", "name": "WreckMatch LLC"},
        "publisher": {"@type": "Organization", "name": "WreckMatch LLC"},
        "datePublished": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        "about": f"Car accident guidance in {city['city']}, {city['state']}",
    }
    return (
        "\n<!-- Article JSON-LD -->\n"
        f"<script type=\"application/ld+json\">\n{json.dumps(schema, indent=2)}\n</script>\n"
    )


def subsection_to_md(sub: dict) -> str:
    parts = []
    if sub.get("heading"):
        parts.append(f"### {sub['heading']}\n")
    for p in sub.get("paragraphs", []):
        parts.append(f"{p}\n")
    if sub.get("list"):
        parts.extend(f"- {item}\n" for item in sub["list"])
        parts.append("")
    return "\n".join(parts)


def section_to_md(sec: dict) -> str:
    num = sec.get("number", "")
    title = sec.get("title", "Section")
    lines = [f"## {num}. {title}\n" if num else f"## {title}\n"]
    for sub in sec.get("subsections", []):
        text = subsection_to_md(sub)
        text = text.replace("[CTA_QUIZ_MID]", render_cta_banner("mid"))
        text = text.replace("[CTA_QUIZ_FULL]", render_quiz_block(sec.get("quiz", {})))
        lines.append(text)
    body = "\n".join(lines)
    body = body.replace("[CTA_QUIZ_MID]", render_cta_banner("mid"))
    return body


def render_cta_banner(position: str) -> str:
    return textwrap.dedent(f"""
    > **Free Accident Case Quiz** — 8 quick questions · No obligation · {city_disclaimer_short()}
    > **[Take the quiz →]({SITE_URL}/#download)** · **Call {PHONE}**
    """).strip() + "\n\n"


def city_disclaimer_short() -> str:
    return "Educational only · WreckMatch LLC is not a law firm"


def build_markdown(data: dict) -> str:
    city = data["city"]
    outline = data["outline"]
    s14 = data["sections_1_4"].get("sections", [])
    s57 = data["sections_5_7"]

    title = (
        f"The Ultimate {city['city']}, {city['state']} Accident Survival Guide: "
        f"What to Do After a Car Crash in 2026"
    )
    primary_kw = outline.get("primary_keyword", f"car accident {city['city']} {city['state']}")
    meta = outline.get("meta_description", "")
    now = datetime.now(timezone.utc).strftime("%B %Y")

    lines = [
        "---",
        f'title: "{title}"',
        f'description: "{meta}"',
        f'city: "{city["city"]}"',
        f'state: "{city["state"]}"',
        f'state_abbrev: "{city["state_abbrev"]}"',
        f'primary_keyword: "{primary_kw}"',
        f"reading_time: 22",
        "---",
        "",
        render_article_schema(title, meta, city),
        "",
        f"# {title}",
        "",
        f"**Last Updated:** {now} | **Reading time:** 20–28 minutes | **Primary topic:** {primary_kw}",
        "",
        textwrap.dedent(f"""
        > **Just had a crash in {city['city']}?** You're not alone. This guide explains what to do
        > in the first minutes, hours, and days — with **{city['city']}-specific** resources.
        > **[Free Survival Guide PDF →]({SITE_URL}/#download)** · **[8-question case quiz →]({SITE_URL}/#download)**
        """).strip(),
        "",
        "## Table of Contents",
        "",
    ]

    toc = outline.get("toc_anchors", [])
    for item in toc:
        lines.append(f"- [{item.get('label', '')}](#{item.get('id', slugify(item.get('label', '')))})")
    lines.append("")

    intro = outline.get("intro_hook", "")
    if isinstance(intro, list):
        for p in intro:
            lines.append(f"{p}\n")
    else:
        lines.append(f"{intro}\n")

    lines.append(render_cta_banner("after-intro"))

    for sec in s14:
        lines.append(section_to_md(sec))

    # Section 5 - lawyer + quiz
    s5 = s57.get("section_5", {})
    if isinstance(s5, dict):
        s5_default = f"When You Need a Car Accident Lawyer in {city['city']}, {city['state']}"
        lines.append(f"## 5. {s5.get('title', s5_default)}\n")
        for p in s5.get("paragraphs", []):
            lines.append(f"{p}\n")
        quiz = s57.get("quiz", {})
        lines.append(render_quiz_block(quiz))

    # Section 6
    s6 = s57.get("section_6", {})
    if isinstance(s6, dict):
        s6_default = f"Local Resources in {city['city']}, {city['state']}"
        lines.append(f"## 6. {s6.get('title', s6_default)}\n")
        for p in s6.get("paragraphs", []):
            lines.append(f"{p}\n")
        for item in s6.get("list", []):
            lines.append(f"- {item}\n")

    # FAQ
    faq = s57.get("section_7_faq", [])
    lines.append(f"## 7. Frequently Asked Questions (FAQ Schema Ready)\n")
    for item in faq:
        lines.append(f"### {item['question']}\n\n{item['answer']}\n")
    lines.append(render_faq_schema(faq))

    conclusion = s57.get("conclusion", "")
    lines.append("## Conclusion + Next Steps\n")
    if isinstance(conclusion, list):
        for p in conclusion:
            lines.append(f"{p}\n")
    else:
        lines.append(f"{conclusion}\n")

    lines.extend([
        f"**→ [Take the Free Accident Case Quiz Now]({SITE_URL}/#download)**  ",
        f"**→ Call our 24/7 hotline: {PHONE}**  ",
        f"**→ [Get a free consultation with a {city['city']} car accident attorney]({SITE_URL}/#download)**",
        "",
        "---",
        "",
        "### Disclaimer",
        "",
        textwrap.dedent(f"""
        AccidentSurvivalGuide.com is an educational resource operated by **WreckMatch LLC**, a legal
        referral service. We are **not** a law firm and do not provide legal advice. Laws in
        {city['state']} change; verify all deadlines and requirements with a licensed attorney.
        Settlement figures are illustrative ranges only. No attorney-client relationship is formed
        by reading this article or using our quiz.
        """).strip(),
        "",
        "### Internal linking",
        "",
    ])
    for link in s57.get("internal_links", []):
        lines.append(f"- {link}")
    lines.append("")

    md = "\n".join(lines)
    wc = word_count(md)
    log(f"Draft word count: {wc}")
    return md


def build_images_md(data: dict) -> str:
    city = data["city"]
    images = data.get("images", {}).get("images", [])
    lines = [
        f"# Image Generation Prompts — {city['city']}, {city['state']}",
        "",
        f"Generated: {data.get('generated_at', '')}",
        "",
        "Use with Grok Imagine, Flux, Midjourney, or DALL·E. All images should feel respectful,",
        "diverse, photorealistic, and appropriate for an educational legal-adjacent site.",
        "",
    ]
    for i, img in enumerate(images, 1):
        lines.extend([
            f"## {i}. {img.get('title', f'Image {i}')}",
            "",
            f"**Aspect ratio:** {img.get('aspect_ratio', '16:9')}  ",
            f"**Usage:** {img.get('usage_note', 'Article body')}",
            "",
            "**Prompt:**",
            "",
            f"> {img.get('prompt', '')}",
            "",
        ])
    return "\n".join(lines)


def markdown_to_blog_json(md: str, data: dict) -> dict:
    """Convert generated markdown to Next.js blog JSON (simplified parser)."""
    city = data["city"]
    outline = data["outline"]
    title_match = re.search(r"^# (.+)$", md, re.MULTILINE)
    title = title_match.group(1) if title_match else f"{city['city']} Accident Guide"
    slug = slugify(f"ultimate-{city['city']}-{city['state']}-accident-survival-guide-2026")

    sections = []
    s14 = data["sections_1_4"].get("sections", [])
    for sec in s14:
        paragraphs = []
        for sub in sec.get("subsections", []):
            paragraphs.extend(sub.get("paragraphs", []))
        sections.append({
            "heading": sec.get("title"),
            "paragraphs": paragraphs[:6],
            "list": sec.get("subsections", [{}])[0].get("list") if sec.get("subsections") else None,
        })

    faq = data["sections_5_7"].get("section_7_faq", [])

    return {
        "slug": slug,
        "title": title,
        "metaDescription": outline.get("meta_description", "")[:160],
        "excerpt": outline.get("intro_hook", [""])[0] if isinstance(outline.get("intro_hook"), list) else str(outline.get("intro_hook", ""))[:200],
        "city": city["city"],
        "state": city["state"],
        "stateAbbr": city["state_abbrev"],
        "stateSlug": city.get("state_slug", slugify(city["state"])),
        "topic": "state-local-laws",
        "status": "published" if os.getenv("BLOG_AUTO_PUBLISH", "").lower() == "true" else "draft",
        "publishedAt": datetime.now(timezone.utc).isoformat(),
        "keywords": outline.get("secondary_keywords", [])[:12],
        "sections": sections,
        "faq": faq[:15],
        "readingTimeMinutes": max(20, word_count(md) // 220),
        "autopilot": True,
        "contentPath": f"content/{city['state_abbrev'].lower()}/{city['city_slug']}/index.md",
    }


def save_outputs(city: dict, md: str, images_md: str, data: dict, publish_json: bool) -> Path:
    out_dir = CONTENT_ROOT / city["state_abbrev"].lower() / city["city_slug"]
    out_dir.mkdir(parents=True, exist_ok=True)

    index_path = out_dir / "index.md"
    images_path = out_dir / "images.md"
    index_path.write_text(md, encoding="utf-8")
    images_path.write_text(images_md, encoding="utf-8")
    log(f"Saved {index_path}")
    log(f"Saved {images_path}")

    if publish_json:
        BLOG_POSTS_DIR.mkdir(parents=True, exist_ok=True)
        post = markdown_to_blog_json(md, data)
        json_path = BLOG_POSTS_DIR / f"{post['slug']}.json"
        json_path.write_text(json.dumps(post, indent=2) + "\n", encoding="utf-8")
        log(f"Saved blog JSON {json_path}")

    return out_dir


def run_generation(city: dict, publish_json: bool = False, dry_run: bool = False) -> None:
    loc = f"{city['city']}, {city['state']}"
    if dry_run:
        log(f"DRY RUN — would generate for {loc}")
        return

    client = get_openai_client()
    data = generate_post_data(client, city)
    md = build_markdown(data)
    images_md = build_images_md(data)

    if word_count(md) < TARGET_WORDS_MIN * 0.7:
        log(f"WARNING: Word count {word_count(md)} below target; consider re-run or model upgrade.")

    save_outputs(city, md, images_md, data, publish_json)

    queue = load_queue()
    key = city_key(city)
    if key not in queue.get("completed_city_keys", []):
        queue.setdefault("completed_city_keys", []).append(key)
    queue["last_city_key"] = key
    save_queue(queue)

    nxt = next_cities(load_cities(), queue, 1)
    if nxt:
        log(f"Next city in queue: {nxt[0]['city']}, {nxt[0]['state']}")
    log(f"Done: {loc}")


# ---------------------------------------------------------------------------
# Queue maintenance
# ---------------------------------------------------------------------------

def sync_queue() -> int:
    """Reconcile the queue with content already on disk so --next never
    regenerates a city that already has a post. Scans published blog JSON and
    generated markdown directories and marks matching cities completed."""
    cities = load_cities()
    queue = load_queue()
    done = set(queue.get("completed_city_keys", []))
    before = len(done)

    # 1) Published blog JSON posts (content/blog/posts/*.json)
    if BLOG_POSTS_DIR.exists():
        for jf in BLOG_POSTS_DIR.glob("*.json"):
            try:
                post = json.loads(jf.read_text(encoding="utf-8"))
            except Exception:
                continue
            c = find_city(cities, post.get("city", ""),
                          post.get("stateAbbr") or post.get("state", ""))
            if c:
                done.add(city_key(c))

    # 2) Generated markdown (content/<state_abbrev>/<city_slug>/index.md)
    for c in cities:
        md = CONTENT_ROOT / c["state_abbrev"].lower() / c["city_slug"] / "index.md"
        if md.exists():
            done.add(city_key(c))

    queue["completed_city_keys"] = sorted(done)
    save_queue(queue)
    log(f"sync-queue: {len(done)} cities marked complete "
        f"({len(done) - before} newly reconciled).")
    return 0


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main() -> int:
    load_env()
    parser = argparse.ArgumentParser(description="Accident Survival Guide autopilot blog generator")
    parser.add_argument("--city", help='City name e.g. "Austin"')
    parser.add_argument("--state", help='State name e.g. "Texas"')
    parser.add_argument("--next", action="store_true", help="Generate next city in priority queue")
    parser.add_argument("--batch", type=int, default=None, help="Number of cities to generate")
    parser.add_argument("--list-next", type=int, help="List next N pending cities and exit")
    parser.add_argument("--sync-queue", action="store_true", help="Reconcile queue with content already on disk and exit")
    parser.add_argument("--publish-json", action="store_true", help="Also write content/blog/posts/*.json")
    parser.add_argument("--dry-run", action="store_true", help="Log only, no API calls")
    parser.add_argument("--continue-on-error", action="store_true", help="Keep going if a single city fails")
    parser.add_argument("--delay", type=float, default=0.0, help="Seconds to wait between cities")
    args = parser.parse_args()

    if args.sync_queue:
        return sync_queue()

    cities = load_cities()
    queue = load_queue()

    if args.list_next:
        pending = next_cities(cities, queue, args.list_next)
        for c in pending:
            print(f"  [{c.get('priority_rank')}] {c['city']}, {c['state']} ({c['state_abbrev']}) — score {c['accident_hotspot_score']}")
        return 0

    targets: list[dict] = []
    if args.city and args.state:
        found = find_city(cities, args.city, args.state)
        if not found:
            log(f"City not found: {args.city}, {args.state}")
            return 1
        targets = [found]
    elif args.next or args.batch:
        targets = next_cities(cities, queue, args.batch or 1)
        if not targets:
            log("Queue complete — all cities generated.")
            return 0
    else:
        parser.print_help()
        return 1

    publish = args.publish_json or os.getenv("BLOG_AUTO_PUBLISH", "").lower() == "true"
    failures = 0
    for idx, city in enumerate(targets):
        try:
            run_generation(city, publish_json=publish, dry_run=args.dry_run)
        except Exception as e:
            log(f"ERROR {city['city']}, {city['state']}: {e}")
            if not args.continue_on_error:
                raise
            failures += 1
        if args.delay and idx < len(targets) - 1:
            time.sleep(args.delay)

    if failures:
        log(f"Batch finished with {failures} failure(s) of {len(targets)} (continue-on-error).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
