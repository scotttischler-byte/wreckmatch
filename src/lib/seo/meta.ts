import type { CityRecord } from "../../../data/types";
import type { StateRecord } from "../../../data/types";
import { getStateForCity } from "./cities";

export function cityMetaDescription(city: CityRecord): string {
  const state = getStateForCity(city);
  const crashes = city.annual_crashes?.toLocaleString() ?? "thousands of";
  const sol = state?.statute_limitations_years ?? 2;
  return `${city.city} sees ~${crashes} crashes/year. ${city.state} has a ${sol}-year statute of limitations. Free attorney match in 60 seconds — 24/7 callback.`;
}

export function stateMetaDescription(state: StateRecord, cityCount: number): string {
  const crashes = state.annual_crashes_state?.toLocaleString() ?? "many";
  return `${state.name} reports ~${crashes} crashes annually. ${cityCount} city guides with local hospitals, highways, and ${state.statute_limitations_years}-year SOL. Free attorney matching.`;
}

export function blogMetaDescription(
  city: CityRecord,
  topicLabel: string,
): string {
  const state = getStateForCity(city);
  const crashes = city.annual_crashes?.toLocaleString() ?? "thousands of";
  return `${topicLabel} in ${city.city}, ${city.state_abbr}: ~${crashes} local crashes/year, ${state?.statute_limitations_years}-year SOL, ${state?.min_liability_insurance} insurance minimums. Educational guide — not legal advice.`;
}
