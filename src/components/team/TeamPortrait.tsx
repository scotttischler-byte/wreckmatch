import Image from "next/image";
import type { TeamMember } from "@/lib/team/people";
import { displayName } from "@/lib/team/people";

type TeamPortraitProps = {
  member: TeamMember;
  featured?: boolean;
};

export function TeamPortrait({ member, featured }: TeamPortraitProps) {
  const size = featured ? "size-40 sm:size-48" : "size-28 sm:size-32";
  const name = displayName(member);

  if (member.image) {
    return (
      <div
        className={`relative ${size} shrink-0 overflow-hidden rounded-full border-2 border-[#c9a227]/45 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.35)]`}
      >
        <Image src={member.image} alt={name} fill className="object-cover" sizes={featured ? "192px" : "128px"} />
      </div>
    );
  }

  return (
    <div
      className={`flex ${size} shrink-0 items-center justify-center rounded-full border-2 border-[#c9a227]/40 bg-gradient-to-br from-[#0c1f3f] to-[#081428] font-serif text-2xl font-semibold text-[#fde68a] shadow-[0_18px_40px_-24px_rgba(15,23,42,0.35)] sm:text-3xl`}
      aria-hidden
    >
      {member.initials}
    </div>
  );
}
