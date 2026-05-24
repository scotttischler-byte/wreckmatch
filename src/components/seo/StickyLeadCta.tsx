"use client";

import Link from "next/link";
import { Phone } from "lucide-react";
import { SARAH_PHONE_DISPLAY, SARAH_PHONE_TEL } from "@/lib/constants";
import { trackWreckmatchEvent } from "@/lib/analytics";

export function StickyLeadCta({ label = "Free attorney match" }: { label?: string }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#e7dccb] bg-white/95 p-3 backdrop-blur sm:hidden">
      <div className="flex gap-2">
        <Link
          href="#match-form"
          className="flex h-12 flex-[2] items-center justify-center rounded-xl bg-[#c9a227] text-sm font-semibold text-[#152238]"
        >
          {label}
        </Link>
        <a
          href={SARAH_PHONE_TEL}
          onClick={() => trackWreckmatchEvent("phone_click", { source: "sticky_cta" })}
          className="flex h-12 flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#c9a227]/40 bg-[#fcfaf6] text-xs font-semibold text-[#152238]"
        >
          <Phone className="size-3.5 shrink-0" aria-hidden />
          <span className="truncate">{SARAH_PHONE_DISPLAY}</span>
        </a>
      </div>
    </div>
  );
}
