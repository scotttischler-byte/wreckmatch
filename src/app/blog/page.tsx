import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedBlogPosts } from "@/lib/blog/posts";
import { SeoShell } from "@/components/seo/SeoShell";
import { BlogCoverImage } from "@/components/seo/BlogCoverImage";
import { BLOG_TOPICS } from "@/lib/blog/topics";
import { absoluteUrl } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "Car Accident Blog | WreckMatch",
  description:
    "Educational car accident guides by city and state — immediate steps, insurance pitfalls, statutes of limitations, and injury recovery. Not legal advice.",
  alternates: { canonical: absoluteUrl("/blog") },
  openGraph: {
    title: "Car Accident Blog | WreckMatch",
    description:
      "Educational car accident guides by city and state. WreckMatch LLC is a referral service — not a law firm.",
    images: [{ url: absoluteUrl("/blog/covers/car-accident-scene-1.png"), width: 1200, height: 630 }],
  },
};

export default function BlogIndexPage() {
  const posts = getPublishedBlogPosts();

  return (
    <SeoShell>
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="font-serif text-3xl font-semibold text-[#152238] sm:text-4xl">
          Car Accident Guides & Blog
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-[#475569]">
          City- and state-specific educational articles on what to do after a crash, insurance tactics,
          and when to explore attorney matching. WreckMatch LLC is a referral service — not a law firm.
        </p>

        <ul className="mt-10 space-y-8">
          {posts.map((post) => (
            <li
              key={post.slug}
              className="overflow-hidden rounded-[1.25rem] border border-[#e7dccb] bg-white shadow-sm transition hover:border-[#c9a227]/40"
            >
              <Link href={`/blog/${post.slug}`} className="block">
                <BlogCoverImage
                  post={post}
                  className="rounded-none border-0 border-b border-[#e7dccb]"
                />
              </Link>
              <div className="p-6">
                <div className="flex flex-wrap gap-2 text-xs font-medium text-[#64748b]">
                  <span className="rounded-full bg-[#f5efe6] px-2.5 py-0.5 text-[#8a6914]">
                    {BLOG_TOPICS[post.topic]?.label ?? post.topic}
                  </span>
                  {post.city !== "Nationwide" ? (
                    <span>
                      {post.city}, {post.stateAbbr}
                    </span>
                  ) : null}
                  <time dateTime={post.publishedAt}>
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                </div>
                <h2 className="mt-3 font-serif text-xl font-semibold text-[#152238]">
                  <Link href={`/blog/${post.slug}`} className="hover:text-[#8a6914]">
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-2 text-[#475569]">{post.excerpt}</p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-3 inline-block text-sm font-medium text-[#8a6914] underline underline-offset-2"
                >
                  Read guide →
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </SeoShell>
  );
}
