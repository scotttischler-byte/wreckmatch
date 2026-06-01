"use client";

import { Scale } from "lucide-react";
import { BgLink } from "@/components/bobbygarcia/BgLink";
import { BgLanguageSwitcher } from "@/components/bobbygarcia/BgLanguageSwitcher";
import { useBgLocale } from "@/components/bobbygarcia/BgLocaleProvider";
import { BG_BASE_URL, BG_PHONE_DISPLAY, BG_PHONE_E164 } from "@/lib/bobbygarcia/site";

export function BgHeader() {
  const { messages } = useBgLocale();
  const nav = messages.nav;

  const NAV_LINKS = [
    { href: `${BG_BASE_URL}/`, label: nav.home, external: true },
    { href: "/meet-our-attorneys", label: nav.attorneys, external: false },
    { href: `${BG_BASE_URL}/aboutbobbygarcia/`, label: nav.about, external: true },
    { href: `${BG_BASE_URL}/contactus/`, label: nav.contact, external: true },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[#c9a227]/20 bg-[#0a1220]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <BgLink href="/meet-our-attorneys" className="flex min-w-0 items-center gap-2.5 text-white transition hover:text-[#c9a227]">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#c9a227]/15 text-[#c9a227]">
            <Scale className="size-5" aria-hidden />
          </span>
          <span className="min-w-0 text-left">
            <span className="block truncate font-serif text-[1.05rem] font-semibold tracking-[-0.02em]">
              {messages.meta.siteName}
            </span>
          </span>
        </BgLink>

        <nav
          aria-label={nav.ariaMain}
          className="hidden items-center gap-5 text-sm font-medium text-[#b8c4d4] lg:flex"
        >
          {NAV_LINKS.map((link) =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                className="transition hover:text-white"
              >
                {link.label}
              </a>
            ) : (
              <BgLink key={link.href} href={link.href} className="transition hover:text-white">
                {link.label}
              </BgLink>
            ),
          )}
          <BgLanguageSwitcher />
          <a
            href={`tel:${BG_PHONE_E164}`}
            className="rounded-full bg-[#c9a227] px-4 py-2 font-semibold text-[#0a1220] transition hover:bg-[#dbb84a]"
          >
            {nav.callNow}
          </a>
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <BgLanguageSwitcher />
          <a
            href={`tel:${BG_PHONE_E164}`}
            className="rounded-full bg-[#c9a227] px-3.5 py-2 text-sm font-semibold text-[#0a1220]"
            aria-label={`${nav.callNow} ${BG_PHONE_DISPLAY}`}
          >
            {nav.callNow}
          </a>
        </div>
      </div>
    </header>
  );
}
