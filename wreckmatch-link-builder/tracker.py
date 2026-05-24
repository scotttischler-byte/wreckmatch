"""
Prospect tracking with Google Sheets integration and local CSV fallback.

Columns match config.TRACKER_COLUMNS for consistent exports and dashboard views.
"""

from __future__ import annotations

import csv
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import pandas as pd

from config import TRACKER_COLUMNS, AppConfig
from logger_setup import log_error_with_context, log_operation, setup_logger

logger = setup_logger(__name__)


class TrackerError(Exception):
    """Raised when tracker operations fail."""


class ProspectTracker:
    """
    Manage link-building prospects in Google Sheets or local CSV.

    Google Sheets is preferred for team collaboration; CSV works offline.
    """

    WORKSHEET_NAME = "Prospects"

    def __init__(self, config: AppConfig | None = None) -> None:
        self.config = config or AppConfig.from_env()
        self.config.data_dir.mkdir(parents=True, exist_ok=True)
        self.csv_path = self.config.data_dir / "prospects.csv"
        self._sheet = None
        self._gc = None

    @property
    def uses_google_sheets(self) -> bool:
        return bool(
            self.config.google_sheets_spreadsheet_id
            and self.config.google_sheets_credentials_path.exists()
        )

    def _connect_sheets(self) -> None:
        """Initialize gspread client if credentials are available."""
        if self._gc is not None:
            return

        if not self.uses_google_sheets:
            logger.info("Google Sheets not configured — using local CSV at %s", self.csv_path)
            return

        try:
            import gspread
            from google.oauth2.service_account import Credentials

            scopes = [
                "https://www.googleapis.com/auth/spreadsheets",
                "https://www.googleapis.com/auth/drive",
            ]
            creds = Credentials.from_service_account_file(
                str(self.config.google_sheets_credentials_path),
                scopes=scopes,
            )
            self._gc = gspread.authorize(creds)
            spreadsheet = self._gc.open_by_key(self.config.google_sheets_spreadsheet_id)

            try:
                self._sheet = spreadsheet.worksheet(self.WORKSHEET_NAME)
            except Exception:
                self._sheet = spreadsheet.add_worksheet(
                    title=self.WORKSHEET_NAME,
                    rows=1000,
                    cols=len(TRACKER_COLUMNS),
                )
                self._sheet.append_row(TRACKER_COLUMNS)
                logger.info("Created worksheet %r with headers", self.WORKSHEET_NAME)

            logger.info("Connected to Google Sheets spreadsheet")
        except Exception as exc:
            logger.error("Google Sheets connection failed: %s — falling back to CSV", exc)
            self._gc = None
            self._sheet = None

    def _ensure_csv(self) -> None:
        """Create CSV with headers if it doesn't exist."""
        if not self.csv_path.exists():
            with self.csv_path.open("w", newline="", encoding="utf-8") as f:
                writer = csv.DictWriter(f, fieldnames=TRACKER_COLUMNS)
                writer.writeheader()
            logger.info("Created CSV tracker at %s", self.csv_path)

    def load(self) -> pd.DataFrame:
        """Load all prospects as a DataFrame."""
        try:
            self._connect_sheets()

            if self._sheet is not None:
                records = self._sheet.get_all_records()
                if not records:
                    return pd.DataFrame(columns=TRACKER_COLUMNS)
                df = pd.DataFrame(records)
                for col in TRACKER_COLUMNS:
                    if col not in df.columns:
                        df[col] = ""
                return df[TRACKER_COLUMNS]

            self._ensure_csv()
            df = pd.read_csv(self.csv_path, dtype=str).fillna("")
            for col in TRACKER_COLUMNS:
                if col not in df.columns:
                    df[col] = ""
            return df[TRACKER_COLUMNS]
        except Exception as exc:
            log_error_with_context(logger, "Failed to load tracker", exc)
            raise TrackerError(f"Could not load tracker: {exc}") from exc

    def save(self, df: pd.DataFrame) -> None:
        """Persist entire DataFrame to Sheets or CSV."""
        try:
            self._connect_sheets()
            df = df.fillna("").astype(str)
            for col in TRACKER_COLUMNS:
                if col not in df.columns:
                    df[col] = ""
            df = df[TRACKER_COLUMNS]

            if self._sheet is not None:
                self._sheet.clear()
                self._sheet.append_row(TRACKER_COLUMNS)
                if len(df) > 0:
                    rows = df.values.tolist()
                    self._sheet.append_rows(rows, value_input_option="USER_ENTERED")
                logger.info("Saved %d rows to Google Sheets", len(df))
                return

            df.to_csv(self.csv_path, index=False)
            logger.info("Saved %d rows to CSV", len(df))
        except Exception as exc:
            log_error_with_context(logger, "Failed to save tracker", exc, rows=len(df))
            raise TrackerError(f"Could not save tracker: {exc}") from exc

    def add_prospects(self, prospects: list[dict[str, Any]]) -> int:
        """
        Append new prospects, skipping duplicates by URL.

        Returns count of newly added rows.
        """
        df = self.load()
        existing_urls = set(df["url"].str.lower()) if len(df) else set()
        added = 0

        for prospect in prospects:
            url = str(prospect.get("url", "")).strip()
            if not url or url.lower() in existing_urls:
                continue

            row = {col: "" for col in TRACKER_COLUMNS}
            row.update({k: str(v) for k, v in prospect.items() if k in TRACKER_COLUMNS})
            if not row.get("id"):
                row["id"] = str(uuid.uuid4())[:8]
            if not row.get("date_found"):
                row["date_found"] = datetime.now(timezone.utc).strftime("%Y-%m-%d")
            if not row.get("link_acquired"):
                row["link_acquired"] = "no"
            if not row.get("status"):
                row["status"] = "new"

            df = pd.concat([df, pd.DataFrame([row])], ignore_index=True)
            existing_urls.add(url.lower())
            added += 1

        if added:
            self.save(df)
        logger.info("Added %d new prospects", added)
        return added

    def update_status(
        self,
        prospect_id: str,
        *,
        status: str | None = None,
        response: str | None = None,
        link_acquired: str | None = None,
        notes: str | None = None,
        date_contacted: str | None = None,
        outreach_template: str | None = None,
    ) -> bool:
        """Update fields on a prospect by ID."""
        try:
            df = self.load()
            mask = df["id"] == prospect_id
            if not mask.any():
                logger.warning("Prospect ID not found: %s", prospect_id)
                return False

            if status is not None:
                df.loc[mask, "status"] = status
            if response is not None:
                df.loc[mask, "response"] = response
            if link_acquired is not None:
                df.loc[mask, "link_acquired"] = link_acquired
            if notes is not None:
                df.loc[mask, "notes"] = notes
            if date_contacted is not None:
                df.loc[mask, "date_contacted"] = date_contacted
            if outreach_template is not None:
                df.loc[mask, "outreach_template"] = outreach_template

            self.save(df)
            log_operation(logger, "prospect_updated", prospect_id=prospect_id, status=status)
            return True
        except TrackerError:
            raise
        except Exception as exc:
            log_error_with_context(logger, "Failed to update prospect", exc, prospect_id=prospect_id)
            raise TrackerError(f"Could not update prospect {prospect_id}: {exc}") from exc

    def export_csv(self, output_path: Path | None = None) -> Path:
        """Export tracker to CSV file."""
        df = self.load()
        path = output_path or (
            self.config.data_dir
            / f"prospects_export_{datetime.now(timezone.utc).strftime('%Y%m%d_%H%M%S')}.csv"
        )
        path.parent.mkdir(parents=True, exist_ok=True)
        df.to_csv(path, index=False)
        logger.info("Exported %d rows to %s", len(df), path)
        return path

    def stats(self) -> dict[str, int]:
        """Return summary counts for dashboard."""
        try:
            df = self.load()
        except TrackerError:
            return {"total": 0}

        if len(df) == 0:
            return {"total": 0, "links_acquired": 0, "email_drafted": 0, "contacted": 0}

        stats: dict[str, int] = {
            "total": len(df),
            "links_acquired": int((df["link_acquired"].str.lower() == "yes").sum()),
            "email_drafted": int((df["status"] == "email_drafted").sum()),
            "contacted": int((df["status"] == "contacted").sum()),
        }
        for status, count in df["status"].value_counts().items():
            stats[f"status_{status}"] = int(count)
        return stats

    def get_prospects_for_outreach(self, limit: int = 10) -> list[dict[str, str]]:
        """Return prospects eligible for outreach email drafting."""
        df = self.load()
        if len(df) == 0:
            return []

        eligible = df[
            ~df["status"].isin(["link_acquired", "declined", "not_relevant", "contacted"])
        ]
        return eligible.head(limit).to_dict(orient="records")
