#!/usr/bin/env npx tsx
/**
 * Generate SEO blog JSON + GEO city markdown without OpenAI.
 * Uses programmatic templates from build-city-page and build-blog-post.
 *
 * Usage:
 *   npx tsx scripts/generate-programmatic-seo-geo.ts [--limit 20] [--dry-run]
 */

import fs from "fs";
import path from "path";
import type { BlogTemplateId } from "../data/types";
import type { CityRecord } from "../data/types";
import { STATE_BY_SLUG } from "../data/states";
import { CITIES, getStateForCity } from "../src/lib/seo/cities";
import { buildCityMarkdown } from "../src/lib/seo/build-city-page";
import {
  buildProgrammaticBlogPost,
  countBlogWords,
} from "../src/lib/seo/build-blog-post";
import { WRECKMATCH_SEO_BASE, cityPagePath } from "../src/lib/seo/site";

const ROOT = process.cwd();
const MASTER_PATH = path.join(ROOT, "content/autopilot/cities_master.json");
const QUEUE_PATH = path.join(ROOT, "content/autopilot/queue.json");
const LOG_PATH = path.join(ROOT, "content/autopilot/generation.log");
const POSTS_DIR = path.join(ROOT, "content/blog/posts");
const GEO_DIR = path.join(ROOT, "ai-visibility-accelerator/output/content/city-posts");
const CONTENT_ROOT = path.join(ROOT, "content");

const TEMPLATES: BlogTemplateId[] = [
  "immediate-steps",
  "statute-limitations",
  "costly-mistakes",
];

type MasterCity = {
  city: string;
  state: string;
  state_abbrev: string;
  state_slug: string;
  city_slug: string;
};

function parseArgs() {
  const dryRun = process.argv.includes("--dry-run");
  const eq = process.argv.find((a) => a.startsWith("--limit="));
  let limit = 20;
  if (eq) limit = Number(eq.split("=")[1]) || 20;
  const i = process.argv.indexOf("--limit");
  if (i !== -1 && process.argv[i + 1]) limit = Number(process.argv[i + 1]) || 20;
  return { limit, dryRun };
}

function log(msg: string) {
  const line = `[${new Date().toISOString()}] programmatic-seo-geo: ${msg}\n`;
  fs.appendFileSync(LOG_PATH, line);
  console.log(msg);
}

function cityKey(c: MasterCity) {
  return `${c.city_slug}|${c.state_abbrev}`;
}

function loadQueue(): {
  completed_city_keys: string[];
  last_city_key?: string;
  last_run_at?: string;
} {
  if (!fs.existsSync(QUEUE_PATH)) {
    return { completed_city_keys: [] };
  }
  return JSON.parse(fs.readFileSync(QUEUE_PATH, "utf8"));
}

function saveQueue(queue: ReturnType<typeof loadQueue>) {
  queue.last_run_at = new Date().toISOString();
  fs.writeFileSync(QUEUE_PATH, JSON.stringify(queue, null, 2) + "\n");
}

function findCityRecord(master: MasterCity): CityRecord | undefined {
  return CITIES.find(
    (c) =>
      c.city.toLowerCase() === master.city.toLowerCase() &&
      c.state_abbr.toLowerCase() === master.state_abbrev.toLowerCase(),
  );
}

/** Minimal city record when full enrichment data is not in cities.generated.json */
function stubCityRecord(master: MasterCity): CityRecord {
  const slug = master.city_slug.replace(/-[a-z]{2}$/i, "") || master.city_slug;
  return {
    slug,
    city: master.city,
    state: master.state,
    state_abbr: master.state_abbrev,
    state_slug: master.state_slug,
    lat: 0,
    lng: 0,
    population: 150_000,
    metro_population: null,
    annual_crashes: null,
    fatal_crashes_annual: null,
    major_hospitals: [`${master.city} area hospitals and emergency departments`],
    trauma_centers_level1: [],
    county: `${master.city} County / local jurisdiction`,
    county_court: `${master.state} courts serving ${master.city}`,
    major_highways: [`Major highways and arterials in ${master.city}`],
    accident_hotspots: [`High-traffic corridors in ${master.city}, ${master.state_abbrev}`],
    local_dot_link: STATE_BY_SLUG[master.state_slug]?.dot_url ?? null,
    police_accident_report_link: null,
    local_bar_association: STATE_BY_SLUG[master.state_slug]?.bar_association ?? `${master.state} Bar`,
    spanish_speaking_population_pct: null,
    data_sources: [],
  };
}

function resolveCity(master: MasterCity): CityRecord {
  return findCityRecord(master) ?? stubCityRecord(master);
}

function writeGeoPage(city: CityRecord, state: NonNullable<ReturnType<typeof getStateForCity>>) {
  fs.mkdirSync(GEO_DIR, { recursive: true });
  const canonical = `${WRECKMATCH_SEO_BASE}${cityPagePath(city.slug)}`;
  const title = `Car Accident Help in ${city.city}, ${state.name} (${new Date().getFullYear()} Guide)`;
  const description = `${city.city} car accident guide — ${state.statute_limitations_years}-year SOL, local resources, insurance minimums, and next steps. Educational only.`;
  const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
description: "${description.replace(/"/g, '\\"')}"
canonical: "${canonical}"
city: "${city.city}"
state: "${state.name}"
state_abbr: "${city.state_abbr}"
generated_at: "${new Date().toISOString().slice(0, 10)}"
programmatic: true
---

`;
  const file = path.join(GEO_DIR, `car-accident-help-${city.slug}.md`);
  fs.writeFileSync(file, frontmatter + buildCityMarkdown(city, state));
  return file;
}

function writeAsgIndex(city: CityRecord, state: NonNullable<ReturnType<typeof getStateForCity>>, master: MasterCity) {
  const dir = path.join(CONTENT_ROOT, master.state_abbrev.toLowerCase(), master.city_slug);
  fs.mkdirSync(dir, { recursive: true });
  const md = buildCityMarkdown(city, state);
  const header = `# ${city.city}, ${state.name} Car Accident Survival Guide (${new Date().getFullYear()})\n\n`;
  fs.writeFileSync(path.join(dir, "index.md"), header + md);
  fs.writeFileSync(
    path.join(dir, "images.md"),
    `# Image suggestions — ${city.city}, ${state.name}\n\n- Aerial map of ${city.major_highways[0] ?? city.city + " corridors"}\n- Local courthouse / ${city.county}\n- Emergency department exterior (stock, licensed)\n`,
  );
  return dir;
}

function writeBlogPosts(city: CityRecord, state: NonNullable<ReturnType<typeof getStateForCity>>) {
  fs.mkdirSync(POSTS_DIR, { recursive: true });
  const written: string[] = [];
  for (const template of TEMPLATES) {
    const post = buildProgrammaticBlogPost(city, state, template);
    const out = path.join(POSTS_DIR, `${post.slug}.json`);
    if (fs.existsSync(out)) continue;
    fs.writeFileSync(out, JSON.stringify(post, null, 2) + "\n");
    written.push(`${post.slug}.json (${countBlogWords(post)} words)`);
  }
  return written;
}

function main() {
  const { limit, dryRun } = parseArgs();
  const master = JSON.parse(fs.readFileSync(MASTER_PATH, "utf8")) as {
    cities: MasterCity[];
  };
  const queue = loadQueue();
  const done = new Set(queue.completed_city_keys ?? []);

  const pending = master.cities.filter((c) => !done.has(cityKey(c)));
  const batch = pending.slice(0, limit);

  if (batch.length === 0) {
    console.log("No pending cities — queue is complete.");
    process.exit(0);
  }

  console.log(`Generating programmatic SEO+GEO for ${batch.length} cities (dry-run=${dryRun})…`);

  let geoCount = 0;
  let blogCount = 0;
  let asgCount = 0;

  for (const mc of batch) {
    const city = resolveCity(mc);
    const state = getStateForCity(city) ?? STATE_BY_SLUG[mc.state_slug];
    if (!state) {
      log(`SKIP ${mc.city} — no state record for ${mc.state_slug}`);
      continue;
    }

    if (dryRun) {
      log(`DRY RUN: ${mc.city}, ${mc.state}`);
      continue;
    }

    const geoFile = writeGeoPage(city, state);
    geoCount += 1;

    const asgDir = writeAsgIndex(city, state, mc);
    asgCount += 1;

    const blogs = writeBlogPosts(city, state);
    blogCount += blogs.length;

    if (!done.has(cityKey(mc))) {
      queue.completed_city_keys = [...(queue.completed_city_keys ?? []), cityKey(mc)];
    }
    queue.last_city_key = cityKey(mc);

    log(
      `${mc.city}, ${mc.state}: GEO ${path.relative(ROOT, geoFile)} | ASG ${path.relative(ROOT, asgDir)} | blogs: ${blogs.length}`,
    );
  }

  if (!dryRun) {
    saveQueue(queue);
  }

  console.log("\n--- Summary ---");
  console.log(`Cities processed:  ${batch.length}`);
  console.log(`GEO pages written: ${geoCount}`);
  console.log(`ASG index dirs:    ${asgCount}`);
  console.log(`Blog posts new:    ${blogCount}`);
  console.log(`Queue complete:    ${queue.completed_city_keys?.length ?? 0}/279`);
}

main();
