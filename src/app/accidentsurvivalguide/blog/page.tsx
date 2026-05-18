import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getPublishedBlogPosts } from "@/lib/blog/posts";
import { BlogFilters } from "@/components/accidentsurvivalguide/BlogFilters";
import { BLOG_TOPICS } from "@/lib/blog/topics";
import { formatMessage, getMessages } from "@/lib/i18n/get-messages";
import { localizeHref } from "@/lib/i18n/locale-path";
import { getAsgLocale } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const b = getMessages(getAsgLocale()).blog;
  return { title: b.metaTitle, description: b.metaDescription };
}

type PageProps = {
  searchParams: Promise<{ state?: string; topic?: string; q?: string }>;
};

export default async function BlogIndexPage({ searchParams }: PageProps) {
  const locale = getAsgLocale();
  const b = getMessages(locale).blog;
  const filters = await searchParams;
  const posts = getPublishedBlogPosts({
    state: filters.state,
    topic: filters.topic as never,
    q: filters.q,
  });
  const dateLocale = locale === "es" ? "es-US" : "en-US";

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <h1 className="font-serif text-4xl font-semibold text-[#1a3a52]">{b.title}</h1>
      <p className="mt-4 max-w-2xl text-[#5b6b7f] leading-relaxed">{b.indexIntro}</p>

      <Suspense fallback={<div className="mt-8 h-24 animate-pulse rounded-xl bg-[#eef6fb]" />}>
        <BlogFilters />
      </Suspense>

      <p className="mt-6 text-sm text-[#7a8a98]">
        {formatMessage(b.articleCount, { count: posts.length })}
      </p>

      <ul className="mt-8 space-y-6">
        {posts.map((post) => (
          <li key={post.slug}>
            <article className="rounded-xl border border-[#c5dce8] bg-white p-6 sm:p-8">
              <div className="flex flex-wrap gap-2 text-xs font-medium text-[#5b8fa8]">
                {post.city !== "Nationwide" ? (
                  <span>
                    {post.city}, {post.stateAbbr}
                  </span>
                ) : null}
                <span>· {BLOG_TOPICS[post.topic]?.label}</span>
              </div>
              <time className="mt-2 block text-sm text-[#7a8a98]" dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString(dateLocale, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <h2 className="mt-2 font-serif text-2xl font-semibold text-[#1a3a52]">
                <Link
                  href={localizeHref(`/blog/${post.slug}`, locale)}
                  className="hover:text-[#2a7a9b]"
                >
                  {post.title}
                </Link>
              </h2>
              <p className="mt-3 text-[#5b6b7f] leading-relaxed">{post.excerpt}</p>
              <Link
                href={localizeHref(`/blog/${post.slug}`, locale)}
                className="mt-4 inline-flex text-sm font-semibold text-[#2a7a9b] underline underline-offset-2"
              >
                {b.readMore}
              </Link>
            </article>
          </li>
        ))}
      </ul>

      {posts.length === 0 ? <p className="mt-8 text-[#5b6b7f]">{b.noPosts}</p> : null}

      <p className="mt-10 text-sm">
        <Link href="/feed.xml" className="text-[#2a7a9b] underline underline-offset-2">
          RSS feed
        </Link>
      </p>
    </div>
  );
}
