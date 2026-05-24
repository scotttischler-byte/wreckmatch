"""
Structured logging for audit trails and safety compliance.

Every prospect search, HTTP request, and outreach draft is logged so a human
can review activity before any email is sent.
"""

from __future__ import annotations

import logging
import sys
import traceback
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from config import AppConfig


def setup_logger(name: str, log_dir: Path | None = None) -> logging.Logger:
    """
    Configure a module logger with console + daily file output.

    Args:
        name: Logger name (typically __name__).
        log_dir: Directory for log files; defaults to config log_dir.

    Returns:
        Configured logger instance.
    """
    config = AppConfig.from_env()
    directory = log_dir or config.log_dir
    directory.mkdir(parents=True, exist_ok=True)

    logger = logging.getLogger(name)
    if logger.handlers:
        return logger

    logger.setLevel(logging.DEBUG)
    formatter = logging.Formatter(
        "%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    console = logging.StreamHandler(sys.stdout)
    console.setLevel(logging.INFO)
    console.setFormatter(formatter)
    logger.addHandler(console)

    date_stamp = datetime.now(timezone.utc).strftime("%Y%m%d")
    file_handler = logging.FileHandler(directory / f"link_builder_{date_stamp}.log")
    file_handler.setLevel(logging.DEBUG)
    file_handler.setFormatter(formatter)
    logger.addHandler(file_handler)

    return logger


def log_safety_reminder(logger: logging.Logger, action: str) -> None:
    """Emit a standard reminder that human review is required."""
    logger.warning(
        "SAFETY: %s — Human review required before sending any outreach email.",
        action,
    )


def log_operation(logger: logging.Logger, operation: str, **details: Any) -> None:
    """Log a structured operation with optional key=value details."""
    detail_str = " | ".join(f"{k}={v!r}" for k, v in details.items())
    message = f"OPERATION: {operation}"
    if detail_str:
        message = f"{message} | {detail_str}"
    logger.info(message)


def log_error_with_context(
    logger: logging.Logger,
    message: str,
    exc: BaseException | None = None,
    **context: Any,
) -> None:
    """Log an error with optional exception and context fields."""
    ctx = " | ".join(f"{k}={v!r}" for k, v in context.items())
    full = f"{message} | {ctx}" if ctx else message
    if exc is not None:
        logger.error("%s | exception=%s", full, exc)
        logger.debug("Traceback:\n%s", traceback.format_exc())
    else:
        logger.error(full)
