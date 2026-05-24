import type { MetadataRoute } from "next";
import { getPublishedBlogPosts } from "@/lib/blog/posts";
import { CITIES, STATES } from "@/lib/seo/cities";
import { WRECKMATCH_SEO_BASE, blogPostPath, cityPagePath } from "@/lib/seo/site";
import { REDIRECTED_BLOG_SLUGS } from "@/lib/seo/redirected-blog";
import { blogSlugFor } from "@/lib/seo/internal-links";
import {
  PROGRAMMATIC_SITEMAP_TEMPLATES,
  PROGRAMMATIC_SITEMAP_CITY_COUNT,
} from "@/lib/seo/programmatic-sitemap";
import { topCitiesByPopulation } from "@/lib/seo/internal-links";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = WRECKMATCH_SEO_BASE;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/resources`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/llms.txt`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: `${base}/llms-full.txt`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: `${base}/ai.txt`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: `${base}/feed.xml`, lastModified: now, changeFrequency: "daily", priority: 0.5 },
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

  const blogRoutes = getPublishedBlogPosts()
    .filter((post) => !REDIRECTED_BLOG_SLUGS.has(post.slug))
    .map((post) => ({
      url: `${base}${blogPostPath(post.slug)}`,
      lastModified: new Date(post.updatedAt ?? post.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.65,
    }));

  const topCities = topCitiesByPopulation(PROGRAMMATIC_SITEMAP_CITY_COUNT);
  const programmaticRoutes = topCities.flatMap((city) =>
    PROGRAMMATIC_SITEMAP_TEMPLATES.map((template) => ({
      url: `${base}${blogPostPath(blogSlugFor(city, template))}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.55,
    })),
  );

  return [...staticRoutes, ...stateRoutes, ...cityRoutes, ...blogRoutes, ...programmaticRoutes];
}
