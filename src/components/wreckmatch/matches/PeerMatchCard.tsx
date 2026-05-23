import type { PeerMatch } from "@/lib/wreckmatch/models/match";
import { WmCard } from "@/components/wreckmatch/ui/WmPrimitives";

export function PeerMatchCard({ match }: { match: PeerMatch }) {
  return (
    <WmCard className="min-w-[240px] shrink-0">
      <p className="text-sm font-semibold text-[#2B2B2B]">{match.display_name}</p>
      <p className="mt-1 text-xs text-[#5C5C5C]">
        {match.wreck_type} · {match.state}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-[#5C5C5C]">{match.shared_note}</p>
    </WmCard>
  );
}
