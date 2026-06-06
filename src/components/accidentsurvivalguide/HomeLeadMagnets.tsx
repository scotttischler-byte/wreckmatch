"use client";

import { useState } from "react";
import { BookOpen, Calculator, Headphones, Scale, ShieldCheck } from "lucide-react";
import { useAsgLocale } from "@/components/accidentsurvivalguide/AsgLocaleProvider";
import { CalculatorLeadForm } from "@/components/accidentsurvivalguide/CalculatorLeadForm";
import { ExpertIntakeBanner } from "@/components/accidentsurvivalguide/ExpertIntakeForm";
import { SurvivalGuideDownloadForm } from "@/components/accidentsurvivalguide/SurvivalGuideDownloadForm";
import { cn } from "@/lib/utils";

type MobileTab = "calculator" | "guide" | "expert";

export function HomeLeadMagnets() {
  const { messages } = useAsgLocale();
  const h = messages.home;
  const [mobileTab, setMobileTab] = useState<MobileTab>("calculator");

  const mobileTabs: { id: MobileTab; label: string; icon: typeof Calculator }[] = [
    { id: "calculator", label: h.mobileTabCalculator, icon: Calculator },
    { id: "guide", label: h.mobileTabGuide, icon: BookOpen },
    { id: "expert", label: h.mobileTabExpert, icon: Headphones },
  ];

  return (
    <section
      id="get-help"
      className="relative scroll-mt-24 border-b border-[#c5dce8]/50 bg-[#f8fbfd]"
      aria-labelledby="home-hero-heading"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[#e8f4fa]/80 to-transparent" />

      <div className="relative mx-auto max-w-6xl px-4 pb-10 pt-6 sm:px-6 sm:pb-14 sm:pt-8">
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#5a9a82]">
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
                className="inline-flex items-center gap-1.5 rounded-full border border-[#c5dce8] bg-white px-3 py-1.5 text-xs font-semibold text-[#3d5568] shadow-sm"
              >
                <ShieldCheck className="size-3.5 text-[#5a9a82]" aria-hidden />
                {badge}
              </li>
            ))}
          </ul>
        </header>

        <div
          role="note"
          className="mx-auto mt-5 max-w-4xl rounded-xl border border-amber-200 bg-amber-50/90 px-3 py-3 text-left text-xs leading-relaxed text-amber-950 shadow-sm sm:mt-6 sm:rounded-2xl sm:px-5 sm:py-4 sm:text-center sm:text-sm"
        >
          <p className="font-semibold">{h.leadMagnetsDisclaimerTitle}</p>
          <p className="mt-1.5">{messages.disclaimer}</p>
          <p className="mt-1.5 text-xs opacity-90">{h.leadMagnetsDisclaimerExtra}</p>
        </div>

        <div id="asg-hero-end" className="h-px w-full" aria-hidden />

        <div
          role="tablist"
          aria-label={h.leadMagnetsTitle}
          className="mt-6 flex gap-2 lg:hidden"
        >
          {mobileTabs.map(({ id, label, icon: Icon }) => {
            const selected = mobileTab === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                id={`tab-${id}`}
                aria-selected={selected}
                aria-controls={`panel-${id}`}
                onClick={() => setMobileTab(id)}
                className={cn(
                  "flex min-h-[48px] flex-1 flex-col items-center justify-center gap-1 rounded-xl border px-2 py-2.5 text-center text-xs font-semibold transition active:scale-[0.98]",
                  selected
                    ? "border-[#2a7a9b] bg-[#2a7a9b] text-white shadow-md"
                    : "border-[#c5dce8] bg-white text-[#3d5568] shadow-sm",
                )}
              >
                <Icon className="size-4 shrink-0" aria-hidden />
                <span className="leading-tight">{label}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:mt-8 lg:grid-cols-2 lg:gap-6">
          <article
            id="panel-calculator"
            role="tabpanel"
            aria-labelledby="tab-calculator"
            className={cn(
              "flex min-h-0 flex-col overflow-hidden rounded-2xl border-2 border-[#2a7a9b]/80 bg-gradient-to-br from-[#1a3a52] to-[#2d6a85] shadow-[0_16px_40px_-12px_rgba(26,58,82,0.5)] sm:rounded-3xl",
              mobileTab !== "calculator" && "hidden lg:flex",
            )}
          >
            <div className="border-b border-white/10 px-4 py-3 sm:px-5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-[#b8e6d4]">
                <Calculator className="size-3" aria-hidden />
                {h.calculatorBadge}
              </span>
            </div>
            <div className="flex flex-1 flex-col p-4 sm:p-5 lg:p-6">
              <CalculatorLeadForm />
            </div>
          </article>

          <article
            id="download"
            role="tabpanel"
            aria-labelledby="tab-guide"
            className={cn(
              "scroll-mt-24 flex min-h-0 flex-col overflow-hidden rounded-2xl border-2 border-[#5a9a82]/70 bg-white shadow-[0_16px_40px_-12px_rgba(90,154,130,0.35)] sm:rounded-3xl",
              mobileTab !== "guide" && "hidden lg:flex",
            )}
          >
            <div className="border-b border-[#e8f4fa] bg-gradient-to-r from-[#f4faf8] to-white px-4 py-3 sm:px-5">
              <div className="flex items-start gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#e8f4fa] text-[#2a7a9b] sm:size-12">
                  <BookOpen className="size-5 sm:size-6" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <span className="inline-flex items-center rounded-full bg-[#e8f4fa] px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-[#2a7a9b]">
                    {h.guideBadge}
                  </span>
                  <h2 className="mt-1.5 font-serif text-xl font-bold leading-tight text-[#1a3a52] sm:text-2xl">
                    {h.guideCardTitle}
                  </h2>
                  <p className="mt-1 text-sm leading-snug text-[#5b6b7f]">
                    {h.guideCardSubtitle}
                  </p>
                </div>
              </div>
            </div>
            <p
              role="note"
              className="mx-4 mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-950 sm:mx-5"
            >
              {h.guideCardDisclaimer}
            </p>
            <div className="flex flex-1 flex-col border-t border-[#eef6fb]">
              <SurvivalGuideDownloadForm embedded headline="checklist" />
            </div>
          </article>
        </div>

        <div
          id="panel-expert"
          role="tabpanel"
          aria-labelledby="tab-expert"
          className={cn("mt-6 lg:mt-8", mobileTab !== "expert" && "hidden lg:block")}
        >
          <ExpertIntakeBanner />
        </div>

        <p className="mx-auto mt-6 flex max-w-3xl items-start gap-2 px-1 text-xs leading-relaxed text-[#7a8a98] sm:mt-8 sm:justify-center sm:text-center">
          <Scale className="mt-0.5 size-4 shrink-0 text-[#5b8fa8]" aria-hidden />
          <span>{h.leadMagnetsFooterLegal}</span>
        </p>
      </div>
    </section>
  );
}
