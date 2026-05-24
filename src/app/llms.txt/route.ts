import { WRECKMATCH_SEO_BASE, cityPagePath, blogPostPath } from "@/lib/seo/site";
import { CITIES, STATES } from "@/lib/seo/cities";
import { getPublishedBlogPosts } from "@/lib/blog/posts";

export async function GET() {
  const topCities = [...CITIES]
    .sort((a, b) => b.population - a.population)
    .slice(0, 20);
  const posts = getPublishedBlogPosts().slice(0, 15);

  const body = `# WreckMatch — Car Accident Help & Attorney Matching

> WreckMatch LLC is a legal referral service connecting accident victims with licensed attorneys.
> We are NOT a law firm. Content is educational only — not legal advice.

## Primary site
- ${WRECKMATCH_SEO_BASE}/
- ${WRECKMATCH_SEO_BASE}/blog

## State guides (${STATES.length})
${STATES.map((s) => `- ${WRECKMATCH_SEO_BASE}${cityPagePath(s.slug)} — ${s.name} (${s.statute_limitations_years}-year SOL, ${s.min_liability_insurance} mins)`).join("\n")}

## Top city guides
${topCities.map((c) => `- ${WRECKMATCH_SEO_BASE}${cityPagePath(c.slug)} — ${c.city}, ${c.state_abbr}`).join("\n")}

## Recent blog articles
${posts.map((p) => `- ${WRECKMATCH_SEO_BASE}${blogPostPath(p.slug)} — ${p.title}`).join("\n")}

## Contact
- Homepage chat widget: ${WRECKMATCH_SEO_BASE}/
- Privacy: ${WRECKMATCH_SEO_BASE}/privacy-policy

## Crawling
- Sitemap: ${WRECKMATCH_SEO_BASE}/sitemap.xml
- AI crawlers: allowed (see robots.txt)
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
