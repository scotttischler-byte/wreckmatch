"use client";

import Link from "next/link";
import type { AttorneyMatch } from "@/lib/wreckmatch/models/match";
import { WmCard } from "@/components/wreckmatch/ui/WmPrimitives";

export function AttorneyMatchCard({ match }: { match: AttorneyMatch }) {
  return (
    <WmCard>
      <p className="text-base font-semibold text-[#2B2B2B]">{match.name}</p>
      <p className="mt-1 text-sm text-[#5C5C5C]">{match.state}</p>
      <p className="mt-3 text-sm leading-relaxed text-[#5C5C5C]">{match.match_reason}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {match.practice_areas.map((area) => (
          <span
            key={area}
            className="rounded-full bg-[#006D77]/8 px-2.5 py-1 text-xs text-[#006D77]"
          >
            {area}
          </span>
        ))}
      </div>
      <Link
        href={`/matches/attorney/${match.id}`}
        className="mt-4 inline-flex text-sm font-medium text-[#006D77] hover:underline"
      >
        View profile
      </Link>
    </WmCard>
  );
}
