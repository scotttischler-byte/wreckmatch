import type { PeerMatch } from "@/lib/wreckmatch/models/match";
import { WmCard } from "@/components/wreckmatch/ui/WmPrimitives";
import { cn } from "@/lib/utils";

type PeerMatchCardProps = {
  match: PeerMatch;
  layout?: "scroll" | "stack";
};

export function PeerMatchCard({ match, layout = "scroll" }: PeerMatchCardProps) {
  return (
    <WmCard
      className={cn(
        "p-4 sm:p-5",
        layout === "scroll" && "w-[17.5rem] shrink-0 snap-start sm:w-[18.5rem]",
        layout === "stack" && "w-full",
      )}
    >
      <p className="font-semibold text-[#2B2B2B]">{match.display_name}</p>
      <p className="mt-1 text-xs font-medium text-[#006D77]/80">
        {match.wreck_type} · {match.state}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-[#5C5C5C]">{match.shared_note}</p>
    </WmCard>
  );
}
