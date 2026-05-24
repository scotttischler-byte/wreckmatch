import type { StateRecord } from "./types";

export type Citation = {
  label: string;
  url: string;
  retrieved: string;
};

/** State-level legal and crash citations — sourced once, reused on every city page. */
export const STATE_CITATIONS: Record<string, Citation[]> = {
  texas: [
    { label: "TxDOT crash statistics", url: "https://www.txdot.gov/data-maps/crash-reports-records/crash-reports.html", retrieved: "2026-05" },
    { label: "Tex. Civ. Prac. & Rem. Code § 16.003 (SOL)", url: "https://statutes.capitol.texas.gov/Docs/CP/htm/CP.16.htm", retrieved: "2026-05" },
    { label: "Texas minimum liability limits", url: "https://www.tdi.texas.gov/tips/minimum-coverage-amounts.html", retrieved: "2026-05" },
    { label: "NHTSA FARS Texas", url: "https://cdan.nhtsa.gov/states", retrieved: "2026-05" },
  ],
  california: [
    { label: "Caltrans SWITRS crash data", url: "https://dot.ca.gov/programs/traffic-operations/census/swtrs", retrieved: "2026-05" },
    { label: "Cal. Civ. Proc. Code § 335.1", url: "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=335.1.&lawCode=CCP", retrieved: "2026-05" },
    { label: "California minimum insurance", url: "https://www.insurance.ca.gov/01-consumers/105-type/95-guides/03-res/car.cfm", retrieved: "2026-05" },
  ],
  florida: [
    { label: "FLHSMV crash reports", url: "https://www.flhsmv.gov/traffic-crash-reports/", retrieved: "2026-05" },
    { label: "Fla. Stat. § 95.11", url: "http://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0000-0099/0095/Sections/0095.11.html", retrieved: "2026-05" },
    { label: "Florida PIP / insurance", url: "https://www.floir.com/sections/pandc/auto/Automobile-Insurance.aspx", retrieved: "2026-05" },
  ],
  "new-york": [
    { label: "NY DMV crash reports", url: "https://dmv.ny.gov/records/get-a-copy-of-a-report-of-motor-vehicle-accident", retrieved: "2026-05" },
    { label: "N.Y. CPLR § 214", url: "https://www.nysenate.gov/legislation/laws/CPLR/214", retrieved: "2026-05" },
    { label: "NY DFS auto insurance", url: "https://www.dfs.ny.gov/consumers/auto_insurance", retrieved: "2026-05" },
  ],
  illinois: [
    { label: "IDOT crash data", url: "https://idot.illinois.gov/transportation-system/local-transportation-partners/crash-reports/index", retrieved: "2026-05" },
    { label: "735 ILCS 5/13-202 (SOL)", url: "https://www.ilga.gov/legislation/ilcs/ilcs4.asp?DocName=073500050HArt%2E+XIII&DocNum=13&ActID=2017&ChapterID=56&SeqStart=120000000&SeqEnd=2400000", retrieved: "2026-05" },
    { label: "Illinois minimum insurance", url: "https://www.illinois.gov/sites/insurance/ConsumerInformation/AutoInsurance/Pages/default.aspx", retrieved: "2026-05" },
  ],
  georgia: [
    { label: "Georgia DOT crash data", url: "https://www.dot.ga.gov/DS/GDOTCrash", retrieved: "2026-05" },
    { label: "O.C.G.A. § 9-3-33", url: "https://law.justia.com/codes/georgia/title-9/chapter-3/section-9-3-33/", retrieved: "2026-05" },
    { label: "Georgia minimum insurance", url: "https://oci.georgia.gov/insurance-resources/auto-insurance", retrieved: "2026-05" },
  ],
  pennsylvania: [
    { label: "PennDOT crash facts", url: "https://www.penndot.pa.gov/TravelInPA/Safety/Pages/Crash-Facts-and-Statistics.aspx", retrieved: "2026-05" },
    { label: "42 Pa.C.S. § 5524", url: "https://www.legis.state.pa.us/cfdocs/legis/LI/consCheck.cfm?txtType=HTM&ttl=42&div=0&chpt=55&sctn=24&subsctn=0", retrieved: "2026-05" },
    { label: "PA insurance department", url: "https://www.insurance.pa.gov/Consumers/Auto/Pages/default.aspx", retrieved: "2026-05" },
  ],
  ohio: [
    { label: "Ohio crash statistics", url: "https://www.publicsafety.ohio.gov/links/2023CrashStatistics.pdf", retrieved: "2026-05" },
    { label: "Ohio Rev. Code § 2305.10", url: "https://codes.ohio.gov/ohio-revised-code/section-2305.10", retrieved: "2026-05" },
    { label: "Ohio BMV insurance", url: "https://www.bmv.ohio.gov/dl-insurance-faq.aspx", retrieved: "2026-05" },
  ],
  "north-carolina": [
    { label: "NCDOT crash data", url: "https://www.ncdot.gov/initiatives-policies/safety/crash-data/Pages/default.aspx", retrieved: "2026-05" },
    { label: "N.C. Gen. Stat. § 1-52", url: "https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/BySection/Chapter_1/GS_1-52.html", retrieved: "2026-05" },
    { label: "NC DOI auto insurance", url: "https://www.ncdoi.gov/consumers/automobile-insurance", retrieved: "2026-05" },
  ],
  arizona: [
    { label: "ADOT crash facts", url: "https://azdot.gov/motor-vehicles/driver-services/driver-improvement/crash-facts", retrieved: "2026-05" },
    { label: "A.R.S. § 12-542", url: "https://www.azleg.gov/viewdocument/?docName=https://www.azleg.gov/ars/12/00542.htm", retrieved: "2026-05" },
    { label: "Arizona minimum insurance", url: "https://insurance.az.gov/consumers/auto-insurance", retrieved: "2026-05" },
  ],
  washington: [
    { label: "WSDOT collision data", url: "https://wsdot.wa.gov/about/transportation-data/traffic-data/collision-data", retrieved: "2026-05" },
    { label: "RCW 4.16.080", url: "https://app.leg.wa.gov/rcw/default.aspx?cite=4.16.080", retrieved: "2026-05" },
    { label: "WA OIC auto insurance", url: "https://www.insurance.wa.gov/auto-insurance", retrieved: "2026-05" },
  ],
  colorado: [
    { label: "CDOT crash data", url: "https://www.codot.gov/safety/traffic-safety/crash-data", retrieved: "2026-05" },
    { label: "C.R.S. § 13-80-101", url: "https://leg.colorado.gov/sites/default/files/images/olls/crs2016-title-13.pdf", retrieved: "2026-05" },
    { label: "Colorado DORA insurance", url: "https://doi.colorado.gov/auto-insurance", retrieved: "2026-05" },
  ],
  tennessee: [
    { label: "TDOT crash statistics", url: "https://www.tn.gov/tdot/statistics/crash-data.html", retrieved: "2026-05" },
    { label: "Tenn. Code § 28-3-104", url: "https://law.justia.com/codes/tennessee/title-28/chapter-3/section-28-3-104/", retrieved: "2026-05" },
    { label: "TN Dept. of Commerce insurance", url: "https://www.tn.gov/commerce/insurance/consumer-resources/auto-insurance.html", retrieved: "2026-05" },
  ],
  michigan: [
    { label: "Michigan crash facts", url: "https://www.michigan.gov/msp/divisions/cjis/crash-statistics", retrieved: "2026-05" },
    { label: "MCL 600.5805", url: "https://www.legislature.mi.gov/(S(leg))/mileg.aspx?page=getObject&objectName=mcl-600-5805", retrieved: "2026-05" },
    { label: "Michigan no-fault / insurance", url: "https://www.michigan.gov/difs/consumer-services/auto-insurance", retrieved: "2026-05" },
  ],
  "new-jersey": [
    { label: "NJ crash statistics", url: "https://www.nj.gov/oag/hts/crash-statistics.html", retrieved: "2026-05" },
    { label: "N.J.S.A. 2A:14-2", url: "https://lis.njleg.state.nj.us/nxt/gateway.dll?f=templates&fn=default.htm&vid=Publish:10.1048/Enu", retrieved: "2026-05" },
    { label: "NJ DOBI auto insurance", url: "https://www.nj.gov/dobi/division_consumers/insurance/autoins.htm", retrieved: "2026-05" },
  ],
};

const DEFAULT_CITATIONS = (state: StateRecord): Citation[] => [
  { label: `${state.name} DOT / transportation`, url: state.dot_url, retrieved: "2026-05" },
  { label: `${state.bar_association}`, url: `https://www.google.com/search?q=${encodeURIComponent(state.bar_association + " lawyer referral")}`, retrieved: "2026-05" },
  { label: "NHTSA state crash data", url: "https://cdan.nhtsa.gov/states", retrieved: "2026-05" },
];

export function getCitationsForState(stateSlug: string, state: StateRecord): Citation[] {
  return STATE_CITATIONS[stateSlug] ?? DEFAULT_CITATIONS(state);
}

export function formatCitationFootnote(citations: Citation[], index: number): string {
  const c = citations[index];
  if (!c) return "";
  return `[${index + 1}] [${c.label}](${c.url}) (${c.retrieved})`;
}
