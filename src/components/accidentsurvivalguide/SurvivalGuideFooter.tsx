import Link from "next/link";
import { SurvivalGuideDisclaimer } from "@/components/SurvivalGuideDisclaimer";
import { SUPPORT_PHONE_DISPLAY, SUPPORT_PHONE_E164 } from "@/lib/constants";
import { WRECKMATCH_URL } from "@/lib/accidentsurvivalguide";

export function SurvivalGuideFooter() {
  return (
    <footer className="border-t border-[#c5dce8]/70 bg-[#f4faf8] py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="font-serif text-lg font-semibold text-[#1a3a52]">
              Accident Survival Guide
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[#5b6b7f]">
              Calm, educational help after a car crash—operated by WreckMatch LLC.
            </p>
          </div>

          <nav aria-label="Footer navigation" className="text-sm">
            <p className="font-semibold text-[#1a3a52]">Explore</p>
            <ul className="mt-3 space-y-2 text-[#5b6b7f]">
              <li>
                <Link href="/resources" className="hover:text-[#2a7a9b]">
                  Free resources
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[#2a7a9b]">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#2a7a9b]">
                  About Scott&apos;s story
                </Link>
              </li>
              <li>
                <a
                  href={WRECKMATCH_URL}
                  className="hover:text-[#2a7a9b]"
                  rel="noopener noreferrer"
                >
                  Attorney matching at WreckMatch
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
              <Link href="/privacy-policy" className="underline underline-offset-2 hover:text-[#2a7a9b]">
                Privacy Policy
              </Link>
              {" · "}
              <Link href="/terms" className="underline underline-offset-2 hover:text-[#2a7a9b]">
                Terms of Use
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-10 space-y-4 border-t border-[#c5dce8]/60 pt-8">
          <SurvivalGuideDisclaimer variant="footer" />
          <p className="text-[0.75rem] leading-relaxed text-[#7a8a98]">
            WreckMatch LLC may receive a marketing fee from participating law firms. This does not
            affect your legal rights. No attorney-client relationship is formed by using this
            educational site or downloading the guide. Msg &amp; data rates may apply if you opt in
            to text updates. Reply STOP to unsubscribe.
          </p>
          <p className="text-[0.75rem] text-[#7a8a98]">
            &copy; {new Date().getFullYear()} WreckMatch LLC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
