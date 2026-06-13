import type { MetadataRoute } from "next";
import { ASG_BASE_URL } from "@/lib/accidentsurvivalguide";
import { getPublishedBlogPosts } from "@/lib/blog/posts";
import { ALL_STATE_SLUGS } from "@/lib/asg/state-guides";
import { REDIRECTED_BLOG_SLUGS } from "@/lib/seo/redirected-blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = ASG_BASE_URL;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/es`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/resources`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/es/blog`, lastModified: now, changeFrequency: "daily", priority: 0.85 },
    { url: `${base}/calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/es/calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/llms.txt`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: `${base}/llms-full.txt`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: `${base}/ai.txt`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: `${base}/feed.xml`, lastModified: now, changeFrequency: "daily", priority: 0.5 },
  ];

  const stateRoutes = ALL_STATE_SLUGS.flatMap((slug) => [
    {
      url: `${base}/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${base}/es/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.65,
    },
  ]);

  const blogRoutesEn = getPublishedBlogPosts({ locale: "en" })
    .filter((post) => !REDIRECTED_BLOG_SLUGS.has(post.slug))
    .map((post) => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt ?? post.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  const blogRoutesEs = getPublishedBlogPosts({ locale: "es" })
    .filter((post) => !REDIRECTED_BLOG_SLUGS.has(post.slug))
    .map((post) => ({
      url: `${base}/es/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt ?? post.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.55,
    }));

  return [...staticRoutes, ...stateRoutes, ...blogRoutesEn, ...blogRoutesEs];
}
