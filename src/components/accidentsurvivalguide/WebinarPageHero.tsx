"use client";

import { GraduationCap } from "lucide-react";
import { AsgFounderCard } from "@/components/accidentsurvivalguide/AsgFounderCard";
import { AsgFunnelLink } from "@/components/accidentsurvivalguide/AsgFunnelLink";
import { AsgTrustStrip } from "@/components/accidentsurvivalguide/AsgTrustStrip";
import { WebinarSignupForm } from "@/components/accidentsurvivalguide/WebinarSignupForm";
import { useAsgLocale } from "@/components/accidentsurvivalguide/AsgLocaleProvider";
import { asg, asgCn } from "@/components/accidentsurvivalguide/asg-ui";

export function WebinarPageHero() {
  const { messages } = useAsgLocale();
  const w = messages.webinarForm;
  const f = messages.funnel;
  const founder = messages.founder;

  return (
    <>
      <section className="border-b border-asg-border/40 bg-gradient-to-b from-asg-navy-deep via-asg-navy to-[#1e5f7a] text-white">
        <div className={asgCn(asg.container, "grid gap-10 py-12 sm:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-12")}>
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-asg-sage">
              <GraduationCap className="size-4" aria-hidden />
              {f.eyebrow}
            </p>
            <h1 className="mt-4 font-serif text-3xl font-semibold leading-tight sm:text-4xl lg:text-[2.5rem]">
              {w.pageTitle}
            </h1>
            <p className="mt-4 text-base font-medium text-asg-sky">{f.heroWebinarSchedule}</p>

            <div className={asgCn(asg.cardSoft, "mt-8 border-white/10 bg-white/5 p-5 backdrop-blur-sm")}>
              <AsgFounderCard variant="dark" />
            </div>

            <p className="mt-6 text-sm leading-relaxed text-white/90">{founder.webinarIntro}</p>
            <ul className="mt-6 space-y-3">
              {w.learnItems.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-white/90">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-asg-sage" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm font-semibold text-asg-sage">{w.noCostNote}</p>
            <div className="mt-6">
              <AsgTrustStrip variant="dark" />
            </div>
          </div>

          <div className={asgCn(asg.cardElevated, "sticky top-24 text-asg-navy shadow-2xl shadow-asg-navy/15")} id="webinar-signup">
            <WebinarSignupForm variant="page" formName="asg-webinar-page" />
          </div>
        </div>
      </section>

      <section className={asgCn(asg.sectionTight, "border-b border-asg-border/40 bg-asg-surface text-center")}>
        <div className={asg.containerNarrow}>
          <p className={asg.bodySm}>{w.alreadyRegistered}</p>
          <AsgFunnelLink
            funnel="webinarConfirmed"
            utmMedium="webinar_page"
            className="mt-2 inline-block text-sm font-semibold text-asg-teal underline underline-offset-2"
          >
            {f.alreadyRegistered}
          </AsgFunnelLink>
        </div>
      </section>
    </>
  );
}
