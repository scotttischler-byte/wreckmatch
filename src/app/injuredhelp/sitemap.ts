import type { MetadataRoute } from "next";
import { INJUREDHELP_BASE } from "@/lib/injuredhelp";

/** Discovery-only sitemap — canonical content lives on wreckmatch.com. */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = INJUREDHELP_BASE;
  const now = new Date();

  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/llms.txt`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/ai.txt`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/feed.xml`, lastModified: now, changeFrequency: "daily", priority: 0.6 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.5 },
  ];
}
