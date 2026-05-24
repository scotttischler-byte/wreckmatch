#!/usr/bin/env node
/**
 * Autopilot city queue progress report.
 * Usage: node scripts/autopilot-status.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const queuePath = path.join(ROOT, "content/autopilot/queue.json");
const masterPath = path.join(ROOT, "content/autopilot/cities_master.json");

if (!fs.existsSync(masterPath)) {
  console.log("Autopilot: cities_master.json not found.");
  process.exit(0);
}

const master = JSON.parse(fs.readFileSync(masterPath, "utf8"));
const queue = fs.existsSync(queuePath)
  ? JSON.parse(fs.readFileSync(queuePath, "utf8"))
  : { completed_city_keys: [] };

const done = new Set(queue.completed_city_keys ?? []);
const total = master.cities?.length ?? 0;
const remaining = (master.cities ?? []).filter(
  (c) => !done.has(`${c.city_slug}|${c.state_abbrev}`),
);

console.log(`Autopilot queue: ${done.size}/${total} cities complete (${total ? Math.round((done.size / total) * 100) : 0}%)`);
if (queue.last_run_at) console.log(`  Last run: ${queue.last_run_at}`);
if (queue.last_city_key) console.log(`  Last city: ${queue.last_city_key}`);

if (remaining.length) {
  console.log("\nNext priorities:");
  remaining
    .sort((a, b) => (a.priority_rank ?? 999) - (b.priority_rank ?? 999))
    .slice(0, 10)
    .forEach((c) => console.log(`  - ${c.city}, ${c.state} (${c.city_slug}|${c.state_abbrev})`));
  console.log(`\n  ${remaining.length} cities remaining in queue.`);
} else {
  console.log("\nQueue empty — all cities processed.");
}
