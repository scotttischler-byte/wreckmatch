import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | WreckMatch",
  description:
    "Privacy Policy for WreckMatch covering data collection, SMS consent, cookies, security, and user rights.",
};

export default function PrivacyPolicyPage() {
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
        <p className="mt-3 text-sm text-[#64748b]">Effective date: May 12, 2026</p>
        <p className="mt-2 text-xs text-[#64748b]">
          Tophundred Global Ventures LLC DBA WreckMatch · wreckmatch.com
        </p>

        <div className="mt-10 space-y-10 text-[0.95rem] leading-[1.75] text-[#334155]">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-[#0f172a]">1. What information we collect</h2>
            <p>
              We may collect information you provide directly, including your name, email address, phone number, city and
              state, accident details, treatment information, insurance information, preferred callback time, and any other
              case information you choose to submit through our forms, calls, chats, or messages.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-[#0f172a]">2. How user data is used</h2>
            <p>
              We use your information to respond to your request, evaluate your potential case, route you to appropriate
              professionals or partners, send updates, improve our services, and maintain business and legal records.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-[#0f172a]">3. SMS opt-in details</h2>
            <div className="rounded-xl border border-[#c9a227]/35 bg-[#fffefb] p-5 shadow-sm">
              <p>
                If you choose to opt in, we may send automated SMS confirmations, case-related updates, scheduling messages,
                and follow-up communications. Message frequency varies. Msg & data rates may apply. You may reply{" "}
                <span className="font-semibold">STOP</span> to unsubscribe at any time.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-[#0f172a]">4. Cookie and tracking practices</h2>
            <p>
              We may use cookies, analytics tools, pixels, and similar technologies to understand traffic, improve user
              experience, measure campaign performance, and maintain site functionality.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-[#0f172a]">5. Data security and handling</h2>
            <p>
              We use commercially reasonable safeguards to protect information we collect. While no method of storage or
              transmission is completely secure, we work to limit access and protect personal information from unauthorized
              use, disclosure, or loss.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-[#0f172a]">6. User rights</h2>
            <p>
              You may request access to the personal information we hold about you, request correction of inaccurate
              information, or request deletion where applicable. We may need to verify your identity before responding.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-[#0f172a]">7. Mobile information sharing statement</h2>
            <p>
              We do not share mobile numbers or mobile opt-in data with third parties for marketing purposes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-[#0f172a]">8. Contact</h2>
            <p>
              Questions about this Privacy Policy or your data can be sent to{" "}
              <a href="mailto:scott@wreckmatch.com" className="font-semibold text-[#92400e] underline underline-offset-4">
                scott@wreckmatch.com
              </a>
              .
            </p>
            <p className="text-sm text-[#64748b]">
              Tophundred Global Ventures LLC DBA WreckMatch · wreckmatch.com
            </p>
          </section>
        </div>

        <div className="mt-12 rounded-2xl border border-[#c9a227]/30 bg-[#fffdfb] p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8a6914]">Business Address</p>
          <div className="mt-3 space-y-1 text-[0.95rem] leading-[1.8] text-[#334155]">
            <p>Tophundred Global Ventures LLC</p>
            <p>832 Saint Augustine Road</p>
            <p>Colgate, WI 53017</p>
            <p>
              Phone:{" "}
              <a href="tel:8156080449" className="font-semibold text-[#92400e] underline underline-offset-4">
                (815) 608-0449
              </a>
            </p>
          </div>
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
