import type { Metadata } from "next";
import Link from "next/link";
import { ASG_BLOG_POSTS } from "@/lib/accidentsurvivalguide";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Educational articles about what to do after a car accident — from Accident Survival Guide by WreckMatch LLC.",
};

export default function BlogIndexPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <h1 className="font-serif text-4xl font-semibold text-[#1a3a52]">Blog</h1>
      <p className="mt-4 max-w-2xl text-[#5b6b7f] leading-relaxed">
        Calm, educational articles—not legal advice. For guidance about your specific situation,
        speak with a licensed attorney in your state.
      </p>

      <ul className="mt-12 space-y-6">
        {ASG_BLOG_POSTS.map((post) => (
          <li key={post.slug}>
            <article className="rounded-xl border border-[#c5dce8] bg-white p-6 sm:p-8">
              <time className="text-sm text-[#7a8a98]" dateTime={post.date}>
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <h2 className="mt-2 font-serif text-2xl font-semibold text-[#1a3a52]">
                <Link
                  href={`/blog/${post.slug}`}
                  className="hover:text-[#2a7a9b]"
                >
                  {post.title}
                </Link>
              </h2>
              <p className="mt-3 text-[#5b6b7f] leading-relaxed">{post.excerpt}</p>
              <Link
                href={`/blog/${post.slug}`}
                className="mt-4 inline-flex text-sm font-semibold text-[#2a7a9b] underline underline-offset-2"
              >
                Read article →
              </Link>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
