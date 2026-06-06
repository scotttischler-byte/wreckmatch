export interface AsgPressOutlet {
  id: string;
  name: string;
  /** Full wordmark SVG — outlet name styled in brand typography */
  wordmarkSrc: string;
  wordmarkWidth: number;
  wordmarkHeight: number;
}

/**
 * Top 10 most recognizable placements from the syndication list —
 * major newspapers, TV, and national outlets (not PR-wire distributors).
 */
export const ASG_TOP_PRESS_OUTLETS: AsgPressOutlet[] = [
  {
    id: "boston-herald",
    name: "Boston Herald",
    wordmarkSrc: "/press/wordmarks/boston-herald.svg",
    wordmarkWidth: 168,
    wordmarkHeight: 40,
  },
  {
    id: "star-tribune",
    name: "Star Tribune",
    wordmarkSrc: "/press/wordmarks/star-tribune.svg",
    wordmarkWidth: 156,
    wordmarkHeight: 40,
  },
  {
    id: "pittsburgh-post-gazette",
    name: "Pittsburgh Post-Gazette",
    wordmarkSrc: "/press/wordmarks/pittsburgh-post-gazette.svg",
    wordmarkWidth: 220,
    wordmarkHeight: 40,
  },
  {
    id: "wral",
    name: "WRAL",
    wordmarkSrc: "/press/wordmarks/wral.svg",
    wordmarkWidth: 108,
    wordmarkHeight: 40,
  },
  {
    id: "townhall",
    name: "Townhall",
    wordmarkSrc: "/press/wordmarks/townhall.svg",
    wordmarkWidth: 148,
    wordmarkHeight: 40,
  },
  {
    id: "ibtimes",
    name: "IBTimes",
    wordmarkSrc: "/press/wordmarks/ibtimes.svg",
    wordmarkWidth: 132,
    wordmarkHeight: 40,
  },
  {
    id: "business-insurance",
    name: "Business Insurance",
    wordmarkSrc: "/press/wordmarks/business-insurance.svg",
    wordmarkWidth: 196,
    wordmarkHeight: 40,
  },
  {
    id: "press-telegram",
    name: "Press-Telegram",
    wordmarkSrc: "/press/wordmarks/press-telegram.svg",
    wordmarkWidth: 176,
    wordmarkHeight: 40,
  },
  {
    id: "newsok",
    name: "NewsOK",
    wordmarkSrc: "/press/wordmarks/newsok.svg",
    wordmarkWidth: 128,
    wordmarkHeight: 40,
  },
  {
    id: "sun-chronicle",
    name: "Sun Chronicle",
    wordmarkSrc: "/press/wordmarks/sun-chronicle.svg",
    wordmarkWidth: 168,
    wordmarkHeight: 40,
  },
];
