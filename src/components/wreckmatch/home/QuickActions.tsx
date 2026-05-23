"use client";

import { Heart, Sparkles } from "lucide-react";
import { WmButton } from "@/components/wreckmatch/ui/WmPrimitives";

type QuickActionsProps = {
  onStruggling?: () => void;
  onShareWin?: () => void;
};

export function QuickActions({ onStruggling, onShareWin }: QuickActionsProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <WmButton
        type="button"
        variant="outline"
        className="h-auto min-h-14 justify-start gap-3 px-4 py-4 text-left"
        onClick={onStruggling}
      >
        <Heart className="size-5 shrink-0 text-[#FF8C42]" aria-hidden />
        <span>
          <span className="block font-semibold">I&apos;m struggling today</span>
          <span className="block text-xs font-normal text-[#5C5C5C]">
            Reach out to the community
          </span>
        </span>
      </WmButton>
      <WmButton
        type="button"
        className="h-auto min-h-14 justify-start gap-3 px-4 py-4 text-left"
        onClick={onShareWin}
      >
        <Sparkles className="size-5 shrink-0" aria-hidden />
        <span>
          <span className="block font-semibold">Share a win</span>
          <span className="block text-xs font-normal text-white/85">
            Celebrate progress, big or small
          </span>
        </span>
      </WmButton>
    </div>
  );
}
