#!/usr/bin/env node
/**
 * Generates up to 5 blog post drafts per run.
 * Requires OPENAI_API_KEY. Set BLOG_AUTO_PUBLISH=true to write directly to posts/.
 *
 * Usage: node scripts/generate-blog-batch.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const POSTS_DIR = path.join(ROOT, "content/blog/posts");
const DRAFTS_DIR = path.join(ROOT, "content/blog/drafts");
const QUEUE_PATH = path.join(ROOT, "content/blog/queue.json");

const POSTS_PER_DAY = Number(process.env.BLOG_POSTS_PER_DAY ?? 5);
const AUTO_PUBLISH = process.env.BLOG_AUTO_PUBLISH === "true";

// Inline city list (subset) — full list lives in src/lib/blog/cities.ts at build time
const CITIES = JSON.parse(
  fs.readFileSync(path.join(ROOT, "content/blog/cities-seed.json"), "utf8"),
);

const TOPICS = [
  "immediate-steps",
  "insurance-pitfalls",
  "injuries-medical",
  "state-local-laws",
  "claims-adjusters",
  "rideshare-truck",
  "uninsured-hit-run",
  "prevention-safety",
];

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 90);
}

function loadQueue() {
  if (!fs.existsSync(QUEUE_PATH)) {
    return { recentCitySlugs: [], requireApproval: true };
  }
  return JSON.parse(fs.readFileSync(QUEUE_PATH, "utf8"));
}

function saveQueue(queue) {
  fs.writeFileSync(QUEUE_PATH, JSON.stringify(queue, null, 2));
}

function existingSlugs() {
  const dirs = [POSTS_DIR, DRAFTS_DIR];
  const slugs = new Set();
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) {
      if (f.endsWith(".json")) slugs.add(f.replace(/\.json$/, ""));
    }
  }
  return slugs;
}

function pickBatch(queue, count) {
  const recent = new Set(queue.recentCitySlugs ?? []);
  const pool = CITIES.filter((c) => !recent.has(c.slug));
  const source = pool.length >= count ? pool : CITIES;
  const shuffled = [...source].sort(() => Math.random() - 0.5);
  const picks = [];
  const usedTopics = new Set();

  for (const city of shuffled) {
    if (picks.length >= count) break;
    const topic = TOPICS.find((t) => !usedTopics.has(t)) ?? TOPICS[picks.length % TOPICS.length];
    usedTopics.add(topic);
    picks.push({ city, topic });
  }
  return picks;
}

async function generateWithOpenAI(city, topic) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is required for blog generation");

  const system = `You write educational car accident content for AccidentSurvivalGuide.com (WreckMatch LLC, not a law firm). Output ONLY valid JSON with: title, metaDescription, excerpt, keywords (array), sections (array of {heading, paragraphs, list?}), faq (array of {question, answer}). 1200+ words total. Not legal advice.`;

  const user = `City: ${city.city}, ${city.state} (${city.stateAbbr}). Topic: ${topic}. Title should include city and state.`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.BLOG_OPENAI_MODEL ?? "gpt-4o-mini",
      temperature: 0.7,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI error: ${res.status} ${err}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  return JSON.parse(content);
}

function buildFallbackPost(city, topic) {
  const title = `What to Do After a Car Accident in ${city.city}, ${city.stateAbbr}`;
  return {
    title,
    metaDescription: `Educational checklist for ${city.city}, ${city.stateAbbr} drivers after a crash. Not legal advice.`,
    excerpt: `Practical steps for ${city.city} residents after a collision.`,
    keywords: [`car accident ${city.city}`, `${city.stateAbbr} crash guide`, topic],
    sections: [
      {
        heading: "Immediate safety",
        paragraphs: [
          `After a crash in ${city.city}, move to safety if you can, call 911 when injuries may exist, and turn on hazard lights.`,
        ],
        list: ["Exchange insurance information", "Photograph the scene", "Collect witness contacts"],
      },
    ],
    faq: [
      {
        question: "Is this legal advice?",
        answer: "No. This is general education from WreckMatch LLC, a referral service—not a law firm.",
      },
    ],
  };
}

async function main() {
  const queue = loadQueue();
  const batch = pickBatch(queue, POSTS_PER_DAY);
  const slugs = existingSlugs();
  const outDir = AUTO_PUBLISH && !queue.requireApproval ? POSTS_DIR : DRAFTS_DIR;
  fs.mkdirSync(outDir, { recursive: true });

  const newCitySlugs = [];

  for (const { city, topic } of batch) {
    let generated;
    try {
      generated = process.env.OPENAI_API_KEY
        ? await generateWithOpenAI(city, topic)
        : buildFallbackPost(city, topic);
    } catch (e) {
      console.warn(`Fallback for ${city.city}:`, e.message);
      generated = buildFallbackPost(city, topic);
    }

    let slug = slugify(generated.title);
    if (slugs.has(slug)) slug = `${slug}-${Date.now()}`;
    slugs.add(slug);

    const post = {
      slug,
      ...generated,
      city: city.city,
      state: city.state,
      stateAbbr: city.stateAbbr,
      stateSlug: city.stateSlug,
      topic,
      status: AUTO_PUBLISH && !queue.requireApproval ? "published" : "draft",
      publishedAt: new Date().toISOString(),
    };

    fs.writeFileSync(path.join(outDir, `${slug}.json`), JSON.stringify(post, null, 2));
    console.log(`Wrote ${post.status}: ${slug}`);
    newCitySlugs.push(city.slug);
  }

  queue.lastRunAt = new Date().toISOString();
  queue.recentCitySlugs = [...newCitySlugs, ...(queue.recentCitySlugs ?? [])].slice(0, 50);
  saveQueue(queue);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
