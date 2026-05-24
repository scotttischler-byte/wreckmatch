"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { GetMatchedForm } from "@/components/wreckmatch/support/GetMatchedForm";
import { SarahSupportCard } from "@/components/wreckmatch/support/SarahSupportCard";
import { WmLanguageSwitcher } from "@/components/wreckmatch/WmLanguageSwitcher";
import { WmCard } from "@/components/wreckmatch/ui/WmPrimitives";
import { useWmLocale } from "@/lib/wreckmatch/context/WmLocaleProvider";
import { isDemoMode } from "@/lib/wreckmatch/supabase/config";
import { WRECKMATCH_APP_NAME } from "@/lib/wreckmatch/site";
import { wm } from "@/lib/wreckmatch/theme";

export function SplashPageContent() {
  const { messages } = useWmLocale();

  return (
    <main className={`${wm.pageSplash} wm-shell-bg`}>
      <div className="mx-auto max-w-lg">
        <div className="mb-8 flex justify-center pt-2">
          <WmLanguageSwitcher variant="prominent" />
        </div>

        <header className="text-center">
          <div className="mx-auto inline-flex size-[4.5rem] items-center justify-center rounded-full bg-gradient-to-br from-[#006D77]/15 to-[#FF8C42]/15 ring-1 ring-[#006D77]/10">
            <Heart className="size-9 text-[#FF8C42]" aria-hidden />
          </div>
          <h1 className="mt-6 text-[1.875rem] font-semibold leading-tight tracking-tight text-[#2B2B2B] sm:text-3xl">
            {WRECKMATCH_APP_NAME}
          </h1>
          <p className="mt-3 text-lg leading-relaxed text-[#5C5C5C]">{messages.tagline}</p>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-[#5C5C5C]/90">
            {messages.splash.subtitle}
          </p>
        </header>

        <section className="mt-8 space-y-5">
          <SarahSupportCard variant="hero" />
          <WmCard>
            <GetMatchedForm source="wreckmatch-splash" compact />
          </WmCard>
        </section>

        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/onboarding"
            className="wm-press inline-flex min-h-14 w-full items-center justify-center rounded-2xl bg-[#006D77] px-6 text-base font-semibold text-white transition hover:bg-[#005a62] active:bg-[#004950]"
          >
            {messages.splash.createProfile}
          </Link>
          {isDemoMode() && (
            <Link
              href="/home"
              className="wm-press inline-flex min-h-14 w-full items-center justify-center rounded-2xl border border-[#006D77]/22 bg-white px-6 text-base font-semibold text-[#006D77] transition hover:bg-[#006D77]/5"
            >
              {messages.splash.exploreApp}
            </Link>
          )}
          <Link
            href="/login"
            className="inline-flex min-h-12 w-full items-center justify-center text-sm font-medium text-[#5C5C5C] hover:text-[#006D77]"
          >
            {messages.splash.hasAccount}
          </Link>
        </div>
      </div>
    </main>
  );
}
