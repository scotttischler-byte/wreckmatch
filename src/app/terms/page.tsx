import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use | WreckMatch",
  description: "Terms governing WreckMatch customer care SMS and website use.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#f7f2ea] text-[#152238] antialiased">
      <header className="border-b border-[#c9a227]/20 bg-[#faf6ef]/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-5 sm:px-6">
          <Link
            href="/"
            className="text-sm font-semibold tracking-tight text-[#152238] underline decoration-[#c9a227]/45 underline-offset-4 hover:text-[#0f172a]"
          >
            ← Back to WreckMatch
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-[#0f172a] sm:text-4xl">
          Terms of Use
        </h1>
        <p className="mt-3 text-sm text-[#64748b]">Effective date: May 7, 2026 · Last updated: May 7, 2026</p>
        <p className="mt-2 text-xs text-[#64748b]">
          Tophundred Global Ventures LLC DBA WreckMatch (&quot;Company,&quot; &quot;we,&quot; &quot;us,&quot; or
          &quot;our&quot;).
        </p>

        <div className="mt-10 space-y-10 text-[0.95rem] leading-[1.75] text-[#334155]">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-[#0f172a]">1. Agreement</h2>
            <p>
              These Terms of Use (&quot;Terms&quot;) govern access to and use of our website, chat widget, SMS/MMS programs,
              and related offerings (&quot;Services&quot;). By accessing or using the Services, you agree to these Terms and
              our{" "}
              <Link href="/privacy-policy" className="font-semibold text-[#92400e] underline underline-offset-2 hover:text-[#713f12]">
                Privacy Policy
              </Link>
              .
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-[#0f172a]">2. Not legal advice; no attorney-client relationship</h2>
            <p>
              Content on the Services is for general information only and is not legal advice. We are not your lawyers.
              Unsolicited information you send may not be treated as confidential until a licensed attorney agrees to
              represent you. You should consult qualified counsel about your specific situation.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-[#0f172a]">3. Eligibility</h2>
            <p>
              You represent that you are at least eighteen (18) years old and have authority to provide contact information
              and consent on behalf of yourself or an entity you represent, as applicable.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-[#0f172a]">4. SMS / text messaging terms</h2>
            <div className="rounded-xl border border-[#c9a227]/35 bg-[#fffefb] p-5 shadow-sm">
              <p className="font-semibold text-[#0f172a]">Program description</p>
              <p className="mt-2">
                When you provide your mobile number and agree through the website chat widget or another legally sufficient
                method, you consent to receive customer care and service-related text messages from or on behalf of the
                Company regarding your inquiry or existing support request.
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>
                  <span className="font-medium text-[#1e293b]">Opt-in:</span> Consent must be affirmative, clear, and
                  captured before customer care texts are sent, consistent with applicable law (including the Telephone
                  Consumer Protection Act and implementing rules where applicable).
                </li>
                <li>
                  <span className="font-medium text-[#1e293b]">Opt-out:</span> Reply{" "}
                  <span className="font-mono text-[#0f172a]">STOP</span> to cancel. You may receive a one-time confirmation.
                  Reply <span className="font-mono text-[#0f172a]">HELP</span> for help.
                </li>
                <li>
                  <span className="font-medium text-[#1e293b]">Frequency &amp; charges:</span> Message frequency varies.
                  Message and data rates may apply. Carriers are not liable for delayed or undelivered messages.
                </li>
                <li>
                  <span className="font-medium text-[#1e293b]">Supported carriers:</span> Major U.S. carriers typically
                  support deliverability; availability may vary and can change without notice.
                </li>
                <li>
                  <span className="font-medium text-[#1e293b]">Content:</span> Texts may include case-status updates,
                  support responses, inquiry updates, appointment coordination, and related follow-up communications.
                </li>
                <li>
                  <span className="font-medium text-[#1e293b]">No promotional content:</span> Messaging described on this
                  site is limited to customer care and service-related communications, not marketing campaigns or
                  promotional offers.
                </li>
              </ul>
              <p className="mt-3 text-sm text-[#475569]">Customer care: (815) 608-0449.</p>
              <div className="mt-4 rounded-xl border border-[#e7dccb] bg-[#faf6ef] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a6914]">
                  Example customer care message
                </p>
                <p className="mt-2 text-[0.95rem] leading-[1.8] text-[#334155]">
                  &ldquo;Hello from TOPHUNDRED GLOBAL VENTURES LLC DBA WreckMatch. We are following up regarding your
                  support request. Please let us know if you still need assistance. Reply STOP to unsubscribe.&rdquo;
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-[#0f172a]">5. Communications generally</h2>
            <p>
              You agree we may contact you at the email address or mobile number you provide for customer care and
              service-related follow-up where allowed after appropriate consent. You will maintain accurate contact
              information.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-[#0f172a]">6. Acceptable use</h2>
            <p>You will not misuse the Services, including by attempting unauthorized access, scraping in violation of law or
              our robots rules, transmitting malware, harassing staff or users, or submitting false information.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-[#0f172a]">7. Intellectual property</h2>
            <p>
              The Services, branding, text, graphics, and other materials are owned by the Company or licensors and are
              protected by intellectual property laws. You receive a limited, revocable license to access the Services for
              personal, non-commercial use unless we agree otherwise in writing.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-[#0f172a]">8. Disclaimers</h2>
            <p>
              THE SERVICES ARE PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE.&quot; TO THE MAXIMUM EXTENT PERMITTED BY LAW,
              WE DISCLAIM ALL WARRANTIES, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING MERCHANTABILITY, FITNESS FOR A
              PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT RESULTS, RECOVERIES, OR OUTCOMES OF ANY LEGAL
              MATTER.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-[#0f172a]">9. Limitation of liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL THE COMPANY OR ITS OFFICERS, DIRECTORS, EMPLOYEES, OR
              AGENTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF
              PROFITS, DATA, OR GOODWILL, ARISING FROM YOUR USE OF THE SERVICES, EVEN IF ADVISED OF THE POSSIBILITY. OUR
              AGGREGATE LIABILITY FOR ANY CLAIM RELATING TO THE SERVICES SHALL NOT EXCEED THE GREATER OF ONE HUNDRED U.S.
              DOLLARS (US $100) OR THE AMOUNTS YOU PAID US DIRECTLY FOR THE SPECIFIC SERVICE GIVING RISE TO THE CLAIM IN THE
              SIX (6) MONTHS BEFORE THE CLAIM.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-[#0f172a]">10. Indemnity</h2>
            <p>
              You will defend, indemnify, and hold harmless the Company and its affiliates from claims, damages, losses, and
              expenses (including reasonable attorneys&apos; fees) arising out of your misuse of the Services, violation of
              these Terms, or violation of third-party rights.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-[#0f172a]">11. Disputes; governing law</h2>
            <p>
              These Terms are governed by the laws of the State of Delaware, excluding conflict-of-law rules, unless a
              different jurisdiction is required by applicable consumer protection law. You agree to bring claims in the
              federal or state courts located in Delaware, unless applicable law requires otherwise, and waive any objection
              to venue in those courts.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-[#0f172a]">12. Changes</h2>
            <p>
              We may modify these Terms at any time by posting an updated version. Your continued use after changes become
              effective constitutes acceptance unless applicable law requires additional steps.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-[#0f172a]">13. Contact</h2>
            <p>(815) 608-0449</p>
            <p className="text-sm text-[#64748b]">
              Tophundred Global Ventures LLC DBA WreckMatch
            </p>
          </section>
        </div>

        <div className="mt-12 rounded-2xl border border-[#c9a227]/30 bg-[#fffdfb] p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8a6914]">Business Address</p>
          <div className="mt-3 space-y-1 text-[0.95rem] leading-[1.8] text-[#334155]">
            <p>Tophundred Global Ventures LLC</p>
            <p>832 Saint Augustine Road</p>
            <p>Colgate, WI 53017</p>
            <p>Phone: (815) 608-0449</p>
          </div>
        </div>

        <p className="mt-12 text-center text-sm text-[#64748b]">
          <Link href="/privacy-policy" className="font-medium text-[#92400e] underline underline-offset-4 hover:text-[#713f12]">
            Privacy Policy
          </Link>
        </p>
      </main>
    </div>
  );
}
