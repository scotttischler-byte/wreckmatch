import Link from "next/link";
import { MessageSquare, Shield, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f2ea] text-[#152238] antialiased">
      <section className="relative overflow-hidden border-b border-[#c9a227]/18 bg-gradient-to-br from-[#081428] via-[#0c1f3f] to-[#040a14] text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,114,0.18),transparent_42%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(251,191,36,0.08),transparent_46%)]" />

        <div className="relative mx-auto max-w-5xl px-6 py-20 text-center sm:px-10 sm:py-28">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#fde68a] backdrop-blur">
            <Shield className="size-4" aria-hidden />
            Messaging compliance review mode
          </div>

          <h1 className="mt-8 font-serif text-[2.5rem] font-semibold leading-[1.02] tracking-[-0.03em] text-[#fffaf0] sm:text-[4rem]">
            WreckMatch
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-[1.05rem] font-light leading-[1.9] text-[#dbe7f6] sm:text-[1.2rem]">
            To keep the website as clean as possible for carrier review, the only contact path on this page is the secure
            chat widget in the lower right corner.
          </p>

          <div className="mx-auto mt-10 max-w-2xl rounded-[1.75rem] border border-[#fde68a]/25 bg-white/10 px-6 py-8 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.45)] backdrop-blur sm:px-8 sm:py-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#fde68a]/14 px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#fde68a]">
              <MessageSquare className="size-4" aria-hidden />
              Single approved contact path
            </div>
            <p className="mt-5 text-[1.05rem] font-medium leading-[1.8] text-[#fffaf0] sm:text-[1.15rem]">
              Please use the GHL / LeadConnector chat bubble to start your conversation.
            </p>
            <p className="mt-3 text-sm leading-[1.9] text-[#dbe7f6] sm:text-[0.98rem]">
              There are intentionally no other homepage forms, call buttons, callback flows, intake questionnaires, or
              alternate text-entry mechanisms during this review period.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-[#c9a227]/14 bg-[#fcfaf6] py-16 sm:py-20">
        <div className="mx-auto grid max-w-5xl gap-5 px-6 sm:px-10 md:grid-cols-3">
          {[
            {
              title: "One text-entry path",
              copy: "The homepage has been flattened so the chat widget is the only messaging path available to visitors.",
            },
            {
              title: "No extra opt-in flows",
              copy: "No homepage forms, intake questions, callback widgets, calculator inputs, or downloadable lead magnets remain.",
            },
            {
              title: "Legal pages stay visible",
              copy: "Privacy Policy and Terms of Use remain available so reviewers can verify disclosures and business identity.",
            },
          ].map((item) => (
            <article
              key={item.title}
              className="rounded-[1.35rem] border border-[#e7dccb] bg-white px-6 py-7 shadow-[0_22px_50px_-34px_rgba(15,23,42,0.18)]"
            >
              <div className="inline-flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#8a6914]">
                <Sparkles className="size-4" aria-hidden />
                Review ready
              </div>
              <h2 className="mt-4 font-serif text-[1.55rem] font-semibold tracking-[-0.02em] text-[#152238]">
                {item.title}
              </h2>
              <p className="mt-3 text-[0.96rem] leading-[1.8] text-[#475569]">{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="bg-[#f5efe6] py-14">
        <div className="mx-auto max-w-4xl px-6 text-center sm:px-10">
          <p className="font-serif text-[1.35rem] font-semibold tracking-[-0.02em] text-[#152238]">
            WreckMatch LLC
          </p>
          <p className="mt-4 text-[0.95rem] leading-[1.8] text-[#475569]">
            832 Saint Augustine Road
            <br />
            Colgate, WI 53017
          </p>

          <nav
            aria-label="Legal policies"
            className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm font-medium text-[#64748b]"
          >
            <Link href="/privacy-policy" className="underline decoration-[#c9a227]/50 underline-offset-4 hover:text-[#152238]">
              Privacy Policy
            </Link>
            <span className="text-[#cbd5e1]" aria-hidden>
              ·
            </span>
            <Link href="/terms" className="underline decoration-[#c9a227]/50 underline-offset-4 hover:text-[#152238]">
              Terms of Use
            </Link>
          </nav>

          <div className="mt-6 space-y-2 text-[0.78rem] leading-[1.8] text-[#64748b]">
            <p>Text messaging is available only through the chat widget on this site during compliance review.</p>
            <p>Msg &amp; data rates may apply. Reply STOP to unsubscribe.</p>
            <p>&copy; 2026 WreckMatch. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
