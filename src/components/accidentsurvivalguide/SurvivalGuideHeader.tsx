"use client";

import { useEffect, useState } from "react";
import { BookOpen, Menu, X } from "lucide-react";
import { AsgLink } from "@/components/accidentsurvivalguide/AsgLink";
import { LanguageSwitcher } from "@/components/accidentsurvivalguide/LanguageSwitcher";
import { useAsgLocale } from "@/components/accidentsurvivalguide/AsgLocaleProvider";
import { asg, asgCn } from "@/components/accidentsurvivalguide/asg-ui";

export function SurvivalGuideHeader() {
  const { messages } = useAsgLocale();
  const nav = messages.nav;
  const [menuOpen, setMenuOpen] = useState(false);

  const NAV_LINKS = [
    { href: "/#first-24-hours", label: nav.first24 },
    { href: "/calculator", label: nav.calculator },
    { href: "/masterclass", label: nav.masterclass },
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
    <header className="sticky top-0 z-40 border-b border-asg-border/70 bg-asg-surface/95 backdrop-blur">
      <div className={asgCn(asg.container, "flex items-center justify-between gap-2 py-3 sm:py-4")}>
        <AsgLink
          href="/"
          className="flex min-w-0 items-center gap-2.5 text-asg-navy transition hover:text-asg-teal"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-asg-elevated text-asg-teal">
            <BookOpen className="size-5" aria-hidden />
          </span>
          <span className="min-w-0 text-left">
            <span className={asg.eyebrow}>{nav.eyebrow}</span>
            <span className="block truncate font-serif text-base font-semibold tracking-tight">
              {messages.meta.siteName}
            </span>
          </span>
        </AsgLink>

        <nav aria-label={nav.ariaMain} className="hidden items-center gap-6 text-sm font-medium text-asg-muted lg:flex">
          {NAV_LINKS.map((link) => (
            <AsgLink key={link.href} href={link.href} className="transition hover:text-asg-navy">
              {link.label}
            </AsgLink>
          ))}
          <LanguageSwitcher />
          <AsgLink href="/#get-help" className={asgCn(asg.btnPrimary, "rounded-full px-4 py-2 text-sm")}>
            {nav.getGuide}
          </AsgLink>
        </nav>

        <div className="flex items-center gap-1.5 lg:hidden">
          <LanguageSwitcher className="shrink-0" />
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg border border-asg-border bg-asg-page text-asg-navy"
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
            className="fixed inset-0 z-40 bg-asg-navy/40 lg:hidden"
            aria-label={nav.menuClose}
            onClick={closeMenu}
          />
          <nav
            aria-label={nav.ariaMain}
            className="fixed inset-x-0 top-14 z-50 max-h-[calc(100dvh-3.5rem)] overflow-y-auto border-b border-asg-border bg-asg-surface px-4 py-4 shadow-lg lg:hidden"
          >
            <ul className="space-y-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <AsgLink
                    href={link.href}
                    onClick={closeMenu}
                    className="flex min-h-[48px] items-center rounded-lg px-4 text-base font-medium text-asg-navy hover:bg-asg-page"
                  >
                    {link.label}
                  </AsgLink>
                </li>
              ))}
              <li className="pt-2">
                <AsgLink
                  href="/#get-help"
                  onClick={closeMenu}
                  className={asgCn(asg.btnPrimary, "w-full")}
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
