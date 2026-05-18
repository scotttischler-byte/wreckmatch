import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  Heart,
  MessageCircle,
  Scale,
  Shield,
  Users,
} from "lucide-react";
import { SurvivalGuideDownloadForm } from "@/components/accidentsurvivalguide/SurvivalGuideDownloadForm";
import {
  COMMON_MISTAKES,
  FIRST_24_HOURS_STEPS,
  GUIDE_BENEFITS,
  HOMEPAGE_FAQ,
  STATE_SLUGS,
  STATE_GUIDES,
  TESTIMONIALS,
  WRECKMATCH_URL,
} from "@/lib/accidentsurvivalguide";

export default function AccidentSurvivalGuideHomePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-[#c5dce8]/60 bg-gradient-to-br from-[#e8f4fa] via-[#f4faf8] to-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(90,168,130,0.12),transparent_50%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5b8fa8]">
            Free educational resource
          </p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl font-semibold leading-[1.08] tracking-[-0.03em] text-[#1a3a52] sm:text-5xl">
            The Accident Survival Guide – What To Do After a Car Crash
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#4a6578]">
            Calm, step-by-step help for the first 24 hours and beyond. Not legal advice—just the
            checklist I wish I had after my own wreck.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#download"
              className="inline-flex items-center rounded-full bg-[#2a7a9b] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#236884]"
            >
              Download free guide
            </a>
            <a
              href="#first-24-hours"
              className="inline-flex items-center rounded-full border border-[#2a7a9b]/40 bg-white px-6 py-3 text-sm font-semibold text-[#2a7a9b] transition hover:bg-[#e8f4fa]"
            >
              Read the checklist
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <blockquote className="rounded-2xl border border-[#c5dce8] bg-white p-8 shadow-sm">
            <Heart className="size-8 text-[#5a9a82]" aria-hidden />
            <p className="mt-6 text-lg leading-relaxed text-[#3d5568]">
              &ldquo;When I got in a car wreck, I had no idea what to do. The insurance company was
              calling, I was in pain, and I felt completely overwhelmed. That&apos;s why I created
              this free Survival Guide — so you don&apos;t have to go through it alone.&rdquo;
            </p>
            <footer className="mt-6 text-sm font-medium text-[#5b8fa8]">— Scott, founder</footer>
          </blockquote>

          <div>
            <h2 className="font-serif text-2xl font-semibold text-[#1a3a52]">
              What&apos;s inside the guide
            </h2>
            <ul className="mt-6 space-y-3">
              {GUIDE_BENEFITS.map((benefit) => (
                <li key={benefit} className="flex gap-3 text-[#4a6578]">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[#5a9a82]" aria-hidden />
                  <span className="leading-relaxed">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-[#eef6fb] py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-xl">
            <SurvivalGuideDownloadForm />
          </div>
        </div>
      </section>

      <section id="first-24-hours" className="scroll-mt-24 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Clock className="size-7 text-[#2a7a9b]" aria-hidden />
            <h2 className="font-serif text-3xl font-semibold text-[#1a3a52]">
              What To Do in the First 24 Hours
            </h2>
          </div>
          <p className="mt-4 max-w-2xl text-[#5b6b7f]">
            General education only. Laws vary by state—consider speaking with a licensed attorney for
            advice about your situation.
          </p>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2">
            {FIRST_24_HOURS_STEPS.map((step, index) => (
              <li
                key={step.title}
                className="rounded-xl border border-[#c5dce8] bg-white p-6"
              >
                <span className="text-sm font-semibold text-[#5b8fa8]">
                  Step {index + 1}
                </span>
                <h3 className="mt-2 font-semibold text-[#1a3a52]">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#5b6b7f]">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="common-mistakes" className="scroll-mt-24 bg-[#f4faf8] py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="size-7 text-[#c4884a]" aria-hidden />
            <h2 className="font-serif text-3xl font-semibold text-[#1a3a52]">
              Common Mistakes to Avoid
            </h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {COMMON_MISTAKES.map((item) => (
              <article
                key={item.title}
                className="rounded-xl border border-[#d4e8dc] bg-white p-6"
              >
                <h3 className="font-semibold text-[#1a3a52]">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#5b6b7f]">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="your-rights" className="scroll-mt-24 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Scale className="size-7 text-[#2a7a9b]" aria-hidden />
            <h2 className="font-serif text-3xl font-semibold text-[#1a3a52]">
              Your Rights After an Accident
            </h2>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Shield,
                title: "Medical care",
                text: "You generally have the right to seek treatment. Keep records of every visit and bill.",
              },
              {
                icon: FileText,
                title: "Insurance communication",
                text: "You may report a claim promptly, but you are not required to accept the first offer.",
              },
              {
                icon: Users,
                title: "Legal representation",
                text: "You may consult a licensed attorney in your state. WreckMatch can help you explore a free match.",
              },
            ].map((card) => (
              <article
                key={card.title}
                className="rounded-xl border border-[#c5dce8] bg-white p-6"
              >
                <card.icon className="size-6 text-[#5a9a82]" aria-hidden />
                <h3 className="mt-4 font-semibold text-[#1a3a52]">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#5b6b7f]">{card.text}</p>
              </article>
            ))}
          </div>
          <p className="mt-8 text-sm text-[#7a8a98]">
            This section is general education, not legal advice for your case.
          </p>
        </div>
      </section>

      <section className="bg-[#eef6fb] py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-serif text-3xl font-semibold text-[#1a3a52]">Free resources</h2>
          <p className="mt-3 text-[#5b6b7f]">
            Guides, blog articles, and state-specific education pages.
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <li>
              <Link
                href="/resources"
                className="block rounded-xl border border-[#c5dce8] bg-white p-5 transition hover:border-[#2a7a9b]/40"
              >
                <span className="font-semibold text-[#1a3a52]">All free resources →</span>
              </Link>
            </li>
            <li>
              <Link
                href="/blog"
                className="block rounded-xl border border-[#c5dce8] bg-white p-5 transition hover:border-[#2a7a9b]/40"
              >
                <span className="font-semibold text-[#1a3a52]">Educational blog →</span>
              </Link>
            </li>
            {STATE_SLUGS.slice(0, 4).map((slug) => (
              <li key={slug}>
                <Link
                  href={`/${slug}`}
                  className="block rounded-xl border border-[#c5dce8] bg-white p-5 transition hover:border-[#2a7a9b]/40"
                >
                  <span className="font-semibold text-[#1a3a52]">
                    {STATE_GUIDES[slug].name} guide →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-serif text-3xl font-semibold text-[#1a3a52]">
            What readers say
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <blockquote
                key={t.attribution}
                className="rounded-xl border border-[#c5dce8] bg-white p-6"
              >
                <p className="text-[#4a6578] leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                <footer className="mt-4 text-sm font-medium text-[#5b8fa8]">
                  {t.attribution}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#c5dce8]/60 bg-white py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="font-serif text-2xl font-semibold text-[#1a3a52]">
            Frequently asked questions
          </h2>
          <dl className="mt-8 space-y-6">
            {HOMEPAGE_FAQ.map((item) => (
              <div key={item.question}>
                <dt className="font-semibold text-[#1a3a52]">{item.question}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-[#5b6b7f]">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-t border-[#c5dce8]/60 bg-[#1a3a52] py-14 text-white">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
          <MessageCircle className="mx-auto size-8 text-[#8ecae6]" aria-hidden />
          <h2 className="mt-4 font-serif text-2xl font-semibold">Need more help?</h2>
          <p className="mx-auto mt-3 max-w-xl text-[#b8d4e8]">
            Use the chat widget for our AI assistant Sarah (24/7), or visit WreckMatch for a free
            attorney match in your state.
          </p>
          <a
            href={WRECKMATCH_URL}
            className="mt-6 inline-flex rounded-full bg-[#5a9a82] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#4d8872]"
            rel="noopener noreferrer"
          >
            Visit wreckmatch.com
          </a>
        </div>
      </section>
    </>
  );
}
