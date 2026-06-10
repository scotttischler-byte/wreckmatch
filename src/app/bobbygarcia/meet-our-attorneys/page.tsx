import type { Metadata } from "next";
import { AttorneyCard } from "@/components/bobbygarcia/AttorneyCard";
import { BgLink } from "@/components/bobbygarcia/BgLink";
import { BgTeamWall } from "@/components/bobbygarcia/BgTeamWall";
import { FeaturedAttorney } from "@/components/bobbygarcia/FeaturedAttorney";
import { bgLocaleOpenGraph } from "@/lib/bobbygarcia/i18n/config";
import { getBgMessages } from "@/lib/bobbygarcia/i18n/get-messages";
import { getBgLocale } from "@/lib/bobbygarcia/i18n/server";
import {
  FEATURED_ATTORNEY,
  OTHER_ATTORNEYS,
  type AttorneySlug,
} from "@/lib/bobbygarcia/attorneys";
import { BG_BASE_URL, BG_PHONE_DISPLAY, BG_PHONE_E164, BG_WHATSAPP_URL } from "@/lib/bobbygarcia/site";

export async function generateMetadata(): Promise<Metadata> {
  const locale = getBgLocale();
  const p = getBgMessages(locale).attorneysPage;
  const path = locale === "es" ? "/es/meet-our-attorneys" : "/meet-our-attorneys";

  return {
    title: p.metaTitle,
    description: p.metaDescription,
    openGraph: {
      type: "website",
      locale: bgLocaleOpenGraph(locale),
      url: `${BG_BASE_URL}${path}`,
      title: p.metaTitle,
      description: p.metaDescription,
    },
    alternates: {
      canonical: `${BG_BASE_URL}${path}`,
      languages: {
        en: `${BG_BASE_URL}/meet-our-attorneys`,
        es: `${BG_BASE_URL}/es/meet-our-attorneys`,
      },
    },
  };
}

export default function MeetOurAttorneysPage() {
  const locale = getBgLocale();
  const messages = getBgMessages(locale);
  const p = messages.attorneysPage;
  const featuredCopy = messages.attorneys[FEATURED_ATTORNEY.slug as AttorneySlug];

  return (
    <>
      <section className="relative overflow-hidden border-b border-[#c9a227]/15 bg-gradient-to-b from-[#0f1c2e] to-[#0a1220]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(201,162,39,0.12)_0%,_transparent_55%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a227]">
            {p.eyebrow}
          </p>
          <h1 className="mt-4 text-center font-serif text-4xl font-semibold tracking-[-0.02em] text-white sm:text-5xl lg:text-6xl">
            {p.title}
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-center text-base leading-relaxed text-[#b8c4d4] sm:text-lg">
            {p.intro}
          </p>
          <p className="mt-8 text-center font-serif text-2xl font-semibold uppercase tracking-[0.12em] text-[#c9a227] sm:text-3xl">
            {p.motto}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <FeaturedAttorney
          attorney={FEATURED_ATTORNEY}
          copy={featuredCopy}
          featuredLabel={p.featuredLabel}
        />
      </section>

      {OTHER_ATTORNEYS.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6 sm:pb-20">
          <h2 className="text-center font-serif text-2xl font-semibold text-white sm:text-3xl">
            {p.teamTitle}
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {OTHER_ATTORNEYS.map((attorney) => (
              <AttorneyCard
                key={attorney.slug}
                attorney={attorney}
                copy={messages.attorneys[attorney.slug]}
              />
            ))}
          </div>
        </section>
      )}

      <section className="border-t border-[#c9a227]/10 bg-[#0c1525]">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <h2 className="text-center font-serif text-2xl font-semibold text-white sm:text-3xl">
            {locale === "es" ? "Todo el equipo" : "The full team"}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-[#b8c4d4]">
            {locale === "es"
              ? "Abogados, analistas legales, especialistas médicos y paralegales — dedicados a su caso."
              : "Attorneys, legal analysts, medical specialists, and paralegals — all dedicated to your case."}
          </p>
          <div className="mt-10">
            <BgTeamWall />
          </div>
        </div>
      </section>

      <section className="border-t border-[#c9a227]/15 bg-[#060d18]">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <h2 className="font-serif text-3xl font-semibold text-white">{p.ctaTitle}</h2>
          <p className="mt-4 text-[#b8c4d4]">{p.ctaBody}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <BgLink
              href="/contact"
              className="inline-flex rounded-full bg-[#c9a227] px-8 py-3 font-semibold text-[#0a1220] transition hover:bg-[#dbb84a]"
            >
              {p.ctaButton}
            </BgLink>
            <a
              href={`tel:${BG_PHONE_E164}`}
              className="inline-flex rounded-full border border-[#c9a227]/50 px-8 py-3 font-semibold text-white transition hover:border-[#c9a227]"
            >
              {p.ctaPhone}: {BG_PHONE_DISPLAY}
            </a>
          </div>
          <a
            href={BG_WHATSAPP_URL}
            className="mt-6 inline-block text-sm text-[#c9a227] underline underline-offset-2"
            rel="noopener noreferrer"
            target="_blank"
          >
            WhatsApp 24/7
          </a>
        </div>
      </section>
    </>
  );
}
