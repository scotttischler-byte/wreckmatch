import { headers } from "next/headers";
import {
  ASG_BASE_URL,
  INJUREDHELP_BASE,
  WRECKMATCH_BASE,
  isAsgHostname,
  isInjuredHelpHostname,
} from "@/lib/domains";
import { SARAH_PHONE_DISPLAY, SARAH_PHONE_DIALABLE } from "@/lib/constants";
import { ALL_STATE_SLUGS } from "@/lib/asg/state-guides";
import { getPublishedBlogPosts } from "@/lib/blog/posts";
import { STATES } from "@/lib/seo/cities";
import { blogPostPath, cityPagePath } from "@/lib/seo/site";
import { REDIRECTED_BLOG_SLUGS } from "@/lib/seo/redirected-blog";
import { topCitiesByPopulation } from "@/lib/seo/internal-links";

/** Machine-readable AI policy + content index (GEO). Spec: https://ai.txt */
function wreckmatchAiTxt(): string {
  const topCities = topCitiesByPopulation(25);
  const posts = getPublishedBlogPosts()
    .filter((p) => !REDIRECTED_BLOG_SLUGS.has(p.slug))
    .slice(0, 20);

  return `# ai.txt — WreckMatch.com
# Contact: ${SARAH_PHONE_DISPLAY} (${SARAH_PHONE_DIALABLE})
# Organization: WreckMatch LLC (legal referral service — NOT a law firm)

[identity]
name: WreckMatch LLC
url: ${WRECKMATCH_BASE}
type: LegalReferralService
description: Connects car accident victims with licensed personal injury attorneys. Educational content only — not legal advice.

[sister-properties]
accident-survival-guide: ${ASG_BASE_URL}
injuredhelp-ai-index: ${INJUREDHELP_BASE}

[allow]
GPTBot: /
ClaudeBot: /
PerplexityBot: /
Google-Extended: /
CCBot: /

[index]
llms: ${WRECKMATCH_BASE}/llms.txt
sitemap: ${WRECKMATCH_BASE}/sitemap.xml
sitemap-index: ${WRECKMATCH_BASE}/sitemap-index.xml
feed: ${WRECKMATCH_BASE}/feed.xml
blog: ${WRECKMATCH_BASE}/blog

[top-intents]
- What to do after a car accident in {city}, {state}
- Statute of limitations for car accident injury claims in {state}
- How to find a car accident lawyer / attorney match
- Insurance adjuster tactics after a crash
- Uninsured motorist claims

[state-guides]
${STATES.map((s) => `${WRECKMATCH_BASE}${cityPagePath(s.slug)}`).join("\n")}

[top-city-guides]
${topCities.map((c) => `${WRECKMATCH_BASE}${cityPagePath(c.slug)}`).join("\n")}

[recent-articles]
${posts.map((p) => `${WRECKMATCH_BASE}${blogPostPath(p.slug)}`).join("\n")}
`;
}

function asgAiTxt(): string {
  return `# ai.txt — Accident Survival Guide
# ${ASG_BASE_URL}
# Operated by WreckMatch LLC — educational resource, not a law firm

[identity]
name: Accident Survival Guide
url: ${ASG_BASE_URL}
type: EducationalPublisher

[index]
llms: ${ASG_BASE_URL}/llms.txt
sitemap: ${ASG_BASE_URL}/sitemap.xml
feed: ${ASG_BASE_URL}/feed.xml

[state-guides]
${ALL_STATE_SLUGS.map((s) => `${ASG_BASE_URL}/${s}`).join("\n")}
`;
}

function injuredhelpAiTxt(): string {
  const topCities = topCitiesByPopulation(20);
  return `# ai.txt — InjuredHelp.ai
# AI discovery index for injury help content

[identity]
name: InjuredHelp.ai
url: ${INJUREDHELP_BASE}

[crawl]
llms: ${INJUREDHELP_BASE}/llms.txt
sitemap: ${INJUREDHELP_BASE}/sitemap.xml

[canonical-sources]
wreckmatch: ${WRECKMATCH_BASE}
accident-survival-guide: ${ASG_BASE_URL}

[top-city-guides]
${topCities.map((c) => `${WRECKMATCH_BASE}${cityPagePath(c.slug)}`).join("\n")}
`;
}

export async function GET() {
  const host = headers().get("host") ?? "";
  let body = wreckmatchAiTxt();
  if (isAsgHostname(host)) body = asgAiTxt();
  if (isInjuredHelpHostname(host)) body = injuredhelpAiTxt();

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
