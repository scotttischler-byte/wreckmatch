#!/usr/bin/env node
/**
 * Publishes queued SEO URLs conservatively (city/state/blog).
 * Does NOT deploy — only updates local queue state and promotes blog drafts.
 *
 * Usage: node scripts/publish-from-queue.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const QUEUE_PATH = path.join(ROOT, "data/publish-queue.json");
const DRAFTS_DIR = path.join(ROOT, "content/blog/drafts");
const POSTS_DIR = path.join(ROOT, "content/blog/posts");

function loadQueue() {
  return JSON.parse(fs.readFileSync(QUEUE_PATH, "utf8"));
}

function saveQueue(queue) {
  fs.writeFileSync(QUEUE_PATH, JSON.stringify(queue, null, 2));
}

function promoteDrafts(limit) {
  if (!fs.existsSync(DRAFTS_DIR)) return [];
  const drafts = fs.readdirSync(DRAFTS_DIR).filter((f) => f.endsWith(".json"));
  const promoted = [];

  for (const file of drafts.slice(0, limit)) {
    const src = path.join(DRAFTS_DIR, file);
    const gate = spawnSync("node", ["scripts/quality-gate.mjs", src], { cwd: ROOT });
    if (gate.status !== 0) {
      console.warn(`Skip draft (quality gate): ${file}`);
      continue;
    }
    const raw = JSON.parse(fs.readFileSync(src, "utf8"));
    raw.status = "published";
    raw.publishedAt = raw.publishedAt || new Date().toISOString();
    fs.mkdirSync(POSTS_DIR, { recursive: true });
    fs.writeFileSync(path.join(POSTS_DIR, file), JSON.stringify(raw, null, 2));
    fs.unlinkSync(src);
    promoted.push(raw.slug);
    console.log(`Published blog: ${raw.slug}`);
  }
  return promoted;
}

function main() {
  const queue = loadQueue();
  const limits = queue.dailyLimits ?? { cityPages: 5, statePages: 2, blogPosts: 5 };

  const cityBatch = (queue.queue.cities ?? []).slice(0, limits.cityPages);
  const stateBatch = (queue.queue.states ?? []).slice(0, limits.statePages);

  queue.queue.cities = (queue.queue.cities ?? []).slice(limits.cityPages);
  queue.queue.states = (queue.queue.states ?? []).slice(limits.statePages);

  queue.published.cities = [...(queue.published.cities ?? []), ...cityBatch];
  queue.published.states = [...(queue.published.states ?? []), ...stateBatch];

  const blogPromoted = promoteDrafts(limits.blogPosts);
  queue.published.blogSlugs = [...(queue.published.blogSlugs ?? []), ...blogPromoted];

  queue.lastPublishAt = new Date().toISOString();
  saveQueue(queue);

  console.log("\nPublish summary:");
  console.log(`  Cities marked live (SSG already builds all): ${cityBatch.join(", ") || "(none)"}`);
  console.log(`  States marked live: ${stateBatch.join(", ") || "(none)"}`);
  console.log(`  Blog posts promoted: ${blogPromoted.length}`);
  console.log("\nCommit and deploy when ready — this script does not deploy.");
}

main();
