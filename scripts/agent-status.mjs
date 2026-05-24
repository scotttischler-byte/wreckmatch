#!/usr/bin/env node
/**
 * Show recent SEO agent activity from the JSONL log.
 * Usage: node scripts/agent-status.mjs [lines]
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOG = path.join(__dirname, "../content/agents/seo-agent-log.jsonl");
const lines = Number(process.argv[2] ?? 15);

if (!fs.existsSync(LOG)) {
  console.log("No agent log yet. Run: node scripts/seo-agent.mjs health");
  process.exit(0);
}

const rows = fs
  .readFileSync(LOG, "utf8")
  .trim()
  .split("\n")
  .filter(Boolean)
  .slice(-lines)
  .map((l) => JSON.parse(l));

console.log(`Last ${rows.length} SEO agent events:\n`);
for (const r of rows) {
  const status = r.ok === false ? "FAIL" : r.ok === true ? "OK" : r.event ?? "?";
  console.log(`${r.ts}  ${status.padEnd(8)} ${r.task ?? r.event ?? ""}`);
}

const lastComplete = [...rows].reverse().find((r) => r.event === "complete");
if (lastComplete) {
  console.log(`\nLast completed task: ${lastComplete.task} at ${lastComplete.ts}`);
}
