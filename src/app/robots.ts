import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import {
  AI_CRAWLER_AGENTS,
  ASG_BASE_URL,
  INJUREDHELP_BASE,
  WRECKMATCH_BASE,
  isAsgHostname,
  isInjuredHelpHostname,
} from "@/lib/domains";

function aiBotRules() {
  return AI_CRAWLER_AGENTS.map((userAgent) => ({
    userAgent,
    allow: "/" as const,
  }));
}

/** Host-aware robots.txt for wreckmatch.com, accidentsurvivalguide.com, and injuredhelp.ai. */
export default function robots(): MetadataRoute.Robots {
  const host = headers().get("host") ?? "";

  if (isAsgHostname(host)) {
    return {
      rules: [
        {
          userAgent: "*",
          allow: "/",
          disallow: ["/admin/", "/thank-you", "/api/"],
        },
        ...aiBotRules(),
      ],
      sitemap: `${ASG_BASE_URL}/sitemap.xml`,
      host: ASG_BASE_URL.replace("https://", ""),
    };
  }

  if (isInjuredHelpHostname(host)) {
    return {
      rules: [
        {
          userAgent: "*",
          allow: "/",
          disallow: ["/api/"],
        },
        ...aiBotRules(),
      ],
      sitemap: `${INJUREDHELP_BASE}/sitemap.xml`,
      host: INJUREDHELP_BASE.replace("https://", ""),
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/accidentsurvivalguide/admin/"],
      },
      ...aiBotRules(),
    ],
    sitemap: [
      `${WRECKMATCH_BASE}/sitemap.xml`,
      `${WRECKMATCH_BASE}/sitemap-index.xml`,
    ],
    host: WRECKMATCH_BASE.replace("https://", ""),
  };
}
