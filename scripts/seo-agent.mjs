#!/usr/bin/env node
/**
 * WreckMatch SEO Agent — unified 24/7 automation entry point.
 * Designed for GitHub Actions (hourly cron) or local loops.
 *
 * Usage:
 *   node scripts/seo-agent.mjs              # auto-rotate task by UTC hour
 *   node scripts/seo-agent.mjs health       # verify + validate sitemaps
 *   node scripts/seo-agent.mjs indexnow     # ping Bing/Yandex
 *   node scripts/seo-agent.mjs report       # status dashboards
 *   node scripts/seo-agent.mjs enrich       # enrich 1 city (no-op if complete)
 *   node scripts/seo-agent.mjs full         # report + health + indexnow
 */

import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const LOG_PATH = path.join(ROOT, "content/agents/seo-agent-log.jsonl");

const ROTATION = ["report", "health", "indexnow", "report", "health", "enrich"];

function log(entry) {
  fs.mkdirSync(path.dirname(LOG_PATH), { recursive: true });
  const line = JSON.stringify({ ts: new Date().toISOString(), ...entry });
  fs.appendFileSync(LOG_PATH, line + "\n");
}

function run(label, cmd, args, opts = {}) {
  const started = Date.now();
  const r = spawnSync(cmd, args, { cwd: ROOT, stdio: "pipe", encoding: "utf8", ...opts });
  const ok = (r.status ?? 1) === 0 || opts.allowFail;
  const output = (r.stdout || "") + (r.stderr || "");
  log({
    task: label,
    ok,
    exitCode: r.status,
    durationMs: Date.now() - started,
    outputTail: output.slice(-500),
  });
  if (!opts.silent) {
    console.log(`\n▶ ${label} ${ok ? "✓" : "✗"}`);
    if (output) process.stdout.write(output);
  }
  return ok;
}

function taskReport() {
  run("enrichment-status", "node", ["scripts/enrichment-status.mjs"]);
  run("autopilot-status", "node", ["scripts/autopilot-status.mjs"]);
  run("cannibalization", "node", ["scripts/find-cannibalization.mjs"], { allowFail: true });
}

function taskHealth() {
  run("verify-seo-live", "node", ["scripts/verify-seo-live.mjs"], { allowFail: true });
  run("validate-sitemaps", "node", ["scripts/validate-sitemaps.mjs"], { allowFail: true });
  run("ping-feeds", "node", ["scripts/ping-feeds.mjs"], { allowFail: true });
}

function taskIndexNow() {
  run("indexnow-all", "node", ["scripts/submit-indexnow.mjs", "all", "--fallback"], {
    allowFail: true,
  });
}

function taskEnrich() {
  run("enrich-cities", "npx", ["tsx", "scripts/generate-enriched-city-markdown.ts", "--limit", "1"], {
    allowFail: true,
  });
}

function taskFull() {
  taskReport();
  taskHealth();
  taskIndexNow();
}

const arg = process.argv[2] ?? "rotate";
let task = arg;

if (task === "rotate") {
  const hour = new Date().getUTCHours();
  task = ROTATION[hour % ROTATION.length];
  console.log(`SEO Agent rotate → ${task} (UTC hour ${hour})`);
}

log({ event: "start", task, argv: process.argv.slice(2) });
console.log(`=== SEO Agent: ${task} ===`);
console.log(new Date().toISOString());

switch (task) {
  case "report":
    taskReport();
    break;
  case "health":
    taskHealth();
    break;
  case "indexnow":
    taskIndexNow();
    break;
  case "enrich":
    taskEnrich();
    break;
  case "full":
    taskFull();
    break;
  default:
    console.error(`Unknown task: ${task}. Use: report|health|indexnow|enrich|full|rotate`);
    process.exit(1);
}

log({ event: "complete", task });
console.log(`\n✓ SEO Agent complete (${task})`);
console.log(`  Log: content/agents/seo-agent-log.jsonl`);
