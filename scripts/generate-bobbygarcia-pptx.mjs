#!/usr/bin/env node
/**
 * Generate PowerPoint decks for every published Bobby Garcia guide.
 * Usage: node scripts/generate-bobbygarcia-pptx.mjs [--force]
 */

import fs from "fs";
import path from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const PptxGenJS = require("pptxgenjs");

const ROOT = process.cwd();
const POSTS_EN = path.join(ROOT, "content/bobbygarcia/posts/en");
const OUT_DIR = path.join(ROOT, "public/bobbygarcia/presentations");
const MANIFEST_PATH = path.join(ROOT, "content/bobbygarcia/presentations.json");
const force = process.argv.includes("--force");

const PHONE = "(956) 668-7400";
const BRAND = "Law Office of Bobby Garcia";
const GOLD = "C9A227";
const NAVY = "0A1220";

function chunkBullets(items, max = 5) {
  const chunks = [];
  for (let i = 0; i < items.length; i += max) chunks.push(items.slice(i, i + max));
  return chunks;
}

async function buildDeck(post) {
  const pptx = new PptxGenJS();
  pptx.author = BRAND;
  pptx.title = post.title;
  pptx.layout = "LAYOUT_16x9";

  const titleSlide = pptx.addSlide();
  titleSlide.background = { color: NAVY };
  titleSlide.addText(BRAND, { x: 0.5, y: 0.4, w: 9, h: 0.4, fontSize: 14, color: GOLD, bold: true });
  titleSlide.addText(post.title, {
    x: 0.5,
    y: 1.2,
    w: 9,
    h: 1.8,
    fontSize: 28,
    color: "FFFFFF",
    bold: true,
  });
  titleSlide.addText(`${post.city}, ${post.stateAbbr}`, { x: 0.5, y: 3.1, w: 9, h: 0.5, fontSize: 16, color: "B8C4D4" });
  titleSlide.addText(`Justice Made Simple · ${PHONE}`, { x: 0.5, y: 4.8, w: 9, h: 0.4, fontSize: 12, color: GOLD });

  for (const section of post.sections ?? []) {
    if (section.paragraphs?.length) {
      const slide = pptx.addSlide();
      slide.background = { color: NAVY };
      slide.addText(section.heading ?? "Overview", {
        x: 0.5,
        y: 0.35,
        w: 9,
        h: 0.7,
        fontSize: 22,
        color: GOLD,
        bold: true,
      });
      slide.addText(section.paragraphs.join("\n\n"), {
        x: 0.5,
        y: 1.2,
        w: 9,
        h: 3.8,
        fontSize: 13,
        color: "E8EDF4",
        valign: "top",
      });
    }
    if (section.list?.length) {
      for (const group of chunkBullets(section.list, 6)) {
        const slide = pptx.addSlide();
        slide.background = { color: NAVY };
        slide.addText(section.heading ?? "Key points", {
          x: 0.5,
          y: 0.35,
          w: 9,
          h: 0.6,
          fontSize: 20,
          color: GOLD,
          bold: true,
        });
        slide.addText(group.map((t) => ({ text: t, options: { bullet: true, breakLine: true } })), {
          x: 0.7,
          y: 1.1,
          w: 8.8,
          h: 4,
          fontSize: 14,
          color: "E8EDF4",
        });
      }
    }
  }

  if (post.faq?.length) {
    for (const item of post.faq.slice(0, 8)) {
      const slide = pptx.addSlide();
      slide.background = { color: NAVY };
      slide.addText("FAQ", { x: 0.5, y: 0.35, w: 9, h: 0.5, fontSize: 18, color: GOLD, bold: true });
      slide.addText(item.question, { x: 0.5, y: 1, w: 9, h: 1, fontSize: 16, color: "FFFFFF", bold: true });
      slide.addText(item.answer, { x: 0.5, y: 2.1, w: 9, h: 2.8, fontSize: 13, color: "E8EDF4" });
    }
  }

  const cta = pptx.addSlide();
  cta.background = { color: NAVY };
  cta.addText("Free consultation 24/7", { x: 0.5, y: 1.5, w: 9, h: 0.8, fontSize: 28, color: "FFFFFF", bold: true, align: "center" });
  cta.addText(PHONE, { x: 0.5, y: 2.5, w: 9, h: 0.8, fontSize: 32, color: GOLD, bold: true, align: "center" });
  cta.addText("Bobby Garcia Law · English & Español", { x: 0.5, y: 3.5, w: 9, h: 0.5, fontSize: 14, color: "B8C4D4", align: "center" });

  return pptx;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const posts = fs
    .readdirSync(POSTS_EN)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(POSTS_EN, f), "utf8")))
    .filter((p) => p.status === "published");

  const manifest = { generatedAt: new Date().toISOString(), decks: [] };
  let ok = 0;
  let skip = 0;

  for (const post of posts) {
    const dest = path.join(OUT_DIR, `${post.slug}.pptx`);
    const publicPath = `/bobbygarcia/presentations/${post.slug}.pptx`;
    if (fs.existsSync(dest) && !force) {
      skip++;
      manifest.decks.push({ slug: post.slug, publicPath, status: "skipped" });
      continue;
    }
    const pptx = await buildDeck(post);
    await pptx.writeFile({ fileName: dest });
    ok++;
    manifest.decks.push({ slug: post.slug, publicPath, slides: (post.sections?.length ?? 0) + 3, status: "ok" });
    console.log(`✓ ${post.slug}.pptx`);
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`\nDone: ${ok} created, ${skip} skipped → ${OUT_DIR}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
