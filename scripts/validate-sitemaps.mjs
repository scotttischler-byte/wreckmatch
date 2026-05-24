#!/usr/bin/env node
/**
 * Validate sitemap URL counts vs expected minimums.
 * Usage: node scripts/validate-sitemaps.mjs
 */

const CHECKS = [
  {
    name: "wreckmatch.vercel.app",
    url: "https://wreckmatch.vercel.app/sitemap.xml",
    minUrls: 400,
    mustInclude: ["car-accident-help-houston", "llms-full.txt", "/resources"],
  },
  {
    name: "accidentsurvivalguide.com",
    url: "https://www.accidentsurvivalguide.com/sitemap.xml",
    minUrls: 90,
    mustInclude: ["llms-full.txt", "/texas"],
  },
  {
    name: "injuredhelp.ai",
    url: "https://www.injuredhelp.ai/sitemap.xml",
    maxUrls: 10,
    mustInclude: ["llms.txt", "ai.txt"],
  },
];

async function check({ name, url, minUrls, maxUrls, mustInclude }) {
  const res = await fetch(url);
  if (!res.ok) return { name, ok: false, issues: [`HTTP ${res.status}`] };
  const xml = await res.text();
  const count = (xml.match(/<loc>/g) ?? []).length;
  const issues = [];
  if (minUrls && count < minUrls) issues.push(`${count} URLs < min ${minUrls}`);
  if (maxUrls && count > maxUrls) issues.push(`${count} URLs > max ${maxUrls} (discovery-only expected)`);
  for (const needle of mustInclude ?? []) {
    if (!xml.includes(needle)) issues.push(`missing "${needle}"`);
  }
  return { name, ok: issues.length === 0, count, issues };
}

async function main() {
  let failed = 0;
  for (const c of CHECKS) {
    const r = await check(c);
    if (r.ok) console.log(`OK  ${r.name} (${r.count} URLs)`);
    else {
      console.log(`FAIL ${r.name}: ${r.issues.join("; ")}`);
      failed++;
    }
  }
  process.exit(failed ? 1 : 0);
}

main();
