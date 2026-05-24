#!/usr/bin/env node
/**
 * Quality gate only for blog JSON files changed in the last commit.
 * Usage: node scripts/quality-gate-changed.mjs [base-ref]
 */

import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const base = process.argv[2] ?? "HEAD~1";

const diff = spawnSync("git", ["diff", "--name-only", base, "HEAD", "--", "content/blog/posts"], {
  cwd: ROOT,
  encoding: "utf8",
});

if (diff.status !== 0) {
  console.log("No git diff available — skipping changed-post quality gate.");
  process.exit(0);
}

const files = diff.stdout
  .split("\n")
  .map((f) => f.trim())
  .filter((f) => f.endsWith(".json") && fs.existsSync(path.join(ROOT, f)));

if (!files.length) {
  console.log("No changed blog posts to quality-gate.");
  process.exit(0);
}

console.log(`Quality gate on ${files.length} changed post(s):`);
const r = spawnSync("node", ["scripts/quality-gate.mjs", ...files], {
  cwd: ROOT,
  stdio: "inherit",
});
process.exit(r.status ?? 0);
