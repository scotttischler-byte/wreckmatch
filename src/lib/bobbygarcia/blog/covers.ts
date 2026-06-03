import type { BgBlogPost, BgBlogTopic } from "@/lib/bobbygarcia/blog/types";

/** One local cover file per slug — populated by scripts/download-bobbygarcia-blog-covers.mjs */
export function bgBlogCoverPath(slug: string): string {
  return `/bobbygarcia/blog-covers/${slug}.jpg`;
}

const TOPIC_FALLBACKS: Record<string, string[]> = {
  "rideshare-truck": [
    "/bobbygarcia/practice/18-wheeler.webp",
    "/bobbygarcia/practice/car-accident.webp",
  ],
  "insurance-pitfalls": [
    "/bobbygarcia/practice/car-accident.webp",
    "/bobbygarcia/locations/edinburg-office.jpeg",
  ],
  "injuries-medical": [
    "/bobbygarcia/locations/edinburg-office.jpeg",
    "/bobbygarcia/practice/workplace.png",
  ],
  "statute-of-limitations": [
    "/bobbygarcia/locations/harlingen.png",
    "/bobbygarcia/locations/mission.png",
  ],
  "costly-mistakes": [
    "/bobbygarcia/practice/slip-and-fall.png",
    "/bobbygarcia/practice/mass-tort.webp",
  ],
  "claims-adjusters": [
    "/bobbygarcia/locations/rio-grande-valley.jpg",
    "/bobbygarcia/locations/edinburg.webp",
  ],
  "prevention-safety": [
    "/bobbygarcia/practice/car-accident.webp",
    "/bobbygarcia/hero/bobby-action.jpg",
  ],
  "uninsured-hit-run": [
    "/bobbygarcia/practice/18-wheeler.webp",
    "/bobbygarcia/practice/car-accident.webp",
  ],
  "state-local-laws": [
    "/bobbygarcia/locations/edinburg-office.jpeg",
    "/bobbygarcia/locations/harlingen.png",
  ],
  "immediate-steps": [
    "/bobbygarcia/practice/car-accident.webp",
    "/bobbygarcia/locations/rio-grande-valley.jpg",
  ],
};

function hashSlug(slug: string): number {
  return slug.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function fallbackForTopic(topic: BgBlogTopic | string, slug: string): string {
  const pool = TOPIC_FALLBACKS[topic] ?? TOPIC_FALLBACKS["immediate-steps"];
  return pool[hashSlug(slug) % pool.length];
}

/** Always return a slug-specific cover path (unique per post). */
export function getBgBlogCoverImage(post: Pick<BgBlogPost, "slug" | "topic">): string {
  return bgBlogCoverPath(post.slug);
}

export function getBgBlogCoverAlt(post: Pick<BgBlogPost, "title" | "city" | "stateAbbr">): string {
  return `${post.title} — ${post.city}, ${post.stateAbbr}`;
}

export function getBgBlogCoverFallback(post: Pick<BgBlogPost, "slug" | "topic">): string {
  return fallbackForTopic(post.topic, post.slug);
}
