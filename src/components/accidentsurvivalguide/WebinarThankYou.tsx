"use client";

import { useEffect } from "react";
import { Calendar, CheckCircle2 } from "lucide-react";
import { AsgFunnelLink } from "@/components/accidentsurvivalguide/AsgFunnelLink";
import { AsgLink } from "@/components/accidentsurvivalguide/AsgLink";
import { useAsgLocale } from "@/components/accidentsurvivalguide/AsgLocaleProvider";
import { asg, asgCn } from "@/components/accidentsurvivalguide/asg-ui";
import { formatMessage } from "@/lib/i18n/get-messages";
import { trackAsgEvent } from "@/lib/analytics";

type Props = {
  email: string;
  firstName?: string;
};

export function WebinarThankYou({ email, firstName }: Props) {
  const { messages } = useAsgLocale();
  const w = messages.webinarForm;
  const greeting = firstName?.trim() || w.there;

  useEffect(() => {
    trackAsgEvent("thank_you_view", { type: "webinar" });
  }, []);

  return (
    <section className={asgCn(asg.containerNarrow, "py-12 sm:py-20")}>
      <div className={asgCn(asg.cardPad, "text-center")}>
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-asg-elevated text-asg-teal">
          <CheckCircle2 className="size-9" aria-hidden />
        </div>
        <p className={asgCn(asg.eyebrow, "mt-4")}>{w.thankYouEyebrow}</p>
        <h1 className={asgCn(asg.h1, "mt-3 text-3xl sm:text-4xl")}>{w.thankYouTitle}</h1>
        <p className={asgCn(asg.body, "mx-auto mt-5 max-w-xl")}>
          {formatMessage(w.thankYouBody, { name: greeting, email })}
        </p>
        <p className={asgCn(asg.bodySm, "mx-auto mt-4 max-w-lg")}>{w.thankYouReminder}</p>
        <p className={asgCn(asg.legal, "mt-4 flex items-center justify-center gap-2")}>
          <Calendar className="size-4 shrink-0 text-asg-teal" aria-hidden />
          {messages.funnel.masterclassSchedule}
        </p>
      </div>

      <div className={asgCn(asg.cardPad, "mt-8 text-center")}>
        <h2 className={asg.h3}>{w.thankYouNextTitle}</h2>
        <p className={asgCn(asg.bodySm, "mt-2")}>{w.thankYouNextBody}</p>
        <AsgFunnelLink
          funnel="bookCall"
          utmMedium="webinar_thank_you"
          className={asgCn(asg.btnPrimary, "mt-5 gap-2 bg-asg-sage hover:bg-asg-sage/90")}
        >
          {messages.funnel.bookCallCta}
        </AsgFunnelLink>
      </div>

      <p className="mt-10 text-center">
        <AsgLink href="/" className="text-sm font-medium text-asg-teal underline underline-offset-2">
          {w.backHome}
        </AsgLink>
      </p>
    </section>
  );
}
