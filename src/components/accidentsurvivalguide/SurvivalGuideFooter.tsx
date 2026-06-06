"use client";

import { SurvivalGuideDisclaimer } from "@/components/SurvivalGuideDisclaimer";
import { AsgLink } from "@/components/accidentsurvivalguide/AsgLink";
import { useAsgLocale } from "@/components/accidentsurvivalguide/AsgLocaleProvider";
import { asg, asgCn } from "@/components/accidentsurvivalguide/asg-ui";
import { SUPPORT_PHONE_DISPLAY, SUPPORT_PHONE_E164 } from "@/lib/constants";
import { WRECKMATCH_URL } from "@/lib/accidentsurvivalguide";

export function SurvivalGuideFooter() {
  const { messages } = useAsgLocale();
  const f = messages.footer;

  return (
    <footer className="border-t border-asg-border/70 bg-asg-elevated py-14">
      <div className={asg.container}>
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="font-serif text-lg font-semibold text-asg-navy">{messages.meta.siteName}</p>
            <p className={asgCn(asg.bodySm, "mt-3")}>{f.tagline}</p>
          </div>

          <nav aria-label={f.navAria} className="text-sm">
            <p className="font-semibold text-asg-navy">{f.explore}</p>
            <ul className={asgCn(asg.bodySm, "mt-3 space-y-2")}>
              <li>
                <AsgLink href="/resources" className="hover:text-asg-teal">
                  {f.freeResources}
                </AsgLink>
              </li>
              <li>
                <AsgLink href="/blog" className="hover:text-asg-teal">
                  {messages.nav.blog}
                </AsgLink>
              </li>
              <li>
                <AsgLink href="/about" className="hover:text-asg-teal">
                  {f.aboutScott}
                </AsgLink>
              </li>
              <li>
                <a href={WRECKMATCH_URL} className="hover:text-asg-teal" rel="noopener noreferrer">
                  {f.attorneyMatch}
                </a>
              </li>
            </ul>
          </nav>

          <div className={asg.bodySm}>
            <p className="font-semibold text-asg-navy">WreckMatch LLC</p>
            <p className="mt-3 leading-relaxed">
              832 Saint Augustine Road
              <br />
              Colgate, WI 53017
            </p>
            <p className="mt-2">
              <a href={`tel:${SUPPORT_PHONE_E164}`} className="font-medium text-asg-teal hover:underline">
                {SUPPORT_PHONE_DISPLAY}
              </a>
            </p>
            <p className="mt-3">
              <AsgLink href="/privacy-policy" className="underline underline-offset-2 hover:text-asg-teal">
                {f.privacy}
              </AsgLink>
              {" · "}
              <AsgLink href="/terms" className="underline underline-offset-2 hover:text-asg-teal">
                {f.terms}
              </AsgLink>
            </p>
          </div>
        </div>

        <div className="mt-10 space-y-4 border-t border-asg-border/60 pt-8">
          <SurvivalGuideDisclaimer variant="footer" text={messages.disclaimer} />
          <p className={asg.legal}>{f.feeDisclaimer}</p>
          <p className={asg.legal}>
            &copy; {new Date().getFullYear()} WreckMatch LLC. {f.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
