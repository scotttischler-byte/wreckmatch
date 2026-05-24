import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AsgLink } from "@/components/accidentsurvivalguide/AsgLink";
import { ALL_STATE_SLUGS } from "@/lib/asg/state-guides";
import { WRECKMATCH_URL, ASG_BASE_URL } from "@/lib/accidentsurvivalguide";
import { SurvivalGuideDownloadForm } from "@/components/accidentsurvivalguide/SurvivalGuideDownloadForm";
import { AsgJsonLd } from "@/components/accidentsurvivalguide/AsgJsonLd";
import { getMessages, formatMessage } from "@/lib/i18n/get-messages";
import { getLocalizedStateGuide } from "@/lib/i18n/state-guides-i18n";
import { getAsgLocale } from "@/lib/i18n/server";

type PageProps = { params: Promise<{ state: string }> };

export async function generateStaticParams() {
  return ALL_STATE_SLUGS.map((state) => ({ state }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { state } = await params;
  const locale = getAsgLocale();
  const guide = getLocalizedStateGuide(state, locale);
  const sp = getMessages(locale).statePage;
  if (!guide) return { title: sp.notFound };
  const canonical = `${ASG_BASE_URL}/${locale === "es" ? "es/" : ""}${state}`;
  return {
    title: guide.headline,
    description: guide.intro,
    alternates: { canonical },
  };
}

export default async function StateGuidePage({ params }: PageProps) {
  const { state } = await params;
  const locale = getAsgLocale();
  const guide = getLocalizedStateGuide(state, locale);
  const sp = getMessages(locale).statePage;

  if (!guide) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      <AsgJsonLd pageTitle={guide.headline} pageDescription={guide.intro} />

      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#5b8fa8]">
        {guide.name} · {guide.abbr}
      </p>
      <h1 className="mt-3 font-serif text-4xl font-semibold text-[#1a3a52]">{guide.headline}</h1>
      <p className="mt-6 text-[#5b6b7f] leading-relaxed">{guide.intro}</p>

      <ol className="mt-10 space-y-4">
        {guide.tips.map((tip, i) => (
          <li key={tip} className="flex gap-4 rounded-xl border border-[#c5dce8] bg-white p-5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#e8f4fa] text-sm font-semibold text-[#2a7a9b]">
              {i + 1}
            </span>
            <p className="text-[#4a6578] leading-relaxed">{tip}</p>
          </li>
        ))}
      </ol>

      <p className="mt-10 rounded-lg border border-[#d4e8dc] bg-[#f4faf8] p-5 text-sm text-[#5b6b7f] leading-relaxed">
        <strong className="text-[#1a3a52]">{sp.note}</strong> {guide.statuteNote}
      </p>

      <div className="mt-10 rounded-xl border border-[#c5dce8] bg-[#eef6fb] p-6">
        <h2 className="font-semibold text-[#1a3a52]">
          {formatMessage(sp.attorneyTitle, { state: guide.name })}
        </h2>
        <p className="mt-2 text-sm text-[#5b6b7f] leading-relaxed">{sp.attorneyBody}</p>
        <a
          href={WRECKMATCH_URL}
          className="mt-4 inline-flex rounded-full bg-[#2a7a9b] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#236884]"
          rel="noopener noreferrer"
        >
          {sp.exploreWreckmatch}
        </a>
      </div>

      <div className="mt-14">
        <SurvivalGuideDownloadForm />
      </div>

      <p className="mt-10">
        <AsgLink href="/resources" className="text-sm font-medium text-[#2a7a9b] underline underline-offset-2">
          {sp.back}
        </AsgLink>
      </p>
    </article>
  );
}
