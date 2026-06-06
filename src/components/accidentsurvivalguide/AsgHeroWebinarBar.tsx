"use client";

import { GraduationCap, Phone } from "lucide-react";
import { useAsgLocale } from "@/components/accidentsurvivalguide/AsgLocaleProvider";
import { AsgFunnelLink } from "@/components/accidentsurvivalguide/AsgFunnelLink";
/** Above-the-fold webinar + book-call promo on the homepage hero. */
export function AsgHeroWebinarBar() {
  const { messages } = useAsgLocale();
  const f = messages.funnel;

  return (
    <div className="mx-auto mt-8 max-w-3xl overflow-hidden rounded-2xl border-2 border-asg-teal/40 bg-gradient-to-br from-asg-navy via-asg-navy to-asg-teal shadow-lg">
      <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-asg-sky">
            <GraduationCap className="size-4 shrink-0" aria-hidden />
            {f.eyebrow}
          </p>
          <p className="mt-2 font-serif text-lg font-semibold leading-snug text-white sm:text-xl">
            {f.heroWebinarTitle}
          </p>
          <p className="mt-2 text-sm font-medium text-asg-sky">{f.heroWebinarSchedule}</p>
          <p className="mt-2 text-sm leading-relaxed text-white/85">{f.masterclassBody}</p>
        </div>

        <div className="flex shrink-0 flex-col gap-2.5 sm:min-w-[200px]">
          <AsgFunnelLink
            funnel="masterclass"
            utmMedium="hero_webinar_bar"
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-asg-sage px-5 text-sm font-semibold text-white transition hover:bg-asg-sage/90"
          >
            <GraduationCap className="size-4" aria-hidden />
            {f.masterclassCta}
          </AsgFunnelLink>
          <AsgFunnelLink
            funnel="bookCall"
            utmMedium="hero_webinar_bar"
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-white/30 px-5 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            <Phone className="size-4" aria-hidden />
            {f.bookCallCta}
          </AsgFunnelLink>
          <AsgFunnelLink
            funnel="webinarConfirmed"
            utmMedium="hero_webinar_bar"
            className="text-center text-xs font-medium text-asg-sky underline underline-offset-2 hover:text-white"
          >
            {f.heroWebinarAlreadyRegistered}
          </AsgFunnelLink>
        </div>
      </div>
    </div>
  );
}
