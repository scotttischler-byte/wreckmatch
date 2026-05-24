"""
Prospect discovery for white-hat link building.

Capabilities:
- Smart Google search via Custom Search API (recommended)
- Broken link detection on resource pages
- Resource page identification heuristics
- Legal directory tracking

All HTTP traffic goes through RateLimitedClient for safe crawling.
"""

from __future__ import annotations

import re
import uuid
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any
from urllib.parse import urljoin, urlparse

from bs4 import BeautifulSoup

from config import (
    LEGAL_DIRECTORIES,
    SEARCH_QUERY_TEMPLATES,
    AppConfig,
    WreckMatchBrand,
    BRAND,
)
from logger_setup import log_error_with_context, log_operation, log_safety_reminder, setup_logger
from rate_limiter import RateLimitedClient

logger = setup_logger(__name__)


class ProspectorError(Exception):
    """Raised when prospect discovery fails in a recoverable way."""

# Heuristic keywords suggesting a page is a resource/link list.
RESOURCE_PAGE_SIGNALS = (
    "resources",
    "helpful links",
    "useful links",
    "legal resources",
    "external links",
    "recommended sites",
    "victim resources",
    "accident resources",
    "links",
    "directory",
)

# Domains we should never outreach to (competitors, social, etc.).
BLOCKED_DOMAINS = {
    "facebook.com",
    "twitter.com",
    "x.com",
    "instagram.com",
    "linkedin.com",
    "youtube.com",
    "pinterest.com",
    "reddit.com",
    "wikipedia.org",
    "wreckmatch.com",
    "google.com",
    "bing.com",
}


@dataclass
class Prospect:
    """A link-building prospect with metadata for tracking and outreach."""

    url: str
    domain: str
    prospect_type: str
    title: str = ""
    status: str = "new"
    date_found: str = field(default_factory=lambda: _utc_now())
    notes: str = ""
    broken_url: str = ""
    suggested_replacement: str = ""
    contact_email: str = ""
    contact_name: str = ""
    id: str = field(default_factory=lambda: str(uuid.uuid4())[:8])

    def to_dict(self) -> dict[str, str]:
        return {
            "id": self.id,
            "url": self.url,
            "domain": self.domain,
            "prospect_type": self.prospect_type,
            "title": self.title,
            "status": self.status,
            "date_found": self.date_found,
            "date_contacted": "",
            "response": "",
            "link_acquired": "no",
            "contact_email": self.contact_email,
            "contact_name": self.contact_name,
            "outreach_template": "",
            "notes": self.notes,
            "broken_url": self.broken_url,
            "suggested_replacement": self.suggested_replacement,
        }


@dataclass
class BrokenLink:
    """A broken outbound link found on a prospect page."""

    page_url: str
    broken_url: str
    anchor_text: str
    status_code: int
    suggested_replacement: str = BRAND.website


def _utc_now() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%d")


def _extract_domain(url: str) -> str:
    netloc = urlparse(url).netloc.lower()
    if netloc.startswith("www."):
        netloc = netloc[4:]
    return netloc


def _is_blocked_domain(url: str) -> bool:
    domain = _extract_domain(url)
    return any(domain == blocked or domain.endswith(f".{blocked}") for blocked in BLOCKED_DOMAINS)


def _normalize_url(url: str) -> str:
    parsed = urlparse(url)
    return f"{parsed.scheme}://{parsed.netloc}{parsed.path}".rstrip("/")


class SearchQueryGenerator:
    """Generate smart Google search operator queries for manual or API use."""

    def __init__(self, brand: WreckMatchBrand = BRAND) -> None:
        self.brand = brand

    def generate(self, count: int | None = None) -> list[str]:
        """Return search queries; optionally limit count."""
        queries = list(SEARCH_QUERY_TEMPLATES)
        # Add geo-targeted variants.
        for state in ("Texas", "California", "Florida", "New York"):
            queries.append(f'"car accident" resources "{state}"')
        if count:
            return queries[:count]
        return queries

    def for_broken_links(self) -> list[str]:
        return [q for q in SEARCH_QUERY_TEMPLATES if "broken" in q.lower() or "resources" in q.lower()]

    def for_resource_pages(self) -> list[str]:
        return [q for q in SEARCH_QUERY_TEMPLATES if "resource" in q.lower() or "links" in q.lower()]


class ProspectSearcher:
    """
    Search for prospects using Google Custom Search API.

    Requires GOOGLE_CSE_API_KEY and GOOGLE_CSE_CX in .env.
    Without credentials, returns empty results and logs setup instructions.
    """

    CSE_ENDPOINT = "https://www.googleapis.com/customsearch/v1"

    def __init__(
        self,
        client: RateLimitedClient | None = None,
        config: AppConfig | None = None,
    ) -> None:
        self.config = config or AppConfig.from_env()
        self.client = client or RateLimitedClient(self.config)
        self._owns_client = client is None

    def search(
        self,
        query: str,
        *,
        num_results: int = 10,
        prospect_type: str = "general",
    ) -> list[Prospect]:
        """
        Run a single CSE query and return deduplicated prospects.

        Args:
            query: Google search query (operators supported).
            num_results: Max results (CSE returns up to 10 per request).
            prospect_type: Label for tracker categorization.
        """
        if not self.config.google_cse_api_key or not self.config.google_cse_cx:
            logger.warning(
                "Google Custom Search not configured. Set GOOGLE_CSE_API_KEY and "
                "GOOGLE_CSE_CX in .env. Returning empty results."
            )
            return []

        params = {
            "key": self.config.google_cse_api_key,
            "cx": self.config.google_cse_cx,
            "q": query,
            "num": min(num_results, 10),
        }

        log_safety_reminder(logger, f"CSE search: {query!r}")

        try:
            response = self.client.get(self.CSE_ENDPOINT, params=params)
            data = response.json()
        except Exception as exc:
            log_error_with_context(logger, "CSE search request failed", exc, query=query)
            return []

        if "error" in data:
            err = data["error"]
            log_error_with_context(
                logger,
                "Google CSE API error",
                message=err.get("message", "unknown"),
                code=err.get("code"),
                query=query,
            )
            return []

        prospects: list[Prospect] = []
        for item in data.get("items", []):
            url = item.get("link", "")
            if not url or _is_blocked_domain(url):
                continue
            prospects.append(
                Prospect(
                    url=url,
                    domain=_extract_domain(url),
                    prospect_type=prospect_type,
                    title=item.get("title", ""),
                    notes=f"Found via query: {query}",
                )
            )

        logger.info("Query %r returned %d prospects", query, len(prospects))
        return prospects

    def search_all_templates(
        self,
        *,
        max_queries: int = 5,
        num_results_per_query: int = 5,
    ) -> list[Prospect]:
        """Run multiple template queries and deduplicate by URL."""
        generator = SearchQueryGenerator()
        queries = generator.generate(max_queries)
        seen: set[str] = set()
        all_prospects: list[Prospect] = []

        for query in queries:
            for prospect in self.search(query, num_results=num_results_per_query):
                key = _normalize_url(prospect.url)
                if key not in seen:
                    seen.add(key)
                    all_prospects.append(prospect)

        logger.info("Total unique prospects from %d queries: %d", len(queries), len(all_prospects))
        return all_prospects

    def search_queries(
        self,
        queries: list[str],
        *,
        num_results_per_query: int = 5,
        prospect_type: str = "resource_page",
    ) -> list[Prospect]:
        """Run explicit queries and deduplicate by URL."""
        seen: set[str] = set()
        results: list[Prospect] = []
        for query in queries:
            for prospect in self.search(
                query,
                num_results=num_results_per_query,
                prospect_type=prospect_type,
            ):
                key = _normalize_url(prospect.url)
                if key not in seen:
                    seen.add(key)
                    results.append(prospect)
        log_operation(
            logger,
            "search_queries_complete",
            queries=len(queries),
            prospects=len(results),
        )
        return results

    def close(self) -> None:
        if self._owns_client:
            self.client.close()


class ResourcePageFinder:
    """Identify whether a URL looks like a resource/link page."""

    def __init__(self, client: RateLimitedClient | None = None) -> None:
        self.client = client or RateLimitedClient()
        self._owns_client = client is None

    def analyze(self, url: str) -> Prospect | None:
        """
        Fetch a page and score it as a potential resource page.

        Returns a Prospect if score exceeds threshold, else None.
        """
        if _is_blocked_domain(url):
            return None

        try:
            response = self.client.get(url)
            if response.status_code >= 400:
                return None
        except Exception:
            return None

        soup = BeautifulSoup(response.text, "lxml")
        title = (soup.title.string or "").strip() if soup.title else ""
        text_lower = soup.get_text(" ", strip=True).lower()
        title_lower = title.lower()
        url_lower = url.lower()

        score = 0
        matched_signals: list[str] = []
        for signal in RESOURCE_PAGE_SIGNALS:
            if signal in title_lower or signal in url_lower or signal in text_lower[:3000]:
                score += 1
                matched_signals.append(signal)

        # Count outbound links — resource pages typically have many.
        outbound = self._count_outbound_links(soup, url)
        if outbound >= 5:
            score += 2
        if outbound >= 15:
            score += 1

        if score < 3:
            return None

        return Prospect(
            url=url,
            domain=_extract_domain(url),
            prospect_type="resource_page",
            title=title,
            notes=f"Resource signals: {', '.join(matched_signals)}; outbound links: {outbound}",
        )

    def find_from_urls(self, urls: list[str]) -> list[Prospect]:
        """Analyze multiple URLs and return those qualifying as resource pages."""
        results: list[Prospect] = []
        for url in urls:
            prospect = self.analyze(url)
            if prospect:
                results.append(prospect)
                logger.info("Resource page found: %s", url)
        return results

    @staticmethod
    def _count_outbound_links(soup: BeautifulSoup, page_url: str) -> int:
        page_domain = _extract_domain(page_url)
        count = 0
        for anchor in soup.find_all("a", href=True):
            href = anchor["href"]
            if href.startswith(("mailto:", "tel:", "#", "javascript:")):
                continue
            absolute = urljoin(page_url, href)
            if _extract_domain(absolute) != page_domain:
                count += 1
        return count

    def close(self) -> None:
        if self._owns_client:
            self.client.close()


class BrokenLinkFinder:
    """Find broken outbound links on a page — core of broken link building."""

    # Status codes treated as broken.
    BROKEN_CODES = {404, 410, 500, 502, 503}

    def __init__(
        self,
        client: RateLimitedClient | None = None,
        brand: WreckMatchBrand = BRAND,
    ) -> None:
        self.client = client or RateLimitedClient()
        self._owns_client = client is None
        self.brand = brand

    def find_on_page(self, page_url: str, max_links: int = 30) -> list[BrokenLink]:
        """
        Crawl outbound links on a page and report broken ones.

        Args:
            page_url: URL to scan.
            max_links: Cap checks per page to stay within rate limits.
        """
        if _is_blocked_domain(page_url):
            return []

        try:
            response = self.client.get(page_url)
            if response.status_code >= 400:
                logger.warning("Cannot scan page (status %d): %s", response.status_code, page_url)
                return []
        except Exception as exc:
            logger.error("Failed to fetch %s: %s", page_url, exc)
            return []

        soup = BeautifulSoup(response.text, "lxml")
        page_domain = _extract_domain(page_url)
        checked: set[str] = set()
        broken: list[BrokenLink] = []

        for anchor in soup.find_all("a", href=True):
            if len(broken) >= max_links:
                break

            href = anchor["href"]
            if href.startswith(("mailto:", "tel:", "#", "javascript:")):
                continue

            absolute = urljoin(page_url, href)
            link_domain = _extract_domain(absolute)

            # Only check external http(s) links.
            if not absolute.startswith(("http://", "https://")):
                continue
            if link_domain == page_domain:
                continue
            if absolute in checked:
                continue
            checked.add(absolute)

            status = self._check_link_status(absolute)
            if status in self.BROKEN_CODES:
                anchor_text = anchor.get_text(strip=True)[:120]
                broken.append(
                    BrokenLink(
                        page_url=page_url,
                        broken_url=absolute,
                        anchor_text=anchor_text,
                        status_code=status,
                        suggested_replacement=self._suggest_replacement(anchor_text),
                    )
                )
                logger.info(
                    "Broken link on %s: %s (%d) — anchor: %r",
                    page_url,
                    absolute,
                    status,
                    anchor_text,
                )

        return broken

    def find_prospects(
        self,
        page_urls: list[str],
        *,
        max_links_per_page: int = 15,
    ) -> list[Prospect]:
        """
        Scan pages for broken links and convert findings to Prospects.
        """
        prospects: list[Prospect] = []
        for page_url in page_urls:
            broken_links = self.find_on_page(page_url, max_links=max_links_per_page)
            for bl in broken_links:
                prospects.append(
                    Prospect(
                        url=page_url,
                        domain=_extract_domain(page_url),
                        prospect_type="broken_link",
                        title=f"Broken link: {bl.anchor_text or bl.broken_url}",
                        broken_url=bl.broken_url,
                        suggested_replacement=bl.suggested_replacement,
                        notes=(
                            f"Broken URL returned {bl.status_code}. "
                            f"Anchor text: {bl.anchor_text!r}"
                        ),
                    )
                )
        return prospects

    def _check_link_status(self, url: str) -> int:
        """Check URL with HEAD, fall back to GET on failure."""
        try:
            response = self.client.head(url)
            if response.status_code == 405:
                response = self.client.get(url)
            return response.status_code
        except Exception:
            return 0

    def _suggest_replacement(self, anchor_text: str) -> str:
        """Map anchor context to the best WreckMatch URL."""
        text = anchor_text.lower()
        base = self.brand.website.rstrip("/")
        if any(kw in text for kw in ("llm", "ai ", "gpt", "chatbot")):
            return f"{base}/llms.txt"
        if any(kw in text for kw in ("checklist", "survival", "first 24", "pdf")):
            return "https://www.accidentsurvivalguide.com/resources"
        if any(kw in text for kw in ("houston", "dallas", "miami", "chicago", "los angeles", "phoenix")):
            for city in ("houston", "dallas", "miami", "chicago", "los-angeles", "phoenix"):
                if city.replace("-", " ") in text or city in text:
                    return f"{base}/car-accident-help-{city.replace(' ', '-')}"
        if any(kw in text for kw in ("texas", "florida", "california", "new york")):
            for state in ("texas", "florida", "california", "new-york"):
                if state.replace("-", " ") in text or state in text:
                    return f"{base}/car-accident-help-{state}"
        if any(kw in text for kw in ("lawyer", "attorney", "legal", "injury", "accident")):
            return f"{base}/resources"
        if "resource" in text or "help" in text or "guide" in text:
            return f"{base}/resources"
        return base

    def close(self) -> None:
        if self._owns_client:
            self.client.close()


class LegalDirectoryTracker:
    """Track known legal directories and their listing status for WreckMatch."""

    def __init__(self, client: RateLimitedClient | None = None) -> None:
        self.client = client or RateLimitedClient()
        self._owns_client = client is None
        self.directories = LEGAL_DIRECTORIES

    def check_all(self) -> list[Prospect]:
        """Verify directory URLs are reachable and return tracker prospects."""
        prospects: list[Prospect] = []
        for entry in self.directories:
            url = entry["url"]
            status = "unknown"
            try:
                response = self.client.get(url)
                status = "reachable" if response.status_code < 400 else f"error_{response.status_code}"
            except Exception as exc:
                status = f"unreachable: {exc}"

            prospects.append(
                Prospect(
                    url=url,
                    domain=_extract_domain(url),
                    prospect_type="legal_directory",
                    title=entry["name"],
                    notes=f"{entry['notes']} | Status: {status}",
                )
            )
            logger.info("Directory %s: %s", entry["name"], status)
        return prospects

    def listing_checklist(self) -> list[dict[str, str]]:
        """Return a human checklist for manual directory submissions."""
        return [
            {
                "directory": d["name"],
                "url": d["url"],
                "action": "Verify WreckMatch listing; submit if missing",
                "notes": d["notes"],
            }
            for d in self.directories
        ]

    def close(self) -> None:
        if self._owns_client:
            self.client.close()


class Prospector:
    """
    High-level facade combining all prospecting capabilities.
    """

    def __init__(self, config: AppConfig | None = None) -> None:
        self.config = config or AppConfig.from_env()
        self.client = RateLimitedClient(self.config)
        self.searcher = ProspectSearcher(self.client, self.config)
        self.resource_finder = ResourcePageFinder(self.client)
        self.broken_finder = BrokenLinkFinder(self.client)
        self.directory_tracker = LegalDirectoryTracker(self.client)
        self.query_generator = SearchQueryGenerator()

    def find_prospects(
        self,
        *,
        mode: str = "search",
        urls: list[str] | None = None,
        max_queries: int = 3,
    ) -> list[Prospect]:
        """
        Run prospect discovery.

        Modes:
            search — CSE template queries
            resource — analyze URLs as resource pages
            broken — scan URLs for broken outbound links
            directories — legal directory tracker
            all — combine search + resource analysis on results
        """
        log_safety_reminder(logger, "Prospect discovery")
        results: list[Prospect] = []

        if mode in ("search", "all"):
            results.extend(self.searcher.search_all_templates(max_queries=max_queries))

        if mode in ("resource", "all") and urls:
            results.extend(self.resource_finder.find_from_urls(urls))
        elif mode == "resource" and results:
            urls_from_search = [p.url for p in results]
            results.extend(self.resource_finder.find_from_urls(urls_from_search))

        if mode == "broken":
            target_urls = urls or [p.url for p in results]
            if not target_urls:
                # Search first, then scan.
                search_results = self.searcher.search_all_templates(max_queries=2)
                target_urls = [p.url for p in search_results]
                results.extend(search_results)
            results.extend(
                self.broken_finder.find_prospects(target_urls, max_links_per_page=10)
            )

        if mode == "directories":
            results = self.directory_tracker.check_all()

        # Deduplicate by URL + type.
        seen: set[tuple[str, str]] = set()
        unique: list[Prospect] = []
        for p in results:
            key = (_normalize_url(p.url), p.prospect_type)
            if key not in seen:
                seen.add(key)
                unique.append(p)

        logger.info("Prospector finished: %d unique prospects (mode=%s)", len(unique), mode)
        return unique

    def find_pilot_prospects(
        self,
        *,
        min_target: int = 10,
        max_target: int = 20,
        analyze_resources: bool = True,
    ) -> list[Prospect]:
        """
        Search the car accident lawyer + resources niche for a first pilot.

        Runs PILOT_SEARCH_QUERIES, optionally reclassifies hits as resource pages,
        and caps results at max_target.
        """
        from config import PILOT_SEARCH_QUERIES

        log_safety_reminder(logger, "Pilot prospect search")
        log_operation(
            logger,
            "pilot_search_start",
            min_target=min_target,
            max_target=max_target,
        )

        if not self.config.google_cse_api_key or not self.config.google_cse_cx:
            raise ProspectorError(
                "Google Custom Search is not configured. Set GOOGLE_CSE_API_KEY and "
                "GOOGLE_CSE_CX in .env before running the pilot."
            )

        raw = self.searcher.search_queries(
            PILOT_SEARCH_QUERIES,
            num_results_per_query=5,
            prospect_type="general",
        )

        if analyze_resources and raw:
            urls = [p.url for p in raw]
            resource_hits = self.resource_finder.find_from_urls(urls)
            resource_urls = {_normalize_url(p.url) for p in resource_hits}
            for prospect in raw:
                if _normalize_url(prospect.url) in resource_urls:
                    prospect.prospect_type = "resource_page"
                    match = next(
                        (r for r in resource_hits if _normalize_url(r.url) == _normalize_url(prospect.url)),
                        None,
                    )
                    if match:
                        prospect.notes = f"{prospect.notes} | {match.notes}"

        # Prefer resource pages, then dedupe and cap.
        raw.sort(key=lambda p: (0 if p.prospect_type == "resource_page" else 1, p.domain))
        seen: set[str] = set()
        unique: list[Prospect] = []
        for p in raw:
            key = _normalize_url(p.url)
            if key not in seen:
                seen.add(key)
                unique.append(p)
            if len(unique) >= max_target:
                break

        if len(unique) < min_target:
            logger.warning(
                "Pilot found %d prospects (target %d–%d). Consider adding queries or URLs.",
                len(unique),
                min_target,
                max_target,
            )

        log_operation(logger, "pilot_search_complete", found=len(unique))
        return unique

    def close(self) -> None:
        self.client.close()
