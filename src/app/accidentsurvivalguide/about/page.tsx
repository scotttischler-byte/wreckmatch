import type { Metadata } from "next";
import { AsgLink } from "@/components/accidentsurvivalguide/AsgLink";
import { SurvivalGuideDownloadForm } from "@/components/accidentsurvivalguide/SurvivalGuideDownloadForm";
import { AsgJsonLd } from "@/components/accidentsurvivalguide/AsgJsonLd";
import { WRECKMATCH_URL } from "@/lib/accidentsurvivalguide";
import { getMessages } from "@/lib/i18n/get-messages";
import { getAsgLocale } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const m = getMessages(getAsgLocale()).about;
  return { title: m.metaTitle, description: m.metaDescription };
}

export default function AboutPage() {
  const locale = getAsgLocale();
  const a = getMessages(locale).about;

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      <AsgJsonLd pageTitle={a.metaTitle} pageDescription={a.metaDescription} />

      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#5b8fa8]">{a.eyebrow}</p>
      <h1 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.02em] text-[#1a3a52]">
        {a.title}
      </h1>

      <div className="mt-10 space-y-6 text-[#4a6578] leading-relaxed">
        <p>{a.p1}</p>
        <p>{a.p2}</p>
        <p>{a.p3}</p>
        <p>
          {a.p4Before}{" "}
          <strong className="font-medium text-[#1a3a52]">WreckMatch LLC</strong>
          {a.p4After}{" "}
          <a
            href={WRECKMATCH_URL}
            className="font-medium text-[#2a7a9b] underline underline-offset-2"
            rel="noopener noreferrer"
          >
            WreckMatch
          </a>{" "}
          {a.p4End}
        </p>
        <p className="text-sm text-[#7a8a98]">{a.signature}</p>
      </div>

      <div className="mt-14">
        <SurvivalGuideDownloadForm />
      </div>

      <p className="mt-10">
        <AsgLink href="/" className="text-sm font-medium text-[#2a7a9b] underline underline-offset-2">
          {a.back}
        </AsgLink>
      </p>
    </article>
  );
}
