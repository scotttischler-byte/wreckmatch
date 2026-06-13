#!/usr/bin/env node
/**
 * Quality gate for SEO content (blog JSON, markdown).
 * Usage: node scripts/quality-gate.mjs [--warn-only] [file...]
 * Exit 1 if any file fails (unless --warn-only).
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { listAllDraftJsonFiles } from "./blog-locale-paths.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const args = process.argv.slice(2);
const warnOnly = args.includes("--warn-only");
const fileArgs = args.filter((a) => !a.startsWith("--"));

const MIN_WORDS = Number(process.env.SEO_MIN_WORDS ?? 800);
const MIN_DATA_POINTS = Number(process.env.SEO_MIN_DATA_POINTS ?? 5);

function countWords(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

function countDataPoints(text) {
  let score = 0;
  if (/\d{1,3}(,\d{3})+|\d{4,}/.test(text)) score++;
  if (/\$[\d,]+|\d+\/\d+\/\d+/.test(text)) score++;
  if (/\b(I-\d+|US-\d+|SR-\d+|Highway|Freeway)\b/i.test(text)) score++;
  if (/\b(hospital|trauma|medical center|ER)\b/i.test(text)) score++;
  if (/\b(statute|SOL|years?|plazo|años)\b/i.test(text)) score++;
  if (/\b(insurance|liability|UM\/UIM|adjuster|aseguradora|seguro)\b/i.test(text)) score++;
  if (/\b(not legal advice|not a law firm|referral service|no es un bufete|no es asesoramiento)\b/i.test(text)) score++;
  if (/\b(county|DOT|Department of Transportation)\b/i.test(text)) score++;
  if (/https?:\/\//.test(text)) score++;
  return score;
}

function checkBlogPost(post) {
  const text = JSON.stringify(post);
  const words = countWords(text);
  const dataPoints = countDataPoints(text);
  const locale = post.locale === "es" ? "es" : "en";
  const disclaimerRe =
    locale === "es"
      ? /no es asesoramiento|no es un bufete|servicio de referencia/i
      : /not legal advice|not a law firm|referral service/i;
  const hasDisclaimer =
    disclaimerRe.test(text) &&
    Boolean(post.metaDescription) &&
    post.metaDescription !== post.excerpt;
  const issues = [];
  if (words < MIN_WORDS) issues.push(`words ${words} < ${MIN_WORDS}`);
  if (dataPoints < MIN_DATA_POINTS) issues.push(`dataPoints ${dataPoints} < ${MIN_DATA_POINTS}`);
  if (!hasDisclaimer) issues.push("missing disclaimer or duplicate meta/excerpt");
  if (!post.sections?.length || post.sections.length < 4) issues.push("needs 4+ sections");
  if (!post.faq?.length || post.faq.length < 2) issues.push("needs 2+ FAQ items");
  return { ok: issues.length === 0, words, dataPoints, issues };
}

function checkMarkdown(md) {
  const words = countWords(md);
  const dataPoints = countDataPoints(md);
  const issues = [];
  if (words < MIN_WORDS) issues.push(`words ${words} < ${MIN_WORDS}`);
  if (dataPoints < MIN_DATA_POINTS) issues.push(`dataPoints ${dataPoints} < ${MIN_DATA_POINTS}`);
  if (!/not legal advice|not a law firm/i.test(md)) issues.push("missing disclaimer");
  return { ok: issues.length === 0, words, dataPoints, issues };
}

function main() {
  const files =
    fileArgs.length > 0
      ? fileArgs
      : listAllDraftJsonFiles().map((entry) => entry.filePath);

  let failed = 0;
  for (const file of files) {
    if (!fs.existsSync(file)) {
      console.warn(`Skip missing: ${file}`);
      continue;
    }
    const raw = fs.readFileSync(file, "utf8");
    let result;
    if (file.endsWith(".json")) {
      result = checkBlogPost(JSON.parse(raw));
    } else {
      result = checkMarkdown(raw);
    }
    const label = path.relative(ROOT, file);
    if (result.ok) {
      console.log(`PASS ${label} (${result.words} words, ${result.dataPoints} data signals)`);
    } else {
      console.error(`FAIL ${label}: ${result.issues.join("; ")}`);
      failed++;
    }
  }

  if (failed > 0) {
    console.error(`\n${failed} file(s) failed quality gate.`);
    if (!warnOnly) process.exit(1);
    console.warn("Continuing (--warn-only).");
  } else {
    console.log("\nAll files passed.");
  }
}

main();
