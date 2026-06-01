export const BG_LOCALE_COOKIE = "bg_locale";
export const BG_LOCALE_HEADER = "x-bg-locale";

export const BG_LOCALES = ["en", "es"] as const;
export type BgLocale = (typeof BG_LOCALES)[number];
export const BG_DEFAULT_LOCALE: BgLocale = "en";

export function isBgLocale(value: string | null | undefined): value is BgLocale {
  return value === "en" || value === "es";
}

export function bgLocaleHtmlLang(locale: BgLocale): string {
  return locale === "es" ? "es" : "en";
}

export function bgLocaleOpenGraph(locale: BgLocale): string {
  return locale === "es" ? "es_US" : "en_US";
}
