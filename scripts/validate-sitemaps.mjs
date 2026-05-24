#!/usr/bin/env node
/**
 * Validate sitemap URL counts vs expected minimums.
 * Usage: node scripts/validate-sitemaps.mjs
 */

const CHECKS = [
  {
    name: "wreckmatch.vercel.app",
    url: "https://wreckmatch.vercel.app/sitemap.xml",
    minUrls: 300,
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
    warnOnly: true,
  },
];

async function check({ name, url, minUrls, maxUrls, mustInclude, warnOnly }) {
  const res = await fetch(url);
  if (!res.ok) {
    const issues = [`HTTP ${res.status}`];
    if (warnOnly) return { name, ok: true, warn: true, issues };
    return { name, ok: false, issues };
  }
  const xml = await res.text();
  const count = (xml.match(/<loc>/g) ?? []).length;
  const issues = [];
  if (minUrls && count < minUrls) issues.push(`${count} URLs < min ${minUrls}`);
  if (maxUrls && count > maxUrls) {
    issues.push(
      `${count} URLs > max ${maxUrls} — domain may still point at old deploy; move injuredhelp.ai to wreckmatch project`,
    );
  }
  for (const needle of mustInclude ?? []) {
    if (!xml.includes(needle)) issues.push(`missing "${needle}"`);
  }
  const failed = issues.length > 0 && !warnOnly;
  return { name, ok: !failed, warn: warnOnly && issues.length > 0, count, issues };
}

async function main() {
  let failed = 0;
  let warned = 0;
  for (const c of CHECKS) {
    const r = await check(c);
    if (r.ok && !r.warn) console.log(`OK  ${r.name} (${r.count ?? "?"} URLs)`);
    else if (r.warn) {
      console.log(`WARN ${r.name}: ${r.issues.join("; ")}`);
      warned++;
    } else {
      console.log(`FAIL ${r.name}: ${r.issues.join("; ")}`);
      failed++;
    }
  }
  if (warned) console.log(`\n${warned} warning(s) — often fixed by moving domains to wreckmatch Vercel project.`);
  process.exit(failed ? 1 : 0);
}

main();
