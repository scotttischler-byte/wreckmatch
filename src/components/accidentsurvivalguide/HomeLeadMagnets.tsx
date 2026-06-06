"use client";

import { useState } from "react";
import { BookOpen, Calculator, Headphones } from "lucide-react";
import { AsgHeroWebinarBar } from "@/components/accidentsurvivalguide/AsgHeroWebinarBar";
import { AsgTrustStrip } from "@/components/accidentsurvivalguide/AsgTrustStrip";
import { useAsgLocale } from "@/components/accidentsurvivalguide/AsgLocaleProvider";
import { CalculatorLeadForm } from "@/components/accidentsurvivalguide/CalculatorLeadForm";
import { ExpertIntakeBanner } from "@/components/accidentsurvivalguide/ExpertIntakeForm";
import { SurvivalGuideDownloadForm } from "@/components/accidentsurvivalguide/SurvivalGuideDownloadForm";
import { asg, asgCn } from "@/components/accidentsurvivalguide/asg-ui";
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
      className="relative scroll-mt-20 border-b border-asg-border/40"
      aria-labelledby="home-hero-heading"
    >
      <div className={asgCn(asg.container, "relative pb-12 pt-8 sm:pb-16 sm:pt-12")}>
        <header className="mx-auto max-w-2xl text-center">
          <p className={asg.eyebrow}>{h.leadMagnetsEyebrow}</p>
          <h1 id="home-hero-heading" className={asgCn(asg.h1, "mt-3")}>
            {h.heroTitle}
          </h1>
          <p className={asgCn(asg.body, "mt-4 text-lg sm:mt-5")}>{h.leadMagnetsHeroLine}</p>
          <div className="mt-5">
            <AsgTrustStrip variant="inline" />
          </div>
        </header>

        <AsgHeroWebinarBar />

        <p className={asgCn(asg.legal, "mx-auto mt-6 max-w-2xl text-center text-asg-subtle/90")}>
          {messages.disclaimer}
        </p>

        <div id="asg-hero-end" className="h-px w-full" aria-hidden />

        <p className={asgCn(asg.eyebrow, "mt-10 text-center")}>{h.leadMagnetsEyebrow}</p>
        <h2 className={asgCn(asg.h2, "mt-2 text-center")}>{h.leadMagnetsTitle}</h2>

        <div role="tablist" aria-label={h.leadMagnetsTitle} className="mt-6 flex gap-2 lg:hidden">
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
                  "flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-lg border px-2 py-2.5 text-center text-xs font-semibold transition active:scale-[0.98]",
                  selected
                    ? "border-asg-teal bg-asg-teal text-white shadow-sm"
                    : "border-asg-border bg-asg-surface text-asg-muted",
                )}
              >
                <Icon className="size-4 shrink-0" aria-hidden />
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:mt-10 lg:grid-cols-2">
          <article
            id="panel-calculator"
            role="tabpanel"
            aria-labelledby="tab-calculator"
            className={cn(
              "overflow-hidden rounded-2xl border border-asg-border/70 bg-asg-surface shadow-md shadow-asg-navy/[0.04]",
              mobileTab !== "calculator" && "hidden lg:block",
            )}
          >
            <div className="border-b border-asg-border bg-asg-navy px-5 py-4 text-white">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-asg-sky">
                <Calculator className="size-3.5" aria-hidden />
                {h.calculatorBadge}
              </span>
            </div>
            <div className="bg-asg-navy px-5 pb-5 pt-0">
              <CalculatorLeadForm />
            </div>
          </article>

          <article
            id="download"
            role="tabpanel"
            aria-labelledby="tab-guide"
            className={cn(
              "scroll-mt-24 overflow-hidden rounded-2xl border border-asg-border/70 bg-asg-surface shadow-md shadow-asg-navy/[0.04]",
              mobileTab !== "guide" && "hidden lg:block",
            )}
          >
            <div className="border-b border-asg-border px-5 py-4">
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-asg-elevated text-asg-teal">
                  <BookOpen className="size-5" aria-hidden />
                </span>
                <div className="min-w-0">
                  <span className={asg.eyebrow}>{h.guideBadge}</span>
                  <h2 className={asgCn(asg.h3, "mt-1")}>{h.guideCardTitle}</h2>
                  <p className={asgCn(asg.bodySm, "mt-1")}>{h.guideCardSubtitle}</p>
                </div>
              </div>
            </div>
            <div className="px-5 pb-5 pt-4">
              <SurvivalGuideDownloadForm embedded headline="checklist" />
            </div>
          </article>
        </div>

        <div
          id="panel-expert"
          role="tabpanel"
          aria-labelledby="tab-expert"
          className={cn("mt-6", mobileTab !== "expert" && "hidden lg:block")}
        >
          <ExpertIntakeBanner />
        </div>

        <p className={asgCn(asg.legal, "mx-auto mt-8 max-w-2xl text-center")}>
          {h.leadMagnetsFooterLegal}
        </p>
      </div>
    </section>
  );
}
