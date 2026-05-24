#!/usr/bin/env node
/**
 * Report city page markdown enrichment coverage.
 * Usage: node scripts/enrichment-status.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const CITY_MD_DIR = path.join(ROOT, "ai-visibility-accelerator/output/content/city-posts");
const CITIES = JSON.parse(fs.readFileSync(path.join(ROOT, "data/cities.generated.json"), "utf8"));

function enrichedSlugs() {
  if (!fs.existsSync(CITY_MD_DIR)) return new Set();
  const slugs = new Set();
  for (const file of fs.readdirSync(CITY_MD_DIR).filter((f) => f.endsWith(".md"))) {
    const raw = file.replace(/^car-accident-help-/, "").replace(/\.md$/, "");
    const city = CITIES.find(
      (c) =>
        raw === c.slug ||
        raw === `${c.slug}-${c.state_abbr.toLowerCase()}` ||
        raw === `${c.slug}-${c.state_slug}`,
    );
    if (city) slugs.add(city.slug);
  }
  return slugs;
}

const enriched = enrichedSlugs();
const missing = CITIES.filter((c) => !enriched.has(c.slug)).sort(
  (a, b) => b.population - a.population,
);

console.log(`City markdown enrichment: ${enriched.size}/${CITIES.length} (${Math.round((enriched.size / CITIES.length) * 100)}%)`);

if (missing.length) {
  console.log("\nMissing (by population):");
  missing.slice(0, 15).forEach((c) => console.log(`  - ${c.city}, ${c.state_abbr} (${c.slug})`));
  if (missing.length > 15) console.log(`  … and ${missing.length - 15} more`);
} else {
  console.log("All cities have enriched markdown files.");
}

process.exit(missing.length ? 0 : 0);
