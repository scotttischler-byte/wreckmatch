"use client";

import Image from "next/image";
import { useState } from "react";
import { BgLink } from "@/components/bobbygarcia/BgLink";
import { BgLanguageSwitcher } from "@/components/bobbygarcia/BgLanguageSwitcher";
import { useBgLocale } from "@/components/bobbygarcia/BgLocaleProvider";
import { BG_PHONE_E164 } from "@/lib/bobbygarcia/site";
import { cn } from "@/lib/utils";

export function BgHeader() {
  const { locale, messages } = useBgLocale();
  const nav = messages.nav;
  const es = locale === "es";
  const [open, setOpen] = useState(false);

  const NAV_LINKS = [
    { href: "/", label: nav.home },
    { href: "/practice-areas", label: nav.practice },
    { href: "/meet-our-attorneys", label: nav.attorneys },
    { href: "/blog", label: nav.blog },
    { href: "/about", label: nav.about },
    { href: "/contact", label: nav.contact },
  ];

  return (
    <header className="sticky top-0 z-40">
      <div className="border-b border-[#c9a227]/25 bg-[#c9a227] text-[#0a1220]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] sm:px-6 sm:text-xs">
          <p className="truncate">
            {es ? "Equipo bilingüe · Inglés y Español · Consulta gratuita 24/7" : "Bilingual team · English & Español · Free 24/7 consultation"}
          </p>
          <BgLanguageSwitcher className="shrink-0 border-[#0a1220]/20 bg-[#0a1220]/10" />
        </div>
      </div>

      <div className="border-b border-[#c9a227]/20 bg-[#0a1220]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <BgLink href="/" className="flex shrink-0 items-center">
            <Image
              src="/bobbygarcia/brand/logo-white.png"
              alt={messages.meta.siteName}
              width={180}
              height={40}
              className="h-8 w-auto sm:h-9"
              priority
            />
          </BgLink>

          <nav aria-label={nav.ariaMain} className="hidden items-center gap-4 text-sm font-medium text-[#b8c4d4] xl:flex">
            {NAV_LINKS.map((link) => (
              <BgLink key={link.href} href={link.href} className="transition hover:text-white">
                {link.label}
              </BgLink>
            ))}
            <a
              href={`tel:${BG_PHONE_E164}`}
              className="rounded-full bg-[#c9a227] px-4 py-2 font-semibold text-[#0a1220] transition hover:bg-[#dbb84a]"
            >
              {nav.callNow}
            </a>
          </nav>

          <div className="flex items-center gap-2 xl:hidden">
            <button
              type="button"
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
              className="rounded-lg border border-[#c9a227]/40 p-2 text-[#c9a227]"
            >
              <span className="sr-only">Menu</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {open ? (
                  <path d="M6 6l12 12M18 6L6 18" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>
            <a
              href={`tel:${BG_PHONE_E164}`}
              className="rounded-full bg-[#c9a227] px-3 py-2 text-xs font-semibold text-[#0a1220]"
            >
              {nav.callNow}
            </a>
          </div>
        </div>

        <nav
          aria-label={nav.ariaMain}
          className={cn(
            "border-t border-[#c9a227]/15 bg-[#0a1220] xl:hidden",
            open ? "block" : "hidden",
          )}
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 sm:px-6">
            {NAV_LINKS.map((link) => (
              <BgLink
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-[#d4dce8] hover:bg-[#111d32] hover:text-white"
              >
                {link.label}
              </BgLink>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
