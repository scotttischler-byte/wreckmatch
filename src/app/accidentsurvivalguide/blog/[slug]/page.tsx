import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPostBySlug, getPublishedBlogPosts } from "@/lib/blog/posts";
import { BlogPostView } from "@/components/accidentsurvivalguide/BlogPostView";
import { BlogPostSchema } from "@/components/accidentsurvivalguide/BlogPostSchema";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getPublishedBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return { title: "Article not found" };
  return {
    title: post.title,
    description: post.metaDescription,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      type: "article",
      publishedTime: post.publishedAt,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post || post.status !== "published") notFound();

  return (
    <>
      <BlogPostSchema post={post} />
      <BlogPostView post={post} />
    </>
  );
}
