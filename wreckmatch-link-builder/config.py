"""
Central configuration for the WreckMatch Link Builder.

Loads environment variables and defines brand constants used across modules.
"""

from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path

from dotenv import load_dotenv

# Project root is the directory containing this file.
PROJECT_ROOT = Path(__file__).resolve().parent
load_dotenv(PROJECT_ROOT / ".env")


@dataclass(frozen=True)
class WreckMatchBrand:
    """Brand voice and contact details for outreach personalization."""

    website: str = "https://www.wreckmatch.com"
    phone: str = "855-8-WRECKMATCH"
    phone_display: str = "855-897-3262"
    mission: str = (
        "Connect car accident victims with top personal injury attorneys "
        "at no upfront cost"
    )
    tagline: str = "Free attorney matching for car accident victims"
    value_props: tuple[str, ...] = (
        "Free matching service — no upfront cost to accident victims",
        "Vetted personal injury attorneys across the United States",
        "Educational resources for people navigating post-accident decisions",
        "Professional, trustworthy guidance during a stressful time",
    )


BRAND = WreckMatchBrand()


@dataclass
class AppConfig:
    """Runtime configuration from environment variables."""

    google_cse_api_key: str
    google_cse_cx: str
    google_sheets_credentials_path: Path
    google_sheets_spreadsheet_id: str
    outreach_sender_name: str
    outreach_sender_email: str
    outreach_sender_title: str
    outreach_sender_bio: str
    min_delay_seconds: float
    max_delay_seconds: float
    max_requests_per_minute: int
    data_dir: Path
    log_dir: Path

    @classmethod
    def from_env(cls) -> AppConfig:
        data_dir = Path(os.getenv("DATA_DIR", PROJECT_ROOT / "data"))
        log_dir = Path(os.getenv("LOG_DIR", PROJECT_ROOT / "logs"))
        creds = os.getenv(
            "GOOGLE_SHEETS_CREDENTIALS_PATH",
            PROJECT_ROOT / "credentials" / "google-service-account.json",
        )
        return cls(
            google_cse_api_key=os.getenv("GOOGLE_CSE_API_KEY", ""),
            google_cse_cx=os.getenv("GOOGLE_CSE_CX", ""),
            google_sheets_credentials_path=Path(creds),
            google_sheets_spreadsheet_id=os.getenv("GOOGLE_SHEETS_SPREADSHEET_ID", ""),
            outreach_sender_name=os.getenv("OUTREACH_SENDER_NAME", "Scott Tischler"),
            outreach_sender_email=os.getenv("OUTREACH_SENDER_EMAIL", "scott@wreckmatch.com"),
            outreach_sender_title=os.getenv("OUTREACH_SENDER_TITLE", "Founder, WreckMatch"),
            outreach_sender_bio=os.getenv(
                "OUTREACH_SENDER_BIO",
                "Scott Tischler founded WreckMatch to help car accident victims find "
                "experienced personal injury attorneys at no upfront cost. He leads outreach "
                "and partnerships with legal aid organizations, hospitals, and community "
                "resource sites that serve people after a crash.",
            ),
            min_delay_seconds=float(os.getenv("MIN_DELAY_SECONDS", "8")),
            max_delay_seconds=float(os.getenv("MAX_DELAY_SECONDS", "25")),
            max_requests_per_minute=int(os.getenv("MAX_REQUESTS_PER_MINUTE", "6")),
            data_dir=data_dir,
            log_dir=log_dir,
        )


# Smart Google search operator templates for white-hat prospecting.
SEARCH_QUERY_TEMPLATES: list[str] = [
    '"car accident" "resources" "personal injury"',
    '"personal injury" inurl:resources',
    '"car accident lawyer" "helpful links"',
    '"personal injury" "legal resources" -site:wreckmatch.com',
    '"motor vehicle accident" intitle:resources',
    '"accident victims" "resources" blog',
    '"personal injury" inurl:blog "resources"',
    '"legal directory" "personal injury" attorneys',
    '"broken link" "personal injury" OR "car accident"',
    '"unlinked" OR "mention" "car accident" resources',
    'inurl:links.html "personal injury" OR "legal"',
    '"state bar" "personal injury" directory',
    '"victim resources" "car accident"',
    '"legal aid" "motor vehicle" resources',
]

# Known legal directories worth tracking for listing opportunities.
LEGAL_DIRECTORIES: list[dict[str, str]] = [
    {"name": "Avvo", "url": "https://www.avvo.com", "notes": "Attorney profiles and legal Q&A"},
    {"name": "FindLaw", "url": "https://www.findlaw.com", "notes": "Legal directory and resources"},
    {"name": "Justia", "url": "https://www.justia.com", "notes": "Lawyer directory and legal info"},
    {"name": "Martindale-Hubbell", "url": "https://www.martindale.com", "notes": "Peer-rated attorney directory"},
    {"name": "Lawyers.com", "url": "https://www.lawyers.com", "notes": "Consumer legal directory"},
    {"name": "HG.org", "url": "https://www.hg.org", "notes": "Global legal resources"},
    {"name": "Nolo", "url": "https://www.nolo.com", "notes": "Legal self-help and directory"},
    {"name": "Super Lawyers", "url": "https://www.superlawyers.com", "notes": "Attorney recognition directory"},
    {"name": "American Bar Association", "url": "https://www.americanbar.org", "notes": "ABA resources and referrals"},
    {"name": "State Bar of Texas", "url": "https://www.texasbar.com", "notes": "State bar lawyer referral"},
]

# Tracker column schema (Google Sheets + CSV).
TRACKER_COLUMNS: list[str] = [
    "id",
    "url",
    "domain",
    "prospect_type",
    "title",
    "status",
    "date_found",
    "date_contacted",
    "response",
    "link_acquired",
    "contact_email",
    "contact_name",
    "outreach_template",
    "notes",
    "broken_url",
    "suggested_replacement",
    "suggested_link",
    "suggested_link_reason",
]

PROSPECT_TYPES = (
    "resource_page",
    "broken_link",
    "unlinked_mention",
    "legal_directory",
    "guest_post",
    "general",
)

STATUSES = (
    "new",
    "researched",
    "email_drafted",
    "contacted",
    "follow_up",
    "responded",
    "link_acquired",
    "declined",
    "not_relevant",
)

# First-pilot niche: car accident lawyer resource pages (10–20 prospects).
PILOT_SEARCH_QUERIES: list[str] = [
    '"car accident lawyer" "resources"',
    '"car accident lawyer" "helpful links"',
    '"car accident" "legal resources" -site:wreckmatch.com',
    '"personal injury" "victim resources" blog',
    '"car accident victims" "resources" intitle:resources',
    '"motor vehicle accident" "helpful links"',
]

PILOT_TARGET_MIN = 20
PILOT_TARGET_MAX = 30
PILOT_MAX_EMAILS = 25

# Syndication + firm outreach paths (override in .env)
SYNDICATION_DIR_DEFAULT = (
    Path(__file__).resolve().parent.parent.parent / "injuredhelp.ai" / "content" / "syndication"
)
FIRM_PARTNERS_CSV = "firm_partners.csv"
