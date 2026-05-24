import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  shouldHandleWreckmatchAuth,
  updateWreckmatchSession,
} from "@/lib/wreckmatch/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico)$/)
  ) {
    return NextResponse.next();
  }

  if (shouldHandleWreckmatchAuth(pathname)) {
    return updateWreckmatchSession(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
