/** Syndicated press / media outlet names for the homepage marquee. */
export const ASG_PRESS_OUTLETS = [
  "BrandFeatured",
  "OpenPR",
  "Boston Herald",
  "Star Tribune",
  "StreetInsider",
  "WRAL",
  "NewsOK",
  "Townhall",
  "Business Insurance",
  "Press-Telegram",
  "Pittsburgh Post-Gazette",
  "IBTimes",
  "Wedbush",
  "FinancialContent",
  "MarketMinute",
  "KOTA Radio",
  "Austin NewsNet",
  "San Antonio NewsNet",
  "Waco NewsNet",
  "Los Angeles NewsNet",
  "Sacramento NewsNet",
  "Tampa NewsNet",
  "Orlando NewsNet",
  "Nashville NewsNet",
  "Detroit NewsNet",
  "Louisville NewsNet",
  "Portland NewsNet",
  "Salt Lake City NewsNet",
  "Sioux Falls NewsNet",
  "Norfolk NewsNet",
  "Myrtle Beach NewsNet",
  "Monterey NewsNet",
  "Quincy NewsNet",
  "Santa Barbara NewsNet",
  "Columbus NewsNet",
  "Boise NewsNet",
  "Hawaii NewsNet",
  "Santa Maria Times",
  "Lodi News",
  "Union Democrat",
  "Sun Chronicle",
  "KTVN",
  "KVOA",
  "KTTC",
  "KTIV",
  "KWWL",
  "KBJR",
  "WPTA",
  "WREX",
  "WAOW",
  "WGEM",
  "WKOW",
  "WQOW",
  "WSIL",
  "WVVA",
  "WXOW",
  "WBNG",
  "Texas News Headlines",
  "California News Reporter",
  "Florida News Reporter",
  "Georgia News Desk",
  "Illinois News Desk",
  "New York Chronicle",
  "North Carolina Headlines",
  "Tennessee Headlines",
  "Colorado News Desk",
  "Wisconsin Chronicle",
  "Rhode Island Chronicle",
  "The Global Tribune",
  "The Western Tribune",
  "The Atlantic Report",
  "The Morning Lead",
  "The Great News",
  "Thrive Insider",
  "Recent Legal News",
  "SourceFed",
  "Small Biz Sense",
  "RushPR News",
  "XPR Media",
] as const;

const LOGO_STYLES = [
  "border-asg-teal/40 bg-asg-teal text-white",
  "border-asg-sage/40 bg-asg-sage text-white",
  "border-white/25 bg-white text-asg-navy",
  "border-asg-sky/50 bg-asg-sky text-asg-navy",
  "border-amber-200/50 bg-amber-100 text-asg-navy",
  "border-emerald-200/50 bg-emerald-100 text-asg-navy",
] as const;

export function pressOutletMark(name: string): string {
  const compactName = name.replace(/[^A-Za-z0-9 ]/g, " ").trim();
  const words = compactName.split(/\s+/).filter(Boolean);
  const stationMatch = compactName.match(/^[A-Z]{3,5}$/);

  if (stationMatch) {
    return compactName.slice(0, 4);
  }

  if (words.length === 1) {
    const capitals = words[0].replace(/[^A-Z]/g, "");
    return (capitals.length >= 2 ? capitals : words[0]).slice(0, 3).toUpperCase();
  }

  return words
    .slice(0, 3)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export function pressOutletLogoStyle(index: number): string {
  return LOGO_STYLES[index % LOGO_STYLES.length];
}
