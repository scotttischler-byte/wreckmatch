"use client";

import { MessageCircle, Phone } from "lucide-react";
import { WmButton, WmCard } from "@/components/wreckmatch/ui/WmPrimitives";
import { SARAH_PHONE_DISPLAY, SARAH_PHONE_E164 } from "@/lib/constants";
import { useWmLocale } from "@/lib/wreckmatch/context/WmLocaleProvider";
import { openSarahChat } from "@/lib/open-sarah-chat";
import { cn } from "@/lib/utils";

type SarahSupportCardProps = {
  variant?: "default" | "hero" | "compact";
  className?: string;
};

export function SarahSupportCard({
  variant = "default",
  className,
}: SarahSupportCardProps) {
  const { messages } = useWmLocale();
  const t = messages.sarah;
  const isHero = variant === "hero";
  const isCompact = variant === "compact";

  if (isCompact) {
    return (
      <WmCard
        className={cn(
          "overflow-hidden border-[#006D77]/15 bg-gradient-to-br from-[#006D77]/6 via-white to-white p-0",
          className,
        )}
      >
        <div className="p-5">
          <div className="flex items-center gap-3">
            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-[#006D77] text-lg font-semibold text-white">
              S
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-[#2B2B2B]">{t.hereForYou}</p>
              <p className="text-sm text-[#5C5C5C]">{t.callOrChat247}</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <a
              href={`tel:${SARAH_PHONE_E164}`}
              className="wm-press inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#006D77] px-3 text-sm font-semibold text-white"
            >
              <Phone className="size-4" aria-hidden />
              {t.call}
            </a>
            <WmButton
              type="button"
              variant="outline"
              className="min-h-12 w-full text-sm"
              onClick={() => openSarahChat()}
            >
              <MessageCircle className="mr-1.5 size-4" aria-hidden />
              {t.chat}
            </WmButton>
          </div>
        </div>
      </WmCard>
    );
  }

  return (
    <WmCard
      className={cn(
        "overflow-hidden p-0",
        isHero
          ? "border-[#006D77]/18 shadow-[0_16px_48px_-24px_rgba(0,109,119,0.35)]"
          : "border-[#006D77]/12",
        className,
      )}
    >
      <div className="bg-gradient-to-br from-[#006D77] to-[#004950] px-5 py-6 text-white">
        <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
          <span className="inline-flex size-16 items-center justify-center rounded-full bg-white/15 text-2xl font-semibold ring-2 ring-white/20">
            S
          </span>
          <div className="mt-4 sm:mt-0 sm:ml-4 sm:flex-1">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/70">
              {t.supportGuide}
            </p>
            <p className="mt-1 text-xl font-semibold tracking-tight">{t.talkToSarah}</p>
            <p className="mt-2 text-sm leading-relaxed text-white/85">{t.heroDescription}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3 p-5">
        <a
          href={`tel:${SARAH_PHONE_E164}`}
          className="wm-press flex min-h-[4.5rem] items-center gap-4 rounded-2xl border border-[#006D77]/12 bg-[#F8F5F2] px-4 transition active:bg-[#006D77]/5"
        >
          <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#FF8C42] text-white">
            <Phone className="size-5" aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-medium uppercase tracking-wide text-[#5C5C5C]">
              {t.callOrText}
            </span>
            <span className="block text-xl font-semibold tracking-wide text-[#006D77]">
              {SARAH_PHONE_DISPLAY}
            </span>
          </span>
        </a>

        <WmButton type="button" size="xl" className="w-full" onClick={() => openSarahChat()}>
          <MessageCircle className="mr-2 size-5" aria-hidden />
          {t.chatWithSarah}
        </WmButton>
      </div>
    </WmCard>
  );
}
