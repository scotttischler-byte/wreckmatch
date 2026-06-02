import Image from "next/image";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  Heart,
  MessageCircle,
  Scale,
  Shield,
  Users,
} from "lucide-react";
import { AsgLink } from "@/components/accidentsurvivalguide/AsgLink";
import { HomeLeadMagnets } from "@/components/accidentsurvivalguide/HomeLeadMagnets";
import { getPublishedBlogPosts } from "@/lib/blog/posts";
import { STATE_SLUGS, STATE_GUIDES, WRECKMATCH_URL } from "@/lib/accidentsurvivalguide";
import type { Messages } from "@/lib/i18n/get-messages";
import { formatMessage } from "@/lib/i18n/get-messages";

export function AsgHomePage({ messages: m }: { messages: Messages }) {
  const h = m.home;
  const recentPosts = getPublishedBlogPosts().slice(0, 6);

  return (
    <>
      <HomeLeadMagnets />

      <section className="border-b border-[#c5dce8]/40 bg-white py-10 sm:py-14">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-12">
          <blockquote className="order-2 rounded-2xl border border-[#c5dce8] bg-[#f8fbfd] p-6 sm:order-1 sm:p-8">
            <Heart className="size-7 text-[#5a9a82] sm:size-8" aria-hidden />
            <p className="mt-4 text-base leading-relaxed text-[#3d5568] sm:mt-6 sm:text-lg">
              &ldquo;{h.storyQuote}&rdquo;
            </p>
            <footer className="mt-4 text-sm font-medium text-[#5b8fa8]">{h.storyAttribution}</footer>
          </blockquote>
          <div className="relative order-1 aspect-[4/3] overflow-hidden rounded-2xl border border-[#c5dce8] shadow-md sm:order-2">
            <Image
              src="/asg-hero-checklist.png"
              alt={h.heroImageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <h2 className="font-serif text-2xl font-semibold text-[#1a3a52] sm:text-3xl">{h.insideTitle}</h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {m.benefits.map((benefit) => (
            <li
              key={benefit}
              className="flex gap-3 rounded-xl border border-[#c5dce8]/80 bg-white p-4 text-[#4a6578] shadow-sm"
            >
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[#5a9a82]" aria-hidden />
              <span className="text-sm leading-relaxed sm:text-base">{benefit}</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="first-24-hours" className="scroll-mt-24 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Clock className="size-7 text-[#2a7a9b]" aria-hidden />
            <h2 className="font-serif text-3xl font-semibold text-[#1a3a52]">{h.first24Title}</h2>
          </div>
          <p className="mt-4 max-w-2xl text-[#5b6b7f]">{h.first24Intro}</p>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2">
            {m.first24Steps.map((step, index) => (
              <li key={step.title} className="rounded-xl border border-[#c5dce8] bg-white p-6">
                <span className="text-sm font-semibold text-[#5b8fa8]">
                  {h.stepLabel} {index + 1}
                </span>
                <h3 className="mt-2 font-semibold text-[#1a3a52]">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#5b6b7f]">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="common-mistakes" className="scroll-mt-24 bg-[#f4faf8] py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="size-7 text-[#c4884a]" aria-hidden />
            <h2 className="font-serif text-3xl font-semibold text-[#1a3a52]">{h.mistakesTitle}</h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {m.commonMistakes.map((item) => (
              <article key={item.title} className="rounded-xl border border-[#d4e8dc] bg-white p-6">
                <h3 className="font-semibold text-[#1a3a52]">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#5b6b7f]">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="your-rights" className="scroll-mt-24 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Scale className="size-7 text-[#2a7a9b]" aria-hidden />
            <h2 className="font-serif text-3xl font-semibold text-[#1a3a52]">{h.rightsTitle}</h2>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[Shield, FileText, Users].map((Icon, i) => {
              const card = h.rightsCards[i];
              return (
                <article key={card.title} className="rounded-xl border border-[#c5dce8] bg-white p-6">
                  <Icon className="size-6 text-[#5a9a82]" aria-hidden />
                  <h3 className="mt-4 font-semibold text-[#1a3a52]">{card.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#5b6b7f]">{card.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#eef6fb] py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-serif text-3xl font-semibold text-[#1a3a52]">{h.resourcesTitle}</h2>
          <p className="mt-3 text-[#5b6b7f]">{h.resourcesIntro}</p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <li>
              <AsgLink href="/resources" className="block rounded-xl border border-[#c5dce8] bg-white p-5 transition hover:border-[#2a7a9b]/40">
                <span className="font-semibold text-[#1a3a52]">{h.allResources}</span>
              </AsgLink>
            </li>
            <li>
              <AsgLink href="/blog" className="block rounded-xl border border-[#c5dce8] bg-white p-5 transition hover:border-[#2a7a9b]/40">
                <span className="font-semibold text-[#1a3a52]">
                  {formatMessage(h.blogLink, { count: recentPosts.length })}
                </span>
              </AsgLink>
            </li>
            {STATE_SLUGS.slice(0, 4).map((slug) => (
              <li key={slug}>
                <AsgLink href={`/${slug}`} className="block rounded-xl border border-[#c5dce8] bg-white p-5 transition hover:border-[#2a7a9b]/40">
                  <span className="font-semibold text-[#1a3a52]">
                    {formatMessage(h.stateGuideLink, { state: STATE_GUIDES[slug].name })}
                  </span>
                </AsgLink>
              </li>
            ))}
          </ul>
          {recentPosts.length > 0 ? (
            <ul className="mt-8 space-y-3 border-t border-[#c5dce8]/60 pt-8">
              <li className="text-sm font-semibold text-[#1a3a52]">{h.latestArticles}</li>
              {recentPosts.map((post) => (
                <li key={post.slug}>
                  <AsgLink href={`/blog/${post.slug}`} className="text-sm text-[#2a7a9b] underline underline-offset-2">
                    {post.title}
                  </AsgLink>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>

      <section id="testimonials" className="scroll-mt-24 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-serif text-3xl font-semibold text-[#1a3a52]">{h.testimonialsTitle}</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {m.testimonials.map((t) => (
              <blockquote key={t.attribution} className="rounded-xl border border-[#c5dce8] bg-white p-6">
                <p className="leading-relaxed text-[#4a6578]">&ldquo;{t.quote}&rdquo;</p>
                <footer className="mt-4">
                  <p className="text-sm font-medium text-[#5b8fa8]">{t.attribution}</p>
                  <p className="mt-1 text-xs text-[#7a8a98]">{t.verified}</p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="scroll-mt-24 border-t border-[#c5dce8]/60 bg-white py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="font-serif text-2xl font-semibold text-[#1a3a52]">{h.faqTitle}</h2>
          <dl className="mt-8 space-y-6">
            {m.faq.map((item) => (
              <div key={item.question}>
                <dt className="font-semibold text-[#1a3a52]">{item.question}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-[#5b6b7f]">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-t border-[#c5dce8]/60 bg-[#1a3a52] py-14 text-white">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
          <MessageCircle className="mx-auto size-8 text-[#8ecae6]" aria-hidden />
          <h2 className="mt-4 font-serif text-2xl font-semibold">{h.helpTitle}</h2>
          <p className="mx-auto mt-3 max-w-xl text-[#b8d4e8]">{h.helpBody}</p>
          <a
            href={WRECKMATCH_URL}
            className="mt-6 inline-flex rounded-full bg-[#5a9a82] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#4d8872]"
            rel="noopener noreferrer"
          >
            {h.visitWreckmatch}
          </a>
        </div>
      </section>
    </>
  );
}
