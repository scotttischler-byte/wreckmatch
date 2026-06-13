#!/usr/bin/env node
/**
 * Publishes queued SEO URLs conservatively (city/state/blog).
 * Does NOT deploy — only updates local queue state and promotes blog drafts.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";
import { draftsDir, postsDir } from "./blog-locale-paths.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const QUEUE_PATH = path.join(ROOT, "data/publish-queue.json");

function loadQueue() {
  return JSON.parse(fs.readFileSync(QUEUE_PATH, "utf8"));
}

function saveQueue(queue) {
  fs.writeFileSync(QUEUE_PATH, JSON.stringify(queue, null, 2));
}

function promoteDrafts(limit, locale) {
  const drafts = draftsDir(locale);
  if (!fs.existsSync(drafts)) return [];
  const files = fs.readdirSync(drafts).filter((f) => f.endsWith(".json"));
  const promoted = [];
  const posts = postsDir(locale);

  for (const file of files.slice(0, limit)) {
    const src = path.join(drafts, file);
    const gate = spawnSync("node", ["scripts/quality-gate.mjs", src], { cwd: ROOT });
    if (gate.status !== 0) {
      console.warn(`Skip draft [${locale}] (quality gate): ${file}`);
      continue;
    }
    const raw = JSON.parse(fs.readFileSync(src, "utf8"));
    raw.status = "published";
    raw.locale = locale;
    raw.publishedAt = raw.publishedAt || new Date().toISOString();
    fs.mkdirSync(posts, { recursive: true });
    fs.writeFileSync(path.join(posts, file), JSON.stringify(raw, null, 2));
    fs.unlinkSync(src);
    promoted.push(raw.slug);
    console.log(`Published blog [${locale}]: ${raw.slug}`);
  }
  return promoted;
}

function main() {
  const queue = loadQueue();
  const limits = queue.dailyLimits ?? {
    cityPages: 5,
    statePages: 2,
    blogPosts: 13,
    blogPostsEn: 13,
    blogPostsEs: 13,
  };

  const cityBatch = (queue.queue.cities ?? []).slice(0, limits.cityPages);
  const stateBatch = (queue.queue.states ?? []).slice(0, limits.statePages);

  queue.queue.cities = (queue.queue.cities ?? []).slice(limits.cityPages);
  queue.queue.states = (queue.queue.states ?? []).slice(limits.statePages);

  queue.published.cities = [...(queue.published.cities ?? []), ...cityBatch];
  queue.published.states = [...(queue.published.states ?? []), ...stateBatch];

  const enLimit = limits.blogPostsEn ?? limits.blogPosts ?? 13;
  const esLimit = limits.blogPostsEs ?? limits.blogPosts ?? 13;

  const blogPromotedEn = promoteDrafts(enLimit, "en");
  const blogPromotedEs = promoteDrafts(esLimit, "es");
  const blogPromoted = [...blogPromotedEn, ...blogPromotedEs];

  queue.published.blogSlugs = [...(queue.published.blogSlugs ?? []), ...blogPromoted];

  queue.lastPublishAt = new Date().toISOString();
  saveQueue(queue);

  console.log("\nPublish summary:");
  console.log(`  Cities marked live (SSG already builds all): ${cityBatch.join(", ") || "(none)"}`);
  console.log(`  States marked live: ${stateBatch.join(", ") || "(none)"}`);
  console.log(`  Blog posts promoted EN: ${blogPromotedEn.length}`);
  console.log(`  Blog posts promoted ES: ${blogPromotedEs.length}`);
  console.log("\nCommit and deploy when ready — this script does not deploy.");
}

main();
