export type AttorneySlug = "bobby-garcia";

export type AttorneyRecord = {
  slug: AttorneySlug;
  featured?: boolean;
  initials: string;
  image?: string;
};

export const ATTORNEYS: AttorneyRecord[] = [
  { slug: "bobby-garcia", featured: true, initials: "BG", image: "/bobbygarcia/team/bobby-garcia.png" },
];

export const FEATURED_ATTORNEY = ATTORNEYS.find((a) => a.featured)!;
export const OTHER_ATTORNEYS = ATTORNEYS.filter((a) => !a.featured);
