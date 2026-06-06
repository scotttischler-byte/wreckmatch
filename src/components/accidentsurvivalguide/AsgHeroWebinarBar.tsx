"use client";

import { GraduationCap, Phone } from "lucide-react";
import { AsgFounderCard } from "@/components/accidentsurvivalguide/AsgFounderCard";
import { useAsgLocale } from "@/components/accidentsurvivalguide/AsgLocaleProvider";
import { AsgFunnelLink } from "@/components/accidentsurvivalguide/AsgFunnelLink";
import { AsgLink } from "@/components/accidentsurvivalguide/AsgLink";
import { AsgTrustStrip } from "@/components/accidentsurvivalguide/AsgTrustStrip";
import { WebinarSignupForm } from "@/components/accidentsurvivalguide/WebinarSignupForm";

/** Above-the-fold webinar signup with Scott as host — homepage hero. */
export function AsgHeroWebinarBar() {
  const { messages, href } = useAsgLocale();
  const f = messages.funnel;
  const founder = messages.founder;

  return (
    <div className="mx-auto mt-8 max-w-5xl overflow-hidden rounded-3xl border border-asg-teal/25 bg-gradient-to-br from-asg-navy-deep via-asg-navy to-[#1e5f7a] shadow-xl shadow-asg-navy/20">
      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <div className="border-b border-white/10 p-5 sm:p-6 lg:border-b-0 lg:border-r">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-asg-sage">
            <GraduationCap className="size-4 shrink-0" aria-hidden />
            {f.eyebrow}
          </p>

          <div className="mt-5">
            <AsgFounderCard variant="dark" showQuote={false} />
          </div>

          <p className="mt-4 text-sm leading-relaxed text-white/90">{founder.webinarIntro}</p>
          <p className="mt-3 font-serif text-lg font-semibold leading-snug text-white sm:text-xl">
            {f.heroWebinarTitle}
          </p>
          <p className="mt-2 text-sm font-medium text-asg-sky">{f.heroWebinarSchedule}</p>
          <p className="mt-3 text-sm font-semibold text-asg-sage">{messages.webinarForm.noCostNote}</p>

          <div className="mt-5">
            <AsgTrustStrip variant="dark" />
          </div>

          <div className="mt-5 flex flex-wrap gap-4">
            <AsgFunnelLink
              funnel="bookCall"
              utmMedium="hero_webinar_bar"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white underline underline-offset-2 hover:text-asg-sky"
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

        <div className="bg-white/[0.07] p-5 backdrop-blur-sm sm:p-6">
          <p className="mb-1 text-sm font-semibold text-white">{messages.webinarForm.heroFormTitle}</p>
          <p className="mb-4 text-xs text-asg-sky">{messages.webinarForm.formSubtitle}</p>
          <WebinarSignupForm variant="hero" formName="asg-webinar-hero" />
        </div>
      </div>
    </div>
  );
}
