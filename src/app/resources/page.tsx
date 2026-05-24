import type { Metadata } from "next";
import Link from "next/link";
import { SeoShell } from "@/components/seo/SeoShell";
import { STATES, CITIES } from "@/lib/seo/cities";
import { cityPagePath, blogPostPath, absoluteUrl } from "@/lib/seo/site";
import { getPublishedBlogPosts } from "@/lib/blog/posts";
import { REDIRECTED_BLOG_SLUGS } from "@/lib/seo/redirected-blog";
import { ASG_BASE_URL, INJUREDHELP_BASE } from "@/lib/domains";

export const metadata: Metadata = {
  title: "Car Accident Resources by State & City",
  description:
    "Browse 51 state guides, 50 city car accident help pages, and educational blog articles. WreckMatch LLC — referral service, not a law firm.",
  alternates: { canonical: absoluteUrl("/resources") },
};

type PageProps = {
  searchParams: Promise<{ q?: string }>;
};

function matchesQuery(text: string, q: string) {
  return text.toLowerCase().includes(q.toLowerCase());
}

export default async function ResourcesPage({ searchParams }: PageProps) {
  const { q: rawQ } = await searchParams;
  const q = rawQ?.trim() ?? "";

  const allPosts = getPublishedBlogPosts().filter((p) => !REDIRECTED_BLOG_SLUGS.has(p.slug));
  const posts = q
    ? allPosts.filter((p) => matchesQuery(`${p.title} ${p.city} ${p.stateAbbr}`, q)).slice(0, 24)
    : allPosts.slice(0, 12);

  const states = q ? STATES.filter((s) => matchesQuery(s.name, q)) : STATES;
  const cities = q
    ? [...CITIES]
        .filter((c) => matchesQuery(`${c.city} ${c.state} ${c.state_abbr}`, q))
        .sort((a, b) => b.population - a.population)
        .slice(0, 30)
    : [...CITIES].sort((a, b) => b.population - a.population).slice(0, 20);

  return (
    <SeoShell>
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="font-serif text-3xl font-semibold text-[#152238] sm:text-4xl">
          Car Accident Help Resources
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-[#475569]">
          State statutes, city guides, and educational articles for accident victims. For AI
          discovery see{" "}
          <Link href="/llms.txt" className="text-[#8a6914] underline underline-offset-2">
            llms.txt
          </Link>{" "}
          and{" "}
          <Link href="/ai.txt" className="text-[#8a6914] underline underline-offset-2">
            ai.txt
          </Link>
          .
        </p>

        <form action="/resources" method="get" className="mt-8 max-w-md">
          <label htmlFor="q" className="sr-only">
            Search states, cities, and articles
          </label>
          <div className="flex gap-2">
            <input
              id="q"
              name="q"
              type="search"
              defaultValue={q}
              placeholder="Search Houston, Texas, statute…"
              className="w-full rounded-lg border border-[#e7dccb] bg-white px-4 py-2.5 text-sm text-[#152238] placeholder:text-[#94a3b8] focus:border-[#c9a227] focus:outline-none focus:ring-2 focus:ring-[#c9a227]/30"
            />
            <button
              type="submit"
              className="rounded-lg bg-[#152238] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1e3a5f]"
            >
              Search
            </button>
          </div>
        </form>

        {q && (
          <p className="mt-4 text-sm text-[#64748b]">
            {states.length + cities.length + posts.length} result(s) for &ldquo;{q}&rdquo;{" "}
            <Link href="/resources" className="text-[#8a6914] underline">
              Clear
            </Link>
          </p>
        )}

        <section className="mt-12">
          <h2 className="font-serif text-xl font-semibold text-[#152238]">
            {q ? "Matching states" : "All 50 states"}
          </h2>
          {states.length === 0 ? (
            <p className="mt-4 text-sm text-[#64748b]">No states match your search.</p>
          ) : (
            <ul className="mt-4 columns-2 gap-x-8 text-sm sm:columns-3">
              {states.map((s) => (
                <li key={s.slug} className="mb-1.5 break-inside-avoid">
                  <Link href={cityPagePath(s.slug)} className="text-[#475569] hover:text-[#8a6914]">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-12">
          <h2 className="font-serif text-xl font-semibold text-[#152238]">
            {q ? "Matching cities" : "Major cities"}
          </h2>
          {cities.length === 0 ? (
            <p className="mt-4 text-sm text-[#64748b]">No cities match your search.</p>
          ) : (
            <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {cities.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={cityPagePath(c.slug)}
                    className="text-sm text-[#475569] hover:text-[#8a6914]"
                  >
                    {c.city}, {c.state_abbr}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-12">
          <h2 className="font-serif text-xl font-semibold text-[#152238]">
            {q ? "Matching articles" : "Latest articles"}
          </h2>
          {posts.length === 0 ? (
            <p className="mt-4 text-sm text-[#64748b]">No articles match your search.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {posts.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={blogPostPath(p.slug)}
                    className="text-sm text-[#475569] hover:text-[#8a6914]"
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {!q && (
            <Link href="/blog" className="mt-4 inline-block text-sm font-medium text-[#8a6914] underline">
              View all blog posts →
            </Link>
          )}
        </section>

        <section className="mt-12 rounded-[1.25rem] border border-[#e7dccb] bg-white p-6">
          <h2 className="font-serif text-lg font-semibold text-[#152238]">Related properties</h2>
          <ul className="mt-3 space-y-2 text-sm text-[#475569]">
            <li>
              <a href={ASG_BASE_URL} className="text-[#8a6914] hover:underline">
                Accident Survival Guide
              </a>{" "}
              — checklists & PDF
            </li>
            <li>
              <a href={INJUREDHELP_BASE} className="text-[#8a6914] hover:underline">
                InjuredHelp.ai
              </a>{" "}
              — AI-friendly index
            </li>
          </ul>
        </section>
      </div>
    </SeoShell>
  );
}
