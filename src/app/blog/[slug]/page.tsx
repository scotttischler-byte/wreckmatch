import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { resolveBlogPost } from "@/lib/seo/blog-resolver";
import { getAllBlogSlugsForSitemap } from "@/lib/seo/blog-resolver";
import { getCityRedirectForBlogSlug, REDIRECTED_BLOG_SLUGS } from "@/lib/seo/redirected-blog";
import { WmBlogPostView } from "@/components/seo/WmBlogPostView";
import { getBlogCoverImage } from "@/lib/blog/covers";
import { blogCrossDomainAlternates } from "@/lib/seo/blog-alternates";
import { absoluteUrl } from "@/lib/seo/site";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllBlogSlugsForSitemap()
    .filter((slug) => !REDIRECTED_BLOG_SLUGS.has(slug))
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const redirectPath = getCityRedirectForBlogSlug(slug);
  if (redirectPath) return { title: "Redirecting…" };
  const post = resolveBlogPost(slug);
  if (!post) return { title: "Article not found" };
  const coverUrl = absoluteUrl(getBlogCoverImage(post));
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
  const redirectPath = getCityRedirectForBlogSlug(slug);
  if (redirectPath) permanentRedirect(redirectPath);
  const post = resolveBlogPost(slug);
  if (!post) notFound();
  return <WmBlogPostView post={post} />;
}
