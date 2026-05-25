import Link from "next/link";
import { Phone, Sparkles } from "lucide-react";
import { HomeChatButton } from "@/components/HomeChatButton";
import { SeoShell } from "@/components/seo/SeoShell";
import { SARAH_PHONE_DISPLAY, SARAH_PHONE_TEL } from "@/lib/constants";

export default function Home() {
  return (
    <SeoShell>
      <section className="relative overflow-hidden border-b border-[#c9a227]/18 bg-gradient-to-br from-[#081428] via-[#0c1f3f] to-[#040a14] text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,114,0.18),transparent_42%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(251,191,36,0.08),transparent_46%)]" />

        <div className="relative mx-auto max-w-5xl px-6 py-16 text-center sm:px-10 sm:py-24">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#fde68a]">
            Car accident help nationwide
          </p>

          <h1 className="mt-6 font-serif text-[2.5rem] font-semibold leading-[1.02] tracking-[-0.03em] text-[#fffaf0] sm:text-[3.75rem]">
            WreckMatch
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-[1.05rem] font-light leading-[1.9] text-[#dbe7f6] sm:text-[1.15rem]">
            Connect with licensed personal injury attorneys after a car or truck accident — plus free
            state guides, city resources, and educational articles when you need them.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
            <HomeChatButton />
            <a
              href={SARAH_PHONE_TEL}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#fde68a] px-6 py-3 text-sm font-semibold text-[#081428] transition hover:bg-[#fcd34d]"
            >
              <Phone className="size-4" aria-hidden />
              {SARAH_PHONE_DISPLAY}
            </a>
            <Link
              href="/resources"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-[#fffaf0] transition hover:bg-white/10"
            >
              Browse resources
            </Link>
          </div>

          <p className="mx-auto mt-8 max-w-2xl text-sm leading-relaxed text-[#94a3b8]">
            WreckMatch LLC is a legal referral service — not a law firm. Educational content only; not
            legal advice.
          </p>
        </div>
      </section>

      <section className="border-b border-[#c9a227]/14 bg-[#fcfaf6] py-16 sm:py-20">
        <div className="mx-auto grid max-w-5xl gap-5 px-6 sm:px-10 md:grid-cols-3">
          {[
            {
              title: "Attorney matching",
              copy: "Chat or call to connect with licensed personal injury attorneys from our nationwide network.",
              href: "/about/team",
              linkLabel: "Meet our team",
            },
            {
              title: "State & city guides",
              copy: "Statute of limitations, insurance basics, and local resources for 50 states and major cities.",
              href: "/resources",
              linkLabel: "View resources",
            },
            {
              title: "Accident Survival Guide",
              copy: "Checklists and educational articles on what to do in the first 24 hours after a crash.",
              href: "https://www.accidentsurvivalguide.com",
              linkLabel: "Accident Survival Guide",
              external: true,
            },
          ].map((item) => (
            <article
              key={item.title}
              className="rounded-[1.35rem] border border-[#e7dccb] bg-white px-6 py-7 shadow-[0_22px_50px_-34px_rgba(15,23,42,0.18)]"
            >
              <div className="inline-flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#8a6914]">
                <Sparkles className="size-4" aria-hidden />
                WreckMatch
              </div>
              <h2 className="mt-4 font-serif text-[1.55rem] font-semibold tracking-[-0.02em] text-[#152238]">
                {item.title}
              </h2>
              <p className="mt-3 text-[0.96rem] leading-[1.8] text-[#475569]">{item.copy}</p>
              {"external" in item && item.external ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-sm font-medium text-[#8a6914] underline underline-offset-2"
                >
                  {item.linkLabel} →
                </a>
              ) : (
                <Link
                  href={item.href}
                  className="mt-4 inline-block text-sm font-medium text-[#8a6914] underline underline-offset-2"
                >
                  {item.linkLabel} →
                </Link>
              )}
            </article>
          ))}
        </div>
      </section>
    </SeoShell>
  );
}
