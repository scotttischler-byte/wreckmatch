"use client";

import { createContext, useContext, useMemo } from "react";
import { usePathname } from "next/navigation";
import type { BgLocale } from "@/lib/bobbygarcia/i18n/config";
import type { BgMessages } from "@/lib/bobbygarcia/i18n/get-messages";
import { parseBgLocaleFromPathname, resolveBgHref } from "@/lib/bobbygarcia/i18n/locale-path";

type BgLocaleContextValue = {
  locale: BgLocale;
  messages: BgMessages;
  href: (path: string) => string;
};

const BgLocaleContext = createContext<BgLocaleContextValue | null>(null);

export function BgLocaleProvider({
  locale: serverLocale,
  messages,
  children,
}: {
  locale: BgLocale;
  messages: BgMessages;
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "/";
  const pathLocale = parseBgLocaleFromPathname(pathname).locale;
  const locale = pathLocale ?? serverLocale;

  const value = useMemo(
    () => ({
      locale,
      messages,
      href: (path: string) => resolveBgHref(pathname, path, locale),
    }),
    [locale, messages, pathname],
  );

  return <BgLocaleContext.Provider value={value}>{children}</BgLocaleContext.Provider>;
}

export function useBgLocale() {
  const ctx = useContext(BgLocaleContext);
  if (!ctx) {
    throw new Error("useBgLocale must be used within BgLocaleProvider");
  }
  return ctx;
}
