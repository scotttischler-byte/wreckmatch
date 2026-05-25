import Link from "next/link";
import type { TeamMember } from "@/lib/team/people";
import { displayName, teamMemberPath } from "@/lib/team/people";
import { TeamPortrait } from "@/components/team/TeamPortrait";

type TeamMemberCardProps = {
  member: TeamMember;
};

export function TeamMemberCard({ member }: TeamMemberCardProps) {
  return (
    <article className="flex h-full flex-col rounded-[1.35rem] border border-[#e7dccb] bg-white p-6 shadow-[0_22px_50px_-34px_rgba(15,23,42,0.18)]">
      <div className="flex flex-col items-center text-center">
        <TeamPortrait member={member} />
        <p className="mt-4 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#8a6914]">
          {member.jobTitle}
        </p>
        <h2 className="mt-2 font-serif text-2xl font-semibold tracking-[-0.02em] text-[#152238]">
          {displayName(member)}
        </h2>
      </div>
      <p className="mt-5 flex-1 text-sm leading-[1.85] text-[#475569]">{member.description}</p>
      {member.quote ? (
        <blockquote className="mt-5 border-l-2 border-[#c9a227]/40 pl-4">
          <p className="text-sm italic leading-relaxed text-[#64748b]">&ldquo;{member.quote}&rdquo;</p>
        </blockquote>
      ) : null}
      <Link
        href={teamMemberPath(member.slug)}
        className="mt-6 inline-flex items-center justify-center rounded-full border border-[#c9a227]/30 bg-[#fcfaf6] px-4 py-2.5 text-sm font-semibold text-[#8a6914] transition hover:border-[#c9a227]/55 hover:text-[#152238]"
      >
        Read full bio
      </Link>
      {member.linkedinUrl ? (
        <a
          href={member.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 block text-center text-xs font-medium text-[#64748b] underline underline-offset-2 hover:text-[#8a6914]"
        >
          LinkedIn profile
        </a>
      ) : null}
    </article>
  );
}
