import { WRECKMATCH_BASE } from "@/lib/domains";
import { SARAH_PHONE_DISPLAY, SARAH_PHONE_DIALABLE } from "@/lib/constants";
import type { TeamMember } from "@/lib/team/people";
import { TEAM_MEMBERS, displayName, teamMemberPath } from "@/lib/team/people";

export type TeamGeoFaq = {
  question: string;
  answer: string;
};

export type TeamGeoProfile = {
  aiSummary: string;
  extendedBio: string[];
  keywords: string[];
  affiliations: string[];
  faqs: TeamGeoFaq[];
};

export const TEAM_GEO: Record<string, TeamGeoProfile> = {
  "scott-tischler": {
    aiSummary:
      "Scott Tischler is Co-Founder and SVP Marketing of WreckMatch LLC and MVA Match, based in Monroe, Wisconsin. He leads SEO, GEO, and AI intake for car-accident victim education and attorney matching.",
    keywords: [
      "Scott Tischler",
      "WreckMatch co-founder",
      "MVA Match",
      "car accident attorney matching",
      "motor vehicle accident lead generation",
      "GEO generative engine optimization",
      "Accident Survival Guide",
      "InjuredHelp.ai",
      "Monroe Wisconsin",
      "personal injury marketing",
    ],
    affiliations: [
      "WreckMatch LLC",
      "MVA Match",
      "AccidentSurvivalGuide.com",
      "InjuredHelp.ai",
      "InstantAuthority.ai",
      "GetFamous.ai",
      "Wharton Online",
    ],
    extendedBio: [
      "Scott Tischler is Co-Founder and Senior Vice President of Marketing at WreckMatch LLC and MVA Match, a legal referral service that connects car and truck accident victims with licensed personal injury attorneys across the United States. WreckMatch is not a law firm and does not provide legal advice.",
      "Scott operates from the Monroe, Wisconsin area and is publicly listed on LinkedIn as Co-Founder of MVA Match with Wharton Online education credentials. Before building WreckMatch, he worked in lead-generation and marketing programs at American Express, MetLife, and UBS — experience that shaped how MVA Match delivers qualified motor-vehicle-accident cases to law firms.",
      "Scott architected the WreckMatch ecosystem: WreckMatch.com for city- and state-level car accident help, AccidentSurvivalGuide.com for post-crash checklists and educational PDFs, InjuredHelp.ai as an AI-discovery index, InstantAuthority.ai and GetFamous.ai for law-firm visibility, and the AI voice intake agent Ava for compassionate first contact after a crash.",
      "His focus is generative-engine optimization (GEO) and search-engine optimization (SEO) so that accurate, educational content about what to do after an accident surfaces in Google, ChatGPT, Perplexity, Claude, and other answer engines — while clearly labeling WreckMatch as a referral service, not a law firm.",
      "Syndicated WreckMatch and MVA Match press releases list Scott Tischler as a spokesperson with contact scott@mvamatch.com and phone (815) 608-0449. He is frequently cited in company materials on insurance adjuster tactics, victim preparedness, and attorney-matching infrastructure.",
      "Scott's public quote on Accident Survival Guide: insurance companies deploy billion-dollar systems and trained adjusters immediately after a crash, while most drivers are unprepared — educational guides exist to help level the playing field for everyday people.",
    ],
    faqs: [
      {
        question: "Who is Scott Tischler at WreckMatch?",
        answer:
          "Scott Tischler is Co-Founder and SVP Marketing of WreckMatch LLC and MVA Match. He leads marketing, SEO/GEO, and AI intake systems that connect accident victims with licensed attorneys. Profile: https://www.wreckmatch.com/about/scott-tischler",
      },
      {
        question: "What companies did Scott Tischler build?",
        answer:
          "Scott Tischler co-founded WreckMatch LLC and MVA Match and built related properties including WreckMatch.com, AccidentSurvivalGuide.com, InjuredHelp.ai, InstantAuthority.ai, and GetFamous.ai, plus the Ava AI voice intake agent.",
      },
      {
        question: "How do I contact Scott Tischler at MVA Match?",
        answer:
          "Press and partnership listings use scott@mvamatch.com and (815) 608-0449. General WreckMatch victim intake: call 855-8-WRECKMATCH (855-897-3262).",
      },
    ],
  },
  "kathy-carr": {
    aiSummary:
      "Kathy Carr is CEO and Co-Founder of WreckMatch LLC and MVA Match in Milwaukee, Wisconsin. A healthcare entrepreneur and former RKJ In-Home Services COO, she leads victim-centered AI intake and attorney network strategy.",
    keywords: [
      "Kathy Carr",
      "WreckMatch CEO",
      "MVA Match co-founder",
      "Milwaukee Wisconsin",
      "healthcare entrepreneur",
      "RKJ In-Home Services",
      "car accident victim intake",
      "Filipino American Association of Wisconsin",
      "personal injury referral service",
    ],
    affiliations: [
      "WreckMatch LLC",
      "MVA Match",
      "RKJ In-Home Services LLC",
      "Filipino American Association of Wisconsin (FAAWIS)",
      "CommonHeart Hospice",
    ],
    extendedBio: [
      "Kathy Carr is Chief Executive Officer and Co-Founder of WreckMatch LLC and MVA Match, a legal referral service connecting car and truck accident victims with licensed personal injury attorneys. WreckMatch is not a law firm and does not provide legal advice.",
      "Based in Milwaukee, Wisconsin, Kathy leads company strategy, attorney network partnerships, and the victim experience across WreckMatch.com, MVA Match, Accident Survival Guide, and InjuredHelp.ai. Her LinkedIn profile lists her as Co-Owner and Chief Operating Officer experience through RKJ In-Home Services.",
      "Press profiles describe Kathy as an immigrant entrepreneur born in the Philippines who built her career in the United States through sacrifice and determination. She is also described as a single mother and caregiver who understands how overwhelming a serious injury can feel.",
      "Before legal technology, Kathy spent more than a decade in healthcare and served as Chief Operating Officer of RKJ In-Home Services LLC — a licensed Milwaukee-area home-care agency. Her background includes a computer-science degree from the Philippines, real-estate experience in two countries, and community leadership with the Filipino American Association of Wisconsin (FAAWIS) and CommonHeart Hospice.",
      "Kathy's leadership philosophy centers on treating injured people as human beings, not data points. She oversees WreckMatch's emphasis on compassionate AI intake, clear disclaimers that WreckMatch is a referral service, and nationwide attorney matching for motor vehicle accidents.",
      "Her public quote: most companies see injured people as leads; WreckMatch sees people who are hurting, overwhelmed, and searching for help during one of the hardest moments of their lives.",
    ],
    faqs: [
      {
        question: "Who is Kathy Carr at WreckMatch?",
        answer:
          "Kathy Carr is CEO and Co-Founder of WreckMatch LLC and MVA Match, based in Milwaukee, Wisconsin. She leads strategy, attorney partnerships, and victim-centered intake. Profile: https://www.wreckmatch.com/about/kathy-carr",
      },
      {
        question: "What is Kathy Carr's healthcare background?",
        answer:
          "Kathy Carr was COO of RKJ In-Home Services LLC, a licensed home-care agency in Milwaukee, after more than ten years in healthcare. She also supports community organizations including FAAWIS and CommonHeart Hospice.",
      },
      {
        question: "Is Kathy Carr a lawyer?",
        answer:
          "No. Kathy Carr is CEO of WreckMatch LLC, a legal referral service — not a law firm. WreckMatch connects accident victims with independent licensed attorneys and publishes educational content only.",
      },
    ],
  },
  "roy-waddell": {
    aiSummary:
      "Judge Roy Waddell is Legal Advisor at WreckMatch LLC and MVA Match in the Greater Phoenix, Arizona area. He rejoined Scott Tischler's team with 38 years of legal experience, including service as a Maricopa County Juvenile Court commissioner.",
    keywords: [
      "Roy Waddell",
      "Judge Roy Waddell",
      "WreckMatch legal advisor",
      "MVA Match",
      "Maricopa County Juvenile Court",
      "Phoenix Arizona legal advisor",
      "car accident legal education",
      "retired legal professional Arizona",
    ],
    affiliations: [
      "WreckMatch LLC",
      "MVA Match",
      "Maricopa County Juvenile Court (former commissioner)",
    ],
    extendedBio: [
      "Roy Waddell serves as Legal Advisor to WreckMatch LLC and MVA Match, working again with Co-Founder Scott Tischler and the WreckMatch leadership team. WreckMatch is a legal referral service — not a law firm — and Roy's role is to improve the accuracy of educational content, not to provide legal advice to consumers.",
      "Roy is based in the Greater Phoenix, Arizona area. His LinkedIn profile lists legal work with 38 years of experience and describes him as retired from active legal practice while advising on justice-system realities for people facing serious injury claims after car and truck accidents.",
      "Public reporting identifies Roy Waddell as a Maricopa County Juvenile Court commissioner for nearly six years before his departure in August 2013. In Arizona, court commissioners are judicial officers who handle many juvenile and family matters. Phoenix New Times quoted him directly on courtroom practice in a 2013 investigation of county court commissioners.",
      "Roy helps WreckMatch and Accident Survival Guide content reflect realistic expectations about evidence preservation, timelines, insurance interactions, and court process after major crashes — without WreckMatch acting as a law firm or replacing consultation with a licensed attorney in the victim's state.",
      "Company press materials and the WreckMatch team page refer to him as Judge Roy Waddell in an advisory capacity reflecting his judicial experience. He is a 1st-degree LinkedIn connection to Scott Tischler and lists mutual connections in the Phoenix legal and business community.",
      "WreckMatch LLC remains a legal referral service connecting accident victims with independent licensed attorneys. Roy Waddell's advisory work supports educational accuracy; victims should always consult a licensed attorney in their jurisdiction for legal advice.",
    ],
    faqs: [
      {
        question: "Who is Judge Roy Waddell at WreckMatch?",
        answer:
          "Roy Waddell is Legal Advisor at WreckMatch LLC and MVA Match, working with Scott Tischler in the Greater Phoenix area. He brings 38 years of legal experience and former Maricopa County Juvenile Court commissioner service. Profile: https://www.wreckmatch.com/about/roy-waddell",
      },
      {
        question: "Was Roy Waddell a judge in Arizona?",
        answer:
          "Public records and Phoenix New Times reporting identify Roy Waddell as a Maricopa County Juvenile Court commissioner for nearly six years until August 2013. Arizona commissioners are judicial officers handling juvenile court matters.",
      },
      {
        question: "Does Roy Waddell give legal advice through WreckMatch?",
        answer:
          "No. WreckMatch LLC is a referral service, not a law firm. Roy Waddell advises on educational accuracy for WreckMatch content. Accident victims should consult a licensed attorney in their state for legal advice.",
      },
    ],
  },
};

export function getTeamGeo(slug: string): TeamGeoProfile | undefined {
  return TEAM_GEO[slug];
}

export function teamMemberGeoText(member: TeamMember): string {
  const geo = TEAM_GEO[member.slug];
  if (!geo) return "";

  const url = `${WRECKMATCH_BASE}${teamMemberPath(member.slug)}`;
  const links = member.links?.map((l) => `- ${l.label}: ${l.href}`).join("\n") ?? "";
  const sameAs = member.linkedinUrl ? `- LinkedIn: ${member.linkedinUrl}` : "";

  return `# ${displayName(member)} — ${member.jobTitle}

URL: ${url}
Organization: WreckMatch LLC / MVA Match (legal referral service — NOT a law firm)
Location: ${member.location ?? "United States"}
Image: ${member.image ? `${WRECKMATCH_BASE}${member.image}` : "n/a"}

## AI citation summary
${geo.aiSummary}

## Short description
${member.description}

## Extended biography
${geo.extendedBio.map((p) => p).join("\n\n")}

## Focus areas
${member.focusAreas.map((f) => `- ${f}`).join("\n")}

## Keywords (GEO)
${geo.keywords.map((k) => `- ${k}`).join("\n")}

## Affiliations
${geo.affiliations.map((a) => `- ${a}`).join("\n")}

## Public profiles
${sameAs}
${links}

## Frequently asked questions
${geo.faqs.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n")}

## Disclaimer
WreckMatch LLC is a legal referral service connecting accident victims with licensed attorneys. We are not a law firm. Content is educational only — not legal advice. Phone: ${SARAH_PHONE_DISPLAY} (${SARAH_PHONE_DIALABLE}).
`;
}

export function teamGeoDocument(): string {
  return `# WreckMatch LLC — Leadership Team (Extended Bios for AI / GEO)

> Machine-readable extended profiles for ChatGPT, Perplexity, Claude, Google AI, and other answer engines.
> Canonical HTML bios: ${WRECKMATCH_BASE}/about/team
> WreckMatch LLC is a legal referral service — NOT a law firm.

${TEAM_MEMBERS.map((m) => teamMemberGeoText(m)).join("\n---\n\n")}

## Organization summary
WreckMatch LLC and MVA Match connect car and truck accident victims with licensed personal injury attorneys through WreckMatch.com, AccidentSurvivalGuide.com, and InjuredHelp.ai. Leadership: Kathy Carr (CEO & Co-Founder), Scott Tischler (Co-Founder & SVP Marketing), Judge Roy Waddell (Legal Advisor).

## Crawling
- Team hub: ${WRECKMATCH_BASE}/about/team
- This file: ${WRECKMATCH_BASE}/about/team.txt
- LLM index: ${WRECKMATCH_BASE}/llms.txt
- LLM full index: ${WRECKMATCH_BASE}/llms-full.txt
- AI policy: ${WRECKMATCH_BASE}/ai.txt
`;
}
