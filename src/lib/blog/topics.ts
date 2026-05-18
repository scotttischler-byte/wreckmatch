import type { BlogTopic } from "@/lib/blog/types";

export const BLOG_TOPICS: Record<
  BlogTopic,
  { label: string; description: string; angleHints: string[] }
> = {
  "immediate-steps": {
    label: "First steps after a crash",
    description: "Scene safety, police reports, photos, and witnesses.",
    angleHints: ["911", "documentation", "exchange info", "tow trucks"],
  },
  "insurance-pitfalls": {
    label: "Insurance mistakes",
    description: "Common insurer tactics and what to avoid saying.",
    angleHints: ["recorded statements", "quick settlements", "denials"],
  },
  "injuries-medical": {
    label: "Injuries & medical care",
    description: "Hidden injuries, treatment timelines, and records.",
    angleHints: ["whiplash", "ER vs urgent care", "follow-up visits"],
  },
  "state-local-laws": {
    label: "Local laws & deadlines",
    description: "Fault rules, reporting, and limitation periods (general).",
    angleHints: ["comparative fault", "no-fault", "reporting thresholds"],
  },
  "claims-adjusters": {
    label: "Claims & adjusters",
    description: "How claims move forward and documenting losses.",
    angleHints: ["adjuster calls", "repair estimates", "rental cars"],
  },
  "rideshare-truck": {
    label: "Rideshare & truck crashes",
    description: "Extra parties, commercial policies, and complexity.",
    angleHints: ["Uber/Lyft", "delivery vans", "semi-truck liability"],
  },
  "uninsured-hit-run": {
    label: "Uninsured & hit-and-run",
    description: "UM/UIM coverage and steps when the other driver flees.",
    angleHints: ["phantom vehicles", "police reports", "UM claims"],
  },
  "prevention-safety": {
    label: "Prevention & local risks",
    description: "Safer driving habits tied to local conditions.",
    angleHints: ["weather", "construction zones", "busy corridors"],
  },
};

export const BLOG_TOPIC_SLUGS = Object.keys(BLOG_TOPICS) as BlogTopic[];
