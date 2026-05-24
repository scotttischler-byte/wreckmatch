import type { CityRecord } from "../../../data/types";
import type { BlogTemplateId } from "../../../data/types";
import {
  CITIES,
  getCitiesByState,
  getCity,
  getNearestCities,
  getStateForCity,
} from "./cities";
import { blogPostPath, cityPagePath, statePagePath } from "./site";

export type BreadcrumbItem = { label: string; href: string };

export function homeBreadcrumb(): BreadcrumbItem[] {
  return [{ label: "Home", href: "/" }];
}

export function cityBreadcrumbs(city: CityRecord): BreadcrumbItem[] {
  return [
    { label: "Home", href: "/" },
    { label: city.state, href: statePagePath(city.state_slug) },
    { label: city.city, href: cityPagePath(city.slug) },
  ];
}

export function stateBreadcrumbs(stateName: string, stateSlug: string): BreadcrumbItem[] {
  return [
    { label: "Home", href: "/" },
    { label: stateName, href: statePagePath(stateSlug) },
  ];
}

export function blogBreadcrumbs(title: string, slug: string, city?: CityRecord): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
  ];
  if (city) {
    items.splice(1, 0, { label: city.state, href: statePagePath(city.state_slug) });
  }
  items.push({ label: title, href: blogPostPath(slug) });
  return items;
}

export function nearbyCityLinks(slug: string, limit = 5) {
  return getNearestCities(slug, limit).map((c) => ({
    label: c.city,
    href: cityPagePath(c.slug),
    stateAbbr: c.state_abbr,
  }));
}

export function stateCityLinks(stateSlug: string, limit = 20) {
  return getCitiesByState(stateSlug)
    .slice(0, limit)
    .map((c) => ({
      label: c.city,
      href: cityPagePath(c.slug),
      population: c.population,
    }));
}

const TEMPLATE_SLUG_PREFIX: Record<BlogTemplateId, string> = {
  "immediate-steps": "what-to-do-after-a-car-accident",
  "statute-limitations": "statute-of-limitations",
  "uninsured-driver": "uninsured-driver-accident",
  "truck-accident": "truck-accident",
  "rideshare-accident": "uber-lyft-accident",
  "whiplash-claims": "whiplash-injury-claims",
  "settlement-timeline": "car-accident-settlement-timeline",
  "insurance-denied": "insurance-denied-claim",
  "costly-mistakes": "costly-mistakes-after-crash",
  "hire-lawyer": "should-you-hire-a-lawyer",
};

export function blogSlugFor(city: CityRecord, template: BlogTemplateId): string {
  return `${TEMPLATE_SLUG_PREFIX[template]}-${city.slug}-${city.state_abbr.toLowerCase()}`;
}

export function relatedBlogLinks(city: CityRecord, currentSlug: string, limit = 5) {
  const templates: BlogTemplateId[] = [
    "immediate-steps",
    "statute-limitations",
    "uninsured-driver",
    "costly-mistakes",
    "hire-lawyer",
  ];
  return templates
    .map((t) => ({
      label: templateTitle(t, city),
      href: blogPostPath(blogSlugFor(city, t)),
      slug: blogSlugFor(city, t),
    }))
    .filter((l) => l.slug !== currentSlug)
    .slice(0, limit);
}

export function templateTitle(template: BlogTemplateId, city: CityRecord): string {
  const map: Record<BlogTemplateId, string> = {
    "immediate-steps": `What to Do After a Car Accident in ${city.city}`,
    "statute-limitations": `Statute of Limitations in ${city.state} — ${city.city} Guide`,
    "uninsured-driver": `Hit by an Uninsured Driver in ${city.city}`,
    "truck-accident": `Truck Accident Guide for ${city.city}`,
    "rideshare-accident": `Uber/Lyft Accident in ${city.city}`,
    "whiplash-claims": `Whiplash Injury Claims in ${city.city}`,
    "settlement-timeline": `How Long Does a Settlement Take in ${city.city}?`,
    "insurance-denied": `Insurance Denied Your Claim in ${city.city}`,
    "costly-mistakes": `7 Costly Mistakes After a Crash in ${city.city}`,
    "hire-lawyer": `Should You Hire a Lawyer After a ${city.city} Crash?`,
  };
  return map[template];
}

export function findCityByBlogSlug(slug: string): CityRecord | undefined {
  return CITIES.find(
    (c) =>
      slug.includes(`-${c.slug}-`) ||
      slug.endsWith(`-${c.state_abbr.toLowerCase()}`) && slug.includes(c.slug),
  );
}

export function getCityFromSlugPart(slug: string): CityRecord | undefined {
  return getCity(slug) ?? findCityByBlogSlug(slug);
}

export function topCitiesByPopulation(limit = 10): CityRecord[] {
  return [...CITIES].sort((a, b) => b.population - a.population).slice(0, limit);
}

export function getStateForCityRecord(city: CityRecord) {
  return getStateForCity(city);
}
