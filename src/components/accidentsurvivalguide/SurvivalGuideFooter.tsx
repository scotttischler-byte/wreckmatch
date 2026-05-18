"use client";

import { SurvivalGuideDisclaimer } from "@/components/SurvivalGuideDisclaimer";
import { AsgLink } from "@/components/accidentsurvivalguide/AsgLink";
import { useAsgLocale } from "@/components/accidentsurvivalguide/AsgLocaleProvider";
import { SUPPORT_PHONE_DISPLAY, SUPPORT_PHONE_E164 } from "@/lib/constants";
import { WRECKMATCH_URL } from "@/lib/accidentsurvivalguide";

export function SurvivalGuideFooter() {
  const { messages } = useAsgLocale();
  const f = messages.footer;

  return (
    <footer className="border-t border-[#c5dce8]/70 bg-[#f4faf8] py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="font-serif text-lg font-semibold text-[#1a3a52]">
              {messages.meta.siteName}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[#5b6b7f]">{f.tagline}</p>
          </div>

          <nav aria-label={f.navAria} className="text-sm">
            <p className="font-semibold text-[#1a3a52]">{f.explore}</p>
            <ul className="mt-3 space-y-2 text-[#5b6b7f]">
              <li>
                <AsgLink href="/resources" className="hover:text-[#2a7a9b]">
                  {f.freeResources}
                </AsgLink>
              </li>
              <li>
                <AsgLink href="/blog" className="hover:text-[#2a7a9b]">
                  {messages.nav.blog}
                </AsgLink>
              </li>
              <li>
                <AsgLink href="/about" className="hover:text-[#2a7a9b]">
                  {f.aboutScott}
                </AsgLink>
              </li>
              <li>
                <a
                  href={WRECKMATCH_URL}
                  className="hover:text-[#2a7a9b]"
                  rel="noopener noreferrer"
                >
                  {f.attorneyMatch}
                </a>
              </li>
            </ul>
          </nav>

          <div className="text-sm text-[#5b6b7f]">
            <p className="font-semibold text-[#1a3a52]">WreckMatch LLC</p>
            <p className="mt-3 leading-relaxed">
              832 Saint Augustine Road
              <br />
              Colgate, WI 53017
            </p>
            <p className="mt-2">
              <a
                href={`tel:${SUPPORT_PHONE_E164}`}
                className="font-medium text-[#2a7a9b] hover:underline"
              >
                {SUPPORT_PHONE_DISPLAY}
              </a>
            </p>
            <p className="mt-3">
              <AsgLink href="/privacy-policy" className="underline underline-offset-2 hover:text-[#2a7a9b]">
                {f.privacy}
              </AsgLink>
              {" · "}
              <AsgLink href="/terms" className="underline underline-offset-2 hover:text-[#2a7a9b]">
                {f.terms}
              </AsgLink>
            </p>
          </div>
        </div>

        <div className="mt-10 space-y-4 border-t border-[#c5dce8]/60 pt-8">
          <SurvivalGuideDisclaimer variant="footer" text={messages.disclaimer} />
          <p className="text-[0.75rem] leading-relaxed text-[#7a8a98]">{f.feeDisclaimer}</p>
          <p className="text-[0.75rem] text-[#7a8a98]">
            &copy; {new Date().getFullYear()} WreckMatch LLC. {f.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
