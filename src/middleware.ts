import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isBgHostname } from "@/lib/bobbygarcia/site";
import {
  BG_DEFAULT_LOCALE,
  BG_LOCALE_COOKIE,
  BG_LOCALE_HEADER,
  isBgLocale,
  type BgLocale,
} from "@/lib/bobbygarcia/i18n/config";
import {
  parseBgLocaleFromPathname,
  toBgInternalPath,
} from "@/lib/bobbygarcia/i18n/locale-path";
import { isAsgHostname, isInjuredHelpHostname } from "@/lib/domains";
import {
  ASG_LOCALE_COOKIE,
  ASG_LOCALE_HEADER,
  DEFAULT_LOCALE,
  isLocale,
  type Locale,
} from "@/lib/i18n/config";
import { parseLocaleFromPathname, toInternalPath } from "@/lib/i18n/locale-path";
import { BLOG_PATH_REDIRECTS } from "@/lib/seo/redirected-blog";

const INDEXNOW_KEY_PATH = "/wreckmatch-indexnow-key.txt";

function resolveLocale(request: NextRequest, pathname: string): Locale {
  const fromPath = parseLocaleFromPathname(pathname).locale;
  if (fromPath === "es") return "es";

  const cookie = request.cookies.get(ASG_LOCALE_COOKIE)?.value;
  if (isLocale(cookie) && cookie === "es") return "es";

  return DEFAULT_LOCALE;
}

function withLocaleHeaders(
  request: NextRequest,
  locale: Locale,
  pathname: string,
  init?: { request?: { headers: Headers } },
) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(ASG_LOCALE_HEADER, locale);
  requestHeaders.set("x-pathname", pathname);
  return { request: { headers: requestHeaders }, ...init };
}

function withPathHeader(request: NextRequest, pathname: string) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

function resolveBgLocale(request: NextRequest, pathname: string): BgLocale {
  const { locale, publicPath } = parseBgLocaleFromPathname(pathname);
  if (locale === "es") return "es";
  if (publicPath !== "/") return BG_DEFAULT_LOCALE;

  const cookie = request.cookies.get(BG_LOCALE_COOKIE)?.value;
  if (isBgLocale(cookie) && cookie === "es") return "es";
  return BG_DEFAULT_LOCALE;
}

function withBgLocaleHeaders(
  request: NextRequest,
  locale: BgLocale,
  pathname: string,
  init?: { request?: { headers: Headers } },
) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(BG_LOCALE_HEADER, locale);
  requestHeaders.set("x-pathname", pathname);
  return { request: { headers: requestHeaders }, ...init };
}

export async function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const hostname = host.split(":")[0]?.toLowerCase() ?? "";
  const { pathname } = request.nextUrl;

  if (hostname === "accidentsurvivalguide.com") {
    const url = request.nextUrl.clone();
    url.host = "www.accidentsurvivalguide.com";
    url.protocol = "https:";
    return NextResponse.redirect(url, 308);
  }

  if (hostname === "injuredhelp.ai") {
    const url = request.nextUrl.clone();
    url.host = "www.injuredhelp.ai";
    url.protocol = "https:";
    return NextResponse.redirect(url, 308);
  }

  if (hostname === "wreckmatch.com") {
    const url = request.nextUrl.clone();
    url.host = "www.wreckmatch.com";
    url.protocol = "https:";
    return NextResponse.redirect(url, 308);
  }

  if (hostname === "bobbygarcia.com") {
    const url = request.nextUrl.clone();
    url.host = "www.bobbygarcia.com";
    url.protocol = "https:";
    return NextResponse.redirect(url, 308);
  }

  if (isBgHostname(host)) {
    const locale = resolveBgLocale(request, pathname);

    if (pathname === "/sitemap.xml") {
      const url = request.nextUrl.clone();
      url.pathname = "/bobbygarcia/sitemap.xml";
      return NextResponse.rewrite(url, withBgLocaleHeaders(request, locale, url.pathname));
    }

    if (
      pathname.startsWith("/bobbygarcia") ||
      pathname.startsWith("/api") ||
      pathname.startsWith("/_next") ||
      pathname === "/robots.txt" ||
      pathname === "/llms.txt" ||
      pathname === "/ai.txt"
    ) {
      if (pathname.startsWith("/bobbygarcia/es")) {
        const { publicPath } = parseBgLocaleFromPathname(pathname);
        const url = request.nextUrl.clone();
        url.pathname = toBgInternalPath(publicPath);
        const response = NextResponse.rewrite(url, withBgLocaleHeaders(request, "es", url.pathname));
        response.cookies.set(BG_LOCALE_COOKIE, "es", { path: "/", maxAge: 60 * 60 * 24 * 365 });
        return response;
      }
      const response = NextResponse.next(withBgLocaleHeaders(request, locale, pathname));
      response.cookies.set(BG_LOCALE_COOKIE, locale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
      return response;
    }

    const { publicPath } = parseBgLocaleFromPathname(pathname);
    const url = request.nextUrl.clone();
    url.pathname = toBgInternalPath(publicPath);
    const response = NextResponse.rewrite(url, withBgLocaleHeaders(request, locale, url.pathname));
    response.cookies.set(BG_LOCALE_COOKIE, locale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
    return response;
  }

  if (pathname.startsWith("/bobbygarcia")) {
    const locale = resolveBgLocale(request, pathname);
    if (pathname.startsWith("/bobbygarcia/es")) {
      const { publicPath } = parseBgLocaleFromPathname(pathname);
      const url = request.nextUrl.clone();
      url.pathname = toBgInternalPath(publicPath);
      const response = NextResponse.rewrite(url, withBgLocaleHeaders(request, "es", url.pathname));
      response.cookies.set(BG_LOCALE_COOKIE, "es", { path: "/", maxAge: 60 * 60 * 24 * 365 });
      return response;
    }
    const response = NextResponse.next(withBgLocaleHeaders(request, locale, pathname));
    response.cookies.set(BG_LOCALE_COOKIE, locale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
    return response;
  }

  const locale = resolveLocale(request, pathname);

  const blogRedirect = BLOG_PATH_REDIRECTS[pathname];
  if (blogRedirect) {
    return NextResponse.redirect(new URL(blogRedirect, request.url), 301);
  }

  if (pathname === INDEXNOW_KEY_PATH) {
    return NextResponse.next();
  }

  if (isInjuredHelpHostname(host)) {
    const sharedPaths = ["/privacy-policy", "/terms", "/privacy", "/blog", "/car-accident-help"];
    const isCarHelp = pathname.startsWith("/car-accident-help");
    const isBlog = pathname.startsWith("/blog");
    const isCrawler =
      pathname === "/robots.txt" ||
      pathname === "/llms.txt" ||
      pathname === "/llms-full.txt" ||
      pathname === "/ai.txt" ||
      pathname === "/sitemap.xml" ||
      pathname === "/feed.xml";

    if (isCrawler) {
      if (pathname === "/sitemap.xml") {
        const url = request.nextUrl.clone();
        url.pathname = "/injuredhelp/sitemap.xml";
        return NextResponse.rewrite(url);
      }
      if (pathname === "/feed.xml") {
        const url = request.nextUrl.clone();
        url.pathname = "/injuredhelp/feed.xml";
        return NextResponse.rewrite(url);
      }
      return withPathHeader(request, pathname);
    }

    if (pathname === "/" || pathname === "") {
      const url = request.nextUrl.clone();
      url.pathname = "/injuredhelp";
      return NextResponse.rewrite(url);
    }

    if (
      isBlog ||
      isCarHelp ||
      sharedPaths.some((p) => pathname === p || pathname.startsWith(`${p}/`))
    ) {
      return withPathHeader(request, pathname);
    }

    if (pathname.startsWith("/injuredhelp") || pathname.startsWith("/api") || pathname.startsWith("/_next")) {
      return withPathHeader(request, pathname);
    }

    const url = request.nextUrl.clone();
    url.pathname = `/injuredhelp${pathname}`;
    return NextResponse.rewrite(url);
  }

  if (!isAsgHostname(host)) {
    if (pathname.startsWith("/accidentsurvivalguide")) {
      const response = NextResponse.next(withLocaleHeaders(request, locale, pathname));
      response.cookies.set(ASG_LOCALE_COOKIE, locale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
      return response;
    }

    return withPathHeader(request, pathname);
  }

  const sharedLegalPaths = ["/privacy-policy", "/terms", "/privacy"];
  if (sharedLegalPaths.includes(pathname)) {
    return withPathHeader(request, pathname);
  }

  if (pathname === "/robots.txt" || pathname === "/llms.txt" || pathname === "/llms-full.txt" || pathname === "/ai.txt") {
    const response = NextResponse.next(withLocaleHeaders(request, locale, pathname));
    response.cookies.set(ASG_LOCALE_COOKIE, locale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
    return response;
  }

  if (pathname === "/sitemap.xml") {
    const url = request.nextUrl.clone();
    url.pathname = "/accidentsurvivalguide/sitemap.xml";
    return NextResponse.rewrite(url);
  }
  if (pathname === "/feed.xml") {
    const url = request.nextUrl.clone();
    url.pathname = "/accidentsurvivalguide/feed.xml";
    return NextResponse.rewrite(url);
  }

  if (
    pathname.startsWith("/accidentsurvivalguide") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next")
  ) {
    const response = NextResponse.next(withLocaleHeaders(request, locale, pathname));
    response.cookies.set(ASG_LOCALE_COOKIE, locale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
    return response;
  }

  const { publicPath } = parseLocaleFromPathname(pathname);
  const url = request.nextUrl.clone();
  url.pathname = toInternalPath(publicPath);

  if (pathname.startsWith("/accidentsurvivalguide/es")) {
    const urlStrip = request.nextUrl.clone();
    urlStrip.pathname = toInternalPath(publicPath);
    const response = NextResponse.rewrite(urlStrip, withLocaleHeaders(request, "es", pathname));
    response.cookies.set(ASG_LOCALE_COOKIE, "es", { path: "/", maxAge: 60 * 60 * 24 * 365 });
    return response;
  }

  const response = NextResponse.rewrite(url, withLocaleHeaders(request, locale, pathname));
  response.cookies.set(ASG_LOCALE_COOKIE, locale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|pdf)$).*)",
  ],
};
