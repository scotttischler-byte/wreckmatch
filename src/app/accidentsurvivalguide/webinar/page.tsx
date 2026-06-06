import type { Metadata } from "next";
import { GraduationCap } from "lucide-react";
import { AsgFunnelLink } from "@/components/accidentsurvivalguide/AsgFunnelLink";
import { AsgJsonLd } from "@/components/accidentsurvivalguide/AsgJsonLd";
import { WebinarSignupForm } from "@/components/accidentsurvivalguide/WebinarSignupForm";
import { asg, asgCn } from "@/components/accidentsurvivalguide/asg-ui";
import { getMessages } from "@/lib/i18n/get-messages";
import { getAsgLocale } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const w = getMessages(getAsgLocale()).webinarForm;
  return { title: w.metaTitle, description: w.metaDescription };
}

export default function WebinarPage() {
  const w = getMessages(getAsgLocale()).webinarForm;
  const f = getMessages(getAsgLocale()).funnel;

  return (
    <div className="bg-asg-page">
      <AsgJsonLd pageTitle={w.metaTitle} pageDescription={w.metaDescription} />

      <section className={asgCn(asg.sectionTight, "border-b border-asg-border/50 bg-gradient-to-b from-asg-navy to-asg-teal text-white")}>
        <div className={asgCn(asg.container, "grid gap-10 lg:grid-cols-2 lg:items-center")}>
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-asg-sky">
              <GraduationCap className="size-4" aria-hidden />
              {f.eyebrow}
            </p>
            <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight sm:text-4xl">{w.pageTitle}</h1>
            <p className="mt-4 text-base leading-relaxed text-asg-sky">{f.heroWebinarSchedule}</p>
            <p className="mt-4 text-sm leading-relaxed text-white/90">{f.masterclassBody}</p>
            <ul className="mt-6 space-y-3">
              {w.learnItems.map((item) => (
                <li key={item} className="flex gap-2 text-sm leading-relaxed text-white/90">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-asg-sage" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm font-semibold text-asg-sage">{w.noCostNote}</p>
          </div>

          <div className={asgCn(asg.cardPad, "bg-asg-surface text-asg-navy")} id="webinar-signup">
            <WebinarSignupForm variant="page" formName="asg-webinar-page" />
          </div>
        </div>
      </section>

      <section className={asgCn(asg.sectionTight, "text-center")}>
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
    </div>
  );
}
