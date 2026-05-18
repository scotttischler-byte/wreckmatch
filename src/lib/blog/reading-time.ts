import type { BlogPost } from "@/lib/blog/types";

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
