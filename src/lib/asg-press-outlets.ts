export interface AsgPressOutlet {
  id: string;
  name: string;
  /** Self-hosted official logo pulled from the outlet's site or brand assets */
  logoSrc: string;
  logoWidth: number;
  logoHeight: number;
}

/**
 * Top 10 recognizable syndicated placements — official logos sourced from
 * each outlet's website, station page, or public brand assets.
 */
export const ASG_TOP_PRESS_OUTLETS: AsgPressOutlet[] = [
  {
    id: "boston-herald",
    name: "Boston Herald",
    logoSrc: "/press/official/boston-herald.svg",
    logoWidth: 320,
    logoHeight: 54,
  },
  {
    id: "star-tribune",
    name: "Star Tribune",
    logoSrc: "/press/official/star-tribune.svg",
    logoWidth: 674,
    logoHeight: 60,
  },
  {
    id: "pittsburgh-post-gazette",
    name: "Pittsburgh Post-Gazette",
    logoSrc: "/press/official/pittsburgh-post-gazette.jpg",
    logoWidth: 120,
    logoHeight: 120,
  },
  {
    id: "wral",
    name: "WRAL",
    logoSrc: "/press/official/wral.webp",
    logoWidth: 500,
    logoHeight: 120,
  },
  {
    id: "townhall",
    name: "Townhall",
    logoSrc: "/press/official/townhall.svg",
    logoWidth: 200,
    logoHeight: 40,
  },
  {
    id: "ibtimes",
    name: "IBTimes",
    logoSrc: "/press/official/ibtimes.svg",
    logoWidth: 310,
    logoHeight: 14,
  },
  {
    id: "business-insurance",
    name: "Business Insurance",
    logoSrc: "/press/official/business-insurance.svg",
    logoWidth: 360,
    logoHeight: 26,
  },
  {
    id: "press-telegram",
    name: "Press-Telegram",
    logoSrc: "/press/official/press-telegram.svg",
    logoWidth: 393,
    logoHeight: 41,
  },
  {
    id: "newsok",
    name: "NewsOK",
    logoSrc: "/press/official/newsok.svg",
    logoWidth: 286,
    logoHeight: 20,
  },
  {
    id: "sun-chronicle",
    name: "Sun Chronicle",
    logoSrc: "/press/official/sun-chronicle.png",
    logoWidth: 400,
    logoHeight: 68,
  },
];
