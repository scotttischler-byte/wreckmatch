import fs from "fs";
import path from "path";
import { getAutopilotMarkdownPosts } from "@/lib/blog/markdown-posts";
import type { BlogFilters, BlogLocale, BlogPost, BlogPostStatus } from "@/lib/blog/types";

const POSTS_DIR = path.join(process.cwd(), "content/blog/posts");
const DRAFTS_DIR = path.join(process.cwd(), "content/blog/drafts");

function postLocale(post: BlogPost): BlogLocale {
  return post.locale === "es" ? "es" : "en";
}

function dirForLocale(base: string, locale: BlogLocale): string {
  return locale === "es" ? path.join(base, "es") : base;
}

function readPostsFromDir(dir: string, statusOverride?: BlogPostStatus): BlogPost[] {
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  const posts: BlogPost[] = [];
  for (const file of files) {
    try {
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const post = JSON.parse(raw) as BlogPost;
      if (statusOverride) post.status = statusOverride;
      posts.push(post);
    } catch (e) {
      console.warn(`[blog] skipped invalid post file ${file}:`, e);
    }
  }
  return posts;
}

function readLocalePosts(locale: BlogLocale, includeDrafts: boolean): BlogPost[] {
  const published = readPostsFromDir(dirForLocale(POSTS_DIR, locale));
  const withLocale = published.map((p) => ({ ...p, locale: postLocale(p) }));
  if (!includeDrafts) return withLocale;

  const drafts = readPostsFromDir(dirForLocale(DRAFTS_DIR, locale), "draft").map((p) => ({
    ...p,
    locale: postLocale(p),
  }));
  return [...withLocale, ...drafts];
}

function mergePosts(jsonPosts: BlogPost[], markdownPosts: BlogPost[]): BlogPost[] {
  const bySlug = new Map<string, BlogPost>();
  for (const post of jsonPosts) bySlug.set(post.slug, post);
  for (const post of markdownPosts) {
    const existing = bySlug.get(post.slug);
    if (existing?.markdownBody) continue;
    bySlug.set(post.slug, {
      ...existing,
      ...post,
      sections: post.sections.length ? post.sections : (existing?.sections ?? []),
      faq: post.faq.length ? post.faq : (existing?.faq ?? []),
      markdownBody: post.markdownBody ?? existing?.markdownBody,
      contentPath: post.contentPath ?? existing?.contentPath,
      autopilot: post.autopilot ?? existing?.autopilot,
    });
  }
  return [...bySlug.values()];
}

export function getAllBlogPosts(includeDrafts = false): BlogPost[] {
  const en = readLocalePosts("en", includeDrafts);
  const es = readLocalePosts("es", includeDrafts);
  const markdown = getAutopilotMarkdownPosts();
  return mergePosts([...en, ...es], markdown).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export function getPublishedBlogPosts(filters?: BlogFilters): BlogPost[] {
  let posts = getAllBlogPosts(false).filter((p) => p.status === "published");

  const locale = filters?.locale;
  if (locale) {
    posts = posts.filter((p) => postLocale(p) === locale);
  }

  if (filters?.state) {
    const s = filters.state.toLowerCase();
    posts = posts.filter(
      (p) =>
        p.stateAbbr.toLowerCase() === s ||
        p.stateSlug?.toLowerCase() === s ||
        p.state.toLowerCase().includes(s),
    );
  }
  if (filters?.topic) {
    posts = posts.filter((p) => p.topic === filters.topic);
  }
  if (filters?.city) {
    posts = posts.filter((p) =>
      p.city.toLowerCase().includes(filters.city!.toLowerCase()),
    );
  }
  if (filters?.q) {
    const q = filters.q.toLowerCase();
    posts = posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q),
    );
  }
  return posts;
}

export function getBlogPostBySlug(
  slug: string,
  options?: { includeDrafts?: boolean; locale?: BlogLocale },
): BlogPost | undefined {
  const includeDrafts = options?.includeDrafts ?? false;
  const locale = options?.locale;
  const posts = locale
    ? readLocalePosts(locale, includeDrafts)
    : getAllBlogPosts(includeDrafts);
  return posts.find((p) => p.slug === slug);
}

export function getRecentPostCitySlugs(limit = 30): string[] {
  return getPublishedBlogPosts()
    .slice(0, limit)
    .map((p) => `${p.city}-${p.stateAbbr}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
}

export { estimateReadingTime } from "@/lib/blog/reading-time";
