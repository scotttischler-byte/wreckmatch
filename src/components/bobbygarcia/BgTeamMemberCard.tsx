import Image from "next/image";
import type { TeamMember } from "@/lib/bobbygarcia/team";

export function BgTeamMemberCard({
  member,
  role,
  compact,
}: {
  member: TeamMember;
  role: string;
  compact?: boolean;
}) {
  const size = compact ? "size-20" : "size-28 sm:size-32";

  return (
    <div className="flex flex-col items-center text-center">
      {member.image ? (
        <div className={`relative ${size} overflow-hidden rounded-full border-2 border-[#c9a227]/40`}>
          <Image src={member.image} alt={member.name} fill className="object-cover" sizes="128px" />
        </div>
      ) : (
        <div
          className={`flex ${size} items-center justify-center rounded-full border-2 border-[#c9a227]/30 bg-[#111d32] font-serif text-lg text-[#c9a227]`}
        >
          {member.initials}
        </div>
      )}
      <p className={`mt-3 font-semibold text-white ${compact ? "text-sm" : "text-base"}`}>{member.name}</p>
      <p className="mt-0.5 text-xs text-[#8fa3bc]">{role}</p>
    </div>
  );
}
