import Link from "next/link";
import { redirect } from "next/navigation";
import { Heart } from "lucide-react";
import { createClientSafe } from "@/lib/wreckmatch/supabase/server";
import { isSupabaseConfigured } from "@/lib/wreckmatch/supabase/config";
import { WRECKMATCH_APP_NAME, WRECKMATCH_TAGLINE } from "@/lib/wreckmatch/site";

export default async function SplashPage() {
  if (isSupabaseConfigured()) {
    const supabase = await createClientSafe();
    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) redirect("/home");
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#006D77] to-[#004950] px-6 text-center text-white">
      <div className="inline-flex size-16 items-center justify-center rounded-full bg-white/10 backdrop-blur">
        <Heart className="size-8 text-[#FF8C42]" aria-hidden />
      </div>
      <h1 className="mt-8 text-4xl font-semibold tracking-tight">{WRECKMATCH_APP_NAME}</h1>
      <p className="mt-4 max-w-sm text-lg leading-relaxed text-white/90">
        {WRECKMATCH_TAGLINE}
      </p>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-white/75">
        A calm space for connection, support, and healing after a wreck.
      </p>
      <div className="mt-10 flex w-full max-w-xs flex-col gap-3">
        <Link
          href="/onboarding"
          className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-white px-6 py-3 text-base font-medium text-[#006D77] transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        >
          Get started
        </Link>
        <Link
          href="/login"
          className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-white/30 px-6 py-3 text-base font-medium text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        >
          I already have an account
        </Link>
        {!isSupabaseConfigured() && (
          <Link
            href="/home"
            className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-dashed border-white/40 px-6 py-3 text-sm font-medium text-white/90 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            Explore demo (no account needed)
          </Link>
        )}
      </div>
    </main>
  );
}
