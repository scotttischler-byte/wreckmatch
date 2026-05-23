#!/usr/bin/env node

/**
 * Checks WreckMatch app setup status.
 * Run: npm run wreckmatch:check
 */

import { readFileSync, existsSync } from "fs";
import { join } from "path";

const root = process.cwd();
const envPath = join(root, ".env.local");
const examplePath = join(root, ".env.example");
const migrationPath = join(
  root,
  "supabase/migrations/001_wreckmatch_initial.sql",
);

function parseEnvFile(path) {
  if (!existsSync(path)) return {};
  const vars = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    vars[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return vars;
}

function isConfigured(url, key) {
  if (!url || !key) return false;
  if (url.includes("your-project") || key === "your-anon-key") return false;
  return true;
}

const env = parseEnvFile(envPath);
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("\nWreckMatch setup check\n");

const checks = [
  {
    label: "Dependencies installed",
    ok: existsSync(join(root, "node_modules/@supabase/supabase-js")),
    fix: "Run: npm install",
  },
  {
    label: ".env.local exists",
    ok: existsSync(envPath),
    fix: "Run: cp .env.example .env.local",
  },
  {
    label: ".env.example template",
    ok: existsSync(examplePath),
    fix: "Missing .env.example — pull latest from repo",
  },
  {
    label: "Supabase URL + anon key configured",
    ok: isConfigured(url, key),
    fix: "Add real values to .env.local from Supabase → Project Settings → API",
  },
  {
    label: "SQL migration file present",
    ok: existsSync(migrationPath),
    fix: "Missing supabase/migrations/001_wreckmatch_initial.sql",
  },
];

let allOk = true;
for (const check of checks) {
  const icon = check.ok ? "✓" : "✗";
  console.log(`  ${icon}  ${check.label}`);
  if (!check.ok) {
    allOk = false;
    console.log(`      → ${check.fix}`);
  }
}

console.log("\nApp routes (after npm run dev):");
console.log("  Splash:     http://localhost:3000/splash");
console.log("  Home:       http://localhost:3000/home");
console.log("  Community:  http://localhost:3000/community");

if (isConfigured(url, key)) {
  console.log("\nNext steps with Supabase configured:");
  console.log("  1. Run migration in Supabase SQL Editor");
  console.log("  2. Enable Google OAuth + add http://localhost:3000/auth/callback");
  console.log("  3. npm run dev");
} else {
  console.log("\nDemo mode: Supabase not configured yet.");
  console.log("  The app runs with seed data — browse /splash → Explore demo → /home");
  console.log("  Add Supabase keys to .env.local to enable real auth.");
}

console.log("");
process.exit(allOk ? 0 : 1);
