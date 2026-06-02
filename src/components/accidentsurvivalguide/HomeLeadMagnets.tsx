"use client";

import { BookOpen, Calculator, Scale, ShieldCheck } from "lucide-react";
import { useAsgLocale } from "@/components/accidentsurvivalguide/AsgLocaleProvider";
import { CalculatorLeadForm } from "@/components/accidentsurvivalguide/CalculatorLeadForm";
import { SurvivalGuideDownloadForm } from "@/components/accidentsurvivalguide/SurvivalGuideDownloadForm";

export function HomeLeadMagnets() {
  const { messages } = useAsgLocale();
  const h = messages.home;

  return (
    <section
      id="get-help"
      className="relative scroll-mt-20 border-b border-[#c5dce8]/50 bg-[#f8fbfd]"
      aria-labelledby="home-hero-heading"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[#e8f4fa]/80 to-transparent" />

      <div className="relative mx-auto max-w-6xl px-4 pb-10 pt-6 sm:px-6 sm:pb-14 sm:pt-8">
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.22em] text-[#5a9a82] sm:text-xs">
            {h.leadMagnetsEyebrow}
          </p>
          <h1
            id="home-hero-heading"
            className="mt-3 font-serif text-[1.65rem] font-semibold leading-[1.12] tracking-[-0.03em] text-[#1a3a52] sm:text-4xl lg:text-[2.65rem]"
          >
            {h.heroTitle}
          </h1>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-[#5b6b7f] sm:mt-4 sm:text-lg">
            {h.leadMagnetsHeroLine}
          </p>
          <ul className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {[h.trustFree, h.trustFast, h.trustNoObligation].map((badge) => (
              <li
                key={badge}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#c5dce8] bg-white px-3 py-1 text-[0.7rem] font-semibold text-[#3d5568] shadow-sm sm:text-xs"
              >
                <ShieldCheck className="size-3.5 text-[#5a9a82]" aria-hidden />
                {badge}
              </li>
            ))}
          </ul>
        </header>

        <div
          role="note"
          className="mx-auto mt-5 max-w-4xl rounded-xl border border-amber-200 bg-amber-50/90 px-3 py-3 text-left text-[0.72rem] leading-relaxed text-amber-950 shadow-sm sm:mt-6 sm:rounded-2xl sm:px-5 sm:py-4 sm:text-sm sm:text-center"
        >
          <p className="font-semibold">{h.leadMagnetsDisclaimerTitle}</p>
          <p className="mt-1.5">{messages.disclaimer}</p>
          <p className="mt-1.5 text-[0.65rem] opacity-90 sm:text-xs">{h.leadMagnetsDisclaimerExtra}</p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 md:grid-cols-2 md:gap-5 lg:gap-6">
          <article className="flex min-h-0 flex-col overflow-hidden rounded-2xl border-2 border-[#2a7a9b]/80 bg-gradient-to-br from-[#1a3a52] to-[#2d6a85] shadow-[0_16px_40px_-12px_rgba(26,58,82,0.5)] sm:rounded-3xl md:border-[#2a7a9b]">
            <div className="border-b border-white/10 px-4 py-3 sm:px-5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-[#b8e6d4]">
                <Calculator className="size-3" aria-hidden />
                {h.calculatorBadge}
              </span>
            </div>
            <div className="flex flex-1 flex-col p-4 sm:p-5 md:p-6">
              <CalculatorLeadForm />
            </div>
          </article>

          <article
            id="download"
            className="scroll-mt-20 flex min-h-0 flex-col overflow-hidden rounded-2xl border-2 border-[#5a9a82]/70 bg-white shadow-[0_16px_40px_-12px_rgba(90,154,130,0.35)] sm:rounded-3xl"
          >
            <div className="border-b border-[#e8f4fa] bg-gradient-to-r from-[#f4faf8] to-white px-4 py-3 sm:px-5">
              <div className="flex items-start gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#e8f4fa] text-[#2a7a9b] sm:size-12">
                  <BookOpen className="size-5 sm:size-6" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <span className="inline-flex items-center rounded-full bg-[#e8f4fa] px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-[#2a7a9b]">
                    {h.guideBadge}
                  </span>
                  <h2 className="mt-1.5 font-serif text-xl font-bold leading-tight text-[#1a3a52] sm:text-2xl">
                    {h.guideCardTitle}
                  </h2>
                  <p className="mt-1 text-[0.8rem] leading-snug text-[#5b6b7f] sm:text-sm">
                    {h.guideCardSubtitle}
                  </p>
                </div>
              </div>
            </div>
            <p
              role="note"
              className="mx-4 mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[0.68rem] leading-relaxed text-amber-950 sm:mx-5 sm:text-xs"
            >
              {h.guideCardDisclaimer}
            </p>
            <div className="flex flex-1 flex-col border-t border-[#eef6fb]">
              <SurvivalGuideDownloadForm embedded headline="checklist" />
            </div>
          </article>
        </div>

        <p className="mx-auto mt-6 flex max-w-3xl items-start gap-2 px-1 text-[0.68rem] leading-relaxed text-[#7a8a98] sm:mt-8 sm:justify-center sm:text-center sm:text-xs">
          <Scale className="mt-0.5 size-3.5 shrink-0 text-[#5b8fa8] sm:size-4" aria-hidden />
          <span>{h.leadMagnetsFooterLegal}</span>
        </p>
      </div>
    </section>
  );
}
