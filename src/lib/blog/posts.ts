import fs from "fs";
import path from "path";
import type { BlogFilters, BlogPost, BlogPostStatus } from "@/lib/blog/types";

const POSTS_DIR = path.join(process.cwd(), "content/blog/posts");
const DRAFTS_DIR = path.join(process.cwd(), "content/blog/drafts");

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

export function getAllBlogPosts(includeDrafts = false): BlogPost[] {
  const published = readPostsFromDir(POSTS_DIR);
  const drafts = includeDrafts
    ? readPostsFromDir(DRAFTS_DIR, "draft")
    : [];
  return [...published, ...drafts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export function getPublishedBlogPosts(filters?: BlogFilters): BlogPost[] {
  let posts = getAllBlogPosts(false).filter((p) => p.status === "published");

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

export function getBlogPostBySlug(slug: string, includeDrafts = false): BlogPost | undefined {
  return getAllBlogPosts(includeDrafts).find((p) => p.slug === slug);
}

export function getRecentPostCitySlugs(limit = 30): string[] {
  return getPublishedBlogPosts()
    .slice(0, limit)
    .map((p) => `${p.city}-${p.stateAbbr}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
}

export function estimateReadingTime(post: BlogPost): number {
  const text = [
    post.title,
    post.excerpt,
    ...post.sections.flatMap((s) => [s.heading ?? "", ...s.paragraphs, ...(s.list ?? [])]),
    ...post.faq.flatMap((f) => [f.question, f.answer]),
  ].join(" ");
  const words = text.split(/\s+/).length;
  return Math.max(3, Math.ceil(words / 220));
}
