import { headers } from "next/headers";
import { resolveSiteBrand } from "@/lib/domains";
import { isBgHostname } from "@/lib/bobbygarcia/site";

export type GeoBrand = "wreckmatch" | "accidentsurvivalguide" | "injuredhelp" | "bobbygarcia";

export async function geoBrandFromHeaders(): Promise<GeoBrand> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "";
  if (isBgHostname(host)) return "bobbygarcia";
  return resolveSiteBrand(host) as GeoBrand;
}

export async function geoPathFromHeaders(): Promise<string> {
  const h = await headers();
  return h.get("x-pathname") ?? "/";
}
