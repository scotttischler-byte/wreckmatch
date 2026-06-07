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

const POSTS_PER_DAY = Number(process.env.BLOG_POSTS_PER_DAY ?? 25);
const AUTO_PUBLISH = process.env.BLOG_AUTO_PUBLISH === "true";

// Inline city list (subset) — full list lives in src/lib/blog/cities.ts at build time
const CITIES = JSON.parse(
  fs.readFileSync(path.join(ROOT, "data/cities.generated.json"), "utf8"),
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
    picks.push({
      city: {
        city: city.city,
        state: city.state,
        stateAbbr: city.state_abbr,
        stateSlug: city.state_slug,
        slug: city.slug,
        major_highways: city.major_highways,
      },
      topic,
    });
  }
  return picks;
}

async function generateWithOpenAI(city, topic) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is required for blog generation");

  const system = `You write educational car accident content for WreckMatch.com (WreckMatch LLC, not a law firm). Output ONLY valid JSON with: title, metaDescription (unique, 150-160 chars, different from excerpt), excerpt (1-2 sentences), keywords (array), sections (array of {heading, paragraphs, list?}), faq (array of {question, answer}). Minimum 1200 words total across all sections. Include 5+ specific data points: crash statistics, highway names, hospital names, statute of limitations years, insurance minimums. Not legal advice.`;

  const user = `City: ${city.city}, ${city.state} (${city.state_abbr}). Topic: ${topic}. Title should include city and state. Reference local highways: ${(city.major_highways || []).join(", ")}.`;

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
  const highways = (city.major_highways || ["major local highways"]).slice(0, 3).join(", ");
  const title = `What to Do After a Car Accident in ${city.city}, ${city.stateAbbr}`;
  const metaDescription = `${city.city}, ${city.stateAbbr} crash checklist: 911, police reports, ${highways}, medical care, and insurer pitfalls. Educational guide from WreckMatch LLC — not legal advice.`;
  const excerpt = `A practical ${city.city}-focused guide for the first hours and days after a collision on ${city.state} roads.`;
  return {
    title,
    metaDescription,
    excerpt,
    keywords: [`car accident ${city.city}`, `${city.stateAbbr} crash guide`, topic],
    sections: [
      {
        heading: "Immediate safety",
        paragraphs: [
          `After a crash in ${city.city}, move to safety if you can, call 911 when injuries may exist, and turn on hazard lights. High-traffic corridors such as ${highways} require extra caution when exiting your vehicle.`,
          `Do not admit fault at the scene. Exchange insurance information and photograph all vehicles, plates, and visible injuries before traffic clears.`,
        ],
        list: [
          "Call 911 for injuries or blocked lanes",
          "Photograph the scene from multiple angles",
          "Collect witness names and phone numbers",
          "Seek medical care within 24 hours if pain exists",
        ],
      },
      {
        heading: `${city.city} police reports and documentation`,
        paragraphs: [
          `Request a crash report number from responding officers. If police do not respond, check ${city.state} DOT rules for self-reporting thresholds.`,
          `Save repair estimates, rental receipts, and mileage to medical appointments — insurers in ${city.city} will ask for documentation early.`,
        ],
        list: [
          "Obtain the official crash report",
          "Save all medical bills and visit summaries",
          "Decline recorded statements until you understand injuries",
        ],
      },
      {
        heading: "Medical care and injury documentation",
        paragraphs: [
          `Whiplash, concussion, and soft-tissue injuries may appear hours or days after a ${city.city} collision. A same-day urgent care or ER visit creates a record insurers cannot easily dismiss.`,
          `Follow your provider's treatment plan and track missed work. Gaps in care are a common reason adjusters reduce settlement offers.`,
        ],
      },
      {
        heading: `${city.state} insurance and fault basics`,
        paragraphs: [
          `Notify your carrier with basic facts — date, location, and vehicles involved. ${city.state} fault rules affect how compensation is calculated; anything you say to an adjuster can be used later.`,
          `Review your policy for UM/UIM, MedPay, and PIP coverage before accepting any settlement release.`,
        ],
      },
      {
        heading: "Evidence preservation",
        paragraphs: [
          `Dashcam, security, and business camera footage near ${highways} is often deleted within weeks. Send preservation requests when appropriate.`,
          `Avoid social media posts about the crash — photos and captions can contradict injury claims.`,
        ],
      },
      {
        heading: "When to explore attorney matching",
        paragraphs: [
          `Consider a free consultation if you were hospitalized, fault is disputed, a commercial vehicle was involved, or the first settlement offer arrives before treatment ends.`,
          `WreckMatch LLC connects ${city.city} residents with licensed ${city.state} attorneys. We are a referral service, not a law firm.`,
        ],
      },
    ],
    faq: [
      {
        question: `Do I need a police report for every ${city.city} crash?`,
        answer: "Not always. Reporting depends on injuries, damage, and whether police respond. Check current state rules — this is general education only.",
      },
      {
        question: "Is this legal advice?",
        answer: "No. This is general education from WreckMatch LLC, a referral service—not a law firm.",
      },
      {
        question: `Should I give a recorded statement to insurance?`,
        answer: "You can notify your insurer with basic facts while declining a recorded statement until you understand your injuries and coverage.",
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
