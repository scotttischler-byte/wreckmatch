import type { BlogPost } from "@/lib/blog/types";

const ACCIDENT_COVERS = [
  "/blog/covers/car-accident-scene-1.png",
  "/blog/covers/car-accident-scene-2.png",
  "/blog/covers/car-accident-scene-3.png",
] as const;

const ATTORNEY_COVERS = [
  "/blog/covers/attorney-consultation-1.png",
  "/blog/covers/attorney-consultation-2.png",
] as const;

const ATTORNEY_TOPICS = new Set<BlogPost["topic"]>([
  "claims-adjusters",
  "state-local-laws",
]);

function hashSlug(slug: string): number {
  return slug.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function isAttorneyThemed(post: BlogPost): boolean {
  if (post.coverImage) return false;
  const slug = post.slug.toLowerCase();
  return (
    ATTORNEY_TOPICS.has(post.topic) ||
    slug.includes("lawyer") ||
    slug.includes("attorney") ||
    slug.includes("legal") ||
    slug.includes("rights")
  );
}

/** Stable cover image per post — uses explicit coverImage or topic-based pool. */
export function getBlogCoverImage(post: BlogPost): string {
  if (post.coverImage) return post.coverImage;
  const pool = isAttorneyThemed(post) ? ATTORNEY_COVERS : ACCIDENT_COVERS;
  return pool[hashSlug(post.slug) % pool.length];
}

export function getBlogCoverAlt(post: BlogPost): string {
  if (post.city !== "Nationwide") {
    return `Car accident help guide for ${post.city}, ${post.stateAbbr}`;
  }
  return "WreckMatch car accident educational guide";
}
