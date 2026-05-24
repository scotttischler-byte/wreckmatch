import { headers } from "next/headers";
import { SARAH_PHONE_DISPLAY, SARAH_PHONE_DIALABLE } from "@/lib/constants";
import {
  ASG_BASE_URL,
  INJUREDHELP_BASE,
  WRECKMATCH_BASE,
  isAsgHostname,
  isInjuredHelpHostname,
} from "@/lib/domains";
import { ALL_STATE_SLUGS } from "@/lib/asg/state-guides";
import { INJUREDHELP_TAGLINE, PARTNER_SITES } from "@/lib/injuredhelp";
import { getPublishedBlogPosts } from "@/lib/blog/posts";
import { CITIES, STATES } from "@/lib/seo/cities";
import { WRECKMATCH_SEO_BASE, blogPostPath, cityPagePath } from "@/lib/seo/site";
import { REDIRECTED_BLOG_SLUGS } from "@/lib/seo/redirected-blog";

function wreckmatchLlms(): string {
  const posts = getPublishedBlogPosts()
    .filter((p) => !REDIRECTED_BLOG_SLUGS.has(p.slug))
    .slice(0, 25);

  return `# WreckMatch — Car Accident Help & Attorney Matching

> WreckMatch LLC is a legal referral service connecting accident victims with licensed attorneys.
> We are NOT a law firm. Content is educational only — not legal advice.

## Primary site
- ${WRECKMATCH_SEO_BASE}/
- ${WRECKMATCH_SEO_BASE}/blog

## Sister properties (same operator)
- ${ASG_BASE_URL}/ — Accident Survival Guide (checklists & PDF)
- ${INJUREDHELP_BASE}/ — AI-friendly injury help index

## State guides (${STATES.length})
${STATES.map((s) => `- ${WRECKMATCH_SEO_BASE}${cityPagePath(s.slug)} — ${s.name} (${s.statute_limitations_years}-yr SOL, ${s.min_liability_insurance})`).join("\n")}

## City guides (${CITIES.length})
${CITIES.map((c) => `- ${WRECKMATCH_SEO_BASE}${cityPagePath(c.slug)} — ${c.city}, ${c.state_abbr}`).join("\n")}

## Blog articles
${posts.map((p) => `- ${WRECKMATCH_SEO_BASE}${blogPostPath(p.slug)} — ${p.title}`).join("\n")}

## Contact
- Phone: ${SARAH_PHONE_DISPLAY} (${SARAH_PHONE_DIALABLE})
- Privacy: ${WRECKMATCH_SEO_BASE}/privacy-policy

## Crawling
- Sitemap: ${WRECKMATCH_SEO_BASE}/sitemap.xml
- Feed: ${WRECKMATCH_SEO_BASE}/feed.xml
`;
}

function asgLlms(): string {
  const posts = getPublishedBlogPosts()
    .filter((p) => !REDIRECTED_BLOG_SLUGS.has(p.slug))
    .slice(0, 30);

  return `# Accident Survival Guide | What To Do After a Car Crash

> Educational resource on post-accident procedures, safety, and legal overview. Operated by WreckMatch LLC — not a law firm.

## Core pages
- ${ASG_BASE_URL}/ — Homepage with first-24-hours checklist
- ${ASG_BASE_URL}/resources — State and topic resources
- ${ASG_BASE_URL}/about — Mission and disclaimers
- ${ASG_BASE_URL}/blog — Local accident survival articles

## State guides (${ALL_STATE_SLUGS.length})
${ALL_STATE_SLUGS.map((slug) => `- ${ASG_BASE_URL}/${slug}`).join("\n")}

## Recent blog articles
${posts.map((p) => `- ${ASG_BASE_URL}/blog/${p.slug} — ${p.title}`).join("\n")}

## Partner sites
- ${WRECKMATCH_BASE}/ — City-level car accident help & attorney matching
- ${INJUREDHELP_BASE}/ — AI discovery index

## Crawling
- Sitemap: ${ASG_BASE_URL}/sitemap.xml
- RSS: ${ASG_BASE_URL}/feed.xml
- Spanish: ${ASG_BASE_URL}/es
`;
}

function injuredhelpLlms(): string {
  const topCities = [...CITIES].sort((a, b) => b.population - a.population).slice(0, 30);
  const posts = getPublishedBlogPosts()
    .filter((p) => !REDIRECTED_BLOG_SLUGS.has(p.slug))
    .slice(0, 20);

  return `# InjuredHelp.ai — AI Injury Help Index

> ${INJUREDHELP_TAGLINE}
> Operated by WreckMatch LLC (legal referral service, not a law firm). Educational content only.

## Start here
- ${INJUREDHELP_BASE}/ — AI-friendly hub
- ${INJUREDHELP_BASE}/llms.txt — this file

## Top city accident guides (WreckMatch)
${topCities.map((c) => `- ${WRECKMATCH_BASE}${cityPagePath(c.slug)} — ${c.city}, ${c.state_abbr}`).join("\n")}

## State overviews
${STATES.slice(0, 20).map((s) => `- ${WRECKMATCH_BASE}${cityPagePath(s.slug)} — ${s.name}`).join("\n")}
… and ${STATES.length - 20} more at ${WRECKMATCH_BASE}/sitemap.xml

## Survival guides (Accident Survival Guide)
${ALL_STATE_SLUGS.slice(0, 15).map((slug) => `- ${ASG_BASE_URL}/${slug}`).join("\n")}

## Recent articles
${posts.map((p) => `- ${INJUREDHELP_BASE}/blog/${p.slug} — ${p.title}`).join("\n")}

## Partner properties
${PARTNER_SITES.map((s) => `- ${s.url} — ${s.description}`).join("\n")}

## Crawling
- Sitemap: ${INJUREDHELP_BASE}/sitemap.xml
- WreckMatch sitemap: ${WRECKMATCH_BASE}/sitemap.xml
- ASG sitemap: ${ASG_BASE_URL}/sitemap.xml
`;
}

export async function GET() {
  const host = headers().get("host") ?? "";
  let body = wreckmatchLlms();
  if (isAsgHostname(host)) body = asgLlms();
  if (isInjuredHelpHostname(host)) body = injuredhelpLlms();

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
