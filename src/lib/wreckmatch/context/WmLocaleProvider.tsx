"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  WM_DEFAULT_LOCALE,
  WM_LOCALE_COOKIE,
  wmLocaleHtmlLang,
  type WmLocale,
} from "@/lib/wreckmatch/i18n/config";
import { getWmMessages, type WmMessages } from "@/lib/wreckmatch/i18n/get-messages";

export const WM_LOCALE_CHANGE_EVENT = "wm-locale-change";

type WmLocaleContextValue = {
  locale: WmLocale;
  messages: WmMessages;
  setLocale: (locale: WmLocale) => void;
};

const WmLocaleContext = createContext<WmLocaleContextValue | null>(null);

function setLocaleCookie(locale: WmLocale) {
  document.cookie = `${WM_LOCALE_COOKIE}=${locale};path=/;max-age=31536000;samesite=lax`;
}

export function WmLocaleProvider({
  initialLocale = WM_DEFAULT_LOCALE,
  children,
}: {
  initialLocale?: WmLocale;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<WmLocale>(initialLocale);

  const setLocale = useCallback((next: WmLocale) => {
    setLocaleState(next);
    setLocaleCookie(next);
    document.documentElement.lang = wmLocaleHtmlLang(next);
    window.dispatchEvent(
      new CustomEvent(WM_LOCALE_CHANGE_EVENT, { detail: { locale: next } }),
    );
  }, []);

  useEffect(() => {
    document.documentElement.lang = wmLocaleHtmlLang(locale);
  }, [locale]);

  const value = useMemo(
    () => ({
      locale,
      messages: getWmMessages(locale),
      setLocale,
    }),
    [locale, setLocale],
  );

  return <WmLocaleContext.Provider value={value}>{children}</WmLocaleContext.Provider>;
}

export function useWmLocale() {
  const ctx = useContext(WmLocaleContext);
  if (!ctx) {
    throw new Error("useWmLocale must be used within WmLocaleProvider");
  }
  return ctx;
}
