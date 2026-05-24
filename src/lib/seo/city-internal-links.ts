import type { CityRecord } from "../../../data/types";
import type { StateRecord } from "../../../data/types";
import { blogPostPath, cityPagePath } from "./site";
import { blogSlugFor, relatedBlogLinks, stateCityLinks, templateTitle } from "./internal-links";
import { getCitiesByState } from "./cities";
import type { BlogTemplateId } from "../../../data/types";

const EXTRA_TEMPLATES: BlogTemplateId[] = [
  "statute-limitations",
  "uninsured-driver",
  "whiplash-claims",
  "settlement-timeline",
];

export function cityInternalLinks(city: CityRecord, state: StateRecord) {
  const cityHelp = { label: `${city.city} car accident help hub`, href: cityPagePath(city.slug) };
  const stateHelp = { label: `${state.name} state guide`, href: cityPagePath(state.slug) };
  const blogLinks = relatedBlogLinks(city, "", 4);
  const programmatic = EXTRA_TEMPLATES.map((t) => ({
    label: templateTitle(t, city),
    href: blogPostPath(blogSlugFor(city, t)),
  }));
  const sameState = stateCityLinks(state.slug, 5)
    .filter((c) => c.href !== cityPagePath(city.slug))
    .map((c) => ({ label: `${c.label} guide`, href: c.href }));

  return [cityHelp, stateHelp, ...blogLinks, ...programmatic.slice(0, 3), ...sameState];
}

export function stateInternalLinks(state: StateRecord) {
  const cities = getCitiesByState(state.slug);
  const anchor = cities[0];
  const stateGuide = { label: `${state.name} overview`, href: cityPagePath(state.slug) };
  const resources = { label: "All states & cities", href: "/resources" };
  const cityLinks = stateCityLinks(state.slug, 8).map((c) => ({
    label: `${c.label}, ${state.abbr}`,
    href: c.href,
  }));
  if (!anchor) return [stateGuide, resources, ...cityLinks];

  const programmatic = EXTRA_TEMPLATES.slice(0, 2).map((t) => ({
    label: templateTitle(t, anchor),
    href: blogPostPath(blogSlugFor(anchor, t)),
  }));

  return [stateGuide, resources, ...programmatic, ...cityLinks];
}
