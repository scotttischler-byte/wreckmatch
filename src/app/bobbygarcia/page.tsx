import type { Metadata } from "next";
import Image from "next/image";
import { BgBlogCard } from "@/components/bobbygarcia/BgBlogCard";
import { BgLink } from "@/components/bobbygarcia/BgLink";
import { BgPracticeGrid } from "@/components/bobbygarcia/BgPracticeGrid";
import { BgStatsBar } from "@/components/bobbygarcia/BgStatsBar";
import { BgTeamWallSection } from "@/components/bobbygarcia/BgTeamWall";
import { FeaturedAttorney } from "@/components/bobbygarcia/FeaturedAttorney";
import { getBgBlogPosts, getBgBlogPostCount } from "@/lib/bobbygarcia/blog/posts";
import { FEATURED_ATTORNEY, type AttorneySlug } from "@/lib/bobbygarcia/attorneys";
import { getBgMessages } from "@/lib/bobbygarcia/i18n/get-messages";
import { getBgLocale } from "@/lib/bobbygarcia/i18n/server";
import { BG_BASE_URL, BG_PHONE_DISPLAY, BG_PHONE_E164 } from "@/lib/bobbygarcia/site";

export async function generateMetadata(): Promise<Metadata> {
  const locale = getBgLocale();
  const h = getBgMessages(locale).home;
  return {
    title: h.metaTitle,
    description: h.metaDescription,
    alternates: {
      canonical: locale === "es" ? `${BG_BASE_URL}/es` : BG_BASE_URL,
      languages: { en: BG_BASE_URL, es: `${BG_BASE_URL}/es` },
    },
  };
}

export default function BobbyGarciaHomePage() {
  const locale = getBgLocale();
  const h = getBgMessages(locale).home;
  const featuredCopy = getBgMessages(locale).attorneys[FEATURED_ATTORNEY.slug as AttorneySlug];
  const guideCount = getBgBlogPostCount(locale);
  const latest = getBgBlogPosts(locale).slice(0, 6);

  return (
    <>
      <section className="relative min-h-[70vh] overflow-hidden border-b border-[#c9a227]/15">
        <Image
          src="/bobbygarcia/hero/bobby-action.jpg"
          alt={h.heroImageAlt}
          fill
          className="object-cover object-top"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1220]/95 via-[#0a1220]/80 to-[#0a1220]/50" />
        <div className="relative mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-center px-4 py-20 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#c9a227]">{h.eyebrow}</p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
            {h.heroTitle}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#c8d4e0]">{h.heroSubtitle}</p>
          <p className="mt-4 font-serif text-xl font-semibold uppercase tracking-[0.1em] text-[#c9a227] sm:text-2xl">
            {h.motto}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={`tel:${BG_PHONE_E164}`}
              className="rounded-full bg-[#c9a227] px-8 py-3.5 font-semibold text-[#0a1220] transition hover:bg-[#dbb84a]"
            >
              {h.ctaCall}: {BG_PHONE_DISPLAY}
            </a>
            <BgLink
              href="/contact"
              className="rounded-full border border-white/30 px-8 py-3.5 font-semibold text-white transition hover:border-[#c9a227]"
            >
              {h.ctaFree}
            </BgLink>
          </div>
          <p className="mt-4 text-sm text-[#8fa3bc]">{h.trustLine}</p>
        </div>
      </section>

      <BgStatsBar guideCount={guideCount} />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c9a227]">{h.practiceEyebrow}</p>
        <h2 className="mt-2 font-serif text-3xl font-semibold text-white sm:text-4xl">{h.practiceTitle}</h2>
        <div className="mt-10">
          <BgPracticeGrid />
        </div>
      </section>

      <section className="border-y border-[#c9a227]/10 bg-[#0c1525]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <FeaturedAttorney
            attorney={FEATURED_ATTORNEY}
            copy={featuredCopy}
            featuredLabel={getBgMessages(locale).attorneysPage.featuredLabel}
          />
        </div>
      </section>

      <BgTeamWallSection />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c9a227]">{h.insightsEyebrow}</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold text-white">{h.insightsTitle}</h2>
            <p className="mt-2 text-sm text-[#8fa3bc]">{h.insightsCount.replace("{count}", String(guideCount))}</p>
          </div>
          <BgLink href="/blog" className="hidden shrink-0 text-sm font-semibold text-[#c9a227] sm:block">
            {h.viewAllGuides} →
          </BgLink>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((post) => (
            <BgBlogCard key={post.slug} post={post} />
          ))}
        </div>
        <div className="mt-8 text-center sm:hidden">
          <BgLink href="/blog" className="text-sm font-semibold text-[#c9a227]">
            {h.viewAllGuides} →
          </BgLink>
        </div>
      </section>

      <section className="border-t border-[#c9a227]/15 bg-[#060d18]">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <h2 className="font-serif text-3xl font-semibold text-white sm:text-4xl">{h.finalCtaTitle}</h2>
          <p className="mt-4 text-[#b8c4d4]">{h.finalCtaBody}</p>
          <a
            href={`tel:${BG_PHONE_E164}`}
            className="mt-8 inline-flex rounded-full bg-[#c9a227] px-10 py-4 text-lg font-semibold text-[#0a1220]"
          >
            {BG_PHONE_DISPLAY}
          </a>
        </div>
      </section>
    </>
  );
}
