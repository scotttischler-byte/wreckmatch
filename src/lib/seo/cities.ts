import type { CityRecord } from "../../../data/types";
import { STATE_BY_SLUG } from "../../../data/states";
import citiesJson from "../../../data/cities.generated.json";

export const CITIES = citiesJson as CityRecord[];

export const CITY_BY_SLUG = Object.fromEntries(CITIES.map((c) => [c.slug, c])) as Record<
  string,
  CityRecord
>;

export function getCity(slug: string): CityRecord | undefined {
  return CITY_BY_SLUG[slug];
}

export function getCitiesByState(stateSlug: string): CityRecord[] {
  return CITIES.filter((c) => c.state_slug === stateSlug).sort(
    (a, b) => b.population - a.population,
  );
}

export function getStateForCity(city: CityRecord) {
  return STATE_BY_SLUG[city.state_slug];
}

/** Haversine distance in miles */
export function distanceMiles(a: CityRecord, b: CityRecord): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 3958.8;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(h));
}

export function getCityByName(cityName: string, stateAbbr: string): CityRecord | undefined {
  return CITIES.find((c) => c.city === cityName && c.state_abbr === stateAbbr);
}

export function getNearestCities(slug: string, limit = 5): CityRecord[] {
  const origin = getCity(slug);
  if (!origin) return [];
  return CITIES.filter((c) => c.slug !== slug)
    .map((c) => ({ c, d: distanceMiles(origin, c) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, limit)
    .map(({ c }) => c);
}

export { STATE_BY_SLUG, STATES } from "../../../data/states";
