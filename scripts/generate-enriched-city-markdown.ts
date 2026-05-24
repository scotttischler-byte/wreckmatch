#!/usr/bin/env npx tsx
/**
 * Write enriched city markdown files for top metros missing hand-crafted content.
 * Usage: npx tsx scripts/generate-enriched-city-markdown.ts [--limit 12]
 */

import fs from "fs";
import path from "path";
import { CITIES, getStateForCity } from "../src/lib/seo/cities";
import { buildCityMarkdown } from "../src/lib/seo/build-city-page";
import { listCityMarkdownSlugs } from "../src/lib/seo/markdown-content";
import { WRECKMATCH_SEO_BASE, cityPagePath } from "../src/lib/seo/site";

const OUT_DIR = path.join(process.cwd(), "ai-visibility-accelerator/output/content/city-posts");
const limit = Number(process.argv.find((a) => a.startsWith("--limit="))?.split("=")[1] ?? 12);

const existing = new Set(listCityMarkdownSlugs());

function slugFromFilename(name: string) {
  return name.replace(/^car-accident-help-/, "").replace(/\.md$/, "");
}

function existingCitySlugs(): Set<string> {
  if (!fs.existsSync(OUT_DIR)) return new Set();
  return new Set(
    fs
      .readdirSync(OUT_DIR)
      .filter((f) => f.endsWith(".md"))
      .map((f) => {
        const raw = slugFromFilename(f);
        const city = CITIES.find(
          (c) =>
            raw === c.slug ||
            raw === `${c.slug}-${c.state_abbr.toLowerCase()}` ||
            raw === `${c.slug}-${c.state_slug}`,
        );
        return city?.slug ?? raw;
      }),
  );
}

const have = existingCitySlugs();
const targets = [...CITIES]
  .sort((a, b) => b.population - a.population)
  .filter((c) => !have.has(c.slug))
  .slice(0, limit);

if (targets.length === 0) {
  console.log("All top cities already have enriched markdown.");
  process.exit(0);
}

fs.mkdirSync(OUT_DIR, { recursive: true });

for (const city of targets) {
  const state = getStateForCity(city);
  if (!state) continue;

  const canonical = `${WRECKMATCH_SEO_BASE}${cityPagePath(city.slug)}`;
  const title = `Car Accident Help in ${city.city}, ${state.name} (${new Date().getFullYear()} Guide)`;
  const description = `${city.city} car accident guide — ${state.statute_limitations_years}-year SOL, local hospitals, insurance minimums, and next steps. Educational only.`;

  const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
description: "${description.replace(/"/g, '\\"')}"
canonical: "${canonical}"
og_title: "${title.replace(/"/g, '\\"')} | WreckMatch"
og_description: "${description.replace(/"/g, '\\"')}"
city: "${city.city}"
state: "${state.name}"
state_abbr: "${city.state_abbr}"
generated_at: "${new Date().toISOString().slice(0, 10)}"
---

`;

  const body = buildCityMarkdown(city, state);
  const file = path.join(OUT_DIR, `car-accident-help-${city.slug}.md`);
  fs.writeFileSync(file, frontmatter + body);
  console.log(`Wrote ${path.relative(process.cwd(), file)}`);
}

console.log(`\nGenerated ${targets.length} enriched city page(s).`);
