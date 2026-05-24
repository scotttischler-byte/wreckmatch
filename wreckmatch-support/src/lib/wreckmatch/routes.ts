/** Standalone support app — routes live at the site root (not under /app). */
export const WRECKMATCH_APP_BASE = "";

export function wmPath(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return normalized === "/" ? "/splash" : normalized;
}

export const WM = {
  splash: "/splash",
  onboarding: "/onboarding",
  login: "/login",
  signup: "/signup",
  home: "/home",
  community: "/community",
  matches: "/matches",
  resources: "/resources",
  profile: "/profile",
  help: "/help",
  introRequested: "/intro-requested",
} as const;

export const PUBLIC_ROUTES = [
  WM.splash,
  WM.onboarding,
  WM.login,
  WM.signup,
] as const;

export const PROTECTED_ROUTES = [
  WM.home,
  WM.community,
  WM.matches,
  WM.resources,
  WM.profile,
] as const;

export const SUPPORT_ROUTES = [WM.help, WM.introRequested] as const;

export const AUTH_ROUTES = [WM.login, WM.signup] as const;

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
  if (pathname.startsWith("/api")) return true;
  if (pathname === "/" || pathname.startsWith("/matches/attorney/")) return true;
  return (
    PUBLIC_ROUTES.includes(pathname as (typeof PUBLIC_ROUTES)[number]) ||
    isProtectedRoute(pathname) ||
    SUPPORT_ROUTES.includes(pathname as (typeof SUPPORT_ROUTES)[number])
  );
}

export function shouldShowAppShell(pathname: string): boolean {
  return SHELL_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}
