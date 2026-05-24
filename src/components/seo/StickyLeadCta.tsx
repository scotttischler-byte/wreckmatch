"use client";

import Link from "next/link";

export function StickyLeadCta({ label = "Free attorney match" }: { label?: string }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#e7dccb] bg-white/95 p-3 backdrop-blur sm:hidden">
      <Link
        href="#match-form"
        className="flex h-12 w-full items-center justify-center rounded-xl bg-[#c9a227] text-sm font-semibold text-[#152238]"
      >
        {label}
      </Link>
    </div>
  );
}
