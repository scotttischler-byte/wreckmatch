import type { Metadata } from "next";
import Link from "next/link";

import { SUPPORT_PHONE_DISPLAY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy | WreckMatch",
  description:
    "How WreckMatch protects your information and collects consent for SMS and other communications.",
};

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-[#64748b]">Effective date: May 7, 2026 · Last updated: May 7, 2026</p>
        <p className="mt-2 text-xs text-[#64748b]">
          WreckMatch and MVA Match are DBAs of Tophundred Global Ventures LLC (&quot;we,&quot; &quot;us,&quot; or
          &quot;our&quot;).
        </p>

        <div className="mt-10 space-y-10 text-[0.95rem] leading-[1.75] text-[#334155]">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-[#0f172a]">1. Overview</h2>
            <p>
              This Privacy Policy describes how we collect, use, disclose, and safeguard personal information when you use
              our websites, forms, phone lines, SMS programs, chat experiences (including AI-assisted tools such as Ava), and
              related services (collectively, the &quot;Services&quot;). By using the Services, you agree to this policy.
            </p>
            <p>
              We are not a law firm. Communicating with us does not create an attorney-client relationship unless and
              until you engage licensed counsel under a separate agreement.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-[#0f172a]">2. Information we collect</h2>
            <p>Depending on how you interact with us, we may collect:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <span className="font-medium text-[#1e293b]">Contact data:</span> name, phone number, email, mailing address,
                preferred contact method.
              </li>
              <li>
                <span className="font-medium text-[#1e293b]">Case-related details:</span> accident timing, location (city/state),
                injury and treatment summaries, insurer information, and similar facts you choose to provide.
              </li>
              <li>
                <span className="font-medium text-[#1e293b]">Technical data:</span> IP address, device/browser type, general
                location, pages viewed, referring URLs, and cookies or similar technologies.
              </li>
              <li>
                <span className="font-medium text-[#1e293b]">Communications:</span> call recordings where permitted and
                disclosed, voicemails, SMS/MMS message content, and chat transcripts (including with automated assistants).
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-[#0f172a]">3. How we use information</h2>
            <p>We use personal information to:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Respond to requests and route you to appropriate professionals or partners;</li>
              <li>Operate, secure, and improve the Services;</li>
              <li>Send transactional or service messages and, where permitted, marketing;</li>
              <li>Comply with law, enforce our terms, and protect rights and safety;</li>
              <li>Measure performance and prevent fraud or abuse.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-[#0f172a]">4. SMS and text message consent (important)</h2>
            <div className="rounded-xl border border-[#c9a227]/35 bg-[#fffefb] p-5 shadow-sm">
              <p className="font-medium text-[#0f172a]">Your explicit consent</p>
              <p className="mt-2">
                Where required, we will obtain your <span className="font-semibold">clear and conspicuous consent</span>{" "}
                before sending SMS or MMS messages. Consent is not a condition of purchasing goods or services unless we
                disclose that fact at the point of collection.
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>
                  You authorize <span className="font-semibold">WreckMatch / MVA Match (Tophundred Global Ventures LLC)</span>{" "}
                  and service providers acting on our behalf to use automated or manual technology to send recurring and
                  one-time text messages to the mobile number you provide.
                </li>
                <li>
                  Message frequency varies based on your engagement, case updates, and program rules. For marketing or mixed
                  programs we will state expected frequency or ranges where practicable.
                </li>
                <li>
                  <span className="font-semibold">Message and data rates may apply</span> according to your wireless carrier
                  plan. Carriers are not liable for delayed or undelivered messages.
                </li>
                <li>
                  You may <span className="font-semibold">opt out at any time</span> by texting{" "}
                  <span className="font-mono text-[#0f172a]">STOP</span> to the number from which you received messages, or by
                  following instructions in the message. After opting out, you may receive a one-time confirmation. We honor
                  opt-outs promptly in ordinary course, subject to technical or legal exceptions.
                </li>
                <li>
                  For help, text <span className="font-mono text-[#0f172a]">HELP</span> or call{" "}
                  <a href={`tel:${SUPPORT_PHONE_DISPLAY.replace(/\D/g, "")}`} className="font-semibold text-[#92400e] underline">
                    {SUPPORT_PHONE_DISPLAY}
                  </a>
                  .
                </li>
                <li>
                  We do not sell your phone number for money. We may share information with vendors, carriers, compliance
                  partners, and participating law firms strictly as needed to deliver the Services and meet legal
                  obligations.
                </li>
              </ul>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-[#0f172a]">5. Cookies and similar technologies</h2>
            <p>
              We use cookies, pixels, local storage, and analytics tools to remember preferences, measure traffic, and improve
              conversions. You may control cookies through your browser; disabling them may limit certain features.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-[#0f172a]">6. Sharing of information</h2>
            <p>We may share information with:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Service providers (hosting, CRM, telephony, SMS gateways, analytics, AI vendors);</li>
              <li>Professional partners such as attorneys or case intake firms you request or consent to;</li>
              <li>Regulators, courts, or law enforcement when required by law or to protect rights;</li>
              <li>
                A successor entity in a merger, acquisition, or asset sale, subject to appropriate notice where required.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-[#0f172a]">7. Retention</h2>
            <p>
              We retain information for as long as needed to provide the Services, satisfy legal, accounting, or reporting
              requirements, resolve disputes, and enforce agreements. Retention periods vary by data category and jurisdiction.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-[#0f172a]">8. Security</h2>
            <p>
              We use commercially reasonable administrative, technical, and physical safeguards. No method of transmission or
              storage is 100% secure; we cannot guarantee absolute security.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-[#0f172a]">9. Your choices and rights</h2>
            <p>
              Depending on your state or country, you may have rights to access, correct, delete, or restrict processing of
              personal data, and to opt out of certain sales or sharing (including targeted advertising where applicable).
              To exercise rights, contact us using the details below. We may verify your request as permitted by law.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-[#0f172a]">10. Children</h2>
            <p>
              The Services are not directed to children under 16. We do not knowingly collect personal information from
              children. Contact us if you believe a child has provided information.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-[#0f172a]">11. Changes</h2>
            <p>
              We may update this Privacy Policy from time to time. We will post the revised version with a new effective
              date. For material changes affecting SMS consent, we will obtain fresh consent where required.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-[#0f172a]">12. Contact</h2>
            <p>
              Questions about this Privacy Policy or your data: call{" "}
              <a href={`tel:${SUPPORT_PHONE_DISPLAY.replace(/\D/g, "")}`} className="font-semibold text-[#92400e] underline">
                {SUPPORT_PHONE_DISPLAY}
              </a>
              , or write to the business address on file for Tophundred Global Ventures LLC.
            </p>
            <p className="text-sm text-[#64748b]">
              WreckMatch and MVA Match are DBAs of Tophundred Global Ventures LLC
            </p>
          </section>
        </div>

        <p className="mt-12 text-center text-sm text-[#64748b]">
          <Link href="/terms" className="font-medium text-[#92400e] underline underline-offset-4 hover:text-[#713f12]">
            Terms of Use
          </Link>
        </p>
      </main>
    </div>
  );
}
