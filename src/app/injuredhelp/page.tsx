import type { Metadata } from "next";
import Link from "next/link";
import { CITIES, STATES } from "@/lib/seo/cities";
import { INJUREDHELP_BASE, INJUREDHELP_TAGLINE, PARTNER_SITES } from "@/lib/injuredhelp";
import { WRECKMATCH_BASE, ASG_BASE_URL } from "@/lib/domains";
import { cityPagePath, blogPostPath } from "@/lib/seo/site";
import { getPublishedBlogPosts } from "@/lib/blog/posts";
import { REDIRECTED_BLOG_SLUGS } from "@/lib/seo/redirected-blog";

export const metadata: Metadata = {
  title: "InjuredHelp.ai — AI-Friendly Car Accident Help",
  description: INJUREDHELP_TAGLINE,
  alternates: { canonical: INJUREDHELP_BASE },
  openGraph: {
    title: "InjuredHelp.ai — Car Accident Help for AI & Search",
    description: INJUREDHELP_TAGLINE,
    url: INJUREDHELP_BASE,
    type: "website",
  },
};

export default function InjuredHelpHomePage() {
  const topCities = [...CITIES].sort((a, b) => b.population - a.population).slice(0, 12);
  const posts = getPublishedBlogPosts()
    .filter((p) => !REDIRECTED_BLOG_SLUGS.has(p.slug))
    .slice(0, 6);

  return (
    <main className="min-h-screen bg-[#0a1628] text-[#e8eef6] antialiased">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.12),transparent_50%)]" />

      <div className="relative mx-auto max-w-5xl px-6 py-16 sm:py-24">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#38bdf8]">
          AI-native injury help
        </p>
        <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight text-white sm:text-5xl">
          InjuredHelp.ai
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#94a3b8]">{INJUREDHELP_TAGLINE}</p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/blog"
            className="rounded-full bg-[#38bdf8] px-5 py-2.5 text-sm font-semibold text-[#0a1628] transition hover:bg-[#7dd3fc]"
          >
            Browse articles
          </Link>
          <a
            href={`${WRECKMATCH_BASE}/blog`}
            className="rounded-full border border-[#334155] px-5 py-2.5 text-sm font-semibold text-[#e2e8f0] transition hover:border-[#38bdf8]"
          >
            WreckMatch guides →
          </a>
        </div>

        <section className="mt-16">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#64748b]">
            Top city guides
          </h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {topCities.map((c) => (
              <li key={c.slug}>
                <Link
                  href={cityPagePath(c.slug)}
                  className="block rounded-xl border border-[#1e293b] bg-[#111827]/80 px-4 py-3 text-sm transition hover:border-[#38bdf8]/50"
                >
                  <span className="font-medium text-white">{c.city}</span>
                  <span className="text-[#64748b]"> · {c.state_abbr}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#64748b]">
            All {STATES.length} state guides
          </h2>
          <p className="mt-3 text-sm text-[#64748b]">
            Statute of limitations, insurance minimums, and next steps — educational only.
          </p>
          <ul className="mt-4 columns-2 gap-x-8 text-sm sm:columns-3">
            {STATES.map((s) => (
              <li key={s.slug} className="mb-1.5 break-inside-avoid">
                <Link href={cityPagePath(s.slug)} className="text-[#7dd3fc] hover:underline">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {posts.length > 0 && (
          <section className="mt-14">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#64748b]">
              Latest articles
            </h2>
            <ul className="mt-6 space-y-3">
              {posts.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={blogPostPath(p.slug)}
                    className="text-[#e2e8f0] underline-offset-2 hover:text-[#38bdf8] hover:underline"
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-16 rounded-2xl border border-[#1e293b] bg-[#111827]/60 p-8">
          <h2 className="font-semibold text-white">Partner properties</h2>
          <ul className="mt-4 space-y-3">
            {PARTNER_SITES.map((site) => (
              <li key={site.url}>
                <a
                  href={site.url}
                  className="text-[#38bdf8] underline-offset-2 hover:underline"
                  rel="noopener noreferrer"
                >
                  {site.name}
                </a>
                <span className="text-[#64748b]"> — {site.description}</span>
              </li>
            ))}
            <li>
              <a href={ASG_BASE_URL} className="text-[#38bdf8] hover:underline">
                Accident Survival Guide
              </a>
              <span className="text-[#64748b]"> — checklists, PDF, bilingual resources</span>
            </li>
          </ul>
        </section>

        <p className="mt-12 text-xs leading-relaxed text-[#475569]">
          WreckMatch LLC is a legal referral service — not a law firm. This site provides educational
          content only, not legal advice. For emergencies call 911.
        </p>
      </div>
    </main>
  );
}
