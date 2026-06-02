"use client";

import { BookOpen, Scale } from "lucide-react";
import { useAsgLocale } from "@/components/accidentsurvivalguide/AsgLocaleProvider";
import { CalculatorLeadForm } from "@/components/accidentsurvivalguide/CalculatorLeadForm";
import { SurvivalGuideDownloadForm } from "@/components/accidentsurvivalguide/SurvivalGuideDownloadForm";

export function HomeLeadMagnets() {
  const { messages } = useAsgLocale();
  const h = messages.home;

  return (
    <section
      id="get-help"
      className="scroll-mt-24 border-b border-[#c5dce8]/60 bg-gradient-to-b from-white via-[#f4faf8] to-[#eef6fb] py-12 sm:py-16"
      aria-labelledby="lead-magnets-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#5a9a82]">
            {h.leadMagnetsEyebrow}
          </p>
          <h2
            id="lead-magnets-heading"
            className="mt-3 font-serif text-3xl font-semibold text-[#1a3a52] sm:text-4xl"
          >
            {h.leadMagnetsTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-[#5b6b7f]">
            {h.leadMagnetsSubtitle}
          </p>
        </div>

        <div
          role="note"
          className="mx-auto mt-6 max-w-4xl rounded-xl border-2 border-amber-300 bg-amber-50 px-4 py-4 text-center text-sm leading-relaxed text-amber-950"
        >
          <strong className="font-semibold">{h.leadMagnetsDisclaimerTitle}</strong>
          <p className="mt-2">{messages.disclaimer}</p>
          <p className="mt-2 text-xs">{h.leadMagnetsDisclaimerExtra}</p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:items-stretch lg:gap-8">
          <div className="flex flex-col rounded-3xl border-4 border-[#2a7a9b] bg-gradient-to-br from-[#1a3a52] via-[#234d66] to-[#2a7a9b] p-6 shadow-[0_24px_60px_-20px_rgba(26,58,82,0.45)] sm:p-8">
            <CalculatorLeadForm />
          </div>

          <div
            id="download"
            className="scroll-mt-24 flex flex-col rounded-3xl border-4 border-[#5a9a82] bg-gradient-to-br from-[#f4faf8] to-white p-2 shadow-[0_24px_60px_-20px_rgba(90,154,130,0.35)] sm:p-3"
          >
            <div className="mb-3 flex items-center gap-3 px-4 pt-4 sm:px-5">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#e8f4fa] text-[#2a7a9b]">
                <BookOpen className="size-6" aria-hidden />
              </span>
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#1a3a52] sm:text-3xl">
                  {h.guideCardTitle}
                </h2>
                <p className="mt-1 text-sm text-[#5b6b7f]">{h.guideCardSubtitle}</p>
              </div>
            </div>
            <p
              role="note"
              className="mx-4 mb-2 rounded-lg border border-amber-300/80 bg-amber-50 px-3 py-2.5 text-xs leading-relaxed text-amber-950 sm:mx-5"
            >
              {h.guideCardDisclaimer}
            </p>
            <div className="flex flex-1 flex-col rounded-2xl bg-white">
              <SurvivalGuideDownloadForm embedded headline="checklist" />
            </div>
          </div>
        </div>

        <p className="mx-auto mt-8 flex max-w-3xl items-start justify-center gap-2 text-center text-xs leading-relaxed text-[#7a8a98]">
          <Scale className="mt-0.5 size-4 shrink-0 text-[#5b8fa8]" aria-hidden />
          {h.leadMagnetsFooterLegal}
        </p>
      </div>
    </section>
  );
}
