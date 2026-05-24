import type { StateRecord } from "../../../data/types";
import type { CityRecord } from "../../../data/types";
import { getCitationsForState } from "../../../data/citations";
import { cityPagePath } from "./site";

export function buildStateMarkdown(state: StateRecord, cities: CityRecord[]): string {
  const crashes = state.annual_crashes_state?.toLocaleString() ?? "many";
  const fatals = state.fatal_crashes_annual_state?.toLocaleString() ?? "hundreds of";
  const legalCitations = getCitationsForState(state.slug, state)
    .map((c, i) => `${i + 1}. [${c.label}](${c.url}) (${c.retrieved})`)
    .join("\n");
  const cityList = cities
    .slice(0, 15)
    .map((c) => `- [${c.city}](${cityPagePath(c.slug)}) — ~${c.annual_crashes?.toLocaleString() ?? "N/A"} crashes/yr (est.)`)
    .join("\n");

  return `# Car Accident Help in ${state.name} (${new Date().getFullYear()} State Guide)

**Educational only — not legal advice.** WreckMatch LLC is a legal referral service — **not a law firm**.

**Last updated:** ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}

---

## ${state.name} Overview

| Topic | Detail |
|-------|--------|
| Annual state crashes (est.) | ~${crashes} |
| Fatal crashes (est.) | ~${fatals} |
| Statute of limitations | **${state.statute_limitations_years} years** (most injury claims) |
| Fault system | ${state.comparative_negligence_rule} |
| Minimum liability | ${state.min_liability_insurance} |
| No-fault state | ${state.no_fault_state ? "Yes — PIP/MedPay rules apply" : "No — fault-based system"} |
| State DOT | [${state.name} transportation](${state.dot_url}) |
| Bar association | ${state.bar_association} |

---

## Immediate Steps After a ${state.name} Crash

1. Call 911 if anyone is injured.
2. Move to safety and activate hazard lights when possible.
3. Do not admit fault — stick to facts with officers and insurers.
4. Photograph vehicles, plates, injuries, and road conditions.
5. Collect witness names and phone numbers.
6. Seek medical care and save all records.
7. Notify your insurer with basic facts — decline recorded statements first.
8. Preserve dashcam or security video before it is deleted.

---

## ${state.name} Insurance & Legal Context

${state.no_fault_state
    ? `${state.name} is a no-fault state. Personal injury protection (PIP) may cover initial medical bills regardless of fault, but lawsuits against at-fault drivers are limited until injuries exceed statutory thresholds. Verify current thresholds with a licensed attorney.`
    : `${state.name} uses a fault-based system with ${state.comparative_negligence_rule} comparative negligence. Your recovery may be reduced if you share fault — documentation matters from day one.`}

Minimum liability limits of **${state.min_liability_insurance}** mean many at-fault drivers carry only basic coverage. Review your UM/UIM, MedPay, and PIP endorsements.

---

## City Guides in ${state.name}

${cityList || "_City guides publishing on a rolling schedule._"}

---

## Common Mistakes

| Mistake | Why it hurts |
|---------|--------------|
| Missing the **${state.statute_limitations_years}-year** deadline | Potentially barred claims |
| Recorded statement too early | Insurers use contradictions |
| Delayed treatment | Suggests minor injury |
| Accepting first settlement | May waive future costs |

---

## Frequently Asked Questions

### How long do I have to sue in ${state.name}?
Most car accident injury claims must be filed within **${state.statute_limitations_years} years**, but exceptions exist for minors, government claims, and wrongful death.

### Is WreckMatch a law firm?
No. WreckMatch LLC connects accident victims with independent attorneys — we do not provide legal advice.

---

## Sources & citations

${legalCitations}

---

*General education only. Consult a licensed ${state.name} attorney for advice about your specific case.*
`;
}
