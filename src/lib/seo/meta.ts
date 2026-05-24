import type { BlogTemplateId } from "../../../data/types";
import type { CityRecord } from "../../../data/types";
import type { StateRecord } from "../../../data/types";
import { getStateForCity } from "./cities";

const TEMPLATE_META: Record<
  BlogTemplateId,
  (city: CityRecord, state: StateRecord) => string
> = {
  "immediate-steps": (city, state) =>
    `First steps after a ${city.city} crash: 911, photos, medical care, and ${state.statute_limitations_years}-yr ${state.abbr} SOL. Not legal advice.`,
  "statute-limitations": (city, state) =>
    `${state.name} car accident deadline: ${state.statute_limitations_years}-year SOL for most injury claims in ${city.city}. Educational guide — verify dates with counsel.`,
  "uninsured-driver": (city, state) =>
    `Hit by an uninsured driver in ${city.city}? ${state.min_liability_insurance} minimums, UM/UIM coverage, and ${state.abbr} claim steps explained.`,
  "truck-accident": (city, state) =>
    `${city.city} truck accident guide: commercial carrier claims, ${state.comparative_negligence_rule} fault rules, and evidence preservation.`,
  "rideshare-accident": (city, state) =>
    `Uber/Lyft accident in ${city.city}: rideshare insurance layers, ${state.abbr} reporting, and when to consult an attorney.`,
  "whiplash-claims": (city, state) =>
    `Whiplash injury claims in ${city.city}: medical documentation, insurer tactics, and ${state.statute_limitations_years}-year ${state.abbr} deadline.`,
  "settlement-timeline": (city, state) =>
    `How long car accident settlements take in ${city.city}: ${state.name} timelines, medical liens, and negotiation phases.`,
  "insurance-denied": (city, state) =>
    `Insurance denied your ${city.city} crash claim? ${state.abbr} appeal steps, bad-faith basics, and documentation checklist.`,
  "costly-mistakes": (city, state) =>
    `7 costly mistakes after a ${city.city} crash: recorded statements, gaps in care, and missing the ${state.statute_limitations_years}-yr SOL.`,
  "hire-lawyer": (city, state) =>
    `Should you hire a lawyer after a ${city.city} accident? ${state.name} fault rules, injury severity, and free matching options.`,
};

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

export function programmaticBlogMetaDescription(
  city: CityRecord,
  template: BlogTemplateId,
): string {
  const state = getStateForCity(city);
  if (!state) return blogMetaDescription(city, template);
  const fn = TEMPLATE_META[template];
  return fn(city, state);
}
