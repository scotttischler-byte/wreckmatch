export const ASG_SITE_NAME = "Accident Survival Guide";
export const ASG_DOMAIN = "www.accidentsurvivalguide.com";
export const ASG_BASE_URL = `https://${ASG_DOMAIN}`;
export const WRECKMATCH_URL = "https://www.wreckmatch.com";
export const SURVIVAL_GUIDE_PDF = "/accident-survival-guide-2026-edition.pdf";

export const ASG_HOSTS = [
  "accidentsurvivalguide.com",
  "www.accidentsurvivalguide.com",
];

export function isAsgHostname(host: string): boolean {
  const hostname = host.split(":")[0]?.toLowerCase() ?? "";
  return ASG_HOSTS.includes(hostname);
}

export const US_STATES = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
  { value: "DC", label: "District of Columbia" },
] as const;

export type StateSlug =
  | "texas"
  | "florida"
  | "california"
  | "new-york"
  | "georgia"
  | "illinois"
  | "pennsylvania"
  | "ohio"
  | "north-carolina"
  | "arizona";

export type StateGuide = {
  slug: StateSlug;
  name: string;
  abbr: string;
  headline: string;
  intro: string;
  tips: string[];
  statuteNote: string;
  wreckmatchPath: string;
};

export const STATE_GUIDES: Record<StateSlug, StateGuide> = {
  texas: {
    slug: "texas",
    name: "Texas",
    abbr: "TX",
    headline: "What to do after a car accident in Texas",
    intro:
      "Texas has specific reporting rules and insurance requirements. These steps are general education—not legal advice for your situation.",
    tips: [
      "Call 911 if anyone is injured and move to safety when possible.",
      "Exchange names, insurance, and contact information with other drivers.",
      "File a Crash Report (CR-2) with TxDOT when required for property damage.",
      "Photograph vehicles, road conditions, and visible injuries.",
      "Seek medical care even if pain appears later—document every visit.",
      "Notify your insurer promptly; avoid recorded statements until you understand your rights.",
    ],
    statuteNote:
      "Texas uses a modified comparative fault rule. Speaking with a licensed attorney can help you understand how fault may affect a claim.",
    wreckmatchPath: "https://www.wreckmatch.com",
  },
  florida: {
    slug: "florida",
    name: "Florida",
    abbr: "FL",
    headline: "What to do after a car accident in Florida",
    intro:
      "Florida’s no-fault insurance system can feel confusing after a crash. Use this checklist to stay organized while you recover.",
    tips: [
      "Report the crash to law enforcement when injuries or significant damage occur.",
      "Use PIP coverage for initial medical bills—keep all receipts and records.",
      "Document the scene, witness contacts, and any traffic cameras nearby.",
      "Do not admit fault at the scene; stick to facts when speaking with officers.",
      "Follow up with a doctor if symptoms worsen in the days after the crash.",
      "Before signing insurer releases, consider whether your injuries may exceed PIP limits.",
    ],
    statuteNote:
      "Serious injury thresholds may allow a claim outside PIP. A licensed Florida attorney can explain whether your case may qualify.",
    wreckmatchPath: "https://www.wreckmatch.com",
  },
  california: {
    slug: "california",
    name: "California",
    abbr: "CA",
    headline: "What to do after a car accident in California",
    intro:
      "California crashes must be reported in many situations. These educational steps can help you protect your health and documentation.",
    tips: [
      "Call 911 for injuries and cooperate with responding officers.",
      "Exchange license, insurance, and registration with other parties.",
      "Report to the DMV within 10 days when injury, death, or damage over $1,000 occurs.",
      "Gather photos, witness info, and dashcam footage if available.",
      "Seek medical attention and keep a symptom journal.",
      "Contact your insurer, but consider legal review before giving a recorded statement.",
    ],
    statuteNote:
      "California comparative negligence laws may reduce recovery if you are found partially at fault.",
    wreckmatchPath: "https://www.wreckmatch.com",
  },
  "new-york": {
    slug: "new-york",
    name: "New York",
    abbr: "NY",
    headline: "What to do after a car accident in New York",
    intro:
      "New York’s no-fault system requires timely action. This guide outlines practical steps—not individualized legal advice.",
    tips: [
      "Report the accident to police when required by injury or property damage thresholds.",
      "File a no-fault application with your insurer within required deadlines.",
      "Document medical treatment from the first visit forward.",
      "Preserve evidence: photos, witness statements, and repair estimates.",
      "Avoid social media posts about the crash or your injuries.",
      "Track lost wages and out-of-pocket expenses carefully.",
    ],
    statuteNote:
      "A “serious injury” under New York law may permit a lawsuit beyond no-fault benefits.",
    wreckmatchPath: "https://www.wreckmatch.com",
  },
  georgia: {
    slug: "georgia",
    name: "Georgia",
    abbr: "GA",
    headline: "What to do after a car accident in Georgia",
    intro:
      "Georgia requires prompt reporting in many crashes. Use this checklist to stay calm and organized after a collision.",
    tips: [
      "Move vehicles off the roadway if safe and call 911 for injuries.",
      "Exchange insurance and contact details with all drivers involved.",
      "File SR-13 with Georgia DDS when required.",
      "Photograph damage, skid marks, and road signs.",
      "Get a medical evaluation—even minor soreness can signal injury.",
      "Keep a folder for bills, repair quotes, and insurer letters.",
    ],
    statuteNote:
      "Georgia follows modified comparative negligence; fault allocation can affect compensation.",
    wreckmatchPath: "https://www.wreckmatch.com",
  },
  illinois: {
    slug: "illinois",
    name: "Illinois",
    abbr: "IL",
    headline: "What to do after a car accident in Illinois",
    intro:
      "Illinois reporting rules depend on injury and damage. These steps focus on safety and documentation.",
    tips: [
      "Call 911 when anyone is hurt or the scene is unsafe.",
      "Exchange information and photograph all vehicles and licenses.",
      "File a police report when officers do not respond but damage is significant.",
      "Seek medical care and follow provider instructions.",
      "Notify your insurance company with basic facts only at first.",
      "Save tow bills, rental receipts, and wage-loss documentation.",
    ],
    statuteNote:
      "Illinois uses modified comparative fault with a 50% bar—legal guidance can clarify your options.",
    wreckmatchPath: "https://www.wreckmatch.com",
  },
  pennsylvania: {
    slug: "pennsylvania",
    name: "Pennsylvania",
    abbr: "PA",
    headline: "What to do after a car accident in Pennsylvania",
    intro:
      "Pennsylvania’s choice between limited and full tort affects recovery options. Educational planning starts with good records.",
    tips: [
      "Ensure safety, call 911, and cooperate with police.",
      "Exchange driver’s license, registration, and insurance details.",
      "Document the scene thoroughly with photos and notes.",
      "Report the crash to PennDOT when required.",
      "Seek prompt medical treatment and keep all records.",
      "Review your policy type (limited vs. full tort) before major insurer decisions.",
    ],
    statuteNote:
      "Limited tort policies may restrict pain-and-suffering claims unless exceptions apply.",
    wreckmatchPath: "https://www.wreckmatch.com",
  },
  ohio: {
    slug: "ohio",
    name: "Ohio",
    abbr: "OH",
    headline: "What to do after a car accident in Ohio",
    intro:
      "Ohio drivers should know reporting thresholds and insurance basics. This page offers general education only.",
    tips: [
      "Stop at the scene, assist the injured, and call 911 when needed.",
      "Exchange information with all involved parties.",
      "File BMV Form 3303 when damage exceeds state thresholds and police did not report.",
      "Photograph vehicles, injuries, and weather conditions.",
      "Visit a doctor promptly and attend follow-ups.",
      "Organize insurer correspondence and avoid quick settlement pressure.",
    ],
    statuteNote:
      "Ohio comparative negligence may reduce damages if you share fault.",
    wreckmatchPath: "https://www.wreckmatch.com",
  },
  "north-carolina": {
    slug: "north-carolina",
    name: "North Carolina",
    abbr: "NC",
    headline: "What to do after a car accident in North Carolina",
    intro:
      "North Carolina’s contributory negligence rule makes careful documentation especially important.",
    tips: [
      "Call 911 for injuries and request a police report when officers respond.",
      "Exchange insurance and contact information.",
      "Take photos of damage, traffic controls, and the overall scene.",
      "Seek medical evaluation even for delayed symptoms.",
      "Notify your insurer with factual, concise information.",
      "Avoid discussing fault on social media or with the other party’s insurer alone.",
    ],
    statuteNote:
      "North Carolina is one of few contributory negligence states—legal consultation may be worthwhile.",
    wreckmatchPath: "https://www.wreckmatch.com",
  },
  arizona: {
    slug: "arizona",
    name: "Arizona",
    abbr: "AZ",
    headline: "What to do after a car accident in Arizona",
    intro:
      "Arizona requires accident reports in many cases. These educational steps help you protect your health and records.",
    tips: [
      "Move to safety and call 911 when anyone is injured.",
      "Exchange license, insurance, and registration details.",
      "File Form 39-4001 with MVD when police do not investigate but damage or injury occurred.",
      "Document the scene with photos and witness contacts.",
      "Get medical care and keep treatment records organized.",
      "Track time off work and out-of-pocket expenses.",
    ],
    statuteNote:
      "Arizona pure comparative fault allows recovery even if you are partially at fault, with reductions.",
    wreckmatchPath: "https://www.wreckmatch.com",
  },
};

export const STATE_SLUGS = Object.keys(STATE_GUIDES) as StateSlug[];

export function getStateGuide(slug: string): StateGuide | undefined {
  return STATE_GUIDES[slug as StateSlug];
}

export const ASG_RESOURCES = [
  {
    title: "Accident Survival Guide — 2026 Edition (PDF)",
    description: "Step-by-step checklist for the first 24 hours after a crash.",
    href: SURVIVAL_GUIDE_PDF,
    external: true,
  },
  {
    title: "First 24 Hours Checklist",
    description: "On-page guide to immediate safety, documentation, and medical care.",
    href: "/#first-24-hours",
    external: false,
  },
  {
    title: "Common Mistakes to Avoid",
    description: "Learn what many people regret doing too soon after an accident.",
    href: "/#common-mistakes",
    external: false,
  },
  {
    title: "Your Rights After an Accident",
    description: "General education about insurance, medical care, and legal help.",
    href: "/#your-rights",
    external: false,
  },
  ...STATE_SLUGS.map((slug) => ({
    title: `${STATE_GUIDES[slug].name} accident guide`,
    description: STATE_GUIDES[slug].headline,
    href: `/${slug}`,
    external: false,
  })),
];

export const ASG_BLOG_POSTS = [
  {
    slug: "what-to-do-first-24-hours",
    title: "What To Do in the First 24 Hours After a Car Accident",
    excerpt:
      "A calm, step-by-step checklist for safety, medical care, documentation, and talking with insurers.",
    date: "2026-05-01",
  },
  {
    slug: "mistakes-after-car-crash",
    title: "7 Common Mistakes People Make After a Car Crash",
    excerpt:
      "Why quick settlements, skipped medical care, and social media posts can hurt your recovery.",
    date: "2026-05-08",
  },
  {
    slug: "understanding-your-rights",
    title: "Understanding Your Rights After an Accident (General Education)",
    excerpt:
      "How insurance, medical bills, and attorney referrals typically work—without legal advice.",
    date: "2026-05-15",
  },
];

export const HOMEPAGE_FAQ = [
  {
    question: "Is AccidentSurvivalGuide.com a law firm?",
    answer:
      "No. AccidentSurvivalGuide.com is an educational resource operated by WreckMatch LLC, a legal referral service. We do not provide legal advice.",
  },
  {
    question: "Is the Survival Guide really free?",
    answer:
      "Yes. The PDF guide is free. If you choose, you may also request a free attorney match through WreckMatch with no obligation.",
  },
  {
    question: "Will I get legal advice from this site?",
    answer:
      "No. Information here is for general education only. For advice about your specific situation, speak with a licensed attorney in your state.",
  },
  {
    question: "How does WreckMatch fit in?",
    answer:
      "WreckMatch LLC may connect you with independent licensed attorneys in your area. We are paid a marketing fee by participating law firms—not by you for the referral.",
  },
];

export const GUIDE_BENEFITS = [
  "A printable checklist for the first 24 hours after a crash",
  "Plain-language tips for dealing with insurers (without giving legal advice)",
  "Documentation reminders so you do not lose important evidence",
  "Guidance on when to consider medical care and follow-up visits",
  "An overview of common mistakes—and how to avoid them",
  "Optional connection to licensed attorneys in your state (free, no obligation)",
];

export const FIRST_24_HOURS_STEPS = [
  {
    title: "Ensure safety",
    body: "Move to a safe location if you can. Turn on hazard lights. Call 911 if anyone may be injured.",
  },
  {
    title: "Get medical help",
    body: "Accept EMS care if offered. Even mild pain can worsen—see a doctor as soon as practical.",
  },
  {
    title: "Document the scene",
    body: "Photograph vehicles, plates, road conditions, and injuries. Collect witness names and numbers.",
  },
  {
    title: "Exchange information",
    body: "Share insurance and contact details. Stick to facts; avoid debating fault at the scene.",
  },
  {
    title: "File reports if required",
    body: "Cooperate with police. Your state may require an additional report—check local rules.",
  },
  {
    title: "Notify your insurer",
    body: "Report the crash promptly. You may wish to consult an attorney before recorded statements.",
  },
  {
    title: "Organize records",
    body: "Keep bills, repair estimates, missed work notes, and all insurer letters in one folder.",
  },
  {
    title: "Rest and follow up",
    body: "Recovery comes first. Attend follow-up appointments and track how you feel each day.",
  },
];

export const COMMON_MISTAKES = [
  {
    title: "Skipping medical care",
    body: "Adrenaline can mask pain. Delayed treatment may hurt both your health and your documentation.",
  },
  {
    title: "Giving a recorded statement too soon",
    body: "Insurers may ask for recordings early. You are generally not required to provide one immediately.",
  },
  {
    title: "Accepting a quick settlement",
    body: "Early offers may not account for ongoing treatment. Take time to understand your expenses first.",
  },
  {
    title: "Posting on social media",
    body: "Photos and comments about the crash or your activities can be misinterpreted later.",
  },
  {
    title: "Throwing away evidence",
    body: "Keep damaged property, medical bills, and repair invoices until your matter is resolved.",
  },
  {
    title: "Going it alone when overwhelmed",
    body: "It is okay to ask for help—from medical providers, trusted friends, or a licensed attorney.",
  },
];

export const TESTIMONIALS = [
  {
    quote:
      "The checklist helped me stay calm. I knew what to photograph and what to save for insurance.",
    attribution: "Maria R., Texas",
  },
  {
    quote:
      "I did not realize how many deadlines there were. The guide gave me a simple order of operations.",
    attribution: "James T., Florida",
  },
  {
    quote:
      "Educational and straightforward—no pressure. I downloaded the PDF and read it the same night.",
    attribution: "Anonymous, California",
  },
];
