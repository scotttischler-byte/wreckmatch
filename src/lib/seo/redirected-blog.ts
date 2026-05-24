import { cityPagePath } from "./site";

/** Blog slugs that 301 to city help pages — exclude from listings and sitemap. */
export const REDIRECTED_BLOG_SLUGS = new Set([
  "what-to-do-after-car-accident-houston-tx",
  "car-accident-miami-fl-insurance-pitfalls",
]);

const BLOG_CITY_REDIRECTS: Record<string, string> = {
  "what-to-do-after-car-accident-houston-tx": "houston",
  "car-accident-miami-fl-insurance-pitfalls": "miami",
};

/** `/blog/{slug}` → city help path — for middleware edge redirects. */
export const BLOG_PATH_REDIRECTS: Record<string, string> = Object.fromEntries(
  Object.entries(BLOG_CITY_REDIRECTS).map(([slug, city]) => [
    `/blog/${slug}`,
    cityPagePath(city),
  ]),
);

export function getCityRedirectForBlogSlug(slug: string): string | null {
  const citySlug = BLOG_CITY_REDIRECTS[slug];
  if (!citySlug) return null;
  return cityPagePath(citySlug);
}
