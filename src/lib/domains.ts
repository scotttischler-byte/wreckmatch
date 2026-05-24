import { ASG_BASE_URL, ASG_HOSTS, isAsgHostname } from "@/lib/accidentsurvivalguide";

export const WRECKMATCH_HOSTS = ["wreckmatch.com", "www.wreckmatch.com"] as const;
export const INJUREDHELP_HOSTS = ["injuredhelp.ai", "www.injuredhelp.ai"] as const;

export const WRECKMATCH_BASE = "https://www.wreckmatch.com";
export const INJUREDHELP_BASE = "https://www.injuredhelp.ai";

export type SiteBrand = "wreckmatch" | "accidentsurvivalguide" | "injuredhelp";

export function hostnameFromHost(host: string): string {
  return host.split(":")[0]?.toLowerCase() ?? "";
}

export function isWreckmatchHostname(host: string): boolean {
  return WRECKMATCH_HOSTS.includes(hostnameFromHost(host) as (typeof WRECKMATCH_HOSTS)[number]);
}

export function isInjuredHelpHostname(host: string): boolean {
  return INJUREDHELP_HOSTS.includes(hostnameFromHost(host) as (typeof INJUREDHELP_HOSTS)[number]);
}

export { isAsgHostname, ASG_HOSTS, ASG_BASE_URL };

export function resolveSiteBrand(host: string): SiteBrand {
  if (isAsgHostname(host)) return "accidentsurvivalguide";
  if (isInjuredHelpHostname(host)) return "injuredhelp";
  return "wreckmatch";
}

export function baseUrlForHost(host: string): string {
  const brand = resolveSiteBrand(host);
  if (brand === "accidentsurvivalguide") return ASG_BASE_URL;
  if (brand === "injuredhelp") return INJUREDHELP_BASE;
  return WRECKMATCH_BASE;
}

/** AI crawlers explicitly allowed across all properties. */
export const AI_CRAWLER_AGENTS = [
  "GPTBot",
  "ChatGPT-User",
  "ClaudeBot",
  "anthropic-ai",
  "PerplexityBot",
  "PerplexityAI",
  "Google-Extended",
  "Googlebot",
  "Bingbot",
  "CCBot",
  "Amazonbot",
  "Applebot-Extended",
  "cohere-ai",
  "YouBot",
  "Meta-ExternalAgent",
] as const;
