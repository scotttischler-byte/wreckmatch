const SEO_COVERS = [
  "/blog/covers/car-accident-scene-1.png",
  "/blog/covers/car-accident-scene-2.png",
  "/blog/covers/car-accident-scene-3.png",
  "/blog/covers/attorney-consultation-1.png",
  "/blog/covers/attorney-consultation-2.png",
] as const;

function hashSlug(slug: string): number {
  return slug.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

/** Stable OG/social cover per city or state slug. */
export function getSeoPageCoverImage(slug: string): string {
  return SEO_COVERS[hashSlug(slug) % SEO_COVERS.length];
}

export function getSeoPageCoverAlt(label: string): string {
  return `Car accident help guide — ${label}`;
}
