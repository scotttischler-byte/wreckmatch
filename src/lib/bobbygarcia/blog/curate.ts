import type { BgBlogPost } from "@/lib/bobbygarcia/blog/types";

/** All imported guides are published — no city-template filtering. */
export function shouldPublishBgBlog(): boolean {
  return true;
}

export function isBgBlogUnique(post: Pick<BgBlogPost, "slug">): boolean {
  void post.slug;
  return true;
}

export function filterUniqueBgBlogPosts<T extends Pick<BgBlogPost, "slug">>(posts: T[]): T[] {
  return posts;
}

export function getBgBlogTemplateFamily() {
  return null;
}
