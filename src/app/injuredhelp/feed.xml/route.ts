import { INJUREDHELP_BASE } from "@/lib/injuredhelp";
import { getPublishedBlogPosts } from "@/lib/blog/posts";
import { REDIRECTED_BLOG_SLUGS } from "@/lib/seo/redirected-blog";

export async function GET() {
  const posts = getPublishedBlogPosts()
    .filter((p) => !REDIRECTED_BLOG_SLUGS.has(p.slug))
    .slice(0, 50);

  const items = posts
    .map(
      (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${INJUREDHELP_BASE}/blog/${post.slug}</link>
      <guid isPermaLink="true">${INJUREDHELP_BASE}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <description><![CDATA[${post.excerpt}]]></description>
    </item>`,
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>InjuredHelp.ai — Car Accident Help</title>
    <link>${INJUREDHELP_BASE}</link>
    <description>AI-friendly injury help articles and city guides.</description>
    <language>en-us</language>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
