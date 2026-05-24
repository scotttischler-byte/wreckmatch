import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { resolveBlogPost } from "@/lib/seo/blog-resolver";
import { getAllBlogSlugsForSitemap } from "@/lib/seo/blog-resolver";
import { WmBlogPostView } from "@/components/seo/WmBlogPostView";
import { getBlogCoverImage } from "@/lib/blog/covers";
import { absoluteUrl, blogPostPath } from "@/lib/seo/site";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllBlogSlugsForSitemap().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = resolveBlogPost(slug);
  if (!post) return { title: "Article not found" };
  const coverUrl = absoluteUrl(getBlogCoverImage(post));
  return {
    title: post.title,
    description: post.metaDescription,
    keywords: post.keywords,
    alternates: { canonical: absoluteUrl(blogPostPath(slug)) },
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      type: "article",
      publishedTime: post.publishedAt,
      images: [{ url: coverUrl, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.metaDescription,
      images: [coverUrl],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = resolveBlogPost(slug);
  if (!post) notFound();
  return <WmBlogPostView post={post} />;
}
