import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAsgHostname } from "@/lib/accidentsurvivalguide";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const hostname = host.split(":")[0]?.toLowerCase() ?? "";

  if (hostname === "accidentsurvivalguide.com") {
    const url = request.nextUrl.clone();
    url.host = "www.accidentsurvivalguide.com";
    url.protocol = "https:";
    return NextResponse.redirect(url, 308);
  }

  if (!isAsgHostname(host)) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  const sharedLegalPaths = ["/privacy-policy", "/terms", "/privacy"];
  if (sharedLegalPaths.includes(pathname)) {
    return NextResponse.next();
  }

  if (
    pathname.startsWith("/accidentsurvivalguide") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next")
  ) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname =
    pathname === "/" ? "/accidentsurvivalguide" : `/accidentsurvivalguide${pathname}`;

  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|pdf)$).*)",
  ],
};
