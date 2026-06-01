export type AttorneySlug = "bobby-garcia" | "arturo-garcia" | "roxana-lopez";

export type AttorneyRecord = {
  slug: AttorneySlug;
  featured?: boolean;
  initials: string;
  image?: string;
};

export const ATTORNEYS: AttorneyRecord[] = [
  { slug: "bobby-garcia", featured: true, initials: "BG" },
  { slug: "arturo-garcia", initials: "AG" },
  { slug: "roxana-lopez", initials: "RL" },
];

export const FEATURED_ATTORNEY = ATTORNEYS.find((a) => a.featured)!;
export const OTHER_ATTORNEYS = ATTORNEYS.filter((a) => !a.featured);
