export const ASG_LOCALE_COOKIE = "asg_locale";
export const ASG_LOCALE_HEADER = "x-asg-locale";

export const LOCALES = ["en", "es"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "en" || value === "es";
}

export function localeLabel(locale: Locale): string {
  return locale === "es" ? "Español" : "English";
}

export function localeHtmlLang(locale: Locale): string {
  return locale === "es" ? "es" : "en";
}

export function localeOpenGraph(locale: Locale): string {
  return locale === "es" ? "es_US" : "en_US";
}
