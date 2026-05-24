import type { BlogPost } from "@/lib/blog/types";
import type { BlogTemplateId } from "../../../data/types";
import type { CityRecord } from "../../../data/types";
import type { StateRecord } from "../../../data/types";
import { blogSlugFor, templateTitle } from "./internal-links";
import { blogMetaDescription } from "./meta";

function section(
  heading: string,
  paragraphs: string[],
  list?: string[],
): BlogPost["sections"][number] {
  return { heading, paragraphs, list };
}

function buildImmediateSteps(city: CityRecord, state: StateRecord): BlogPost["sections"] {
  const highways = city.major_highways.slice(0, 3).join(", ");
  return [
    section("First 10 minutes: safety and 911", [
      `A collision on ${city.major_highways[0] ?? "a busy " + city.city + " corridor"} or surface streets in ${city.city} can escalate quickly. If vehicles are drivable and it is safe, move to a shoulder or parking lot. Turn on hazard lights.`,
      `Call 911 when anyone reports pain, airbags deploy, fluids leak, or traffic is blocked. ${city.county} dispatch will route ${city.city} police or state patrol depending on location.`,
    ], [
      "Stay inside the vehicle with seatbelts on if traffic passes closely at highway speed",
      "Do not admit fault — describe facts only",
      "Request a crash report number before officers leave",
    ]),
    section(`${city.city} documentation checklist`, [
      `Photograph all vehicles, license plates, VIN stickers, skid marks, traffic signals, and visible injuries. ${city.city} insurers expect timestamped photos.`,
      `Collect names and phone numbers from witnesses — independent accounts matter on ${highways} and in ${city.county}.`,
      `Exchange insurance policy numbers and registration; note employer if the other driver was working.`,
    ]),
    section("Medical care within 24 hours", [
      `${city.city} has ${city.major_hospitals.slice(0, 2).join(" and ")} among its major facilities. ${city.trauma_centers_level1[0] ? `Level I trauma care is available at ${city.trauma_centers_level1[0]}.` : "Verify the nearest trauma center if injuries may be serious."}`,
      `Whiplash, concussion, and internal injuries may appear hours later. A same-day urgent care or ER visit creates a medical record insurers cannot easily dismiss.`,
    ]),
    section(`${state.name} reporting rules`, [
      `${state.name} requires crash reporting when injuries, death, or significant property damage occur. Minimum liability limits are ${state.min_liability_insurance}.`,
      `Cooperate with officers; request a copy of the report through ${city.police_accident_report_link ? "local police" : "the investigating agency"}. If police do not respond, check ${state.dot_url} for self-report thresholds.`,
    ]),
    section("Insurance notification without hurting your claim", [
      `Notify your carrier with basic facts — date, location, vehicles involved. Decline recorded statements until you understand your coverage and injuries.`,
      `${state.no_fault_state ? `${state.name} no-fault rules may limit lawsuits unless injuries exceed thresholds — verify with counsel.` : `${state.name} uses ${state.comparative_negligence_rule} comparative negligence; anything you say can affect fault allocation.`}`,
    ]),
    section(`Evidence preservation in ${city.city}`, [
      `Dashcam, Ring doorbell, and business security footage near ${city.accident_hotspots[0] ?? city.city + " corridors"} is often deleted within 7–30 days. Send written preservation letters when appropriate.`,
      `Save repair estimates, rental receipts, and mileage to medical appointments.`,
    ]),
    section("When to explore attorney matching", [
      `Consider a free consultation if you were hospitalized, fault is disputed, a commercial vehicle was involved, or the adjuster offers a quick settlement before treatment finishes.`,
      `WreckMatch LLC connects ${city.city} residents with licensed ${state.name} attorneys — we are a referral service, not a law firm.`,
    ]),
  ];
}

function buildStatuteSections(city: CityRecord, state: StateRecord): BlogPost["sections"] {
  return [
    section(`${state.name} deadline overview`, [
      `Most ${state.name} car accident injury lawsuits must be filed within **${state.statute_limitations_years} years** of the injury date. Missing this deadline can permanently bar recovery.`,
      `Wrongful death, government-entity, and minor claimant cases may follow different rules. This article is educational — confirm your dates with a licensed ${state.name} attorney.`,
    ]),
    section(`Why waiting hurts ${city.city} claims`, [
      `With ~${city.annual_crashes?.toLocaleString() ?? "thousands of"} annual crashes in the ${city.city} area, evidence fades fast: skid marks wash away, witnesses relocate, and video is overwritten.`,
      `Insurers begin building a file immediately. Early recorded statements can lock in descriptions before you know the full extent of injuries.`,
    ]),
    section(`Comparative fault in ${state.name}`, [
      `${state.name} follows ${state.comparative_negligence_rule} rules. If you are found partially at fault, compensation may be reduced or barred depending on your percentage.`,
      `Document everything that supports the other driver's negligence — traffic citations, 911 calls, and witness statements.`,
    ]),
    section("Insurance minimums and coverage gaps", [
      `${state.name} requires at least ${state.min_liability_insurance} in liability coverage (verify current law). Many at-fault drivers carry only minimums.`,
      `Review your declarations page for UM/UIM, MedPay, and PIP. These coverages can matter when the other driver is uninsured or underinsured in ${city.city}.`,
    ]),
    section("Government and special entities", [
      `Claims involving city buses, state vehicles, or federal property often require earlier notice than the standard ${state.statute_limitations_years}-year window. Missing a notice deadline can defeat an otherwise valid claim.`,
    ]),
    section(`Practical timeline for ${city.city} residents`, [
      `Day 1–7: Medical care, police report, insurer notification (facts only).`,
      `Week 2–8: Follow treatment plans, gather bills, avoid social media posts about the crash.`,
      `Month 2+: If injuries continue, consult counsel before accepting settlement releases.`,
    ]),
  ];
}

function buildUninsuredSections(city: CityRecord, state: StateRecord): BlogPost["sections"] {
  return [
    section("Confirm coverage at the scene", [
      `Ask for insurance card photos and verify policy status. In ${city.city}, uninsured motorist rates track with statewide averages — always assume minimum limits until verified.`,
    ]),
    section(`Your UM/UIM policy in ${state.name}`, [
      `Uninsured/underinsured motorist coverage on your policy may pay when the at-fault driver has no coverage or insufficient ${state.min_liability_insurance} limits.`,
      `Notify your carrier promptly; UM claims still require documentation of injuries and damages.`,
    ]),
    section(`Hit-and-run steps in ${city.city}`, [
      `Report hit-and-runs immediately to ${city.city} police. UM coverage often requires a police report within 24–72 hours.`,
      `Seek witnesses and camera footage near ${city.accident_hotspots[0] ?? "major corridors"}.`,
    ]),
    section("Medical and financial documentation", [
      `Use ${city.major_hospitals[0] ?? "local ER or urgent care"} if injured. Track lost wages and transportation costs.`,
    ]),
    section("When litigation may be necessary", [
      `If UM/UIM carriers deny or lowball offers, a licensed ${state.name} attorney can evaluate bad-faith and negligence claims against the at-fault driver directly.`,
    ]),
  ];
}

function buildMistakesSections(city: CityRecord, state: StateRecord): BlogPost["sections"] {
  return [
    section("Mistake 1: Skipping medical care", [
      `Delayed treatment is the top reason ${city.city} adjusters reduce offers. Visit ${city.major_hospitals[0] ?? "a provider"} within 24 hours when pain exists.`,
    ]),
    section("Mistake 2: Recorded statements", [
      `Adjusters are trained to elicit admissions. Politely decline until you understand injuries and coverage.`,
    ]),
    section("Mistake 3: Social media", [
      `Posts, check-ins, and photos can contradict injury claims — even innocent updates.`,
    ]),
    section(`Mistake 4: Missing the ${state.statute_limitations_years}-year deadline`, [
      `${state.name} courts enforce statutes strictly. Calendar your deadline the day you are injured.`,
    ]),
    section("Mistake 5: Accepting the first check", [
      `Initial offers rarely include future medical care or wage loss on ${highwaysLabel(city)} crashes.`,
    ]),
    section("Mistake 6: Poor crash report follow-up", [
      `Obtain the official report and verify accuracy — errors on ${city.county} reports are correctable in some cases.`,
    ]),
    section("Mistake 7: DIY negotiation on serious injuries", [
      `Complex ${city.city} crashes involving surgery, permanent impairment, or commercial vehicles usually need professional evaluation.`,
    ]),
  ];
}

function buildHireLawyerSections(city: CityRecord, state: StateRecord): BlogPost["sections"] {
  return [
    section("Signs you may need counsel", [
      `Hospitalization, surgery, disputed fault, denied coverage, or lowball offers after ${city.city} crashes are common triggers for attorney consultation.`,
    ]),
    section(`How ${state.name} contingency fees typically work`, [
      `Most personal injury attorneys work on contingency — you pay no upfront fee; they receive a percentage of recovery if successful. Verify terms in writing.`,
    ]),
    section("What an attorney handles", [
      `Evidence preservation, lien negotiation, insurer correspondence, and litigation if settlement fails.`,
    ]),
    section("WreckMatch's role", [
      `We match ${city.city} residents with independent ${state.name} attorneys. We are not a law firm and do not provide legal advice.`,
    ]),
  ];
}

function highwaysLabel(city: CityRecord): string {
  return city.major_highways.slice(0, 2).join(" / ") || city.city;
}

const BUILDERS: Record<
  BlogTemplateId,
  (city: CityRecord, state: StateRecord) => BlogPost["sections"]
> = {
  "immediate-steps": buildImmediateSteps,
  "statute-limitations": buildStatuteSections,
  "uninsured-driver": buildUninsuredSections,
  "truck-accident": buildImmediateSteps,
  "rideshare-accident": buildImmediateSteps,
  "whiplash-claims": buildImmediateSteps,
  "settlement-timeline": buildStatuteSections,
  "insurance-denied": buildUninsuredSections,
  "costly-mistakes": buildMistakesSections,
  "hire-lawyer": buildHireLawyerSections,
};

function buildFaq(city: CityRecord, state: StateRecord, template: BlogTemplateId): BlogPost["faq"] {
  const base = [
    {
      question: `Is this legal advice for my ${city.city} case?`,
      answer:
        "No. This is general education from WreckMatch LLC, a referral service — not a law firm. Consult a licensed attorney for advice about your situation.",
    },
    {
      question: `What is the statute of limitations in ${state.name}?`,
      answer: `Most injury claims face a ${state.statute_limitations_years}-year deadline, but exceptions apply. Verify your dates with counsel.`,
    },
  ];
  if (template === "uninsured-driver" || template === "insurance-denied") {
    base.push({
      question: "Will my rates increase if I use UM/UIM coverage?",
      answer:
        "Rules vary by carrier and state. Ask your insurer in writing; using UM after a not-at-fault crash is often protected — verify your policy.",
    });
  }
  return base;
}

export function buildProgrammaticBlogPost(
  city: CityRecord,
  state: StateRecord,
  template: BlogTemplateId,
): BlogPost {
  const title = templateTitle(template, city);
  const sections = BUILDERS[template](city, state);
  const slug = blogSlugFor(city, template);
  const topicMap: Record<BlogTemplateId, BlogPost["topic"]> = {
    "immediate-steps": "immediate-steps",
    "statute-limitations": "state-local-laws",
    "uninsured-driver": "uninsured-hit-run",
    "truck-accident": "rideshare-truck",
    "rideshare-accident": "rideshare-truck",
    "whiplash-claims": "injuries-medical",
    "settlement-timeline": "claims-adjusters",
    "insurance-denied": "insurance-pitfalls",
    "costly-mistakes": "prevention-safety",
    "hire-lawyer": "claims-adjusters",
  };

  return {
    slug,
    title,
    metaDescription: blogMetaDescription(city, title),
    excerpt: `Educational ${city.city}, ${city.state_abbr} guide — ${state.statute_limitations_years}-year SOL, local hospitals, and insurer tactics. Not legal advice.`,
    city: city.city,
    state: city.state,
    stateAbbr: city.state_abbr,
    stateSlug: city.state_slug,
    topic: topicMap[template],
    status: "published",
    publishedAt: new Date().toISOString(),
    keywords: [
      `${template} ${city.city}`,
      `${city.state_abbr} car accident`,
      `${city.city} injury guide`,
    ],
    sections,
    faq: buildFaq(city, state, template),
  };
}

const TEMPLATE_PREFIXES: { prefix: string; template: BlogTemplateId }[] = [
  { prefix: "what-to-do-after-a-car-accident", template: "immediate-steps" },
  { prefix: "what-to-do-after-car-accident", template: "immediate-steps" },
  { prefix: "statute-of-limitations", template: "statute-limitations" },
  { prefix: "uninsured-driver-accident", template: "uninsured-driver" },
  { prefix: "truck-accident", template: "truck-accident" },
  { prefix: "uber-lyft-accident", template: "rideshare-accident" },
  { prefix: "whiplash-injury-claims", template: "whiplash-claims" },
  { prefix: "car-accident-settlement-timeline", template: "settlement-timeline" },
  { prefix: "insurance-denied-claim", template: "insurance-denied" },
  { prefix: "costly-mistakes-after-crash", template: "costly-mistakes" },
  { prefix: "should-you-hire-a-lawyer", template: "hire-lawyer" },
];

export function parseProgrammaticBlogSlug(
  slug: string,
  cities: CityRecord[],
): { city: CityRecord; template: BlogTemplateId } | null {
  for (const { prefix, template } of TEMPLATE_PREFIXES) {
    if (!slug.startsWith(`${prefix}-`)) continue;
    const rest = slug.slice(prefix.length + 1);
    const city = cities.find(
      (c) =>
        rest === `${c.slug}-${c.state_abbr.toLowerCase()}` ||
        rest === c.slug ||
        rest.startsWith(`${c.slug}-`),
    );
    if (city) return { city, template };
  }
  return null;
}

export function countBlogWords(post: BlogPost): number {
  const text = [
    post.title,
    post.excerpt,
    ...post.sections.flatMap((s) => [s.heading ?? "", ...s.paragraphs, ...(s.list ?? [])]),
    ...post.faq.flatMap((f) => [f.question, f.answer]),
  ].join(" ");
  return text.split(/\s+/).filter(Boolean).length;
}
