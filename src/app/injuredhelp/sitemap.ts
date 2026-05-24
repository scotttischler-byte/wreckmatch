import type { MetadataRoute } from "next";
import { INJUREDHELP_BASE } from "@/lib/injuredhelp";
import { ASG_BASE_URL } from "@/lib/domains";
import { getPublishedBlogPosts } from "@/lib/blog/posts";
import { CITIES, STATES } from "@/lib/seo/cities";
import { blogPostPath, cityPagePath } from "@/lib/seo/site";
import { REDIRECTED_BLOG_SLUGS } from "@/lib/seo/redirected-blog";
import { ALL_STATE_SLUGS } from "@/lib/asg/state-guides";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = INJUREDHELP_BASE;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/llms.txt`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
  ];

  const cityRoutes = CITIES.map((c) => ({
    url: `${base}${cityPagePath(c.slug)}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  const stateRoutes = STATES.map((s) => ({
    url: `${base}${cityPagePath(s.slug)}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const blogRoutes = getPublishedBlogPosts()
    .filter((p) => !REDIRECTED_BLOG_SLUGS.has(p.slug))
    .map((post) => ({
      url: `${base}${blogPostPath(post.slug)}`,
      lastModified: new Date(post.updatedAt ?? post.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.65,
    }));

  const asgDiscovery = ALL_STATE_SLUGS.slice(0, 10).map((slug) => ({
    url: `${ASG_BASE_URL}/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.4,
  }));

  return [...staticRoutes, ...stateRoutes, ...cityRoutes, ...blogRoutes, ...asgDiscovery];
}
