export type BlogPostStatus = "draft" | "published";

export type BlogTopic =
  | "immediate-steps"
  | "insurance-pitfalls"
  | "injuries-medical"
  | "state-local-laws"
  | "claims-adjusters"
  | "rideshare-truck"
  | "uninsured-hit-run"
  | "prevention-safety";

export type BlogPostSection = {
  heading?: string;
  paragraphs: string[];
  list?: string[];
};

export type BlogPostFaq = {
  question: string;
  answer: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  metaDescription: string;
  excerpt: string;
  city: string;
  state: string;
  stateAbbr: string;
  stateSlug?: string;
  topic: BlogTopic;
  status: BlogPostStatus;
  publishedAt: string;
  updatedAt?: string;
  keywords: string[];
  sections: BlogPostSection[];
  faq: BlogPostFaq[];
  readingTimeMinutes?: number;
  /** Autopilot long-form city guide rendered from content/{st}/{city}/index.md */
  autopilot?: boolean;
  contentPath?: string;
  markdownBody?: string;
  /** Public path under /blog/covers/ or absolute URL */
  coverImage?: string;
};

export type BlogFilters = {
  state?: string;
  topic?: string;
  city?: string;
  q?: string;
};
