export type BgBlogTopic =
  | "immediate-steps"
  | "insurance-pitfalls"
  | "injuries-medical"
  | "state-local-laws"
  | "claims-adjusters"
  | "rideshare-truck"
  | "uninsured-hit-run"
  | "prevention-safety"
  | "statute-of-limitations"
  | "costly-mistakes";

export type BgBlogSection = {
  heading?: string;
  paragraphs: string[];
  list?: string[];
};

export type BgBlogFaq = {
  question: string;
  answer: string;
};

export type BgBlogPost = {
  slug: string;
  title: string;
  metaDescription: string;
  excerpt: string;
  city: string;
  state: string;
  stateAbbr: string;
  topic: BgBlogTopic | string;
  status: "published" | "draft";
  publishedAt: string;
  keywords: string[];
  sections: BgBlogSection[];
  faq: BgBlogFaq[];
  coverImage?: string;
  practiceArea?: string;
  sourceSlug?: string;
};
