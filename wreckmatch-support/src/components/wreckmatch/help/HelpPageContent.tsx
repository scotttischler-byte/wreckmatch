"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Phone, Shield, Users } from "lucide-react";
import { GroundingExercise } from "@/components/wreckmatch/help/GroundingExercise";
import { GetMatchedForm } from "@/components/wreckmatch/support/GetMatchedForm";
import { SarahSupportCard } from "@/components/wreckmatch/support/SarahSupportCard";
import {
  WmActionLink,
  WmCard,
  WmSection,
} from "@/components/wreckmatch/ui/WmPrimitives";
import { useWmLocale } from "@/lib/wreckmatch/context/WmLocaleProvider";
import { WM } from "@/lib/wreckmatch/routes";
import { CRISIS_PHONE, CRISIS_PHONE_HREF } from "@/lib/wreckmatch/site";
import { wm } from "@/lib/wreckmatch/theme";

export function HelpPageContent() {
  const router = useRouter();
  const { messages } = useWmLocale();
  const t = messages.help;

  return (
    <main className={wm.page}>
      <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#006D77] to-[#004950] px-5 py-8 text-white shadow-[0_12px_40px_-16px_rgba(0,109,119,0.45)]">
        <div className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-6 -left-6 size-24 rounded-full bg-[#FF8C42]/20 blur-xl" />
        <p className="relative text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
          {t.supportNow}
        </p>
        <h1 className="relative mt-2 text-[1.625rem] font-semibold leading-tight tracking-tight sm:text-2xl">
          {t.title}
        </h1>
        <p className="relative mt-3 text-sm leading-relaxed text-white/85 sm:text-base">
          {t.subtitle}
        </p>
      </header>

      <section className="mt-6">
        <SarahSupportCard variant="hero" />
      </section>

      <WmSection title={t.requestHelp} description={t.requestHelpDescription}>
        <WmCard className="p-5 sm:p-6">
          <GetMatchedForm source="wreckmatch-help" />
        </WmCard>
      </WmSection>

      <WmSection
        title={t.emergencyResources}
        description={t.emergencyDescription}
        className="mt-8"
      >
        <div className="space-y-3">
          <WmActionLink
            href={CRISIS_PHONE_HREF}
            icon={<Phone className="size-5" aria-hidden />}
            title={t.crisis988}
            description={t.crisis988Description.replace("{phone}", CRISIS_PHONE)}
            accent="orange"
          />
          <WmActionLink
            href="tel:911"
            icon={<Shield className="size-5" aria-hidden />}
            title={t.medicalEmergency}
            description={t.medicalEmergencyDescription}
            accent="neutral"
          />
        </div>
      </WmSection>

      <WmSection title={t.calmBody} className="mt-8">
        <GroundingExercise />
      </WmSection>

      <WmSection
        title={t.connectOthers}
        description={t.connectOthersDescription}
        className="mt-8"
      >
        <div className="grid gap-3">
          <button
            type="button"
            onClick={() => router.push(WM.community)}
            className="wm-press flex min-h-[4.25rem] items-center gap-4 rounded-2xl border border-[#006D77]/12 bg-white p-4 text-left transition hover:border-[#006D77]/25 active:bg-[#F8F5F2]"
          >
            <span className="inline-flex size-11 items-center justify-center rounded-xl bg-[#006D77]/10 text-[#006D77]">
              <Users className="size-5" aria-hidden />
            </span>
            <span>
              <span className="block font-semibold text-[#2B2B2B]">{t.communityFeed}</span>
              <span className="block text-sm text-[#5C5C5C]">{t.communityFeedDescription}</span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => router.push(WM.home)}
            className="wm-press flex min-h-[4.25rem] items-center gap-4 rounded-2xl border border-[#006D77]/12 bg-[#006D77] p-4 text-left text-white transition active:bg-[#005a62]"
          >
            <span className="inline-flex size-11 items-center justify-center rounded-xl bg-white/15">
              <Heart className="size-5" aria-hidden />
            </span>
            <span>
              <span className="block font-semibold">{t.shareHowYouFeel}</span>
              <span className="block text-sm text-white/85">{t.shareHowYouFeelDescription}</span>
            </span>
          </button>
        </div>
      </WmSection>

      <section className="mt-8 rounded-2xl border border-[#006D77]/10 bg-white/90 p-5">
        <p className="text-sm leading-relaxed text-[#5C5C5C]">{messages.legal.auth}</p>
        <p className="mt-3 text-xs leading-relaxed text-[#5C5C5C]/90">{messages.legal.medical}</p>
        <Link
          href={WM.resources}
          className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-[#006D77]"
        >
          {t.moreResources}
        </Link>
      </section>
    </main>
  );
}
