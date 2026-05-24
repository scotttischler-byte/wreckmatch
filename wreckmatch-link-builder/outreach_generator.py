"""
Personalized outreach email generation for WreckMatch link building.

IMPORTANT: This module DRAFTS emails only. Never auto-sends.
A human must review, edit, and send every message manually.
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Literal

from config import BRAND, AppConfig, WreckMatchBrand
from logger_setup import log_safety_reminder, setup_logger

logger = setup_logger(__name__)

TemplateType = Literal[
    "broken_link",
    "resource_addition",
    "unlinked_mention",
    "guest_post",
]

TEMPLATE_TYPES: tuple[TemplateType, ...] = (
    "broken_link",
    "resource_addition",
    "unlinked_mention",
    "guest_post",
)


@dataclass
class OutreachContext:
    """Variables used to personalize an outreach email."""

    contact_name: str
    site_name: str
    page_url: str
    # Broken link specific
    broken_url: str = ""
    anchor_text: str = ""
    suggested_url: str = BRAND.website
    # Unlinked mention specific
    mention_context: str = ""
    # Guest post specific
    topic_idea: str = ""
    # General
    personal_note: str = ""


@dataclass
class OutreachEmail:
    """A drafted outreach email ready for human review."""

    template_type: TemplateType
    subject: str
    body: str
    to_email: str
    contact_name: str
    page_url: str
    generated_at: str
    review_required: bool = True

    def to_dict(self) -> dict[str, str | bool]:
        return {
            "template_type": self.template_type,
            "subject": self.subject,
            "body": self.body,
            "to_email": self.to_email,
            "contact_name": self.contact_name,
            "page_url": self.page_url,
            "generated_at": self.generated_at,
            "review_required": self.review_required,
        }


class OutreachGenerator:
    """
    Generate professional, personalized outreach emails for link building.

    All templates follow WreckMatch brand voice: professional, trustworthy,
    helpful — never pushy or spammy.
    """

    def __init__(
        self,
        config: AppConfig | None = None,
        brand: WreckMatchBrand = BRAND,
    ) -> None:
        self.config = config or AppConfig.from_env()
        self.brand = brand

    def generate(
        self,
        template_type: TemplateType,
        context: OutreachContext,
        *,
        to_email: str = "",
    ) -> OutreachEmail:
        """
        Generate a single outreach email draft.

        Args:
            template_type: One of broken_link, resource_addition, etc.
            context: Personalization variables.
            to_email: Recipient email (optional — fill in during review).

        Returns:
            OutreachEmail draft marked review_required=True.
        """
        log_safety_reminder(logger, f"Email draft generated ({template_type})")

        generators = {
            "broken_link": self._broken_link,
            "resource_addition": self._resource_addition,
            "unlinked_mention": self._unlinked_mention,
            "guest_post": self._guest_post,
        }

        subject, body = generators[template_type](context)
        email = OutreachEmail(
            template_type=template_type,
            subject=subject,
            body=body,
            to_email=to_email,
            contact_name=context.contact_name,
            page_url=context.page_url,
            generated_at=datetime.now(timezone.utc).isoformat(),
        )

        logger.info(
            "Draft created: type=%s, page=%s, subject=%r",
            template_type,
            context.page_url,
            subject,
        )
        return email

    def generate_for_prospect(
        self,
        prospect: dict[str, str],
        *,
        template_type: TemplateType | None = None,
    ) -> OutreachEmail:
        """
        Generate email from a tracker/prospect row dict.

        Auto-selects template based on prospect_type if not specified.
        """
        ptype = prospect.get("prospect_type", "general")
        if template_type is None:
            template_map: dict[str, TemplateType] = {
                "broken_link": "broken_link",
                "resource_page": "resource_addition",
                "unlinked_mention": "unlinked_mention",
                "guest_post": "guest_post",
            }
            template_type = template_map.get(ptype, "resource_addition")

        site_name = _site_name_from_url(prospect.get("url", ""))
        context = OutreachContext(
            contact_name=prospect.get("contact_name") or f"{site_name} Team",
            site_name=site_name,
            page_url=prospect.get("url", ""),
            broken_url=prospect.get("broken_url", ""),
            anchor_text=prospect.get("title", ""),
            suggested_url=prospect.get("suggested_replacement") or self.brand.website,
            mention_context=prospect.get("notes", ""),
            topic_idea=_default_guest_topic(site_name),
            personal_note="",
        )

        return self.generate(
            template_type,
            context,
            to_email=prospect.get("contact_email", ""),
        )

    def _signature(self) -> str:
        return (
            f"Best regards,\n"
            f"{self.config.outreach_sender_name}\n"
            f"{self.config.outreach_sender_title}\n"
            f"WreckMatch — {self.brand.tagline}\n"
            f"{self.brand.website}\n"
            f"{self.brand.phone_display}"
        )

    def _greeting(self, name: str) -> str:
        if name and name.lower() not in ("team", "there"):
            return f"Hi {name},"
        return "Hello,"

    def _cta_block(self, ctx: OutreachContext) -> str:
        """Shared call-to-action emphasizing WreckMatch's mission."""
        return (
            f"If you agree this could help your readers, we'd be grateful for a link to "
            f"{self.brand.website}. Every referral helps a car accident victim find "
            f"qualified legal help when they need it most — at no upfront cost.\n\n"
            f"Questions? Call us at {self.brand.phone} ({self.brand.phone_display}) "
            f"or visit {self.brand.website}."
        )

    def _broken_link(self, ctx: OutreachContext) -> tuple[str, str]:
        subject = f"Broken link on {ctx.site_name} — resource suggestion for your readers"
        body = f"""{self._greeting(ctx.contact_name)}

I hope this message finds you well. I was reviewing your resource page at {ctx.page_url} — it's a valuable collection for people navigating life after a car accident — and noticed one link that appears to be broken:

  • Link text: "{ctx.anchor_text or '(no anchor text)'}"
  • URL: {ctx.broken_url}
  • Likely returns a 404 or server error

When someone has just been in a crash, broken links on a resource page can mean the difference between finding help and giving up. Your page clearly aims to support accident victims, and I wanted to flag this in case you're doing routine link maintenance.

If you're replacing that link, may I suggest {ctx.suggested_url}? WreckMatch is a free, nationwide service that connects car accident victims with vetted personal injury attorneys — {self.brand.mission.lower()}. There is never an upfront cost to the people we help.

We're not asking for anything in exchange for this heads-up. I simply believe it could serve your readers while you fix the link.

{self._cta_block(ctx)}

{ctx.personal_note}

{self._signature()}"""
        return subject, body.strip()

    def _resource_addition(self, ctx: OutreachContext) -> tuple[str, str]:
        subject = f"A free resource for car accident victims on {ctx.site_name}"
        body = f"""{self._greeting(ctx.contact_name)}

I've spent time with the resources you've curated at {ctx.page_url}, and it's clear your team is committed to helping people after a car accident — a moment when reliable information matters enormously.

I'd like to suggest WreckMatch ({self.brand.website}) as a potential addition to your list. We exist for one reason: to help car accident victims connect with experienced personal injury attorneys at no upfront cost. {self.brand.mission}.

Why your readers may find it valuable:
  • **Free attorney matching** — accident victims pay nothing to use our service
  • **Vetted attorneys** — personal injury lawyers screened for quality and experience
  • **Educational guides** — practical steps for the hours and days after a crash
  • **Nationwide coverage** — help available across the United States

Car accident victims often don't know where to turn. A trusted link on a page like yours can be the first step toward getting the legal help they deserve.

{self._cta_block(ctx)}

Thank you for the work you do supporting accident victims and their families. Whether or not WreckMatch is the right fit for your list, I appreciate what you're building.

{ctx.personal_note}

{self._signature()}"""
        return subject, body.strip()

    def _unlinked_mention(self, ctx: OutreachContext) -> tuple[str, str]:
        subject = f"Thank you for mentioning WreckMatch — helping more accident victims find us"
        body = f"""{self._greeting(ctx.contact_name)}

I came across your page at {ctx.page_url} and noticed you mentioned WreckMatch. Thank you — that kind of reference helps car accident victims discover free attorney matching when they need it most.

{ctx.mention_context or "We know how overwhelming the days after a crash can be. Every mention of our service on a trusted site like yours helps someone who might otherwise never find help."}

If it would be helpful, I'm happy to provide:
  • An official one-line description for your page
  • A direct link to {self.brand.website}
  • Answers to any questions about how our free matching service works

Our goal is simple: make sure accident victims who read your content can easily connect with qualified legal help — at no cost to them.

{self._cta_block(ctx)}

Thank you again for supporting car accident victims. We're grateful for partners like {ctx.site_name}.

{ctx.personal_note}

{self._signature()}"""
        return subject, body.strip()

    def _guest_post(self, ctx: OutreachContext) -> tuple[str, str]:
        subject = f"Guest article to help car accident victims — idea for {ctx.site_name}"
        body = f"""{self._greeting(ctx.contact_name)}

I'm reaching out from WreckMatch, where we help car accident victims connect with qualified personal injury attorneys at no upfront cost. I've been reading {ctx.site_name} and believe your audience would benefit from practical, compassionate content on post-accident decisions.

I'd like to propose a guest article:

  • **Topic:** {ctx.topic_idea}
  • **Angle:** Actionable, non-promotional guidance for victims and families
  • **Goal:** Help readers avoid costly mistakes in the first days after a crash
  • **Disclosure:** Author bio would note affiliation with WreckMatch

We never provide legal advice. Our content focuses on helping people understand their options so they can make informed decisions during one of the most stressful periods of their lives.

If guest contributions aren't something you accept, I completely understand. Either way, thank you for the resources you already provide to car accident victims.

{self._cta_block(ctx)}

{ctx.personal_note}

{self._signature()}"""
        return subject, body.strip()

    def batch_generate(
        self,
        prospects: list[dict[str, str]],
    ) -> list[OutreachEmail]:
        """Generate drafts for multiple prospects."""
        emails: list[OutreachEmail] = []
        for prospect in prospects:
            if prospect.get("status") in ("link_acquired", "declined", "not_relevant"):
                continue
            emails.append(self.generate_for_prospect(prospect))
        logger.info("Batch generated %d email drafts", len(emails))
        return emails


def _site_name_from_url(url: str) -> str:
    """Extract a readable site name from a URL."""
    match = re.search(r"https?://(?:www\.)?([^/]+)", url)
    if not match:
        return "your site"
    domain = match.group(1)
    name = domain.split(".")[0]
    return name.replace("-", " ").title()


def _default_guest_topic(site_name: str) -> str:
    return (
        "What to Do in the First 72 Hours After a Car Accident "
        "(A Practical Checklist for Victims and Families)"
    )
