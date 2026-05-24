export const PUBLIC_ROUTES = [
  "/splash",
  "/onboarding",
  "/login",
  "/signup",
] as const;

export const PROTECTED_ROUTES = [
  "/home",
  "/community",
  "/matches",
  "/resources",
  "/profile",
] as const;

/** Always reachable — including when not signed in (crisis support). */
export const SUPPORT_ROUTES = ["/help", "/intro-requested"] as const;

export const AUTH_ROUTES = ["/login", "/signup"] as const;

export const SHELL_ROUTES = [...PROTECTED_ROUTES, ...SUPPORT_ROUTES] as const;

export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.includes(pathname as (typeof AUTH_ROUTES)[number]);
}

export function isWreckmatchAppPath(pathname: string): boolean {
  if (pathname.startsWith("/auth/callback")) return true;
  if (pathname.startsWith("/matches/attorney/")) return true;
  if (SUPPORT_ROUTES.includes(pathname as (typeof SUPPORT_ROUTES)[number])) {
    return true;
  }
  return (
    PUBLIC_ROUTES.includes(pathname as (typeof PUBLIC_ROUTES)[number]) ||
    isProtectedRoute(pathname)
  );
}

export function shouldShowAppShell(pathname: string): boolean {
  return SHELL_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}
