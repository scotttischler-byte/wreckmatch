import type { Metadata } from "next";
import { BgBlogCard } from "@/components/bobbygarcia/BgBlogCard";
import { getBgBlogPosts } from "@/lib/bobbygarcia/blog/posts";
import { getBgMessages } from "@/lib/bobbygarcia/i18n/get-messages";
import { bgLocaleOpenGraph } from "@/lib/bobbygarcia/i18n/config";
import { getBgLocale } from "@/lib/bobbygarcia/i18n/server";
import { BG_BASE_URL } from "@/lib/bobbygarcia/site";

export async function generateMetadata(): Promise<Metadata> {
  const locale = getBgLocale();
  const b = getBgMessages(locale).blog;
  const path = locale === "es" ? "/es/blog" : "/blog";

  return {
    title: b.metaTitle,
    description: b.metaDescription,
    openGraph: {
      type: "website",
      locale: bgLocaleOpenGraph(locale),
      url: `${BG_BASE_URL}${path}`,
      title: b.metaTitle,
      description: b.metaDescription,
    },
    alternates: {
      canonical: `${BG_BASE_URL}${path}`,
      languages: {
        en: `${BG_BASE_URL}/blog`,
        es: `${BG_BASE_URL}/es/blog`,
      },
    },
  };
}

export default function BobbyGarciaBlogIndexPage() {
  const locale = getBgLocale();
  const b = getBgMessages(locale).blog;
  const posts = getBgBlogPosts(locale);

  return (
    <>
      <section className="border-b border-[#c9a227]/15 bg-gradient-to-b from-[#0f1c2e] to-[#0a1220]">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c9a227]">{b.eyebrow}</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold text-white sm:text-5xl">{b.title}</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#b8c4d4]">{b.intro}</p>
          <p className="mt-2 text-sm text-[#8fa3bc]">
            {b.countLabel.replace("{count}", String(posts.length))}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BgBlogCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </>
  );
}
