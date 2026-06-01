"use client";

import { createContext, useContext, useMemo } from "react";
import type { BgLocale } from "@/lib/bobbygarcia/i18n/config";
import type { BgMessages } from "@/lib/bobbygarcia/i18n/get-messages";
import { localizeBgHref } from "@/lib/bobbygarcia/i18n/locale-path";

type BgLocaleContextValue = {
  locale: BgLocale;
  messages: BgMessages;
  href: (path: string) => string;
};

const BgLocaleContext = createContext<BgLocaleContextValue | null>(null);

export function BgLocaleProvider({
  locale,
  messages,
  children,
}: {
  locale: BgLocale;
  messages: BgMessages;
  children: React.ReactNode;
}) {
  const value = useMemo(
    () => ({
      locale,
      messages,
      href: (path: string) => localizeBgHref(path, locale),
    }),
    [locale, messages],
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
