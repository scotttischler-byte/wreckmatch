"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type SeoMarkdownBodyProps = {
  markdown: string;
};

export function SeoMarkdownBody({ markdown }: SeoMarkdownBodyProps) {
  return (
    <div className="seo-markdown mt-8 space-y-4 text-[#475569] leading-relaxed [&_a]:text-[#8a6914] [&_a]:underline [&_a]:underline-offset-2 [&_blockquote]:border-l-4 [&_blockquote]:border-[#c9a227] [&_blockquote]:bg-[#fcfaf6] [&_blockquote]:py-2 [&_blockquote]:pl-4 [&_blockquote]:pr-2 [&_blockquote]:text-[#334155] [&_h1]:font-serif [&_h1]:text-3xl [&_h1]:font-semibold [&_h1]:text-[#152238] [&_h2]:mt-12 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-[#152238] [&_h3]:mt-8 [&_h3]:font-serif [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-[#152238] [&_hr]:my-10 [&_hr]:border-[#e7dccb] [&_li]:mt-1 [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_p]:mt-4 [&_strong]:text-[#152238] [&_table]:mt-6 [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm [&_td]:border [&_td]:border-[#e7dccb] [&_td]:px-3 [&_td]:py-2 [&_th]:border [&_th]:border-[#e7dccb] [&_th]:bg-[#fcfaf6] [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </div>
  );
}
