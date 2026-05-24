import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAsgHostname, isInjuredHelpHostname } from "@/lib/domains";
import {
  ASG_LOCALE_COOKIE,
  ASG_LOCALE_HEADER,
  DEFAULT_LOCALE,
  isLocale,
  type Locale,
} from "@/lib/i18n/config";
import { parseLocaleFromPathname, toInternalPath } from "@/lib/i18n/locale-path";

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
  init?: { request?: { headers: Headers } },
) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(ASG_LOCALE_HEADER, locale);
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

  const locale = resolveLocale(request, pathname);

  if (isInjuredHelpHostname(host)) {
    const sharedPaths = ["/privacy-policy", "/terms", "/privacy", "/blog", "/car-accident-help"];
    const isCarHelp = pathname.startsWith("/car-accident-help");
    const isBlog = pathname.startsWith("/blog");
    const isCrawler =
      pathname === "/robots.txt" ||
      pathname === "/llms.txt" ||
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
      return NextResponse.next();
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
      return NextResponse.next();
    }

    if (pathname.startsWith("/injuredhelp") || pathname.startsWith("/api") || pathname.startsWith("/_next")) {
      return NextResponse.next();
    }

    const url = request.nextUrl.clone();
    url.pathname = `/injuredhelp${pathname}`;
    return NextResponse.rewrite(url);
  }

  if (!isAsgHostname(host)) {
    if (pathname.startsWith("/accidentsurvivalguide")) {
      const response = NextResponse.next(withLocaleHeaders(request, locale));
      response.cookies.set(ASG_LOCALE_COOKIE, locale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
      return response;
    }

    return NextResponse.next();
  }

  const sharedLegalPaths = ["/privacy-policy", "/terms", "/privacy"];
  if (sharedLegalPaths.includes(pathname)) {
    return NextResponse.next();
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
    const response = NextResponse.next(withLocaleHeaders(request, locale));
    response.cookies.set(ASG_LOCALE_COOKIE, locale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
    return response;
  }

  const { publicPath } = parseLocaleFromPathname(pathname);
  const url = request.nextUrl.clone();
  url.pathname = toInternalPath(publicPath);

  if (pathname.startsWith("/accidentsurvivalguide/es")) {
    const urlStrip = request.nextUrl.clone();
    urlStrip.pathname = toInternalPath(publicPath);
    const response = NextResponse.rewrite(urlStrip, withLocaleHeaders(request, "es"));
    response.cookies.set(ASG_LOCALE_COOKIE, "es", { path: "/", maxAge: 60 * 60 * 24 * 365 });
    return response;
  }

  const response = NextResponse.rewrite(url, withLocaleHeaders(request, locale));
  response.cookies.set(ASG_LOCALE_COOKIE, locale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|pdf)$).*)",
  ],
};
