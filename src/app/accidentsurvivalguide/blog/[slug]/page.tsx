import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ASG_BLOG_POSTS } from "@/lib/accidentsurvivalguide";
import { AsgJsonLd } from "@/components/accidentsurvivalguide/AsgJsonLd";
import { SurvivalGuideDownloadForm } from "@/components/accidentsurvivalguide/SurvivalGuideDownloadForm";

const BLOG_CONTENT: Record<string, string[]> = {
  "what-to-do-first-24-hours": [
    "The first day after a crash often feels chaotic. Your priority is safety, then health, then documentation.",
    "If anyone may be injured, call 911. Move vehicles only when it is safe and required by local rules.",
    "Exchange insurance and contact information. Photograph the scene, vehicles, and any visible injuries.",
    "Seek medical care promptly—even mild symptoms can worsen. Keep every bill and visit note.",
    "Notify your insurer with basic facts. You may wish to speak with a licensed attorney before giving a recorded statement.",
  ],
  "mistakes-after-car-crash": [
    "Many people accept the first settlement offer before treatment is complete. Take time to understand your expenses.",
    "Skipping medical care can harm your health and make it harder to document injuries.",
    "Social media posts about the crash or your activities can be misinterpreted later.",
    "Destroying damaged property or receipts too early can remove helpful evidence.",
    "Going without support is common—but you can ask trusted friends, medical providers, or attorneys for help.",
  ],
  "understanding-your-rights": [
    "After an accident, you generally have the right to seek medical treatment and keep records of your care.",
    "You may communicate with insurers, but you are not required to accept the first offer or give a recorded statement immediately.",
    "You may consult a licensed attorney in your state. WreckMatch LLC can refer you to independent attorneys at no cost to you for the referral.",
    "AccidentSurvivalGuide.com does not provide legal advice. This article is general education only.",
  ],
};

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return ASG_BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = ASG_BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return { title: "Article not found" };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = ASG_BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  const paragraphs = BLOG_CONTENT[slug] ?? [post.excerpt];

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      <AsgJsonLd pageTitle={post.title} pageDescription={post.excerpt} />
      <Link href="/blog" className="text-sm font-medium text-[#2a7a9b] underline underline-offset-2">
        ← All articles
      </Link>
      <time className="mt-6 block text-sm text-[#7a8a98]" dateTime={post.date}>
        {new Date(post.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </time>
      <h1 className="mt-3 font-serif text-4xl font-semibold text-[#1a3a52]">{post.title}</h1>

      <div className="mt-10 space-y-5 text-[#4a6578] leading-relaxed">
        {paragraphs.map((p) => (
          <p key={p.slice(0, 40)}>{p}</p>
        ))}
      </div>

      <p className="mt-10 rounded-lg border border-[#c5dce8] bg-[#eef6fb] p-4 text-sm text-[#5b6b7f]">
        This article is general education from WreckMatch LLC, a legal referral service—not legal
        advice. For questions about your specific case, consult a licensed attorney in your state.
      </p>

      <div className="mt-14">
        <SurvivalGuideDownloadForm />
      </div>
    </article>
  );
}
