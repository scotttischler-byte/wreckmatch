import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BgBlogPostView } from "@/components/bobbygarcia/BgBlogPostView";
import { getBgBlogPost, getBgBlogSlugs } from "@/lib/bobbygarcia/blog/posts";
import { bgLocaleOpenGraph } from "@/lib/bobbygarcia/i18n/config";
import { getBgLocale } from "@/lib/bobbygarcia/i18n/server";
import { BG_BASE_URL } from "@/lib/bobbygarcia/site";

type PageProps = { params: Promise<{ slug: string }> };

function articleJsonLd(
  post: NonNullable<ReturnType<typeof getBgBlogPost>>,
  locale: "en" | "es",
) {
  const path = locale === "es" ? `/es/blog/${post.slug}` : `/blog/${post.slug}`;
  const url = `${BG_BASE_URL}${path}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    inLanguage: locale === "es" ? "es-US" : "en-US",
    mainEntityOfPage: url,
    image: post.coverImage ? `${BG_BASE_URL}${post.coverImage}` : undefined,
    author: {
      "@type": "Organization",
      name: "Law Office of Bobby Garcia, P.C.",
      url: BG_BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Law Office of Bobby Garcia, P.C.",
      url: BG_BASE_URL,
    },
  };
}

export async function generateStaticParams() {
  const en = getBgBlogSlugs("en");
  const es = getBgBlogSlugs("es");
  const slugs = [...new Set([...en, ...es])];
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = getBgLocale();
  const post = getBgBlogPost(slug, locale);
  if (!post) return { title: "Guide not found" };

  const path =
    locale === "es" ? `/es/blog/${post.slug}` : `/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.metaDescription,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      type: "article",
      publishedTime: post.publishedAt,
      locale: bgLocaleOpenGraph(locale),
      url: `${BG_BASE_URL}${path}`,
      images: post.coverImage ? [{ url: `${BG_BASE_URL}${post.coverImage}` }] : undefined,
    },
    alternates: {
      canonical: `${BG_BASE_URL}${path}`,
      languages: {
        en: `${BG_BASE_URL}/blog/${post.slug}`,
        es: `${BG_BASE_URL}/es/blog/${post.slug}`,
      },
    },
  };
}

export default async function BobbyGarciaBlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const locale = getBgLocale();
  const post = getBgBlogPost(slug, locale);
  if (!post) notFound();
  const jsonLd = articleJsonLd(post, locale);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BgBlogPostView post={post} />
    </>
  );
}
