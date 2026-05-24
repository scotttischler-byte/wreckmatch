import { getBlogPostBySlug, getPublishedBlogPosts } from "@/lib/blog/posts";
import { CITIES, getStateForCity } from "./cities";
import { buildProgrammaticBlogPost, parseProgrammaticBlogSlug } from "./build-blog-post";
import type { BlogPost } from "@/lib/blog/types";

export function resolveBlogPost(slug: string): BlogPost | undefined {
  const stored = getBlogPostBySlug(slug);
  if (stored && stored.status === "published") return stored;

  const parsed = parseProgrammaticBlogSlug(slug, CITIES);
  if (!parsed) return stored;

  const state = getStateForCity(parsed.city);
  if (!state) return stored;

  return buildProgrammaticBlogPost(parsed.city, state, parsed.template);
}

export function getAllBlogSlugsForSitemap(): string[] {
  return getPublishedBlogPosts().map((p) => p.slug);
}
