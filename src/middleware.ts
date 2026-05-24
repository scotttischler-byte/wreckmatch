import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAsgHostname } from "@/lib/accidentsurvivalguide";
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

  if (hostname === "accidentsurvivalguide.com") {
    const url = request.nextUrl.clone();
    url.host = "www.accidentsurvivalguide.com";
    url.protocol = "https:";
    return NextResponse.redirect(url, 308);
  }

  const { pathname } = request.nextUrl;
  const locale = resolveLocale(request, pathname);

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

  // Root crawler files — must not rewrite to /accidentsurvivalguide/[state]
  if (pathname === "/robots.txt") {
    const url = request.nextUrl.clone();
    url.pathname = "/robots-accidentsurvivalguide.txt";
    return NextResponse.rewrite(url);
  }
  if (pathname === "/llms.txt") {
    const url = request.nextUrl.clone();
    url.pathname = "/llms-accidentsurvivalguide.txt";
    return NextResponse.rewrite(url);
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
