import type { StateRecord } from "../../../data/types";
import { STATES } from "../../../data/states";
import type { StateGuide } from "@/lib/accidentsurvivalguide";
import { STATE_GUIDES } from "@/lib/accidentsurvivalguide";

function buildFallbackGuide(state: StateRecord): StateGuide {
  const noFaultLine = state.no_fault_state
    ? `${state.name} is a no-fault insurance state — PIP/MedPay rules may apply before suing an at-fault driver.`
    : `${state.name} uses a fault-based system with ${state.comparative_negligence_rule} comparative negligence rules.`;

  return {
    slug: state.slug,
    name: state.name,
    abbr: state.abbr,
    headline: `What to do after a car accident in ${state.name}`,
    intro: `${state.name} has specific reporting rules, insurance minimums (${state.min_liability_insurance}), and a ${state.statute_limitations_years}-year statute of limitations for most injury claims. These steps are general education—not legal advice for your situation.`,
    tips: [
      "Call 911 if anyone is injured and move to safety when possible.",
      "Exchange names, insurance, license, and contact information with other drivers.",
      "Photograph vehicles, road conditions, traffic signals, and visible injuries.",
      "Collect witness names and phone numbers before they leave the scene.",
      "Seek medical care even if pain appears later—document every visit.",
      `Notify your insurer promptly; minimum liability in ${state.abbr} is ${state.min_liability_insurance}.`,
      "Avoid recorded statements or signing releases until you understand your rights.",
    ],
    statuteNote: noFaultLine,
    wreckmatchPath: `https://www.wreckmatch.com/car-accident-help-${state.slug}`,
  };
}

export function getStateGuideBySlug(slug: string): StateGuide | undefined {
  const custom = STATE_GUIDES[slug as keyof typeof STATE_GUIDES];
  if (custom) return custom;
  const state = STATES.find((s) => s.slug === slug);
  if (!state) return undefined;
  return buildFallbackGuide(state);
}

export const ALL_STATE_SLUGS = STATES.map((s) => s.slug);
