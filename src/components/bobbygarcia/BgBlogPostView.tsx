"use client";

import type { BgBlogPost } from "@/lib/bobbygarcia/blog/types";
import { getBgMountPrefix } from "@/lib/bobbygarcia/i18n/locale-path";
import { getBgBlogCoverAlt, getBgBlogCoverImage } from "@/lib/bobbygarcia/blog/covers";
import { useBgLocale } from "@/components/bobbygarcia/BgLocaleProvider";
import { BG_PHONE_DISPLAY, BG_PHONE_E164 } from "@/lib/bobbygarcia/site";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { BgLink } from "@/components/bobbygarcia/BgLink";

export function BgBlogPostView({ post }: { post: BgBlogPost }) {
  const { messages } = useBgLocale();
  const pathname = usePathname() ?? "/";
  const b = messages.blog;
  const cover = getBgBlogCoverImage(post);
  const pptxHref = `${getBgMountPrefix(pathname)}/presentations/${post.slug}.pptx`;
  const date = new Date(post.publishedAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-2xl border border-[#c9a227]/25">
          <Image
            src={cover}
            alt={getBgBlogCoverAlt(post)}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>

      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#c9a227]">
        {post.city}, {post.stateAbbr} · <time dateTime={post.publishedAt}>{date}</time>
      </p>
      <h1 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.02em] text-white sm:text-4xl">
        {post.title}
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-[#b8c4d4]">{post.excerpt}</p>

      <div className="prose prose-invert mt-10 max-w-none prose-headings:font-serif prose-headings:text-white prose-p:text-[#c5d0de] prose-li:text-[#c5d0de] prose-strong:text-white">
        {post.sections.map((section, i) => (
          <section key={i} className="mb-8">
            {section.heading ? (
              <h2 className="text-xl font-semibold text-white">{section.heading}</h2>
            ) : null}
            {section.paragraphs.map((p, j) => (
              <p key={j} className="mt-3 leading-relaxed">
                {p}
              </p>
            ))}
            {section.list?.length ? (
              <ul className="mt-3 list-disc space-y-2 pl-5">
                {section.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>

      {post.faq.length ? (
        <section className="mt-12 rounded-xl border border-[#c9a227]/20 bg-[#0f1c2e] p-6">
          <h2 className="font-serif text-xl font-semibold text-white">{b.faq}</h2>
          <dl className="mt-4 space-y-4">
            {post.faq.map((item) => (
              <div key={item.question}>
                <dt className="font-medium text-[#c9a227]">{item.question}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-[#b8c4d4]">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      <p className="mt-8 text-center">
        <a
          href={pptxHref}
          className="inline-flex items-center gap-2 rounded-full border border-[#c9a227]/40 px-5 py-2.5 text-sm font-semibold text-[#c9a227] transition hover:border-[#c9a227]"
          download
        >
          {b.downloadPptx}
        </a>
      </p>

      <aside className="mt-12 rounded-2xl border border-[#c9a227]/30 bg-gradient-to-br from-[#111d32] to-[#0a1220] p-8 text-center">
        <h2 className="font-serif text-2xl font-semibold text-white">{b.ctaTitle}</h2>
        <p className="mt-2 text-[#b8c4d4]">{b.ctaBody}</p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={`tel:${BG_PHONE_E164}`}
            className="rounded-full bg-[#c9a227] px-6 py-3 font-semibold text-[#0a1220]"
          >
            {b.callNow} {BG_PHONE_DISPLAY}
          </a>
          <BgLink
            href="/meet-our-attorneys"
            className="rounded-full border border-[#c9a227]/50 px-6 py-3 font-semibold text-white"
          >
            {b.meetAttorneys}
          </BgLink>
        </div>
      </aside>

      <p className="mt-8">
        <BgLink href="/blog" className="text-sm font-medium text-[#c9a227] underline underline-offset-2">
          {b.allGuides}
        </BgLink>
      </p>
    </article>
  );
}
