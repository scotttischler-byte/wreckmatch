"use client";

import { createContext, useContext, useMemo } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/get-messages";
import { localizeHref } from "@/lib/i18n/locale-path";

type AsgLocaleContextValue = {
  locale: Locale;
  messages: Messages;
  href: (path: string) => string;
};

const AsgLocaleContext = createContext<AsgLocaleContextValue | null>(null);

export function AsgLocaleProvider({
  locale,
  messages,
  children,
}: {
  locale: Locale;
  messages: Messages;
  children: React.ReactNode;
}) {
  const value = useMemo(
    () => ({
      locale,
      messages,
      href: (path: string) => localizeHref(path, locale),
    }),
    [locale, messages],
  );

  return <AsgLocaleContext.Provider value={value}>{children}</AsgLocaleContext.Provider>;
}

export function useAsgLocale() {
  const ctx = useContext(AsgLocaleContext);
  if (!ctx) {
    throw new Error("useAsgLocale must be used within AsgLocaleProvider");
  }
  return ctx;
}
