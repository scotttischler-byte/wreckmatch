import type { MetadataRoute } from "next";
import { getPublishedBlogPosts } from "@/lib/blog/posts";
import { CITIES, STATES } from "@/lib/seo/cities";
import { WRECKMATCH_SEO_BASE, cityPagePath, blogPostPath } from "@/lib/seo/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = WRECKMATCH_SEO_BASE;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/privacy-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const cityRoutes = CITIES.map((c) => ({
    url: `${base}${cityPagePath(c.slug)}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const stateRoutes = STATES.map((s) => ({
    url: `${base}${cityPagePath(s.slug)}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  const blogRoutes = getPublishedBlogPosts().map((post) => ({
    url: `${base}${blogPostPath(post.slug)}`,
    lastModified: new Date(post.updatedAt ?? post.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  return [...staticRoutes, ...stateRoutes, ...cityRoutes, ...blogRoutes];
}
