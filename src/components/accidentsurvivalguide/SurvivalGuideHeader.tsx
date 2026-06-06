"use client";

import { useEffect, useState } from "react";
import { BookOpen, Menu, X } from "lucide-react";
import { AsgLink } from "@/components/accidentsurvivalguide/AsgLink";
import { LanguageSwitcher } from "@/components/accidentsurvivalguide/LanguageSwitcher";
import { useAsgLocale } from "@/components/accidentsurvivalguide/AsgLocaleProvider";

export function SurvivalGuideHeader() {
  const { messages } = useAsgLocale();
  const nav = messages.nav;
  const [menuOpen, setMenuOpen] = useState(false);

  const NAV_LINKS = [
    { href: "/#first-24-hours", label: nav.first24 },
    { href: "/calculator", label: nav.calculator },
    { href: "/resources", label: nav.resources },
    { href: "/blog", label: nav.blog },
    { href: "/about", label: nav.about },
  ];

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[#c5dce8]/70 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:gap-3 sm:px-6 sm:py-4">
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
            href="/#get-help"
            className="rounded-full bg-[#2a7a9b] px-4 py-2 text-white transition hover:bg-[#236884]"
          >
            {nav.getGuide}
          </AsgLink>
        </nav>

        <div className="flex items-center gap-1.5 lg:hidden">
          <LanguageSwitcher className="shrink-0" />
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-[#c5dce8] bg-[#f4faf8] text-[#1a3a52] transition hover:bg-[#e8f4fa]"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? nav.menuClose : nav.menuOpen}
          >
            {menuOpen ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-[#1a3a52]/40 lg:hidden"
            aria-label={nav.menuClose}
            onClick={closeMenu}
          />
          <nav
            aria-label={nav.ariaMain}
            className="fixed inset-x-0 top-[calc(3.75rem+1px)] z-50 max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-[#c5dce8] bg-white px-4 py-4 shadow-lg lg:hidden"
          >
            <ul className="space-y-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <AsgLink
                    href={link.href}
                    onClick={closeMenu}
                    className="flex min-h-[48px] items-center rounded-xl px-4 text-base font-medium text-[#1a3a52] transition hover:bg-[#f4faf8]"
                  >
                    {link.label}
                  </AsgLink>
                </li>
              ))}
              <li className="pt-2">
                <AsgLink
                  href="/#get-help"
                  onClick={closeMenu}
                  className="flex min-h-[48px] items-center justify-center rounded-xl bg-[#2a7a9b] px-4 text-base font-semibold text-white transition hover:bg-[#236884]"
                >
                  {nav.getGuide}
                </AsgLink>
              </li>
            </ul>
          </nav>
        </>
      ) : null}
    </header>
  );
}
