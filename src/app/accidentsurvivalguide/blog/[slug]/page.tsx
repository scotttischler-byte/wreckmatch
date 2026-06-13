import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPostBySlug, getPublishedBlogPosts } from "@/lib/blog/posts";
import { BlogPostView } from "@/components/accidentsurvivalguide/BlogPostView";
import { BlogPostSchema } from "@/components/accidentsurvivalguide/BlogPostSchema";
import { blogCrossDomainAlternates } from "@/lib/seo/blog-alternates";
import { getAsgLocale } from "@/lib/i18n/server";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return [
    ...getPublishedBlogPosts({ locale: "en" }).map((post) => ({ slug: post.slug })),
    ...getPublishedBlogPosts({ locale: "es" }).map((post) => ({ slug: post.slug })),
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = getAsgLocale();
  const { slug } = await params;
  const post = getBlogPostBySlug(slug, { locale });
  if (!post) return { title: "Article not found" };
  return {
    title: post.title,
    description: post.metaDescription,
    keywords: post.keywords,
    alternates: blogCrossDomainAlternates(slug),
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      type: "article",
      publishedTime: post.publishedAt,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const locale = getAsgLocale();
  const { slug } = await params;
  const post = getBlogPostBySlug(slug, { locale });
  if (!post || post.status !== "published") notFound();

  return (
    <>
      <BlogPostSchema post={post} />
      <BlogPostView post={post} />
    </>
  );
}
