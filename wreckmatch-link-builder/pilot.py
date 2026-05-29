#!/usr/bin/env python3
"""
Safe first-pilot runner for WreckMatch link building.

Runs a controlled workflow:
1. Search 10–20 prospects in the car accident lawyer + resources niche
2. Generate personalized outreach email drafts
3. Save prospects and drafts to the tracker

NEVER sends email — all output requires human review.
"""

from __future__ import annotations

import argparse
import json
import sys
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path

from config import PILOT_MAX_EMAILS, PILOT_TARGET_MAX, PILOT_TARGET_MIN, AppConfig
from link_targets import enrich_prospect_row
from logger_setup import log_operation, log_safety_reminder, setup_logger
from outreach_generator import OutreachEmail, OutreachGenerator
from prospector import Prospector, ProspectorError, Prospect
from tracker import ProspectTracker, TrackerError

logger = setup_logger(__name__)


@dataclass
class PilotResult:
    """Summary of a completed pilot run."""

    prospects_found: int
    prospects_added: int
    emails_generated: int
    drafts_dir: Path
    report_path: Path
    prospect_ids: list[str] = field(default_factory=list)
    errors: list[str] = field(default_factory=list)

    def to_dict(self) -> dict:
        return {
            "prospects_found": self.prospects_found,
            "prospects_added": self.prospects_added,
            "emails_generated": self.emails_generated,
            "drafts_dir": str(self.drafts_dir),
            "report_path": str(self.report_path),
            "prospect_ids": self.prospect_ids,
            "errors": self.errors,
        }


def run_pilot(
    *,
    config: AppConfig | None = None,
    min_target: int = PILOT_TARGET_MIN,
    max_target: int = PILOT_TARGET_MAX,
    generate_emails: bool = True,
    max_emails: int = PILOT_MAX_EMAILS,
    skip_resource_analysis: bool = False,
) -> PilotResult:
    """
    Execute the first safe pilot campaign.

    Args:
        config: App configuration; loaded from env if omitted.
        min_target: Minimum desired prospects (warns if fewer found).
        max_target: Maximum prospects to keep.
        generate_emails: Whether to draft outreach emails.
        max_emails: Cap on email drafts (safety / time).
        skip_resource_analysis: Skip live page fetches for resource scoring.

    Returns:
        PilotResult with counts and file paths.

    Raises:
        ProspectorError: If CSE is not configured or search fails entirely.
        TrackerError: If tracker read/write fails.
    """
    config = config or AppConfig.from_env()
    log_safety_reminder(logger, "Pilot run started")
    log_operation(
        logger,
        "pilot_start",
        min_target=min_target,
        max_target=max_target,
        generate_emails=generate_emails,
    )

    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
    drafts_dir = config.data_dir / "drafts" / f"pilot_{timestamp}"
    drafts_dir.mkdir(parents=True, exist_ok=True)
    report_path = config.data_dir / f"pilot_report_{timestamp}.json"
    errors: list[str] = []

    prospector = Prospector(config)
    tracker = ProspectTracker(config)
    generator = OutreachGenerator(config)

    try:
        prospects = prospector.find_pilot_prospects(
            min_target=min_target,
            max_target=max_target,
            analyze_resources=not skip_resource_analysis,
        )
    finally:
        prospector.close()

    if not prospects:
        raise ProspectorError(
            "Pilot found zero prospects. Verify Google CSE credentials and try again."
        )

    rows = [enrich_prospect_row(p.to_dict()) for p in prospects]
    added = tracker.add_prospects(rows)
    prospect_ids = [p.id for p in prospects]

    emails_generated = 0
    email_records: list[dict] = []

    if generate_emails:
        for prospect in rows[:max_emails]:
            try:
                email = generator.generate_for_prospect(prospect)
                draft_path = drafts_dir / f"draft_{prospect['id']}_{email.template_type}.txt"
                draft_path.write_text(
                    _format_draft_file(email),
                    encoding="utf-8",
                )
                tracker.update_status(
                    prospect["id"],
                    status="email_drafted",
                    outreach_template=email.template_type,
                    notes=f"Pilot draft saved: {draft_path.name}",
                )
                emails_generated += 1
                email_records.append(
                    {
                        "prospect_id": prospect["id"],
                        "url": prospect["url"],
                        "template": email.template_type,
                        "subject": email.subject,
                        "draft_file": str(draft_path),
                    }
                )
            except Exception as exc:
                msg = f"Email draft failed for {prospect.get('url', '?')}: {exc}"
                errors.append(msg)
                logger.exception(msg)

    result = PilotResult(
        prospects_found=len(prospects),
        prospects_added=added,
        emails_generated=emails_generated,
        drafts_dir=drafts_dir,
        report_path=report_path,
        prospect_ids=prospect_ids,
        errors=errors,
    )

    report = {
        **result.to_dict(),
        "timestamp": timestamp,
        "prospects": rows,
        "emails": email_records,
        "safety_note": "All emails are DRAFTS. Human review required before sending.",
    }
    report_path.write_text(json.dumps(report, indent=2), encoding="utf-8")

    log_operation(
        logger,
        "pilot_complete",
        found=result.prospects_found,
        added=result.prospects_added,
        emails=result.emails_generated,
    )
    return result


def _format_draft_file(email: OutreachEmail) -> str:
    return (
        "=== WRECKMATCH OUTREACH DRAFT ===\n"
        "HUMAN REVIEW REQUIRED — DO NOT AUTO-SEND\n"
        "================================\n\n"
        f"To: {email.to_email or '(fill in during review)'}\n"
        f"Subject: {email.subject}\n\n"
        f"{email.body}\n"
    )


def _print_summary(result: PilotResult) -> None:
    print("\n" + "=" * 60)
    print("WRECKMATCH LINK BUILDER — PILOT COMPLETE")
    print("=" * 60)
    print(f"  Prospects found:    {result.prospects_found}")
    print(f"  New in tracker:     {result.prospects_added}")
    print(f"  Email drafts:       {result.emails_generated}")
    print(f"  Drafts folder:      {result.drafts_dir}")
    print(f"  Full report:        {result.report_path}")
    if result.errors:
        print(f"\n  Warnings ({len(result.errors)}):")
        for err in result.errors:
            print(f"    - {err}")
    print("\n  NEXT STEPS:")
    print("  1. Review drafts in the drafts folder")
    print("  2. Find contact emails for each site (contact page / Hunter.io)")
    print("  3. Personalize each draft, then send manually")
    print("  4. Update tracker status to 'contacted' after sending")
    print("=" * 60)


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Run a safe first-pilot for WreckMatch link building",
    )
    parser.add_argument(
        "--min-target",
        type=int,
        default=PILOT_TARGET_MIN,
        help=f"Minimum prospects (default {PILOT_TARGET_MIN})",
    )
    parser.add_argument(
        "--max-target",
        type=int,
        default=PILOT_TARGET_MAX,
        help=f"Maximum prospects (default {PILOT_TARGET_MAX})",
    )
    parser.add_argument(
        "--max-emails",
        type=int,
        default=PILOT_MAX_EMAILS,
        help=f"Max email drafts to generate (default {PILOT_MAX_EMAILS})",
    )
    parser.add_argument(
        "--no-emails",
        action="store_true",
        help="Skip email generation (prospects only)",
    )
    parser.add_argument(
        "--skip-resource-analysis",
        action="store_true",
        help="Skip live page fetches (faster, fewer CSE-only results)",
    )
    args = parser.parse_args()

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
    except ProspectorError as exc:
        logger.error("Pilot failed (prospecting): %s", exc)
        print(f"\nPILOT FAILED: {exc}", file=sys.stderr)
        print("\nFix: Add GOOGLE_CSE_API_KEY and GOOGLE_CSE_CX to .env", file=sys.stderr)
        return 1
    except TrackerError as exc:
        logger.error("Pilot failed (tracker): %s", exc)
        print(f"\nPILOT FAILED: {exc}", file=sys.stderr)
        return 1
    except KeyboardInterrupt:
        logger.info("Pilot interrupted by user.")
        return 130
    except Exception as exc:
        logger.exception("Pilot failed unexpectedly: %s", exc)
        print(f"\nPILOT FAILED: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
