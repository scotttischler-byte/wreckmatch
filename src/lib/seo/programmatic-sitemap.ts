import type { BlogTemplateId } from "../../../data/types";
import { blogSlugFor, topCitiesByPopulation } from "./internal-links";

/** Non-cannibalizing programmatic templates (excludes immediate-steps → city pages). */
export const PROGRAMMATIC_SITEMAP_TEMPLATES: BlogTemplateId[] = [
  "statute-limitations",
  "uninsured-driver",
  "costly-mistakes",
  "hire-lawyer",
  "insurance-denied",
  "whiplash-claims",
  "settlement-timeline",
];

export const PROGRAMMATIC_SITEMAP_CITY_COUNT = 25;

export function programmaticBlogSlugsForSitemap(): string[] {
  const cities = topCitiesByPopulation(PROGRAMMATIC_SITEMAP_CITY_COUNT);
  return cities.flatMap((city) =>
    PROGRAMMATIC_SITEMAP_TEMPLATES.map((template) => blogSlugFor(city, template)),
  );
}
