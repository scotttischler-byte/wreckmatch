#!/usr/bin/env node
/**
 * Daily SEO automation orchestrator — safe to run in CI or locally.
 * Usage: node scripts/seo-daily.mjs [--enrich=5] [--indexnow] [--skip-enrich]
 */

import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

function arg(name, fallback) {
  const eq = process.argv.find((a) => a.startsWith(`--${name}=`));
  if (eq) return eq.split("=")[1];
  const i = process.argv.indexOf(`--${name}`);
  if (i !== -1 && process.argv[i + 1] && !process.argv[i + 1].startsWith("--")) {
    return process.argv[i + 1];
  }
  return fallback;
}

function run(label, cmd, args, opts = {}) {
  console.log(`\n▶ ${label}`);
  const r = spawnSync(cmd, args, { cwd: ROOT, stdio: "inherit", ...opts });
  if (r.status !== 0 && !opts.allowFail) {
    console.error(`✗ ${label} failed (exit ${r.status})`);
    process.exit(r.status ?? 1);
  }
  return r.status ?? 0;
}

const enrichLimit = arg("enrich", "5");
const skipEnrich = process.argv.includes("--skip-enrich");
const doIndexNow = process.argv.includes("--indexnow");

console.log("=== WreckMatch SEO daily automation ===");
console.log(new Date().toISOString());

if (!skipEnrich) {
  run(
    `Enrich up to ${enrichLimit} city markdown files`,
    "npx",
    ["tsx", "scripts/generate-enriched-city-markdown.ts", "--limit", enrichLimit],
    { allowFail: true },
  );
}

run("Cannibalization report", "node", ["scripts/find-cannibalization.mjs"]);
run("Enrichment coverage report", "node", ["scripts/enrichment-status.mjs"]);
run("Quality gate (drafts only)", "node", ["scripts/quality-gate.mjs"], { allowFail: true });
run("Autopilot queue status", "node", ["scripts/autopilot-status.mjs"]);

if (doIndexNow) {
  run("IndexNow submit (all hosts)", "node", ["scripts/submit-indexnow.mjs", "all", "--fallback"], {
    allowFail: true,
  });
}

const cityPostsDir = path.join(ROOT, "ai-visibility-accelerator/output/content/city-posts");
const reportPath = path.join(ROOT, "content/seo-daily-last-run.json");
fs.writeFileSync(
  reportPath,
  JSON.stringify(
    {
      ranAt: new Date().toISOString(),
      enrichLimit: skipEnrich ? 0 : Number(enrichLimit),
      cityMarkdownFiles: fs.existsSync(cityPostsDir)
        ? fs.readdirSync(cityPostsDir).filter((f) => f.endsWith(".md")).length
        : 0,
      indexnow: doIndexNow,
    },
    null,
    2,
  ),
);

console.log("\n✓ SEO daily automation complete.");
console.log(`  Report: content/seo-daily-last-run.json`);
