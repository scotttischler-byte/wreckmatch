import type { BlogPost } from "@/lib/blog/types";

const WORDS_PER_MINUTE = 225;
const MIN_WORDS_FOR_BADGE = 400;

export function countBlogWords(post: BlogPost): number {
  const text = [
    post.markdownBody ?? "",
    post.title,
    post.excerpt,
    ...post.sections.flatMap((s) => [s.heading ?? "", ...s.paragraphs, ...(s.list ?? [])]),
    ...post.faq.flatMap((f) => [f.question, f.answer]),
  ].join(" ");
  return text.split(/\s+/).filter(Boolean).length;
}

export function estimateReadingTime(post: BlogPost): number {
  const words = countBlogWords(post);
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

export function shouldShowReadTime(post: BlogPost): boolean {
  return countBlogWords(post) >= MIN_WORDS_FOR_BADGE;
}
