import fs from "fs";
import path from "path";
import type { BlogPost, BlogTopic } from "@/lib/blog/types";

const CONTENT_ROOT = path.join(process.cwd(), "content");

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseFrontmatter(raw: string): {
  meta: Record<string, string>;
  body: string;
} {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };
  const meta: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line
      .slice(idx + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
    meta[key] = value;
  }
  return { meta, body: match[2] };
}

function excerptFromBody(body: string, description: string): string {
  if (description) return description.slice(0, 280);
  const stripped = body
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/^#.+$/gm, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#>*_`-]/g, "")
    .trim();
  const para = stripped.split(/\n\n+/).find((p) => p.length > 80);
  return (para ?? stripped).slice(0, 280);
}

function stateSlugFromAbbr(abbr: string): string {
  const map: Record<string, string> = {
    TX: "texas",
    FL: "florida",
    CA: "california",
    NY: "new-york",
    GA: "georgia",
    AZ: "arizona",
    CO: "colorado",
    IL: "illinois",
    PA: "pennsylvania",
    OH: "ohio",
    MI: "michigan",
    NC: "north-carolina",
    TN: "tennessee",
    WA: "washington",
    MA: "massachusetts",
    NV: "nevada",
    OR: "oregon",
    MO: "missouri",
    IN: "indiana",
    WI: "wisconsin",
    MN: "minnesota",
    SC: "south-carolina",
    AL: "alabama",
    LA: "louisiana",
    KY: "kentucky",
    OK: "oklahoma",
    CT: "connecticut",
    UT: "utah",
    IA: "iowa",
    AR: "arkansas",
    MS: "mississippi",
    KS: "kansas",
    NM: "new-mexico",
    NE: "nebraska",
    ID: "idaho",
    WV: "west-virginia",
    HI: "hawaii",
    NH: "new-hampshire",
    ME: "maine",
    MT: "montana",
    RI: "rhode-island",
    DE: "delaware",
    SD: "south-dakota",
    ND: "north-dakota",
    AK: "alaska",
    VT: "vermont",
    WY: "wyoming",
    DC: "district-of-columbia",
  };
  return map[abbr.toUpperCase()] ?? slugify(abbr);
}

function discoverMarkdownPaths(): string[] {
  if (!fs.existsSync(CONTENT_ROOT)) return [];
  const paths: string[] = [];
  for (const entry of fs.readdirSync(CONTENT_ROOT, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name === "blog" || entry.name === "autopilot") {
      continue;
    }
    if (!/^[a-z]{2}$/i.test(entry.name)) continue;
    const stateDir = path.join(CONTENT_ROOT, entry.name);
    for (const cityEntry of fs.readdirSync(stateDir, { withFileTypes: true })) {
      if (!cityEntry.isDirectory()) continue;
      const indexPath = path.join(stateDir, cityEntry.name, "index.md");
      if (fs.existsSync(indexPath)) paths.push(indexPath);
    }
  }
  return paths;
}

function fileMtimeIso(filePath: string): string {
  const stat = fs.statSync(filePath);
  return stat.mtime.toISOString();
}

export function loadAutopilotMarkdownPost(filePath: string): BlogPost | null {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    const { meta, body } = parseFrontmatter(raw);
    const city = meta.city ?? "";
    const state = meta.state ?? "";
    const stateAbbr = (meta.state_abbrev ?? meta.stateAbbr ?? "").toUpperCase();
    if (!city || !state) return null;

    const titleMatch = body.match(/^#\s+(.+)$/m);
    const title =
      meta.title ?? titleMatch?.[1] ?? `${city}, ${stateAbbr} Accident Survival Guide`;

    const slug = slugify(
      `ultimate-${city}-${state}-accident-survival-guide-2026`,
    );
    const readingTime = meta.reading_time
      ? Number.parseInt(meta.reading_time, 10)
      : undefined;
    const keywords = meta.primary_keyword
      ? [meta.primary_keyword, `${city} car accident`, `${state} accident guide`]
      : [`car accident ${city}`, `${city} ${stateAbbr}`];

    const relativePath = path.relative(process.cwd(), filePath);

    return {
      slug,
      title,
      metaDescription: (meta.description ?? excerptFromBody(body, "")).slice(0, 160),
      excerpt: excerptFromBody(body, meta.description ?? ""),
      city,
      state,
      stateAbbr,
      stateSlug: stateSlugFromAbbr(stateAbbr),
      topic: "state-local-laws" as BlogTopic,
      status: "published",
      publishedAt: fileMtimeIso(filePath),
      updatedAt: fileMtimeIso(filePath),
      keywords,
      sections: [],
      faq: [],
      readingTimeMinutes: Number.isFinite(readingTime) ? readingTime : undefined,
      autopilot: true,
      contentPath: relativePath,
      markdownBody: body,
    };
  } catch (e) {
    console.warn(`[blog] skipped markdown post ${filePath}:`, e);
    return null;
  }
}

export function getAutopilotMarkdownPosts(): BlogPost[] {
  return discoverMarkdownPaths()
    .map(loadAutopilotMarkdownPost)
    .filter((p): p is BlogPost => p !== null);
}
