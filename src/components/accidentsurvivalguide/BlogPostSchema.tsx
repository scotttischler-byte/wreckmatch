import type { BlogPost } from "@/lib/blog/types";
import { ASG_BASE_URL } from "@/lib/accidentsurvivalguide";

export function BlogPostSchema({ post }: { post: BlogPost }) {
  const url = `${ASG_BASE_URL}/blog/${post.slug}`;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: post.title,
        description: post.metaDescription,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt ?? post.publishedAt,
        author: { "@type": "Organization", name: "WreckMatch LLC" },
        publisher: {
          "@type": "Organization",
          name: "WreckMatch LLC",
          url: ASG_BASE_URL,
        },
        mainEntityOfPage: url,
      },
      {
        "@type": "FAQPage",
        mainEntity: post.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
