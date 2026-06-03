#!/usr/bin/env node
/**
 * Queue + submit IndexNow after content changes.
 *
 * Usage:
 *   node scripts/indexnow-after-content.mjs                    # sitemap + pending slugs
 *   node scripts/indexnow-after-content.mjs --wait-deploy      # wait for prod sitemap, then submit
 *   node scripts/indexnow-after-content.mjs --from-posts-dir   # queue all blog slugs missing from pending
 */
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";

const ROOT = process.cwd();
const secretsPath = path.join(ROOT, ".secrets-setup");
if (fs.existsSync(secretsPath)) {
  for (const line of fs.readFileSync(secretsPath, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#") || !t.includes("=")) continue;
    const i = t.indexOf("=");
    const k = t.slice(0, i).trim();
    const v = t.slice(i + 1).trim();
    if (k && v && !process.env[k]) process.env[k] = v;
  }
}

const PENDING_PATH = path.join(ROOT, "content/autopilot/indexnow_pending.json");
const POSTS_DIR = path.join(ROOT, "content/blog/posts");
const WRECKMATCH_SITEMAP = "https://www.wreckmatch.com/sitemap.xml";
const MIN_SITEMAP_URLS = Number(process.env.INDEXNOW_MIN_SITEMAP_URLS ?? "2000");

function loadPending() {
  if (!fs.existsSync(PENDING_PATH)) return { slugs: [], updatedAt: "" };
  try {
    return JSON.parse(fs.readFileSync(PENDING_PATH, "utf8"));
  } catch {
    return { slugs: [], updatedAt: "" };
  }
}

function savePending(data) {
  fs.mkdirSync(path.dirname(PENDING_PATH), { recursive: true });
  fs.writeFileSync(PENDING_PATH, JSON.stringify(data, null, 2) + "\n");
}

function queueSlugs(slugs) {
  const pending = loadPending();
  const merged = [...new Set([...(pending.slugs ?? []), ...slugs])];
  savePending({ slugs: merged, updatedAt: new Date().toISOString() });
  return merged.length;
}

function slugsFromPostsDir() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""));
}

function slugsModifiedSince(msAgo) {
  const cutoff = Date.now() - msAgo;
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".json"))
    .filter((f) => fs.statSync(path.join(POSTS_DIR, f)).mtimeMs >= cutoff)
    .map((f) => f.replace(/\.json$/, ""));
}

async function fetchSitemapUrlCount(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!res.ok) throw new Error(`Sitemap ${url}: ${res.status}`);
  const xml = await res.text();
  return (xml.match(/<loc>/g) ?? []).length;
}

async function waitForDeploy() {
  console.log(`Waiting for production sitemap (target ≥ ${MIN_SITEMAP_URLS} URLs)…`);
  for (let attempt = 1; attempt <= 20; attempt++) {
    try {
      const count = await fetchSitemapUrlCount(WRECKMATCH_SITEMAP);
      console.log(`  Attempt ${attempt}: ${count} URLs in sitemap`);
      if (count >= MIN_SITEMAP_URLS) return count;
    } catch (e) {
      console.log(`  Attempt ${attempt}: ${e.message}`);
    }
    await new Promise((r) => setTimeout(r, 30000));
  }
  console.warn("Deploy wait timed out — submitting anyway.");
  return 0;
}

async function main() {
  const args = process.argv.slice(2);
  const waitDeploy = args.includes("--wait-deploy");
  const fromPosts = args.includes("--from-posts-dir");
  const recentHours = Number(args.find((a) => a.startsWith("--recent-hours="))?.split("=")[1] ?? "24");

  if (fromPosts) {
    const slugs = slugsFromPostsDir();
    const total = queueSlugs(slugs);
    console.log(`Queued ${slugs.length} blog slugs (${total} total pending).`);
  } else if (args.includes("--recent")) {
    const slugs = slugsModifiedSince(recentHours * 3600 * 1000);
    if (slugs.length) {
      queueSlugs(slugs);
      console.log(`Queued ${slugs.length} recently modified blog slug(s).`);
    }
  }

  if (waitDeploy) {
    await waitForDeploy();
  }

  console.log("\nSubmitting IndexNow (all domains)…");
  const result = spawnSync("node", ["scripts/submit-indexnow.mjs", "all", "--fallback"], {
    cwd: ROOT,
    stdio: "inherit",
    env: process.env,
  });

  if (result.status === 0) {
    savePending({ slugs: [], updatedAt: new Date().toISOString() });
    console.log("\nCleared IndexNow pending queue.");
  }

  process.exit(result.status ?? 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
