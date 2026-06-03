#!/usr/bin/env node
/**
 * Download a unique cover image for every published Bobby Garcia blog post.
 * Uses distinct Picsum photo IDs (not seeds) for visually different images.
 * Usage: node scripts/download-bobbygarcia-blog-covers.mjs [--force]
 */

import fs from "fs";
import path from "path";
import { pipeline } from "stream/promises";
import { createHash } from "crypto";

const ROOT = process.cwd();
const POSTS_EN = path.join(ROOT, "content/bobbygarcia/posts/en");
const POSTS_ES = path.join(ROOT, "content/bobbygarcia/posts/es");
const OUT_DIR = path.join(ROOT, "public/bobbygarcia/blog-covers");
const MANIFEST_PATH = path.join(ROOT, "content/bobbygarcia/blog-covers.json");
const force = process.argv.includes("--force");

function coverPath(slug) {
  return `/bobbygarcia/blog-covers/${slug}.jpg`;
}

async function fetchPicsumIds(count) {
  const ids = [];
  for (let page = 1; ids.length < count && page <= 5; page++) {
    const res = await fetch(`https://picsum.photos/v2/list?page=${page}&limit=100`);
    if (!res.ok) throw new Error(`Picsum list HTTP ${res.status}`);
    const batch = await res.json();
    if (!batch.length) break;
    for (const photo of batch) {
      ids.push(String(photo.id));
    }
  }
  if (ids.length < count) {
    throw new Error(`Need ${count} picsum ids, got ${ids.length}`);
  }
  return ids.slice(0, count);
}

function coverUrl(picsumId) {
  return `https://picsum.photos/id/${picsumId}/1200/630`;
}

async function download(url, dest) {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  await fs.promises.mkdir(path.dirname(dest), { recursive: true });
  await pipeline(res.body, fs.createWriteStream(dest));
}

function readPosts(dir) {
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")))
    .filter((p) => p.status === "published");
}

function writePost(dir, post) {
  fs.writeFileSync(path.join(dir, `${post.slug}.json`), JSON.stringify(post, null, 2) + "\n");
}

function fileHash(filePath) {
  return createHash("md5").update(fs.readFileSync(filePath)).digest("hex");
}

async function main() {
  const enPosts = readPosts(POSTS_EN).sort((a, b) => a.slug.localeCompare(b.slug));
  const picsumIds = await fetchPicsumIds(enPosts.length);

  const manifest = {
    downloadedAt: new Date().toISOString(),
    count: enPosts.length,
    covers: [],
  };

  let ok = 0;
  let skip = 0;
  let fail = 0;
  const seenHashes = new Map();

  for (let i = 0; i < enPosts.length; i++) {
    const post = enPosts[i];
    const picsumId = picsumIds[i];
    const dest = path.join(OUT_DIR, `${post.slug}.jpg`);
    const publicPath = coverPath(post.slug);
    const sourceUrl = coverUrl(picsumId);

    if (fs.existsSync(dest) && !force) {
      skip++;
      manifest.covers.push({ slug: post.slug, publicPath, picsumId, status: "skipped" });
    } else {
      try {
        await download(sourceUrl, dest);
        const hash = fileHash(dest);
        if (seenHashes.has(hash)) {
          const altId = picsumIds[(i + 17) % picsumIds.length] ?? `${Number(picsumId) + 100}`;
          await download(coverUrl(altId), dest);
        }
        const finalHash = fileHash(dest);
        seenHashes.set(finalHash, post.slug);
        ok++;
        manifest.covers.push({ slug: post.slug, publicPath, picsumId, sourceUrl, status: "ok" });
        console.log(`✓ ${post.slug} (picsum id ${picsumId})`);
      } catch (e) {
        fail++;
        manifest.covers.push({
          slug: post.slug,
          publicPath,
          status: "failed",
          error: String(e.message ?? e),
        });
        console.warn(`✗ ${post.slug}: ${e.message ?? e}`);
      }
    }

    const coverImage = publicPath;
    writePost(POSTS_EN, { ...JSON.parse(fs.readFileSync(path.join(POSTS_EN, `${post.slug}.json`), "utf8")), coverImage });

    const esPath = path.join(POSTS_ES, `${post.slug}.json`);
    if (fs.existsSync(esPath)) {
      writePost(POSTS_ES, { ...JSON.parse(fs.readFileSync(esPath, "utf8")), coverImage });
    }
  }

  await fs.promises.mkdir(path.dirname(MANIFEST_PATH), { recursive: true });
  await fs.promises.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n");

  const unique = new Set(manifest.covers.map((c) => c.publicPath)).size;
  console.log(`\nDone: ${ok} downloaded, ${skip} skipped, ${fail} failed`);
  console.log(`Published unique guides: ${enPosts.length}`);
  console.log(`Unique cover paths: ${unique}/${enPosts.length}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
