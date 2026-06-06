"use client";

import { GraduationCap, Phone } from "lucide-react";
import { useAsgLocale } from "@/components/accidentsurvivalguide/AsgLocaleProvider";
import { AsgFunnelLink } from "@/components/accidentsurvivalguide/AsgFunnelLink";
import { AsgLink } from "@/components/accidentsurvivalguide/AsgLink";
import { WebinarSignupForm } from "@/components/accidentsurvivalguide/WebinarSignupForm";

/** Above-the-fold webinar signup + book-call promo on the homepage hero. */
export function AsgHeroWebinarBar() {
  const { messages, href } = useAsgLocale();
  const f = messages.funnel;

  return (
    <div className="mx-auto mt-8 max-w-4xl overflow-hidden rounded-2xl border-2 border-asg-teal/40 bg-gradient-to-br from-asg-navy via-asg-navy to-asg-teal shadow-lg">
      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1fr_1.05fr] lg:items-start">
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
          <p className="mt-4 text-sm font-semibold text-asg-sage">{messages.webinarForm.noCostNote}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <AsgFunnelLink
              funnel="bookCall"
              utmMedium="hero_webinar_bar"
              className="inline-flex min-h-[40px] items-center gap-2 text-sm font-semibold text-white underline underline-offset-2 hover:text-asg-sky"
            >
              <Phone className="size-4" aria-hidden />
              {f.bookCallCta}
            </AsgFunnelLink>
            <AsgLink
              href={href("/webinar")}
              className="text-sm font-medium text-asg-sky underline underline-offset-2 hover:text-white"
            >
              {f.heroWebinarFullPage}
            </AsgLink>
          </div>
        </div>

        <div className="rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm sm:p-5">
          <p className="mb-3 text-sm font-semibold text-white">{messages.webinarForm.heroFormTitle}</p>
          <WebinarSignupForm variant="hero" formName="asg-webinar-hero" />
        </div>
      </div>
    </div>
  );
}
