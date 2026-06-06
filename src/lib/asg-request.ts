import { isAsgHostname } from "@/lib/accidentsurvivalguide";

/** Host from a Next.js / edge request (Vercel sets x-forwarded-host). */
export function getRequestHostname(request: Request): string {
  const raw =
    request.headers.get("x-forwarded-host") ??
    request.headers.get("host") ??
    "";
  return raw.split(",")[0]?.trim().toLowerCase().replace(/:\d+$/, "") ?? "";
}

/** True when the request originated from accidentsurvivalguide.com. */
export function isAsgRequest(request: Request): boolean {
  return isAsgHostname(getRequestHostname(request));
}
