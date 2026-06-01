import type { GeoBrand } from "@/lib/geo/request-brand";

export type FaqItem = { question: string; answer: string };

export const GEO_FAQ_SKIP_PREFIXES = [
  "/blog",
  "/accidentsurvivalguide/blog",
  "/accidentsurvivalguide/es",
  "/admin",
  "/car-accident-help",
  "/resources",
];

const PATH_FAQS: Partial<Record<string, (brand: GeoBrand) => FaqItem[]>> = {
  "/": (brand) => {
    if (brand === "bobbygarcia") {
      return [
        {
          question: "What areas does the Law Office of Bobby Garcia serve?",
          answer:
            "Rio Grande Valley (Edinburg) and Houston / The Woodlands. Bilingual staff available for English and Spanish consultations.",
        },
        {
          question: "Is this website legal advice?",
          answer: "No. General information only. Contact the firm for advice about your specific case.",
        },
      ];
    }
    if (brand === "accidentsurvivalguide") {
      return [
        {
          question: "Is Accident Survival Guide a law firm?",
          answer: "No. Educational crash-survival content. For attorney matching, see WreckMatch.com.",
        },
      ];
    }
    return [
      {
        question: "Is WreckMatch a law firm?",
        answer: "No. WreckMatch LLC is a legal referral service connecting victims with licensed counsel.",
      },
      {
        question: "How fast will someone contact me?",
        answer: "Most victims receive a callback within about 60 seconds after submitting the form.",
      },
    ];
  },
  "/privacy": () => [
    {
      question: "How is my information used?",
      answer: "Contact details are used to connect you with legal or educational resources per our privacy policy.",
    },
  ],
  "/terms": () => [
    {
      question: "Does using this site create an attorney-client relationship?",
      answer: "No. Submitting a form or reading content does not create an attorney-client relationship.",
    },
  ],
  "/bobbygarcia/meet-our-attorneys": () => [
    {
      question: "Who leads the firm?",
      answer: "Bobby Garcia — personal injury and criminal defense experience across South Texas and Houston.",
    },
  ],
};

export function geoFaqsForPath(pathname: string, brand: GeoBrand): FaqItem[] | null {
  const path = pathname.split("?")[0]?.replace(/\/$/, "") || "/";
  const normalized = path === "" ? "/" : path;

  if (brand === "accidentsurvivalguide") return null;
  if (GEO_FAQ_SKIP_PREFIXES.some((p) => normalized === p || normalized.startsWith(`${p}/`))) {
    return null;
  }
  if (normalized.startsWith("/accidentsurvivalguide")) return null;

  const fn = PATH_FAQS[normalized];
  if (fn) return fn(brand);

  if (normalized.startsWith("/bobbygarcia") && brand === "bobbygarcia") {
    return PATH_FAQS["/"]?.("bobbygarcia") ?? null;
  }

  return null;
}
