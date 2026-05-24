import fs from "fs";
import path from "path";
import type { CityRecord } from "../../../data/types";

const ROOT = process.cwd();
const CITY_MD_DIR = path.join(ROOT, "ai-visibility-accelerator/output/content/city-posts");
const STATE_MD_DIR = path.join(ROOT, "ai-visibility-accelerator/output/content/state-posts");

export type ParsedMarkdown = {
  frontmatter: Record<string, string>;
  body: string;
  raw: string;
};

function parseFrontmatter(raw: string): ParsedMarkdown {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { frontmatter: {}, body: raw, raw };
  }
  const frontmatter: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    frontmatter[key] = val;
  }
  return { frontmatter: frontmatter, body: match[2], raw };
}

function readIfExists(filePath: string): ParsedMarkdown | null {
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  return parseFrontmatter(raw);
}

export function getCityMarkdown(city: CityRecord): ParsedMarkdown | null {
  const candidates = [
    path.join(CITY_MD_DIR, `car-accident-help-${city.slug}.md`),
    path.join(CITY_MD_DIR, `car-accident-help-${city.slug}-${city.state_slug}.md`),
    path.join(CITY_MD_DIR, `car-accident-help-${city.slug}-${city.state_abbr.toLowerCase()}.md`),
  ];
  for (const file of candidates) {
    const parsed = readIfExists(file);
    if (parsed) return parsed;
  }
  return null;
}

export function getStateMarkdown(stateSlug: string): ParsedMarkdown | null {
  return readIfExists(path.join(STATE_MD_DIR, `car-accident-help-${stateSlug}.md`));
}

export function listCityMarkdownSlugs(): string[] {
  if (!fs.existsSync(CITY_MD_DIR)) return [];
  return fs
    .readdirSync(CITY_MD_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/^car-accident-help-/, "").replace(/\.md$/, ""));
}
