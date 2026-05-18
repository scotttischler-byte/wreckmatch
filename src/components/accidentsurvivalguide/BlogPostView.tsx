"use client";

import type { BlogPost } from "@/lib/blog/types";
import { AsgLink } from "@/components/accidentsurvivalguide/AsgLink";
import { useAsgLocale } from "@/components/accidentsurvivalguide/AsgLocaleProvider";
import { SurvivalGuideDisclaimer } from "@/components/SurvivalGuideDisclaimer";
import { SurvivalGuideDownloadForm } from "@/components/accidentsurvivalguide/SurvivalGuideDownloadForm";
import { estimateReadingTime } from "@/lib/blog/reading-time";
import { BLOG_TOPICS } from "@/lib/blog/topics";
import { formatMessage } from "@/lib/i18n/get-messages";
import { WRECKMATCH_URL } from "@/lib/accidentsurvivalguide";

type BlogPostViewProps = {
  post: BlogPost;
};

export function BlogPostView({ post }: BlogPostViewProps) {
  const { locale, messages } = useAsgLocale();
  const b = messages.blog;
  const readMin = post.readingTimeMinutes ?? estimateReadingTime(post);
  const topicLabel = BLOG_TOPICS[post.topic]?.label ?? post.topic;
  const stateLink = post.stateSlug ? `/${post.stateSlug}` : null;
  const dateLocale = locale === "es" ? "es-US" : "en-US";

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      <nav aria-label="Breadcrumb" className="text-sm text-[#5b8fa8]">
        <AsgLink href="/blog" className="underline underline-offset-2 hover:text-[#2a7a9b]">
          {b.title}
        </AsgLink>
        {post.city !== "Nationwide" ? (
          <>
            <span className="mx-2 text-[#c5dce8]">/</span>
            <span>
              {post.city}, {post.stateAbbr}
            </span>
          </>
        ) : null}
      </nav>

      {locale === "es" ? (
        <p className="mt-6 rounded-lg border border-[#c5dce8] bg-[#eef6fb] px-4 py-3 text-sm text-[#3d5568]">
          {b.englishOnly}
        </p>
      ) : null}

      <SurvivalGuideDisclaimer variant="compact" className="mt-6" />

      <div className="mt-6 flex flex-wrap gap-2 text-xs font-medium">
        <span className="rounded-full bg-[#e8f4fa] px-3 py-1 text-[#2a7a9b]">{topicLabel}</span>
        {post.city !== "Nationwide" ? (
          <span className="rounded-full bg-[#f4faf8] px-3 py-1 text-[#5a9a82]">
            {post.city}, {post.stateAbbr}
          </span>
        ) : null}
        <span className="rounded-full bg-[#f4faf8] px-3 py-1 text-[#5b6b7f]">
          {readMin} min
        </span>
      </div>

      <time className="mt-4 block text-sm text-[#7a8a98]" dateTime={post.publishedAt}>
        {new Date(post.publishedAt).toLocaleDateString(dateLocale, {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </time>

      <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight text-[#1a3a52] sm:text-4xl">
        {post.title}
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-[#5b6b7f]">{post.excerpt}</p>

      <div className="mt-10 space-y-10">
        {post.sections.map((section) => (
          <section key={section.heading ?? section.paragraphs[0]?.slice(0, 40)}>
            {section.heading ? (
              <h2 className="font-serif text-2xl font-semibold text-[#1a3a52]">{section.heading}</h2>
            ) : null}
            <div className="mt-4 space-y-4 text-[#4a6578] leading-relaxed">
              {section.paragraphs.map((p) => (
                <p key={p.slice(0, 48)}>{p}</p>
              ))}
            </div>
            {section.list?.length ? (
              <ol className="mt-4 list-decimal space-y-2 pl-6 text-[#4a6578]">
                {section.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            ) : null}
          </section>
        ))}
      </div>

      {post.faq.length > 0 ? (
        <section className="mt-12 rounded-xl border border-[#c5dce8] bg-[#f8fbfd] p-6">
          <h2 className="font-serif text-xl font-semibold text-[#1a3a52]">FAQ</h2>
          <dl className="mt-6 space-y-5">
            {post.faq.map((item) => (
              <div key={item.question}>
                <dt className="font-semibold text-[#1a3a52]">{item.question}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-[#5b6b7f]">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      <div className="mt-10 space-y-4 rounded-xl border border-[#d4e8dc] bg-[#f4faf8] p-6 text-sm leading-relaxed text-[#5b6b7f]">
        <p>{b.disclaimer}</p>
        {stateLink ? (
          <p>
            <AsgLink href={stateLink} className="font-medium text-[#2a7a9b] underline underline-offset-2">
              {formatMessage(messages.resources.stateGuideTitle, { state: post.state })} →
            </AsgLink>
          </p>
        ) : null}
        <p>
          <a
            href={WRECKMATCH_URL}
            className="font-medium text-[#2a7a9b] underline underline-offset-2"
            rel="noopener noreferrer"
          >
            {b.wreckmatchCta}
          </a>
        </p>
      </div>

      <div className="mt-14">
        <SurvivalGuideDownloadForm headline="checklist" />
      </div>
    </article>
  );
}
