export type GeoAuditInput = {
  robotsAllowsAiCrawlers?: boolean;
  llmsTxt?: boolean;
  aiTxt?: boolean;
  indexNowKeyDeployed?: boolean;
  articleJsonLd?: boolean;
  faqPageJsonLd?: boolean;
  organizationJsonLd?: boolean;
  semanticArticleDom?: boolean;
  faqDetailsOrHeadings?: boolean;
  hasComparisonTable?: boolean;
  wordCount?: number;
  authorByline?: boolean;
  contentDateRecent?: boolean;
  showsLastUpdated?: boolean;
  hubInternalLinks?: boolean;
};

export type GeoScoreResult = {
  score: number;
  grade: "A" | "B" | "C" | "D" | "F";
  breakdown: { label: string; points: number; max: number }[];
  gaps: string[];
};

const WEIGHTS: { label: string; max: number; test: (i: GeoAuditInput) => boolean }[] = [
  { label: "AI crawlers allowed", max: 12, test: (i) => !!i.robotsAllowsAiCrawlers },
  { label: "llms.txt", max: 8, test: (i) => !!i.llmsTxt },
  { label: "ai.txt", max: 5, test: (i) => !!i.aiTxt },
  { label: "IndexNow key", max: 10, test: (i) => !!i.indexNowKeyDeployed },
  { label: "Article JSON-LD", max: 12, test: (i) => !!i.articleJsonLd },
  { label: "FAQPage JSON-LD", max: 10, test: (i) => !!i.faqPageJsonLd },
  { label: "Organization JSON-LD", max: 6, test: (i) => !!i.organizationJsonLd },
  { label: "Semantic article DOM", max: 10, test: (i) => !!i.semanticArticleDom },
  { label: "FAQ UI block", max: 8, test: (i) => !!i.faqDetailsOrHeadings },
  { label: "Data table", max: 7, test: (i) => !!i.hasComparisonTable },
  { label: "Author byline", max: 6, test: (i) => !!i.authorByline },
  { label: "Recent dates", max: 6, test: (i) => !!i.contentDateRecent },
  { label: "Last updated visible", max: 4, test: (i) => !!i.showsLastUpdated },
  { label: "Hub internal links", max: 6, test: (i) => !!i.hubInternalLinks },
];

function wordCountPoints(count: number): number {
  if (count >= 3000) return 10;
  if (count >= 2000) return 8;
  if (count >= 1200) return 5;
  if (count >= 800) return 3;
  return 0;
}

export function calculateGeoScore(input: GeoAuditInput): GeoScoreResult {
  const breakdown: GeoScoreResult["breakdown"] = [];
  const gaps: string[] = [];
  let score = 0;
  for (const w of WEIGHTS) {
    const ok = w.test(input);
    const points = ok ? w.max : 0;
    score += points;
    breakdown.push({ label: w.label, points, max: w.max });
    if (!ok) gaps.push(w.label);
  }
  const wcMax = 10;
  const wcPts = wordCountPoints(input.wordCount ?? 0);
  score += wcPts;
  breakdown.push({ label: "Word count", points: wcPts, max: wcMax });
  if (wcPts < 5) gaps.push(`Word count ~${input.wordCount ?? 0} (target 2000+)`);
  const maxTotal = WEIGHTS.reduce((s, w) => s + w.max, 0) + wcMax;
  const pct = Math.round((score / maxTotal) * 100);
  const grade: GeoScoreResult["grade"] =
    pct >= 90 ? "A" : pct >= 78 ? "B" : pct >= 65 ? "C" : pct >= 50 ? "D" : "F";
  return { score: pct, grade, breakdown, gaps };
}
