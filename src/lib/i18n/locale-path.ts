import type { Locale } from "@/lib/i18n/config";
import { DEFAULT_LOCALE } from "@/lib/i18n/config";

export type ParsedLocalePath = {
  locale: Locale;
  /** Path as seen on the public site (no /accidentsurvivalguide prefix, no /es). */
  publicPath: string;
};

/** Strip internal `/accidentsurvivalguide` prefix used by Next routes. */
export function toPublicPath(pathname: string): string {
  if (pathname.startsWith("/accidentsurvivalguide/es")) {
    return pathname.slice("/accidentsurvivalguide/es".length) || "/";
  }
  if (pathname.startsWith("/accidentsurvivalguide")) {
    return pathname.slice("/accidentsurvivalguide".length) || "/";
  }
  return pathname || "/";
}

export function parseLocaleFromPathname(pathname: string): ParsedLocalePath {
  const publicPath = toPublicPath(pathname);

  if (publicPath === "/es" || publicPath.startsWith("/es/")) {
    const withoutEs = publicPath === "/es" ? "/" : publicPath.slice(3) || "/";
    return { locale: "es", publicPath: withoutEs };
  }

  return { locale: DEFAULT_LOCALE, publicPath };
}

/** Prefix href for the active locale (public paths only). */
export function localizeHref(href: string, locale: Locale): string {
  if (locale === DEFAULT_LOCALE) return href;
  if (
    href.startsWith("http") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("#") ||
    href.startsWith("/api") ||
    href.endsWith(".pdf")
  ) {
    return href;
  }

  const [path, hash] = href.split("#");
  const base = path && path !== "/" ? `/es${path.startsWith("/") ? path : `/${path}`}` : "/es";
  return hash ? `${base}#${hash}` : base;
}

/** Build internal Next path for rewrites (locale is passed via header, not URL segment). */
export function toInternalPath(publicPath: string): string {
  const normalized = publicPath === "/" ? "" : publicPath;
  return `/accidentsurvivalguide${normalized}`;
}
