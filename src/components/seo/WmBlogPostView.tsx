"use client";

import { useEffect } from "react";
import type { BlogPost } from "@/lib/blog/types";
import { estimateReadingTime } from "@/lib/blog/reading-time";
import { BLOG_TOPICS } from "@/lib/blog/topics";
import { SeoShell } from "@/components/seo/SeoShell";
import { SeoBreadcrumbs } from "@/components/seo/SeoBreadcrumbs";
import { SeoJsonLd } from "@/components/seo/SeoJsonLd";
import { RelatedGuides } from "@/components/seo/RelatedGuides";
import { ProgressiveLeadForm } from "@/components/seo/ProgressiveLeadForm";
import { StickyLeadCta } from "@/components/seo/StickyLeadCta";
import { blogBreadcrumbs, relatedBlogLinks } from "@/lib/seo/internal-links";
import { blogPostJsonLd } from "@/lib/seo/schema";
import { getCityByName } from "@/lib/seo/cities";
import { trackWreckmatchEvent } from "@/lib/analytics";
import { BlogCoverImage } from "@/components/seo/BlogCoverImage";

type WmBlogPostViewProps = {
  post: BlogPost;
};

export function WmBlogPostView({ post }: WmBlogPostViewProps) {
  const readMin = post.readingTimeMinutes ?? estimateReadingTime(post);
  const topicLabel = BLOG_TOPICS[post.topic]?.label ?? post.topic;
  const cityRecord =
    post.city !== "Nationwide"
      ? getCityByName(post.city, post.stateAbbr)
      : undefined;
  const breadcrumbs = blogBreadcrumbs(post.title, post.slug, cityRecord);
  const jsonLd = blogPostJsonLd(post, breadcrumbs);

  useEffect(() => {
    trackWreckmatchEvent("blog_view", { slug: post.slug });
  }, [post.slug]);

  return (
    <SeoShell>
      <SeoJsonLd data={jsonLd} />
      <article className="mx-auto max-w-5xl px-4 py-10 pb-24 sm:px-6 sm:py-14">
        <SeoBreadcrumbs items={breadcrumbs} />

        <div className="mt-6 flex flex-wrap gap-2 text-xs font-medium">
          <span className="rounded-full bg-[#f5efe6] px-3 py-1 text-[#8a6914]">{topicLabel}</span>
          {post.city !== "Nationwide" ? (
            <span className="rounded-full bg-[#eef2ff] px-3 py-1 text-[#475569]">
              {post.city}, {post.stateAbbr}
            </span>
          ) : null}
          <span className="rounded-full bg-[#f1f5f9] px-3 py-1 text-[#64748b]">{readMin} min read</span>
        </div>

        <time className="mt-4 block text-sm text-[#64748b]" dateTime={post.publishedAt}>
          {new Date(post.publishedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>

        <BlogCoverImage post={post} priority className="mt-8" />

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_340px]">
          <div>
            <h1 className="font-serif text-3xl font-semibold leading-tight text-[#152238] sm:text-4xl">
              {post.title}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-[#475569]">{post.excerpt}</p>

            <div className="mt-10 space-y-10">
              {post.sections.map((section, i) => (
                <section key={i}>
                  {section.heading ? (
                    <h2 className="font-serif text-2xl font-semibold text-[#152238]">
                      {section.heading}
                    </h2>
                  ) : null}
                  {section.paragraphs.map((p, j) => (
                    <p key={j} className="mt-4 leading-relaxed text-[#475569]">
                      {p}
                    </p>
                  ))}
                  {section.list?.length ? (
                    <ul className="mt-4 list-disc space-y-2 pl-6 text-[#475569]">
                      {section.list.map((item, k) => (
                        <li key={k}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ))}
            </div>

            {post.faq.length ? (
              <section className="mt-12">
                <h2 className="font-serif text-2xl font-semibold text-[#152238]">FAQ</h2>
                <dl className="mt-6 space-y-6">
                  {post.faq.map((item, i) => (
                    <div key={i}>
                      <dt className="font-semibold text-[#152238]">{item.question}</dt>
                      <dd className="mt-2 text-[#475569]">{item.answer}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ) : null}

            {cityRecord ? (
              <RelatedGuides
                links={relatedBlogLinks(cityRecord, post.slug).map((l) => ({
                  label: l.label,
                  href: l.href,
                }))}
              />
            ) : null}
          </div>

          <aside className="lg:sticky lg:top-8 lg:self-start">
            <ProgressiveLeadForm
              defaultValues={{
                city: post.city !== "Nationwide" ? post.city : undefined,
                state: post.stateAbbr,
                leadSource: `blog-${post.slug}`,
              }}
            />
          </aside>
        </div>
      </article>
      <StickyLeadCta />
    </SeoShell>
  );
}
