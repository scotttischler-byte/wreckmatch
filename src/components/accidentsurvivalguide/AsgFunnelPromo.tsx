"use client";

import { Calendar, GraduationCap, Phone } from "lucide-react";
import { useAsgLocale } from "@/components/accidentsurvivalguide/AsgLocaleProvider";
import { AsgFunnelLink } from "@/components/accidentsurvivalguide/AsgFunnelLink";
import { asg, asgCn } from "@/components/accidentsurvivalguide/asg-ui";

type Variant = "full" | "compact";

export function AsgFunnelPromo({ variant = "full" }: { variant?: Variant }) {
  const { messages } = useAsgLocale();
  const f = messages.funnel;

  if (variant === "compact") {
    return (
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
        <AsgFunnelLink
          funnel="masterclass"
          utmMedium="promo_compact"
          className={asgCn(asg.btnPrimary, "gap-2 px-5")}
        >
          <GraduationCap className="size-4" aria-hidden />
          {f.masterclassCta}
        </AsgFunnelLink>
        <AsgFunnelLink
          funnel="bookCall"
          utmMedium="promo_compact"
          className={asgCn(asg.btnSecondary, "gap-2 px-5")}
        >
          <Phone className="size-4" aria-hidden />
          {f.bookCallCta}
        </AsgFunnelLink>
      </div>
    );
  }

  return (
    <section className={asgCn(asg.sectionTight, "border-y border-asg-border/50 bg-asg-elevated")}>
      <div className={asg.container}>
        <div className="mx-auto max-w-2xl text-center">
          <p className={asg.eyebrow}>{f.eyebrow}</p>
          <h2 className={asgCn(asg.h2, "mt-2")}>{f.title}</h2>
          <p className={asgCn(asg.body, "mt-3")}>{f.subtitle}</p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <article className={asgCn(asg.cardPad, "flex flex-col")}>
            <GraduationCap className="size-8 text-asg-teal" aria-hidden />
            <h3 className={asgCn(asg.h3, "mt-4")}>{f.masterclassTitle}</h3>
            <p className={asgCn(asg.bodySm, "mt-2 flex-1")}>{f.masterclassBody}</p>
            <p className={asgCn(asg.legal, "mt-3")}>{f.masterclassSchedule}</p>
            <AsgFunnelLink
              funnel="masterclass"
              utmMedium="promo_card"
              className={asgCn(asg.btnPrimary, "mt-5 w-full gap-2")}
            >
              {f.masterclassCta}
            </AsgFunnelLink>
            <AsgFunnelLink
              funnel="webinarConfirmed"
              utmMedium="promo_card_registered"
              className="mt-3 text-center text-xs font-medium text-asg-teal underline underline-offset-2"
            >
              {f.alreadyRegistered}
            </AsgFunnelLink>
          </article>

          <article className={asgCn(asg.cardPad, "flex flex-col")}>
            <Phone className="size-8 text-asg-sage" aria-hidden />
            <h3 className={asgCn(asg.h3, "mt-4")}>{f.bookCallTitle}</h3>
            <p className={asgCn(asg.bodySm, "mt-2 flex-1")}>{f.bookCallBody}</p>
            <p className={asgCn(asg.legal, "mt-3 flex items-center gap-1.5")}>
              <Calendar className="size-3.5 shrink-0" aria-hidden />
              {f.bookCallNote}
            </p>
            <AsgFunnelLink
              funnel="bookCall"
              utmMedium="promo_card"
              className={asgCn(asg.btnPrimary, "mt-5 w-full gap-2 bg-asg-sage hover:bg-asg-sage/90")}
            >
              {f.bookCallCta}
            </AsgFunnelLink>
            <AsgFunnelLink
              funnel="callConfirmed"
              utmMedium="promo_card_booked"
              className="mt-3 text-center text-xs font-medium text-asg-teal underline underline-offset-2"
            >
              {f.alreadyBooked}
            </AsgFunnelLink>
          </article>
        </div>
      </div>
    </section>
  );
}
