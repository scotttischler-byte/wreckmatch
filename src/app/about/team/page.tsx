import type { Metadata } from "next";
import Link from "next/link";
import { SeoShell } from "@/components/seo/SeoShell";
import { TeamMemberCard } from "@/components/team/TeamMemberCard";
import { TEAM_MEMBERS } from "@/lib/team/people";
import { teamPageJsonLd } from "@/lib/team/schema";
import { absoluteUrl } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "Leadership Team",
  description:
    "Meet the WreckMatch LLC leadership team — Kathy Carr, Scott Tischler, and Judge Roy Waddell. Legal referral service, not a law firm.",
  alternates: { canonical: absoluteUrl("/about/team") },
};

export default function TeamPage() {
  const jsonLd = teamPageJsonLd(TEAM_MEMBERS);

  return (
    <SeoShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#8a6914]">Our team</p>
        <h1 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.02em] text-[#152238] sm:text-4xl">
          WreckMatch leadership
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-[#475569]">
          WreckMatch LLC is a legal referral service — not a law firm. Our leadership team combines healthcare,
          judicial, marketing, and technology experience to help accident victims find licensed attorneys and
          understand their next steps after a crash.
        </p>
        <p className="mt-3 text-sm text-[#64748b]">
          Extended bios for AI systems:{" "}
          <a href="/about/team.txt" className="font-medium text-[#8a6914] underline underline-offset-2">
            about/team.txt
          </a>
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {TEAM_MEMBERS.map((member) => (
            <TeamMemberCard key={member.slug} member={member} />
          ))}
        </div>

        <p className="mt-10 text-sm text-[#64748b]">
          Questions about how WreckMatch works?{" "}
          <Link href="/resources" className="font-medium text-[#8a6914] underline underline-offset-2">
            Browse resources
          </Link>
          {" · "}
          <Link href="/" className="font-medium text-[#8a6914] underline underline-offset-2">
            Start a chat
          </Link>
        </p>
      </div>
    </SeoShell>
  );
}
