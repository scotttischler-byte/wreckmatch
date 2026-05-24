"use client";

import { Heart, Sparkles } from "lucide-react";
import { useWmLocale } from "@/lib/wreckmatch/context/WmLocaleProvider";
import { cn } from "@/lib/utils";

type QuickActionsProps = {
  onStruggling?: () => void;
  onShareWin?: () => void;
};

export function QuickActions({ onStruggling, onShareWin }: QuickActionsProps) {
  const { messages } = useWmLocale();
  const t = messages.quick;

  return (
    <div className="grid grid-cols-1 gap-3">
      <button
        type="button"
        onClick={onStruggling}
        className={cn(
          "wm-press flex min-h-[4.5rem] items-center gap-4 rounded-2xl border border-[#FF8C42]/25",
          "bg-gradient-to-r from-[#FF8C42]/10 via-white to-white p-4 text-left",
          "transition hover:border-[#FF8C42]/40 hover:shadow-sm active:bg-[#FF8C42]/5",
        )}
      >
        <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#FF8C42] text-white shadow-[0_4px_14px_-4px_rgba(255,140,66,0.45)]">
          <Heart className="size-5" aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold text-[#2B2B2B]">{t.struggling}</span>
          <span className="mt-0.5 block text-sm text-[#5C5C5C]">{t.strugglingDescription}</span>
        </span>
      </button>

      <button
        type="button"
        onClick={onShareWin}
        className={cn(
          "wm-press flex min-h-[4.5rem] items-center gap-4 rounded-2xl border border-[#006D77]/15",
          "bg-gradient-to-r from-[#006D77]/8 via-white to-white p-4 text-left",
          "transition hover:border-[#006D77]/30 hover:shadow-sm active:bg-[#006D77]/5",
        )}
      >
        <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#006D77] text-white shadow-[0_4px_14px_-4px_rgba(0,109,119,0.4)]">
          <Sparkles className="size-5" aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold text-[#2B2B2B]">{t.shareWin}</span>
          <span className="mt-0.5 block text-sm text-[#5C5C5C]">{t.shareWinDescription}</span>
        </span>
      </button>
    </div>
  );
}
