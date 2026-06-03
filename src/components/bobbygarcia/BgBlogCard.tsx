"use client";

import Image from "next/image";
import { BgLink } from "@/components/bobbygarcia/BgLink";
import { useBgLocale } from "@/components/bobbygarcia/BgLocaleProvider";
import type { BgBlogPost } from "@/lib/bobbygarcia/blog/types";
import { getBgBlogCoverAlt, getBgBlogCoverImage } from "@/lib/bobbygarcia/blog/covers";

export function BgBlogCard({ post }: { post: BgBlogPost }) {
  const { messages } = useBgLocale();
  const cover = getBgBlogCoverImage(post);
  const date = new Date(post.publishedAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <article className="overflow-hidden rounded-xl border border-[#c9a227]/20 bg-[#0f1c2e] transition hover:border-[#c9a227]/45">
      <BgLink href={`/blog/${post.slug}`} className="relative block aspect-[16/10] overflow-hidden">
          <Image src={cover} alt={getBgBlogCoverAlt(post)} fill className="object-cover" sizes="400px" />
        </BgLink>
      <div className="p-5">
        <div className="flex flex-wrap gap-2 text-xs text-[#8fa3bc]">
          <span>{post.city}, {post.stateAbbr}</span>
          <time dateTime={post.publishedAt}>{date}</time>
        </div>
        <h2 className="mt-2 font-serif text-lg font-semibold text-white">
          <BgLink href={`/blog/${post.slug}`} className="hover:text-[#c9a227]">
            {post.title}
          </BgLink>
        </h2>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[#b8c4d4]">{post.excerpt}</p>
        <BgLink
          href={`/blog/${post.slug}`}
          className="mt-3 inline-block text-sm font-medium text-[#c9a227]"
        >
          {messages.blog.readGuide}
        </BgLink>
      </div>
    </article>
  );
}
