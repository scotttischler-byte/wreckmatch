export interface AsgPressOutlet {
  id: string;
  name: string;
  logoSrc: string;
  logoWidth: number;
  logoHeight: number;
  /** Tailwind arbitrary font stack approximating the outlet wordmark */
  fontClass: string;
  nameColor: string;
}

/** Top 10 syndicated placements shown in the homepage press strip. */
export const ASG_TOP_PRESS_OUTLETS: AsgPressOutlet[] = [
  {
    id: "brandfeatured",
    name: "BrandFeatured",
    logoSrc: "/press/brandfeatured.svg",
    logoWidth: 44,
    logoHeight: 44,
    fontClass: "font-sans font-extrabold tracking-tight",
    nameColor: "#0f766e",
  },
  {
    id: "openpr",
    name: "OpenPR",
    logoSrc: "/press/openpr.svg",
    logoWidth: 44,
    logoHeight: 44,
    fontClass: "font-sans font-bold tracking-wide",
    nameColor: "#1d4ed8",
  },
  {
    id: "boston-herald",
    name: "Boston Herald",
    logoSrc: "/press/boston-herald.svg",
    logoWidth: 44,
    logoHeight: 44,
    fontClass: "font-serif font-bold tracking-tight",
    nameColor: "#0c2340",
  },
  {
    id: "star-tribune",
    name: "Star Tribune",
    logoSrc: "/press/star-tribune.svg",
    logoWidth: 44,
    logoHeight: 44,
    fontClass: "font-serif font-semibold",
    nameColor: "#111827",
  },
  {
    id: "streetinsider",
    name: "StreetInsider",
    logoSrc: "/press/streetinsider.svg",
    logoWidth: 44,
    logoHeight: 44,
    fontClass: "font-sans font-bold uppercase tracking-[0.12em]",
    nameColor: "#14532d",
  },
  {
    id: "wral",
    name: "WRAL",
    logoSrc: "/press/wral.svg",
    logoWidth: 44,
    logoHeight: 44,
    fontClass: "font-sans font-black tracking-widest",
    nameColor: "#b91c1c",
  },
  {
    id: "newsok",
    name: "NewsOK",
    logoSrc: "/press/newsok.svg",
    logoWidth: 44,
    logoHeight: 44,
    fontClass: "font-sans font-bold",
    nameColor: "#1e3a8a",
  },
  {
    id: "townhall",
    name: "Townhall",
    logoSrc: "/press/townhall.svg",
    logoWidth: 44,
    logoHeight: 44,
    fontClass: "font-serif font-bold",
    nameColor: "#991b1b",
  },
  {
    id: "business-insurance",
    name: "Business Insurance",
    logoSrc: "/press/business-insurance.svg",
    logoWidth: 44,
    logoHeight: 44,
    fontClass: "font-sans font-semibold",
    nameColor: "#0f4c81",
  },
  {
    id: "press-telegram",
    name: "Press-Telegram",
    logoSrc: "/press/press-telegram.svg",
    logoWidth: 44,
    logoHeight: 44,
    fontClass: "font-serif font-bold italic",
    nameColor: "#1f2937",
  },
];
