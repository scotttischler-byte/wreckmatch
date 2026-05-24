#!/usr/bin/env node
/**
 * Finds blog posts that cannibalize city help pages (same city + topic).
 * Output: content/cannibalization-report.csv
 *
 * Usage: node scripts/find-cannibalization.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const POSTS_DIR = path.join(ROOT, "content/blog/posts");
const CITIES = JSON.parse(fs.readFileSync(path.join(ROOT, "data/cities.generated.json"), "utf8"));

function slugifyCity(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function countWords(post) {
  const text = JSON.stringify(post);
  return text.split(/\s+/).filter(Boolean).length;
}

function cityFromPost(post) {
  const slug = slugifyCity(post.city);
  return CITIES.find(
    (c) =>
      c.city.toLowerCase() === post.city.toLowerCase() &&
      c.state_abbr.toLowerCase() === post.stateAbbr.toLowerCase(),
  ) ?? CITIES.find((c) => c.slug === slug);
}

function primaryKeyword(post, city) {
  if (!city) return post.slug;
  return `car accident help ${city.city} ${city.state_abbr}`.toLowerCase();
}

function recommendation(blogWords) {
  if (blogWords < 500) return "301_redirect_to_city";
  if (blogWords < 800) return "301_redirect_or_rewrite";
  return "differentiate_angle";
}

const posts = fs
  .readdirSync(POSTS_DIR)
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(fs.readFileSync(path.join(POSTS_DIR, f), "utf8")));

const rows = [["blog_slug", "city_slug", "blog_wordcount", "city_page", "primary_keyword", "recommendation"]];

for (const post of posts) {
  if (post.city === "Nationwide") continue;
  const city = cityFromPost(post);
  if (!city) continue;
  const blogWords = countWords(post);
  const cityPath = `/car-accident-help-${city.slug}`;
  const kw = primaryKeyword(post, city);
  const rec = recommendation(blogWords);
  const isImmediateSteps =
    post.topic === "immediate-steps" ||
    post.slug.includes("what-to-do") ||
    post.slug.includes("car-accident");
  if (isImmediateSteps || blogWords < 800) {
    rows.push([post.slug, city.slug, String(blogWords), cityPath, kw, rec]);
  }
}

const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
const outPath = path.join(ROOT, "content/cannibalization-report.csv");
fs.writeFileSync(outPath, csv);
console.log(`Wrote ${rows.length - 1} pairs to ${outPath}`);
rows.slice(1).forEach((r) => console.log(`  ${r[5]}: ${r[0]} → ${r[3]}`));
