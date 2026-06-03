import type { MetadataRoute } from "next";
import { getBgBlogSlugs } from "@/lib/bobbygarcia/blog/posts";
import { BG_BASE_URL } from "@/lib/bobbygarcia/site";

export default function bobbyGarciaSitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  const staticPages = [
    "",
    "/practice-areas",
    "/meet-our-attorneys",
    "/blog",
    "/about",
    "/contact",
  ];
  for (const path of staticPages) {
    entries.push({
      url: `${BG_BASE_URL}${path}`,
      lastModified: now,
      changeFrequency: path === "" ? "weekly" : "monthly",
      priority: path === "" ? 1 : 0.85,
    });
    entries.push({
      url: `${BG_BASE_URL}/es${path}`,
      lastModified: now,
      changeFrequency: path === "" ? "weekly" : "monthly",
      priority: path === "" ? 1 : 0.85,
    });
  }

  for (const slug of getBgBlogSlugs("en")) {
    entries.push({
      url: `${BG_BASE_URL}/blog/${slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    });
    entries.push({
      url: `${BG_BASE_URL}/es/blog/${slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  return entries;
}
