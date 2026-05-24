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
        className="wm-press mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#006D77] px-4 text-sm font-semibold text-white transition hover:bg-[#005a62] active:bg-[#004950]"
      >
        Request intro
      </Link>
    </WmCard>
  );
}
