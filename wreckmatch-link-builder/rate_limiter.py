"""
HTTP client with enforced rate limiting for white-hat prospecting.

Safety rules:
- Max 5–8 requests per minute (configurable, default 6)
- Random delay between 8–25 seconds between requests
- All requests logged with URL and status
"""

from __future__ import annotations

import random
import time
from collections import deque
from typing import Any
from urllib.parse import urlparse

import httpx

from config import AppConfig
from logger_setup import setup_logger

logger = setup_logger(__name__)


class RateLimitedClient:
    """
    Synchronous HTTP client that enforces per-minute caps and random delays.

    Use this for all outbound scraping/checking to avoid aggressive crawling.
    """

    DEFAULT_HEADERS = {
        "User-Agent": (
            "WreckMatchLinkBuilder/1.0 (+https://www.wreckmatch.com; "
            "white-hat SEO research bot; contact: scott@wreckmatch.com)"
        ),
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
    }

    def __init__(self, config: AppConfig | None = None) -> None:
        self.config = config or AppConfig.from_env()
        self._request_times: deque[float] = deque()
        self._client = httpx.Client(
            headers=self.DEFAULT_HEADERS,
            follow_redirects=True,
            timeout=httpx.Timeout(30.0, connect=10.0),
        )

    def _wait_if_needed(self) -> None:
        """Enforce per-minute cap and random inter-request delay."""
        now = time.monotonic()
        window = 60.0

        # Drop timestamps older than one minute.
        while self._request_times and now - self._request_times[0] > window:
            self._request_times.popleft()

        if len(self._request_times) >= self.config.max_requests_per_minute:
            sleep_until = self._request_times[0] + window - now
            if sleep_until > 0:
                logger.info(
                    "Rate limit: at %d req/min cap, sleeping %.1fs",
                    self.config.max_requests_per_minute,
                    sleep_until,
                )
                time.sleep(sleep_until)

        delay = random.uniform(
            self.config.min_delay_seconds,
            self.config.max_delay_seconds,
        )
        logger.debug("Random delay: %.1fs before next request", delay)
        time.sleep(delay)

    def get(
        self,
        url: str,
        *,
        params: dict[str, Any] | None = None,
        skip_delay: bool = False,
    ) -> httpx.Response:
        """
        Perform a rate-limited GET request.

        Args:
            url: Target URL.
            params: Optional query parameters.
            skip_delay: Used internally for redirect chains (still counts toward cap).

        Returns:
            httpx.Response object.
        """
        if not skip_delay:
            self._wait_if_needed()

        domain = urlparse(url).netloc
        logger.info("GET %s (domain: %s)", url, domain)

        try:
            response = self._client.get(url, params=params)
            self._request_times.append(time.monotonic())
            logger.info(
                "Response %s — %d (%d bytes)",
                url,
                response.status_code,
                len(response.content),
            )
            return response
        except httpx.HTTPError as exc:
            logger.error("Request failed for %s: %s", url, exc)
            raise

    def head(self, url: str) -> httpx.Response:
        """Rate-limited HEAD request — useful for link status checks."""
        self._wait_if_needed()
        logger.info("HEAD %s", url)
        response = self._client.head(url)
        self._request_times.append(time.monotonic())
        logger.info("HEAD response %s — %d", url, response.status_code)
        return response

    def close(self) -> None:
        """Close the underlying HTTP client."""
        self._client.close()

    def __enter__(self) -> RateLimitedClient:
        return self

    def __exit__(self, *args: object) -> None:
        self.close()
