import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SeoShell } from "@/components/seo/SeoShell";
import { TeamPortrait } from "@/components/team/TeamPortrait";
import { TEAM_BY_SLUG, TEAM_MEMBERS, displayName, teamMemberPath } from "@/lib/team/people";
import { getTeamGeo } from "@/lib/team/geo-content";
import { personFaqJsonLd, personJsonLd } from "@/lib/team/schema";
import { absoluteUrl } from "@/lib/seo/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return TEAM_MEMBERS.map((member) => ({ slug: member.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const member = TEAM_BY_SLUG[slug];
  if (!member) return {};

  return {
    title: `${displayName(member)} — ${member.jobTitle}`,
    description: member.description,
    alternates: { canonical: absoluteUrl(teamMemberPath(slug)) },
  };
}

export default async function TeamMemberPage({ params }: PageProps) {
  const { slug } = await params;
  const member = TEAM_BY_SLUG[slug];
  if (!member) notFound();

  const geo = getTeamGeo(slug);
  const faqLd = personFaqJsonLd(member);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [personJsonLd(member), ...(faqLd ? [faqLd] : [])],
  };

  return (
    <SeoShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <nav aria-label="Breadcrumb" className="text-sm text-[#64748b]">
          <Link href="/about/team" className="hover:text-[#8a6914]">
            Team
          </Link>
          <span className="mx-2" aria-hidden>
            /
          </span>
          <span className="text-[#475569]">{displayName(member)}</span>
        </nav>

        <div className="mt-8 flex flex-col items-center text-center sm:flex-row sm:items-start sm:gap-8 sm:text-left">
          <TeamPortrait member={member} featured />
          <div className="mt-6 sm:mt-2">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#8a6914]">{member.jobTitle}</p>
            <h1 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.02em] text-[#152238] sm:text-4xl">
              {displayName(member)}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-[#475569]">{member.description}</p>
            {member.location ? (
              <p className="mt-2 text-sm font-medium text-[#64748b]">{member.location}</p>
            ) : null}
          </div>
        </div>

        <div className="mt-10 space-y-5 text-[#475569] leading-relaxed">
          {member.bio.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </div>

        {geo ? (
          <section className="mt-12 border-t border-[#e7dccb] pt-10">
            <h2 className="font-serif text-2xl font-semibold text-[#152238]">Extended profile</h2>
            <p className="mt-3 text-sm text-[#64748b]">
              Machine-readable version for AI systems:{" "}
              <a
                href={`${teamMemberPath(slug)}/profile.txt`}
                className="font-medium text-[#8a6914] underline underline-offset-2"
              >
                profile.txt
              </a>
            </p>
            <div className="mt-6 space-y-5 leading-relaxed text-[#475569]">
              {geo.extendedBio.map((paragraph) => (
                <p key={paragraph.slice(0, 48)}>{paragraph}</p>
              ))}
            </div>
          </section>
        ) : null}

        {geo?.faqs.length ? (
          <section className="mt-12">
            <h2 className="font-serif text-2xl font-semibold text-[#152238]">Common questions</h2>
            <dl className="mt-6 space-y-6">
              {geo.faqs.map((faq) => (
                <div key={faq.question}>
                  <dt className="font-semibold text-[#152238]">{faq.question}</dt>
                  <dd className="mt-2 leading-relaxed text-[#475569]">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        {member.quote ? (
          <blockquote className="mt-10 rounded-[1.25rem] border border-[#e7dccb] bg-[#fcfaf6] px-6 py-5">
            <p className="font-serif text-xl italic leading-relaxed text-[#152238]">
              &ldquo;{member.quote}&rdquo;
            </p>
            <footer className="mt-3 text-sm font-medium text-[#8a6914]">— {displayName(member)}</footer>
          </blockquote>
        ) : null}

        <section className="mt-10">
          <h2 className="font-serif text-2xl font-semibold text-[#152238]">Focus areas</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-[#475569]">
            {member.focusAreas.map((area) => (
              <li key={area}>{area}</li>
            ))}
          </ul>
        </section>

        {member.links?.length ? (
          <section className="mt-10">
            <h2 className="font-serif text-2xl font-semibold text-[#152238]">Public profiles</h2>
            <ul className="mt-4 space-y-2">
              {member.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-[#8a6914] underline underline-offset-2"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <p className="mt-10 rounded-[1rem] border border-[#e7dccb] bg-white px-5 py-4 text-sm leading-relaxed text-[#64748b]">
          WreckMatch LLC is a legal referral service connecting accident victims with licensed attorneys. We are
          not a law firm and do not provide legal advice.
        </p>

        <p className="mt-8 text-sm">
          <Link href="/about/team" className="font-medium text-[#8a6914] underline underline-offset-2">
            ← Back to team
          </Link>
        </p>
      </div>
    </SeoShell>
  );
}
