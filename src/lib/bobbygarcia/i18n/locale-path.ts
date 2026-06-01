import type { BgLocale } from "@/lib/bobbygarcia/i18n/config";
import { BG_DEFAULT_LOCALE } from "@/lib/bobbygarcia/i18n/config";

export type ParsedBgLocalePath = {
  locale: BgLocale;
  publicPath: string;
};

export function toBgPublicPath(pathname: string): string {
  if (pathname.startsWith("/bobbygarcia/es")) {
    return pathname.slice("/bobbygarcia/es".length) || "/";
  }
  if (pathname.startsWith("/bobbygarcia")) {
    return pathname.slice("/bobbygarcia".length) || "/";
  }
  return pathname || "/";
}

export function parseBgLocaleFromPathname(pathname: string): ParsedBgLocalePath {
  const publicPath = toBgPublicPath(pathname);

  if (publicPath === "/es" || publicPath.startsWith("/es/")) {
    const withoutEs = publicPath === "/es" ? "/" : publicPath.slice(3) || "/";
    return { locale: "es", publicPath: withoutEs };
  }

  return { locale: BG_DEFAULT_LOCALE, publicPath };
}

export function localizeBgHref(href: string, locale: BgLocale): string {
  if (locale === BG_DEFAULT_LOCALE) return href;
  if (
    href.startsWith("http") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("#") ||
    href.startsWith("/api")
  ) {
    return href;
  }

  const [path, hash] = href.split("#");
  const base = path && path !== "/" ? `/es${path.startsWith("/") ? path : `/${path}`}` : "/es";
  return hash ? `${base}#${hash}` : base;
}

export function toBgInternalPath(publicPath: string): string {
  const normalized = publicPath === "/" ? "" : publicPath;
  return `/bobbygarcia${normalized}`;
}
