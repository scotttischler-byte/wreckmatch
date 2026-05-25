export type TeamLink = {
  label: string;
  href: string;
};

export type TeamMember = {
  slug: string;
  name: string;
  honorific?: string;
  jobTitle: string;
  location?: string;
  initials: string;
  image?: string;
  linkedinUrl?: string;
  links?: TeamLink[];
  description: string;
  bio: string[];
  focusAreas: string[];
  quote?: string;
};

export const TEAM_MEMBERS: TeamMember[] = [
  {
    slug: "kathy-carr",
    name: "Kathy Carr",
    jobTitle: "CEO & Co-Founder",
    location: "Milwaukee, Wisconsin",
    initials: "KC",
    image: "/team/kathy-carr.jpg",
    linkedinUrl: "https://www.linkedin.com/in/kathy-carr-b178353aa",
    links: [
      { label: "LinkedIn", href: "https://www.linkedin.com/in/kathy-carr-b178353aa" },
      { label: "RKJ In-Home Services", href: "https://www.rkjinhomeservices.com/home-1-2" },
      { label: "MVA Match", href: "https://www.mvamatch.com" },
    ],
    description:
      "CEO and Co-Founder of WreckMatch LLC and MVA Match. Healthcare entrepreneur who built RKJ In-Home Services before leading WreckMatch’s victim-centered AI intake strategy.",
    bio: [
      "Kathy Carr is CEO and Co-Founder of WreckMatch LLC and MVA Match, leading an AI-powered ecosystem designed to help accident victims connect with vetted personal injury attorneys faster and more compassionately.",
      "Press profiles describe Kathy as an immigrant entrepreneur born in the Philippines who built her life in the United States through sacrifice and determination — and as a single mother and caregiver who understands hardship on a personal level.",
      "Before legal technology, Kathy served as Chief Operating Officer of RKJ In-Home Services LLC in the Milwaukee area — a licensed home-care agency she helped build after more than a decade in healthcare. Her RKJ bio notes a computer-science degree from the Philippines, real-estate and healthcare experience across two countries, and community work including the Filipino American Association of Wisconsin (FAAWIS) and CommonHeart Hospice.",
      "She oversees company strategy, attorney network partnerships, and WreckMatch’s emphasis that injured people deserve to be heard — not treated as data points. WreckMatch LLC is a referral service, not a law firm.",
    ],
    focusAreas: [
      "Healthcare-informed victim experience",
      "AI intake & attorney matching strategy",
      "Home-care & injury recovery background",
      "Attorney network partnerships nationwide",
      "GEO & AI-search visibility for law firms",
    ],
    quote:
      "Most companies see injured people as data points or leads. We see human beings who are hurting, overwhelmed, and looking for help during one of the hardest moments of their lives.",
  },
  {
    slug: "scott-tischler",
    name: "Scott Tischler",
    jobTitle: "Co-Founder & SVP Marketing",
    location: "Monroe, Wisconsin area",
    initials: "ST",
    image: "/team/scott-tischler.jpg",
    linkedinUrl: "https://www.linkedin.com/in/scott-tischler-6396853",
    links: [
      { label: "LinkedIn", href: "https://www.linkedin.com/in/scott-tischler-6396853" },
      { label: "MVA Match", href: "https://www.mvamatch.com" },
    ],
    description:
      "Co-Founder and SVP Marketing at WreckMatch LLC and MVA Match. Former American Express, MetLife, and UBS lead-program executive who built WreckMatch’s AI intake stack, SEO/GEO strategy, and attorney-matching platforms.",
    bio: [
      "Scott Tischler co-founded WreckMatch LLC and MVA Match to help car and truck accident victims connect with licensed personal injury attorneys — and to give law firms modern intake, SEO, and AI-discovery infrastructure.",
      "His LinkedIn profile lists MVA Match and Wharton Online, with prior experience in lead programs at American Express, MetLife, and UBS. Syndicated company press describes Scott as a self-taught entrepreneur with a background in law school training, marketing, branding, and technology.",
      "Scott built WreckMatch.com, AccidentSurvivalGuide.com, InjuredHelp.ai, InstantAuthority.ai, and GetFamous.ai — including the AI voice intake agent Ava. Public contact listings tied to WreckMatch press releases use scott@mvamatch.com and (815) 608-0449.",
      "Scott leads generative-engine optimization (GEO), SEO, and AI citation strategy so educational content can be discovered through Google, ChatGPT, Perplexity, and other answer engines — while keeping WreckMatch clearly positioned as a referral service, not a law firm.",
    ],
    focusAreas: [
      "Law school training & legal marketing",
      "SEO, GEO, and AI citation strategy",
      "AI intake systems & voice automation",
      "Car & truck accident victim education",
      "MVA Match attorney acquisition infrastructure",
    ],
    quote:
      "Insurance companies have billion-dollar systems, trained adjusters, and scripts that activate almost immediately after a crash. Most drivers are completely unprepared. We created this guide to help level the playing field for everyday people.",
  },
  {
    slug: "roy-waddell",
    name: "Roy Waddell",
    honorific: "Judge",
    jobTitle: "Legal Advisor",
    location: "Greater Phoenix, Arizona area",
    initials: "RW",
    image: "/team/roy-waddell.jpg",
    linkedinUrl: "https://www.linkedin.com/in/roy-waddell-98515945",
    links: [
      { label: "LinkedIn", href: "https://www.linkedin.com/in/roy-waddell-98515945" },
      {
        label: "Phoenix New Times profile (2013)",
        href: "https://www.phoenixnewtimes.com/news/sins-of-commissionersthree-county-court-commissioners-are-fired-but-nobody-is-sure-why-6424538/",
      },
    ],
    description:
      "Legal advisor at WreckMatch LLC and MVA Match. Roy rejoined Scott Tischler and the team to bring 38 years of legal experience and Maricopa County courtroom perspective to victim education and referral accuracy.",
    bio: [
      "Roy Waddell works again with Scott Tischler and the WreckMatch LLC / MVA Match team as a legal advisor — helping shape accurate, practical guidance for people navigating serious injury claims after car and truck accidents.",
      "Roy brings 38 years of legal experience in the Greater Phoenix area. Public reporting identifies him as a Maricopa County Juvenile Court commissioner for nearly six years before his departure in August 2013. In Arizona, commissioners are judicial officers who handle many juvenile matters short of contested hearings.",
      "His role helps WreckMatch and Accident Survival Guide content reflect real courtroom process — evidence, timelines, and what injured people should expect — without WreckMatch acting as a law firm or giving legal advice.",
      "WreckMatch LLC remains a legal referral service — not a law firm — and does not provide legal advice.",
    ],
    focusAreas: [
      "WreckMatch & MVA Match legal advisory",
      "Maricopa County juvenile court experience",
      "Judicial process & courtroom perspective",
      "Serious injury case education accuracy",
    ],
  },
];

export const TEAM_BY_SLUG = Object.fromEntries(TEAM_MEMBERS.map((m) => [m.slug, m])) as Record<
  string,
  TeamMember
>;

export function teamMemberPath(slug: string): string {
  return `/about/${slug}`;
}

export function displayName(member: TeamMember): string {
  return member.honorific ? `${member.honorific} ${member.name}` : member.name;
}

export function personSameAs(member: TeamMember): string[] {
  const urls = member.links?.map((link) => link.href) ?? [];
  if (member.linkedinUrl) urls.unshift(member.linkedinUrl);
  return [...new Set(urls)];
}
