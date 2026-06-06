import { ArrowRight, CheckCircle2, Clock, Heart } from "lucide-react";
import { AsgFunnelLink } from "@/components/accidentsurvivalguide/AsgFunnelLink";
import { AsgFunnelPromo } from "@/components/accidentsurvivalguide/AsgFunnelPromo";
import { AsgLink } from "@/components/accidentsurvivalguide/AsgLink";
import { HomeLeadMagnets } from "@/components/accidentsurvivalguide/HomeLeadMagnets";
import { asg, asgCn } from "@/components/accidentsurvivalguide/asg-ui";
import type { Messages } from "@/lib/i18n/get-messages";

export function AsgHomePage({ messages: m }: { messages: Messages }) {
  const h = m.home;

  return (
    <>
      <HomeLeadMagnets />

      <section className={asgCn(asg.sectionTight, "border-b border-asg-border/40 bg-asg-surface")}>
        <div className={asgCn(asg.container, "grid items-center gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12")}>
          <blockquote className={asg.cardPad}>
            <Heart className="size-6 text-asg-sage" aria-hidden />
            <p className={asgCn(asg.body, "mt-4 text-lg")}>&ldquo;{h.storyQuote}&rdquo;</p>
            <footer className="mt-4 text-sm font-medium text-asg-teal">{h.storyAttribution}</footer>
          </blockquote>
          <div>
            <h2 className={asg.h2}>{h.insideTitle}</h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {m.benefits.slice(0, 4).map((benefit) => (
                <li
                  key={benefit}
                  className="flex gap-3 rounded-lg border border-asg-border/60 bg-asg-page p-4"
                >
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-asg-sage" aria-hidden />
                  <span className={asg.bodySm}>{benefit}</span>
                </li>
              ))}
            </ul>
            <AsgLink href="/resources" className={asgCn(asg.btnSecondary, "mt-6 gap-2")}>
              {h.allResources}
              <ArrowRight className="size-4" aria-hidden />
            </AsgLink>
          </div>
        </div>
      </section>

      <section id="first-24-hours" className={asgCn(asg.section, "scroll-mt-20 bg-asg-page")}>
        <div className={asg.container}>
          <div className="flex items-center gap-3">
            <Clock className="size-7 text-asg-teal" aria-hidden />
            <h2 className={asg.h2}>{h.first24Title}</h2>
          </div>
          <p className={asgCn(asg.body, "mt-3 max-w-2xl")}>{h.first24Intro}</p>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2">
            {m.first24Steps.map((step, index) => (
              <li key={step.title} className={asg.cardPad}>
                <span className="text-xs font-bold uppercase tracking-wider text-asg-teal">
                  {h.stepLabel} {index + 1}
                </span>
                <h3 className="mt-2 font-semibold text-asg-navy">{step.title}</h3>
                <p className={asgCn(asg.bodySm, "mt-2")}>{step.body}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10 flex flex-wrap gap-3">
            <AsgLink href="/#common-mistakes" className={asg.btnSecondary}>
              {h.mistakesTitle}
            </AsgLink>
            <AsgLink href="/#your-rights" className={asg.btnSecondary}>
              {h.rightsTitle}
            </AsgLink>
            <AsgLink href="/blog" className={asg.btnSecondary}>
              {m.nav.blog}
            </AsgLink>
          </div>
        </div>
      </section>

      <section id="common-mistakes" className={asgCn(asg.section, "scroll-mt-20 bg-asg-elevated")}>
        <div className={asg.container}>
          <h2 className={asg.h2}>{h.mistakesTitle}</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {m.commonMistakes.map((item) => (
              <article key={item.title} className={asg.cardPad}>
                <h3 className="font-semibold text-asg-navy">{item.title}</h3>
                <p className={asgCn(asg.bodySm, "mt-2")}>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="your-rights" className={asgCn(asg.section, "scroll-mt-20 bg-asg-page")}>
        <div className={asg.container}>
          <h2 className={asg.h2}>{h.rightsTitle}</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {h.rightsCards.map((card) => (
              <article key={card.title} className={asg.cardPad}>
                <h3 className="font-semibold text-asg-navy">{card.title}</h3>
                <p className={asgCn(asg.bodySm, "mt-2")}>{card.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <AsgFunnelPromo />

      <section id="faq" className={asgCn(asg.section, "scroll-mt-20 border-t border-asg-border/60 bg-asg-surface")}>
        <div className={asg.containerNarrow}>
          <h2 className={asg.h2}>{h.faqTitle}</h2>
          <dl className="mt-8 divide-y divide-asg-border/60">
            {m.faq.map((item) => (
              <div key={item.question} className="py-5 first:pt-0 last:pb-0">
                <dt className="font-semibold text-asg-navy">{item.question}</dt>
                <dd className={asgCn(asg.bodySm, "mt-2")}>{item.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="bg-asg-navy py-14 text-white sm:py-16">
        <div className={asgCn(asg.containerNarrow, "text-center")}>
          <h2 className="font-serif text-2xl font-semibold sm:text-3xl">{h.helpTitle}</h2>
          <p className="mx-auto mt-3 max-w-lg text-base leading-relaxed text-asg-sky">{h.helpBody}</p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <AsgLink
              href="/webinar"
              className="inline-flex min-h-[48px] items-center rounded-lg bg-asg-sage px-6 text-sm font-semibold text-white transition hover:bg-asg-sage/90"
            >
              {h.visitWreckmatch}
            </AsgLink>
            <AsgFunnelLink
              funnel="bookCall"
              utmMedium="home_cta"
              className="inline-flex min-h-[48px] items-center rounded-lg border border-white/30 px-6 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              {h.bookCallCta}
            </AsgFunnelLink>
          </div>
        </div>
      </section>
    </>
  );
}
