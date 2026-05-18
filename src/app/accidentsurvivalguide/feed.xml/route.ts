import { ASG_BASE_URL, ASG_SITE_NAME } from "@/lib/accidentsurvivalguide";
import { getPublishedBlogPosts } from "@/lib/blog/posts";

export async function GET() {
  const posts = getPublishedBlogPosts().slice(0, 50);
  const items = posts
    .map(
      (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${ASG_BASE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${ASG_BASE_URL}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <description><![CDATA[${post.excerpt}]]></description>
    </item>`,
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${ASG_SITE_NAME}</title>
    <link>${ASG_BASE_URL}</link>
    <description>Educational car accident guides by city and topic.</description>
    <language>en-us</language>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
