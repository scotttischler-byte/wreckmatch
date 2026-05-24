export const WM_LOCALE_COOKIE = "wm_locale";

export const WM_LOCALES = ["en", "es"] as const;
export type WmLocale = (typeof WM_LOCALES)[number];
export const WM_DEFAULT_LOCALE: WmLocale = "en";

export function isWmLocale(value: string | null | undefined): value is WmLocale {
  return value === "en" || value === "es";
}

export function wmLocaleHtmlLang(locale: WmLocale): string {
  return locale === "es" ? "es" : "en";
}
