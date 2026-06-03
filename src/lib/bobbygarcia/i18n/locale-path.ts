import type { BgLocale } from "@/lib/bobbygarcia/i18n/config";
import { BG_DEFAULT_LOCALE } from "@/lib/bobbygarcia/i18n/config";

export const BG_MOUNT_PREFIX = "/bobbygarcia";

export type ParsedBgLocalePath = {
  locale: BgLocale;
  publicPath: string;
};

/** Strip internal mount prefix and preserve /es locale segment for parsing. */
export function toBgPublicPath(pathname: string): string {
  if (pathname.startsWith(`${BG_MOUNT_PREFIX}/es`)) {
    const rest = pathname.slice(`${BG_MOUNT_PREFIX}/es`.length) || "/";
    return rest === "/" ? "/es" : `/es${rest.startsWith("/") ? rest : `/${rest}`}`;
  }
  if (pathname.startsWith(BG_MOUNT_PREFIX)) {
    return pathname.slice(BG_MOUNT_PREFIX.length) || "/";
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

/** When previewing under /bobbygarcia on wreckmatch, prefix localized hrefs. */
export function getBgMountPrefix(pathname: string): string {
  if (pathname === BG_MOUNT_PREFIX || pathname.startsWith(`${BG_MOUNT_PREFIX}/`)) {
    return BG_MOUNT_PREFIX;
  }
  return "";
}

export function withBgMountPrefix(href: string, mountPrefix: string): string {
  if (
    !mountPrefix ||
    href.startsWith("http") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("#") ||
    href.startsWith("/api")
  ) {
    return href;
  }
  if (href === "/") return mountPrefix;
  if (href === "/es") return `${mountPrefix}/es`;
  return `${mountPrefix}${href.startsWith("/") ? href : `/${href}`}`;
}

export function resolveBgHref(pathname: string, href: string, locale: BgLocale): string {
  const mountPrefix = getBgMountPrefix(pathname);
  return withBgMountPrefix(localizeBgHref(href, locale), mountPrefix);
}

export function resolveBgLocaleSwitchHref(pathname: string, targetLocale: BgLocale): string {
  const { publicPath } = parseBgLocaleFromPathname(pathname);
  return resolveBgHref(pathname, publicPath, targetLocale);
}

export function toBgInternalPath(publicPath: string): string {
  const normalized = publicPath === "/" ? "" : publicPath;
  return `${BG_MOUNT_PREFIX}${normalized}`;
}
