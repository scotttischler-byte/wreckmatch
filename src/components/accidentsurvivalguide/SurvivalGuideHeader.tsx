"use client";

import { BookOpen } from "lucide-react";
import { AsgLink } from "@/components/accidentsurvivalguide/AsgLink";
import { LanguageSwitcher } from "@/components/accidentsurvivalguide/LanguageSwitcher";
import { useAsgLocale } from "@/components/accidentsurvivalguide/AsgLocaleProvider";

export function SurvivalGuideHeader() {
  const { messages } = useAsgLocale();
  const nav = messages.nav;

  const NAV_LINKS = [
    { href: "/#first-24-hours", label: nav.first24 },
    { href: "/calculator", label: nav.calculator },
    { href: "/resources", label: nav.resources },
    { href: "/blog", label: nav.blog },
    { href: "/about", label: nav.about },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[#c5dce8]/70 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <AsgLink href="/" className="flex min-w-0 items-center gap-2.5 text-[#1a3a52] transition hover:text-[#0d5c7a]">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#e8f4fa] text-[#2a7a9b]">
            <BookOpen className="size-5" aria-hidden />
          </span>
          <span className="min-w-0 text-left">
            <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#5b8fa8]">
              {nav.eyebrow}
            </span>
            <span className="block truncate font-serif text-[1.05rem] font-semibold tracking-[-0.02em]">
              {messages.meta.siteName}
            </span>
          </span>
        </AsgLink>

        <nav
          aria-label={nav.ariaMain}
          className="hidden items-center gap-5 text-sm font-medium text-[#4a6578] lg:flex"
        >
          {NAV_LINKS.map((link) => (
            <AsgLink key={link.href} href={link.href} className="transition hover:text-[#1a3a52]">
              {link.label}
            </AsgLink>
          ))}
          <LanguageSwitcher />
          <AsgLink
            href="/#download"
            className="rounded-full bg-[#2a7a9b] px-4 py-2 text-white transition hover:bg-[#236884]"
          >
            {nav.getGuide}
          </AsgLink>
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitcher />
          <AsgLink
            href="/#download"
            className="rounded-full bg-[#2a7a9b] px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-[#236884]"
          >
            {nav.freeGuide}
          </AsgLink>
        </div>
      </div>
    </header>
  );
}
