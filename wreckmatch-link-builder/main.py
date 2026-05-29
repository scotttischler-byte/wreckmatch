#!/usr/bin/env python3
"""
WreckMatch Link Builder — CLI entry point.

Usage:
    python main.py prospect --mode search
    python main.py prospect --mode broken --urls https://example.com/resources
    python main.py email --id abc12345
    python main.py tracker --stats
    python main.py export
    python main.py dashboard
"""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
from pathlib import Path

from config import PILOT_MAX_EMAILS, PILOT_TARGET_MAX, PILOT_TARGET_MIN, AppConfig
from logger_setup import log_safety_reminder, setup_logger
from outreach_generator import OutreachGenerator
from prospector import Prospector, SearchQueryGenerator
from tracker import ProspectTracker, TrackerError

logger = setup_logger(__name__)


def cmd_prospect(args: argparse.Namespace) -> int:
    """Run prospect discovery and save to tracker."""
    config = AppConfig.from_env()
    log_safety_reminder(logger, "CLI prospect command")

    urls = args.urls or None
    prospector = Prospector(config)
    try:
        prospects = prospector.find_prospects(
            mode=args.mode,
            urls=urls,
            max_queries=args.max_queries,
        )
    finally:
        prospector.close()

    if args.queries_only:
        generator = SearchQueryGenerator()
        for q in generator.generate():
            print(q)
        return 0

    if not prospects:
        logger.warning("No prospects found.")
        return 1

    from link_targets import enrich_prospect_row

    tracker = ProspectTracker(config)
    rows = [enrich_prospect_row(p.to_dict()) for p in prospects]
    added = tracker.add_prospects(rows)

    print(f"\nFound {len(prospects)} prospects ({added} new).")
    for p in prospects[: args.limit]:
        print(f"  [{p.prospect_type}] {p.url}")

    if args.json:
        print(json.dumps(rows, indent=2))

    return 0


def cmd_email(args: argparse.Namespace) -> int:
    """Generate outreach email draft for a prospect."""
    config = AppConfig.from_env()
    tracker = ProspectTracker(config)
    df = tracker.load()

    if args.id:
        matches = df[df["id"] == args.id]
        if matches.empty:
            logger.error("Prospect ID not found: %s", args.id)
            return 1
        prospect = matches.iloc[0].to_dict()
    elif args.url:
        matches = df[df["url"] == args.url]
        if matches.empty:
            logger.error("Prospect URL not found: %s", args.url)
            return 1
        prospect = matches.iloc[0].to_dict()
    else:
        eligible = tracker.get_prospects_for_outreach(limit=1)
        if not eligible:
            logger.error("No eligible prospects in tracker.")
            return 1
        prospect = eligible[0]

    generator = OutreachGenerator(config)
    email = generator.generate_for_prospect(
        prospect,
        template_type=args.template,
    )

    print("\n" + "=" * 60)
    print("OUTREACH DRAFT — HUMAN REVIEW REQUIRED BEFORE SENDING")
    print("=" * 60)
    print(f"To:       {email.to_email or '(fill in during review)'}")
    print(f"Subject:  {email.subject}")
    print("-" * 60)
    print(email.body)
    print("=" * 60)

    if args.save:
        out_dir = config.data_dir / "drafts"
        out_dir.mkdir(parents=True, exist_ok=True)
        path = out_dir / f"draft_{prospect['id']}_{email.template_type}.txt"
        path.write_text(
            f"To: {email.to_email}\nSubject: {email.subject}\n\n{email.body}",
            encoding="utf-8",
        )
        print(f"\nSaved to {path}")

        tracker.update_status(prospect["id"], status="email_drafted")

    return 0


def cmd_tracker(args: argparse.Namespace) -> int:
    """View or update tracker."""
    config = AppConfig.from_env()
    tracker = ProspectTracker(config)

    if args.stats:
        stats = tracker.stats()
        print("\nTracker Statistics:")
        for key, value in sorted(stats.items()):
            print(f"  {key}: {value}")
        return 0

    if args.update_id:
        ok = tracker.update_status(
            args.update_id,
            status=args.status,
            response=args.response,
            link_acquired=args.link_acquired,
            notes=args.notes,
            date_contacted=args.date_contacted,
        )
        return 0 if ok else 1

    df = tracker.load()
    if df.empty:
        print("Tracker is empty.")
        return 0

    print(df.to_string(index=False, max_colwidth=50))
    return 0


def cmd_export(args: argparse.Namespace) -> int:
    """Export tracker to CSV."""
    config = AppConfig.from_env()
    tracker = ProspectTracker(config)
    path = tracker.export_csv(Path(args.output) if args.output else None)
    print(f"Exported to {path}")
    return 0


def cmd_pilot(args: argparse.Namespace) -> int:
    """Run the safe first-pilot workflow."""
    from pilot import run_pilot, _print_summary

    try:
        result = run_pilot(
            min_target=args.min_target,
            max_target=args.max_target,
            generate_emails=not args.no_emails,
            max_emails=args.max_emails,
            skip_resource_analysis=args.skip_resource_analysis,
        )
        _print_summary(result)
        return 0
    except Exception as exc:
        logger.exception("Pilot command failed: %s", exc)
        return 1


def cmd_dashboard(args: argparse.Namespace) -> int:
    """Launch Streamlit dashboard."""
    dashboard_path = Path(__file__).parent / "dashboard.py"
    cmd = [sys.executable, "-m", "streamlit", "run", str(dashboard_path)]
    if args.port:
        cmd.extend(["--server.port", str(args.port)])
    print("Launching dashboard…")
    subprocess.run(cmd)
    return 0


def cmd_firm(args: argparse.Namespace) -> int:
    from firm_outreach import generate_drafts

    try:
        out = generate_drafts(limit=args.limit)
        print(f"Firm drafts: {out}")
        return 0
    except FileNotFoundError as exc:
        logger.error("%s", exc)
        return 1


def cmd_weekend(args: argparse.Namespace) -> int:
    from syndication_reader import format_weekend_queue, load_all

    posts = load_all(6)
    if not posts:
        print("No syndication posts found. Set SYNDICATION_DIR.")
        return 1
    config = AppConfig.from_env()
    path = config.data_dir / "weekend_social.md"
    path.write_text(format_weekend_queue(posts), encoding="utf-8")
    print(f"Weekend queue: {path}")
    return 0


def cmd_queries(args: argparse.Namespace) -> int:
    """Print search query templates."""
    generator = SearchQueryGenerator()
    for q in generator.generate():
        print(q)
    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="WreckMatch Link Builder — white-hat backlink prospecting",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=(
            "Safety: Max 6 requests/min with 8–25s random delays. "
            "All emails require human review before sending."
        ),
    )
    sub = parser.add_subparsers(dest="command", required=True)

    # prospect
    p_prospect = sub.add_parser("prospect", help="Find link building prospects")
    p_prospect.add_argument(
        "--mode",
        choices=["search", "resource", "broken", "directories", "all"],
        default="search",
    )
    p_prospect.add_argument("--urls", nargs="+", help="URLs to analyze")
    p_prospect.add_argument("--max-queries", type=int, default=3)
    p_prospect.add_argument("--limit", type=int, default=20, help="Print limit")
    p_prospect.add_argument("--json", action="store_true")
    p_prospect.add_argument(
        "--queries-only",
        action="store_true",
        help="Print search queries without running searches",
    )

    # email
    p_email = sub.add_parser("email", help="Generate outreach email draft")
    p_email.add_argument("--id", help="Prospect ID from tracker")
    p_email.add_argument("--url", help="Prospect URL from tracker")
    p_email.add_argument(
        "--template",
        choices=["broken_link", "resource_addition", "unlinked_mention", "guest_post"],
    )
    p_email.add_argument("--save", action="store_true", help="Save draft to data/drafts/")

    # tracker
    p_tracker = sub.add_parser("tracker", help="View or update tracker")
    p_tracker.add_argument("--stats", action="store_true")
    p_tracker.add_argument("--update-id", help="Prospect ID to update")
    p_tracker.add_argument("--status", choices=[
        "new", "researched", "email_drafted", "contacted", "follow_up",
        "responded", "link_acquired", "declined", "not_relevant",
    ])
    p_tracker.add_argument("--response", help="Response notes")
    p_tracker.add_argument("--link-acquired", choices=["yes", "no"])
    p_tracker.add_argument("--notes", help="Additional notes")
    p_tracker.add_argument("--date-contacted", help="YYYY-MM-DD")

    # export
    p_export = sub.add_parser("export", help="Export tracker to CSV")
    p_export.add_argument("-o", "--output", help="Output file path")

    # pilot
    p_pilot = sub.add_parser("pilot", help="Run weekly pilot (20–30 prospects + drafts)")
    p_pilot.add_argument("--min-target", type=int, default=PILOT_TARGET_MIN)
    p_pilot.add_argument("--max-target", type=int, default=PILOT_TARGET_MAX)
    p_pilot.add_argument("--max-emails", type=int, default=PILOT_MAX_EMAILS)
    p_pilot.add_argument("--no-emails", action="store_true")
    p_pilot.add_argument("--skip-resource-analysis", action="store_true")

    # dashboard
    p_dash = sub.add_parser("dashboard", help="Launch Streamlit dashboard")
    p_dash.add_argument("--port", type=int, default=8501)

    # queries
    sub.add_parser("queries", help="Print search query templates")

    # firm
    p_firm = sub.add_parser("firm", help="Generate firm partner backlink drafts")
    p_firm.add_argument("--limit", type=int, default=25)

    # weekend
    sub.add_parser("weekend", help="Export weekend social posting markdown")

    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()

    commands = {
        "prospect": cmd_prospect,
        "email": cmd_email,
        "tracker": cmd_tracker,
        "export": cmd_export,
        "pilot": cmd_pilot,
        "dashboard": cmd_dashboard,
        "queries": cmd_queries,
        "firm": cmd_firm,
        "weekend": cmd_weekend,
    }

    try:
        return commands[args.command](args)
    except KeyboardInterrupt:
        logger.info("Interrupted by user.")
        return 130
    except Exception as exc:
        logger.exception("Command failed: %s", exc)
        return 1


if __name__ == "__main__":
    sys.exit(main())
