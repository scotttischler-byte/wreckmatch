import { WRECKMATCH_SEO_BASE } from "@/lib/seo/site";
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
      <link>${WRECKMATCH_SEO_BASE}/blog/${post.slug}</link>
      <guid isPermaLink="true">${WRECKMATCH_SEO_BASE}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <description><![CDATA[${post.excerpt}]]></description>
    </item>`,
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>WreckMatch Blog — Car Accident Help</title>
    <link>${WRECKMATCH_SEO_BASE}/blog</link>
    <description>Educational car accident guides, state law overviews, and injury help articles.</description>
    <language>en-us</language>
    <atom:link href="${WRECKMATCH_SEO_BASE}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
