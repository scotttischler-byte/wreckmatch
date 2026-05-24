"use client";

import Link from "next/link";
import { HeartHandshake } from "lucide-react";
import { useWmLocale } from "@/lib/wreckmatch/context/WmLocaleProvider";
import { cn } from "@/lib/utils";

type CrisisHelpButtonProps = {
  className?: string;
};

export function CrisisHelpButton({ className }: CrisisHelpButtonProps) {
  const { messages } = useWmLocale();

  return (
    <Link
      href="/help"
      className={cn(
        "fixed right-4 z-50 hidden items-center gap-2 rounded-full bg-[#FF8C42] px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(255,140,66,0.55)] transition hover:bg-[#e67a35] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8C42]/40 bottom-6 md:inline-flex",
        className,
      )}
      aria-label={messages.crisis.ariaLabel}
    >
      <HeartHandshake className="size-4" aria-hidden />
      {messages.crisis.supportNow}
    </Link>
  );
}
