"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type AutopilotMarkdownBodyProps = {
  markdown: string;
};

function stripEmbeddedJsonLd(markdown: string): string {
  return markdown.replace(
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi,
    "",
  );
}

export function extractJsonLdScripts(markdown: string): string[] {
  const scripts: string[] = [];
  const re =
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(markdown)) !== null) {
    scripts.push(match[1].trim());
  }
  return scripts;
}

export function AutopilotMarkdownBody({ markdown }: AutopilotMarkdownBodyProps) {
  const body = stripEmbeddedJsonLd(markdown);

  return (
    <div className="asg-markdown mt-10 space-y-4 text-[#4a6578] leading-relaxed [&_a]:text-[#2a7a9b] [&_a]:underline [&_a]:underline-offset-2 [&_blockquote]:border-l-4 [&_blockquote]:border-[#2a7a9b] [&_blockquote]:bg-[#eef6fb] [&_blockquote]:py-2 [&_blockquote]:pl-4 [&_blockquote]:pr-2 [&_blockquote]:text-[#3d5568] [&_h1]:hidden [&_h2]:mt-12 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-[#1a3a52] [&_h3]:mt-8 [&_h3]:font-serif [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-[#1a3a52] [&_hr]:my-10 [&_hr]:border-[#c5dce8] [&_li]:mt-1 [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_p]:mt-4 [&_strong]:text-[#1a3a52] [&_table]:mt-6 [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm [&_td]:border [&_td]:border-[#c5dce8] [&_td]:px-3 [&_td]:py-2 [&_th]:border [&_th]:border-[#c5dce8] [&_th]:bg-[#eef6fb] [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
    </div>
  );
}
