import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { ASG_BASE_URL, isAsgHostname } from "@/lib/accidentsurvivalguide";

/** Host-aware robots.txt (wreckmatch.com vs accidentsurvivalguide.com). */
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
        { userAgent: "GPTBot", allow: "/" },
        { userAgent: "ClaudeBot", allow: "/" },
        { userAgent: "anthropic-ai", allow: "/" },
        { userAgent: "PerplexityBot", allow: "/" },
        { userAgent: "Google-Extended", allow: "/" },
      ],
      sitemap: `${ASG_BASE_URL}/sitemap.xml`,
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/accidentsurvivalguide/admin/"],
      },
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "anthropic-ai", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
    ],
    sitemap: "https://www.wreckmatch.com/sitemap.xml",
  };
}
