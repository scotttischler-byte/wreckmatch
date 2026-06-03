import fs from "fs";
import path from "path";
import type { BgBlogPost } from "@/lib/bobbygarcia/blog/types";
import type { BgLocale } from "@/lib/bobbygarcia/i18n/config";
import { getBgBlogCoverImage } from "@/lib/bobbygarcia/blog/covers";

const POSTS_ROOT = path.join(process.cwd(), "content/bobbygarcia/posts");

function postsDir(locale: BgLocale) {
  return path.join(POSTS_ROOT, locale);
}

function readLocalePosts(locale: BgLocale): BgBlogPost[] {
  const dir = postsDir(locale);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      return JSON.parse(raw) as BgBlogPost;
    })
    .filter((p) => p.status === "published")
    .map((p) => ({ ...p, coverImage: getBgBlogCoverImage(p) }))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getBgBlogPosts(locale: BgLocale): BgBlogPost[] {
  return readLocalePosts(locale);
}

export function getBgBlogPost(slug: string, locale: BgLocale): BgBlogPost | undefined {
  return getBgBlogPosts(locale).find((p) => p.slug === slug);
}

export function getBgBlogSlugs(locale: BgLocale): string[] {
  return getBgBlogPosts(locale).map((p) => p.slug);
}

export function getBgBlogPostCount(locale: BgLocale): number {
  return getBgBlogPosts(locale).length;
}
