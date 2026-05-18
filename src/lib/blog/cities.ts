export type USCity = {
  city: string;
  state: string;
  stateAbbr: string;
  stateSlug: string;
  slug: string;
  populationRank: number;
};

function citySlug(city: string, stateAbbr: string) {
  return `${city.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${stateAbbr.toLowerCase()}`.replace(
    /-+/g,
    "-",
  );
}

/** Top US cities for rotational blog coverage (expandable to 100+). */
const RAW: Omit<USCity, "slug">[] = [
  { city: "New York", state: "New York", stateAbbr: "NY", stateSlug: "new-york", populationRank: 1 },
  { city: "Los Angeles", state: "California", stateAbbr: "CA", stateSlug: "california", populationRank: 2 },
  { city: "Chicago", state: "Illinois", stateAbbr: "IL", stateSlug: "illinois", populationRank: 3 },
  { city: "Houston", state: "Texas", stateAbbr: "TX", stateSlug: "texas", populationRank: 4 },
  { city: "Phoenix", state: "Arizona", stateAbbr: "AZ", stateSlug: "arizona", populationRank: 5 },
  { city: "Philadelphia", state: "Pennsylvania", stateAbbr: "PA", stateSlug: "pennsylvania", populationRank: 6 },
  { city: "San Antonio", state: "Texas", stateAbbr: "TX", stateSlug: "texas", populationRank: 7 },
  { city: "San Diego", state: "California", stateAbbr: "CA", stateSlug: "california", populationRank: 8 },
  { city: "Dallas", state: "Texas", stateAbbr: "TX", stateSlug: "texas", populationRank: 9 },
  { city: "San Jose", state: "California", stateAbbr: "CA", stateSlug: "california", populationRank: 10 },
  { city: "Austin", state: "Texas", stateAbbr: "TX", stateSlug: "texas", populationRank: 11 },
  { city: "Jacksonville", state: "Florida", stateAbbr: "FL", stateSlug: "florida", populationRank: 12 },
  { city: "Fort Worth", state: "Texas", stateAbbr: "TX", stateSlug: "texas", populationRank: 13 },
  { city: "Columbus", state: "Ohio", stateAbbr: "OH", stateSlug: "ohio", populationRank: 14 },
  { city: "Charlotte", state: "North Carolina", stateAbbr: "NC", stateSlug: "north-carolina", populationRank: 15 },
  { city: "Indianapolis", state: "Indiana", stateAbbr: "IN", stateSlug: "indiana", populationRank: 16 },
  { city: "San Francisco", state: "California", stateAbbr: "CA", stateSlug: "california", populationRank: 17 },
  { city: "Seattle", state: "Washington", stateAbbr: "WA", stateSlug: "washington", populationRank: 18 },
  { city: "Denver", state: "Colorado", stateAbbr: "CO", stateSlug: "colorado", populationRank: 19 },
  { city: "Washington", state: "District of Columbia", stateAbbr: "DC", stateSlug: "district-of-columbia", populationRank: 20 },
  { city: "Nashville", state: "Tennessee", stateAbbr: "TN", stateSlug: "tennessee", populationRank: 21 },
  { city: "Oklahoma City", state: "Oklahoma", stateAbbr: "OK", stateSlug: "oklahoma", populationRank: 22 },
  { city: "Boston", state: "Massachusetts", stateAbbr: "MA", stateSlug: "massachusetts", populationRank: 23 },
  { city: "El Paso", state: "Texas", stateAbbr: "TX", stateSlug: "texas", populationRank: 24 },
  { city: "Portland", state: "Oregon", stateAbbr: "OR", stateSlug: "oregon", populationRank: 25 },
  { city: "Las Vegas", state: "Nevada", stateAbbr: "NV", stateSlug: "nevada", populationRank: 26 },
  { city: "Detroit", state: "Michigan", stateAbbr: "MI", stateSlug: "michigan", populationRank: 27 },
  { city: "Memphis", state: "Tennessee", stateAbbr: "TN", stateSlug: "tennessee", populationRank: 28 },
  { city: "Louisville", state: "Kentucky", stateAbbr: "KY", stateSlug: "kentucky", populationRank: 29 },
  { city: "Baltimore", state: "Maryland", stateAbbr: "MD", stateSlug: "maryland", populationRank: 30 },
  { city: "Milwaukee", state: "Wisconsin", stateAbbr: "WI", stateSlug: "wisconsin", populationRank: 31 },
  { city: "Albuquerque", state: "New Mexico", stateAbbr: "NM", stateSlug: "new-mexico", populationRank: 32 },
  { city: "Tucson", state: "Arizona", stateAbbr: "AZ", stateSlug: "arizona", populationRank: 33 },
  { city: "Fresno", state: "California", stateAbbr: "CA", stateSlug: "california", populationRank: 34 },
  { city: "Mesa", state: "Arizona", stateAbbr: "AZ", stateSlug: "arizona", populationRank: 35 },
  { city: "Sacramento", state: "California", stateAbbr: "CA", stateSlug: "california", populationRank: 36 },
  { city: "Atlanta", state: "Georgia", stateAbbr: "GA", stateSlug: "georgia", populationRank: 37 },
  { city: "Kansas City", state: "Missouri", stateAbbr: "MO", stateSlug: "missouri", populationRank: 38 },
  { city: "Colorado Springs", state: "Colorado", stateAbbr: "CO", stateSlug: "colorado", populationRank: 39 },
  { city: "Miami", state: "Florida", stateAbbr: "FL", stateSlug: "florida", populationRank: 40 },
  { city: "Raleigh", state: "North Carolina", stateAbbr: "NC", stateSlug: "north-carolina", populationRank: 41 },
  { city: "Omaha", state: "Nebraska", stateAbbr: "NE", stateSlug: "nebraska", populationRank: 42 },
  { city: "Long Beach", state: "California", stateAbbr: "CA", stateSlug: "california", populationRank: 43 },
  { city: "Virginia Beach", state: "Virginia", stateAbbr: "VA", stateSlug: "virginia", populationRank: 44 },
  { city: "Oakland", state: "California", stateAbbr: "CA", stateSlug: "california", populationRank: 45 },
  { city: "Minneapolis", state: "Minnesota", stateAbbr: "MN", stateSlug: "minnesota", populationRank: 46 },
  { city: "Tampa", state: "Florida", stateAbbr: "FL", stateSlug: "florida", populationRank: 47 },
  { city: "Tulsa", state: "Oklahoma", stateAbbr: "OK", stateSlug: "oklahoma", populationRank: 48 },
  { city: "Arlington", state: "Texas", stateAbbr: "TX", stateSlug: "texas", populationRank: 49 },
  { city: "New Orleans", state: "Louisiana", stateAbbr: "LA", stateSlug: "louisiana", populationRank: 50 },
];

export const US_CITIES: USCity[] = RAW.map((c) => ({
  ...c,
  slug: citySlug(c.city, c.stateAbbr),
}));

export function getCityBySlug(slug: string) {
  return US_CITIES.find((c) => c.slug === slug);
}

export function pickCitiesForBatch(count: number, recentSlugs: string[]) {
  const recent = new Set(recentSlugs);
  const pool = US_CITIES.filter((c) => !recent.has(c.slug));
  const source = pool.length >= count ? pool : US_CITIES;
  const shuffled = [...source].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
