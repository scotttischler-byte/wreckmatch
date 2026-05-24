/** Strip SEO-hostile or duplicate content from imported markdown before render. */

const KEYWORD_STUFFING_RE =
  /^(?:.*\bcar accident lawyer\b.*[·|].*\binjury attorney\b.*|.*Primary topic:.*|.*car accident help .*,.* · .*)$/gim;

/** Remove fenced JSON-LD blocks, internal link dumps, and schema appendix sections. */
export function sanitizeCityMarkdown(body: string): string {
  let out = body;

  // Remove ```json ... ``` blocks (embedded schema in markdown source)
  out = out.replace(/```json[\s\S]*?```/gi, "");

  // Remove ## JSON-LD Schema section through end or next ---
  out = out.replace(/\n## JSON-LD Schema[\s\S]*?(?=\n---|\n## [^#]|\z)/gi, "");

  // Remove bloated internal link sections (component handles nearby cities)
  out = out.replace(/\n## Internal Links[\s\S]*?(?=\n## [^#]|\n---|\z)/gi, "");
  out = out.replace(/\n### Other [^\n]+ cities[\s\S]*?(?=\n## |\n---|\*\*|\z)/gi, "");

  // Vanity / activation disclaimers
  out = out.replace(/Vanity line[^\n]*\n?/gi, "");
  out = out.replace(/may take 24[–-]48 hours[^\n]*\n?/gi, "");

  // Keyword stuffing lines
  out = out.replace(KEYWORD_STUFFING_RE, "");

  // Unresolved template tokens
  out = out.replace(/\{city\}/g, "");

  // Collapse excessive blank lines
  out = out.replace(/\n{4,}/g, "\n\n\n");

  return out.trim();
}

/** For blog markdown: hide duplicate H1 when page component renders title separately. */
export function stripLeadingH1(markdown: string): string {
  return markdown.replace(/^#\s+.+\n+/, "");
}

export function countMarkdownWords(markdown: string): number {
  const text = markdown
    .replace(/```[\s\S]*?```/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#>*_`|-]/g, " ")
    .trim();
  return text.split(/\s+/).filter(Boolean).length;
}
