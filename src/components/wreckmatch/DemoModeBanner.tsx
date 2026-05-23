"use client";

import Link from "next/link";
import { isDemoMode } from "@/lib/wreckmatch/supabase/config";

export function DemoModeBanner() {
  if (!isDemoMode()) return null;

  return (
    <div
      role="status"
      className="border-b border-[#FF8C42]/25 bg-[#FF8C42]/10 px-4 py-2.5 text-center text-xs leading-relaxed text-[#5C5C5C] sm:text-sm"
    >
      <strong className="font-medium text-[#2B2B2B]">Demo mode</strong> — browsing with
      sample data. Add Supabase keys to{" "}
      <code className="rounded bg-white/60 px-1">.env.local</code> for real accounts.{" "}
      <Link href="/splash" className="font-medium text-[#006D77] hover:underline">
        Setup guide
      </Link>
    </div>
  );
}
