import type { CityRecord } from "../../../data/types";
import type { StateRecord } from "../../../data/types";
import { getCitationsForState } from "../../../data/citations";
import { cityPagePath } from "./site";

export function buildCityMarkdown(city: CityRecord, state: StateRecord): string {
  const crashes = city.annual_crashes?.toLocaleString() ?? "thousands of";
  const fatals = city.fatal_crashes_annual?.toLocaleString() ?? "dozens of";
  const pop = city.population.toLocaleString();
  const highways = city.major_highways.join(", ");
  const hotspots = city.accident_hotspots.map((h) => `- ${h}`).join("\n");
  const hospitals = city.major_hospitals.map((h) => `- ${h}`).join("\n");
  const trauma = city.trauma_centers_level1.length
    ? city.trauma_centers_level1.map((t) => `- ${t}`).join("\n")
    : "- Verify nearest Level I trauma center via state health department listings";
  const sources = city.data_sources
    .map((s) => `- ${s.field}: [source](${s.url}) (retrieved ${s.retrieved})`)
    .join("\n");
  const policeLink = city.police_accident_report_link ?? "Contact local police or sheriff for crash report instructions";
  const noFaultNote = state.no_fault_state
    ? `${state.name} is a no-fault insurance state — PIP/MedPay rules may limit when you can sue. Verify current thresholds with counsel.`
    : `${state.name} uses a fault-based system with ${state.comparative_negligence_rule} comparative negligence rules.`;

  const legalCitations = getCitationsForState(state.slug, state)
    .map((c, i) => `${i + 1}. [${c.label}](${c.url}) (${c.retrieved})`)
    .join("\n");

  return `# Car Accident Help in ${city.city}, ${state.name} (${new Date().getFullYear()} Guide)

**Educational only — not legal advice.** WreckMatch LLC is a legal referral service connecting accident victims with licensed attorneys — **not a law firm**.

**Last updated:** ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}

**Quick answer:** After a crash in ${city.city}, call 911 if anyone is hurt, document the scene, seek medical care, notify your insurer without giving a recorded statement, and consider free attorney matching before accepting a settlement.

---

## ${city.city} Crash Overview

| Metric | Detail |
|--------|--------|
| City population | ~${pop} |
| Metro population | ~${(city.metro_population ?? city.population * 1.5).toLocaleString()} |
| Annual reported crashes (est.) | ~${crashes} |
| Fatal crashes (est.) | ~${fatals} |
| County | ${city.county} |
| Primary court venue | ${city.county_court} |

${sources ? `**Data sources:**\n${sources}` : ""}

High-traffic corridors in the ${city.city} area include **${highways}**. Insurers in high-volume metros process large claim volumes — documentation and timely medical care protect your position.

---

## Immediate Steps After a Crash in ${city.city}

1. **Move to safety** — Hazards on, avoid blocking traffic if you can relocate.
2. **Call 911** — Request police and EMS when injuries or major damage exist.
3. **Do not admit fault** — Stick to facts with officers and other drivers.
4. **Photograph everything** — Vehicles, plates, signals, skid marks, injuries, and road debris.
5. **Exchange information** — Names, phones, insurance policy numbers, and registration.
6. **Identify witnesses** — Collect contact information before they leave.
7. **Seek medical care** — ER, urgent care, or PCP same day; delayed pain is common.
8. **Preserve evidence** — Dashcam, Ring, or business security video expires quickly.

---

## High-Risk Corridors & Hotspots

${hotspots}

If your crash occurred on one of these corridors, note mile markers, exit numbers, and direction of travel for the police report.

---

## ${state.name} Statute of Limitations & Insurance Rules

| Item | Detail |
|------|--------|
| **Statute of limitations** | **${state.statute_limitations_years} years** for most personal injury claims (verify with counsel) |
| **Fault system** | ${state.comparative_negligence_rule} |
| **Minimum liability limits** | ${state.min_liability_insurance} (BI/PD — verify current law) |
| **State DOT** | [${state.name} transportation](${state.dot_url}) |
| **Crash reporting** | ${typeof policeLink === "string" && policeLink.startsWith("http") ? `[Local instructions](${policeLink})` : policeLink} |

${noFaultNote}

**Direct answer:** You generally have **${state.statute_limitations_years} years** from the injury date to file most ${state.name} car accident lawsuits, but evidence disappears quickly — do not wait.

---

## Medical Care & Trauma Resources in ${city.city}

**Major hospitals:**
${hospitals}

**Level I trauma centers:**
${trauma}

Document every visit, prescription, and missed work day. Gaps in treatment are a common reason insurers reduce offers.

---

## 8 Steps to Protect Your Claim

1. **Medical evaluation within 24 hours** — Even if pain is delayed.
2. **Obtain the police / crash report** — Through the agency serving ${city.city}.
3. **Create a paper trail** — Save texts, emails, and adjuster names with dates.
4. **Avoid social media posts** — Photos and captions can be discoverable.
5. **Track lost wages and mileage** — Medical appointments add up.
6. **Review your policy** — UM/UIM, MedPay, and PIP may apply.
7. **Reject the first low offer** — Initial settlements rarely reflect full damages.
8. **Consult a licensed ${state.name} attorney** before signing releases.

---

## Common Mistakes That Cost ${city.city} Drivers

| Mistake | Consequence |
|---------|-------------|
| Recorded statement too early | Contradictions used to deny or reduce payout |
| Delayed medical treatment | Suggests injury was minor |
| Missing the **${state.statute_limitations_years}-year** deadline | Potentially barred claims |
| Accepting first settlement | May waive future medical costs |
| No crash report | Harder to establish facts and liability |

---

## Insurance Tactics to Watch For

- **Low initial offers** before you understand total medical costs.
- **Recorded statements** used to minimize injury severity.
- **Delay tactics** hoping you miss deadlines or accept less.
- **Partial fault arguments** under ${state.comparative_negligence_rule} rules.

Document every adjuster contact. You are not required to accept the first number.

---

## When to Consider an Attorney

Consider speaking with a licensed ${state.name} personal injury attorney if:

- You were hospitalized or have ongoing treatment.
- Fault is disputed or multiple vehicles were involved.
- The at-fault driver was uninsured or underinsured.
- A commercial truck, rideshare, or government vehicle was involved.
- The insurer denied coverage or offered an amount that does not cover bills.

WreckMatch LLC can help you explore **free attorney matching** — we are a referral service, not a law firm.

---

## Frequently Asked Questions

### Do I need a police report for every ${city.city} crash?
Not always. Reporting depends on injuries, damage thresholds, and whether police respond. Check current ${state.name} rules — this is general education only.

### How long do I have to file a claim in ${state.name}?
Most injury claims face a **${state.statute_limitations_years}-year** statute of limitations, but exceptions exist. Consult a licensed attorney for your specific dates.

### Is WreckMatch a law firm?
No. WreckMatch LLC is a legal referral service. We connect accident victims with independent attorneys — we do not provide legal advice.

### What if the other driver has no insurance?
${state.name} minimum limits are ${state.min_liability_insurance}. Uninsured/underinsured motorist (UM/UIM) coverage on your policy may apply — review your declarations page.

---

## Related ${state.name} Resources

- [${state.name} state accident guide](${cityPagePath(state.slug)})
- [${state.bar_association}](https://www.google.com/search?q=${encodeURIComponent(state.bar_association)})

---

## Sources & citations

${legalCitations}

---

*This guide is for general education only and does not create an attorney-client relationship. Laws change; verify all deadlines and insurance requirements with a licensed ${state.name} attorney.*
`;
}
