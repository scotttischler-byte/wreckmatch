import Link from "next/link";
import { Phone, Sparkles } from "lucide-react";
import { HomeChatButton } from "@/components/HomeChatButton";
import { BlogCoverImage } from "@/components/seo/BlogCoverImage";
import { SeoShell } from "@/components/seo/SeoShell";
import { TeamMemberCard } from "@/components/team/TeamMemberCard";
import { getPublishedBlogPosts } from "@/lib/blog/posts";
import { BLOG_TOPICS } from "@/lib/blog/topics";
import { SARAH_PHONE_DISPLAY, SARAH_PHONE_TEL } from "@/lib/constants";
import { REDIRECTED_BLOG_SLUGS } from "@/lib/seo/redirected-blog";
import { CITIES, STATES } from "@/lib/seo/cities";
import { TEAM_MEMBERS } from "@/lib/team/people";

export default function Home() {
  const blogPosts = getPublishedBlogPosts().filter((p) => !REDIRECTED_BLOG_SLUGS.has(p.slug));
  const featuredPosts = blogPosts.slice(0, 6);

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

      <section className="border-b border-[#c9a227]/14 bg-[#fcfaf6] py-10 sm:py-12">
        <div className="mx-auto grid max-w-5xl gap-4 px-6 sm:grid-cols-2 sm:px-10 lg:grid-cols-4">
          {[
            { label: "Blog guides", value: `${blogPosts.length}+`, href: "/blog" },
            { label: "State pages", value: `${STATES.length}`, href: "/resources" },
            { label: "City pages", value: `${CITIES.length}+`, href: "/resources" },
            { label: "Leadership bios", value: `${TEAM_MEMBERS.length}`, href: "/about/team" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-[1.15rem] border border-[#e7dccb] bg-white px-5 py-4 text-center shadow-sm transition hover:border-[#c9a227]/40"
            >
              <p className="font-serif text-2xl font-semibold text-[#152238]">{item.value}</p>
              <p className="mt-1 text-sm font-medium text-[#64748b]">{item.label}</p>
            </Link>
          ))}
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

      <section className="border-b border-[#c9a227]/14 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-6 sm:px-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#8a6914]">
                Leadership team
              </p>
              <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.02em] text-[#152238]">
                Meet the people behind WreckMatch
              </h2>
              <p className="mt-3 max-w-2xl text-[#475569]">
                Full bios with headshots and extended AI/GEO profiles for Kathy Carr, Scott Tischler, and
                Judge Roy Waddell.
              </p>
            </div>
            <Link
              href="/about/team"
              className="inline-flex shrink-0 items-center justify-center rounded-full border border-[#c9a227]/35 bg-[#fcfaf6] px-5 py-2.5 text-sm font-semibold text-[#8a6914] transition hover:border-[#c9a227]/55"
            >
              View all bios →
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {TEAM_MEMBERS.map((member) => (
              <TeamMemberCard key={member.slug} member={member} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fcfaf6] py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-6 sm:px-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#8a6914]">
                Car accident blog
              </p>
              <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.02em] text-[#152238]">
                Latest city & state guides
              </h2>
              <p className="mt-3 max-w-2xl text-[#475569]">
                {blogPosts.length}+ educational articles with cover images — insurance pitfalls, first steps
                after a crash, and local statute basics.
              </p>
            </div>
            <Link
              href="/blog"
              className="inline-flex shrink-0 items-center justify-center rounded-full border border-[#c9a227]/35 bg-white px-5 py-2.5 text-sm font-semibold text-[#8a6914] transition hover:border-[#c9a227]/55"
            >
              Browse all {blogPosts.length}+ guides →
            </Link>
          </div>

          <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featuredPosts.map((post) => (
              <li
                key={post.slug}
                className="overflow-hidden rounded-[1.25rem] border border-[#e7dccb] bg-white shadow-sm transition hover:border-[#c9a227]/40"
              >
                <Link href={`/blog/${post.slug}`} className="block">
                  <BlogCoverImage post={post} className="rounded-none border-0 border-b border-[#e7dccb]" />
                </Link>
                <div className="p-5">
                  <div className="flex flex-wrap gap-2 text-xs font-medium text-[#64748b]">
                    <span className="rounded-full bg-[#f5efe6] px-2.5 py-0.5 text-[#8a6914]">
                      {BLOG_TOPICS[post.topic]?.label ?? post.topic}
                    </span>
                    {post.city !== "Nationwide" ? (
                      <span>
                        {post.city}, {post.stateAbbr}
                      </span>
                    ) : null}
                  </div>
                  <h3 className="mt-3 font-serif text-lg font-semibold text-[#152238]">
                    <Link href={`/blog/${post.slug}`} className="hover:text-[#8a6914]">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[#475569]">{post.excerpt}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </SeoShell>
  );
}
