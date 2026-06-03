#!/usr/bin/env node
/**
 * Mark duplicate city-template Bobby Garcia blogs as draft.
 * Usage: node scripts/curate-bobbygarcia-blogs.mjs
 */

import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const POSTS_EN = path.join(ROOT, "content/bobbygarcia/posts/en");
const POSTS_ES = path.join(ROOT, "content/bobbygarcia/posts/es");

const TEMPLATE_KEEP_SLUGS = new Set([
  "what-to-do-after-car-accident-houston-tx",
  "what-to-do-after-a-car-accident-mcallen-tx",
  "what-to-do-after-a-car-accident-in-el-paso-tx",
  "costly-mistakes-after-crash-mcallen-tx",
  "costly-mistakes-after-crash-corpus-christi-tx",
  "statute-of-limitations-mcallen-tx",
  "statute-of-limitations-corpus-christi-tx",
]);

function getFamily(slug) {
  if (slug.startsWith("what-to-do-after")) return "what-to-do";
  if (slug.startsWith("costly-mistakes-after-crash")) return "costly-mistakes";
  if (slug.startsWith("statute-of-limitations-")) return "statute";
  return null;
}

function shouldPublish(slug) {
  const family = getFamily(slug);
  if (!family) return true;
  return TEMPLATE_KEEP_SLUGS.has(slug);
}

function curateDir(dir) {
  let published = 0;
  let draft = 0;
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".json"))) {
    const filePath = path.join(dir, file);
    const post = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const nextStatus = shouldPublish(post.slug) ? "published" : "draft";
    if (post.status !== nextStatus) {
      post.status = nextStatus;
      fs.writeFileSync(filePath, JSON.stringify(post, null, 2) + "\n");
    }
    if (nextStatus === "published") published++;
    else draft++;
  }
  return { published, draft };
}

const en = curateDir(POSTS_EN);
const es = curateDir(POSTS_ES);

console.log(`Curated EN: ${en.published} published, ${en.draft} draft`);
console.log(`Curated ES: ${es.published} published, ${es.draft} draft`);
