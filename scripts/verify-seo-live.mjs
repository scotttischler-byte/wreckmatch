#!/usr/bin/env node
/**
 * Post-deploy SEO health check — run after domain alias changes.
 * Usage: node scripts/verify-seo-live.mjs
 */

const CHECKS = [
  { url: "https://www.wreckmatch.com/", expectTitle: "Secure Chat Support" },
  { url: "https://www.wreckmatch.com/sitemap.xml", expectStatus: 200, expectBody: "car-accident-help" },
  { url: "https://www.wreckmatch.com/sitemap-index.xml", expectStatus: 200 },
  { url: "https://www.wreckmatch.com/feed.xml", expectStatus: 200, expectBody: "rss" },
  { url: "https://www.wreckmatch.com/llms.txt", expectStatus: 200, expectBody: "WreckMatch" },
  { url: "https://www.wreckmatch.com/ai.txt", expectStatus: 200, expectBody: "ai.txt" },
  { url: "https://www.wreckmatch.com/resources", expectStatus: 200, expectBody: "Car Accident Help Resources" },
  { url: "https://www.accidentsurvivalguide.com/sitemap.xml", expectStatus: 200 },
  { url: "https://www.accidentsurvivalguide.com/llms.txt", expectStatus: 200 },
  { url: "https://www.injuredhelp.ai/", expectStatus: 200, expectTitle: "AI-Friendly" },
  { url: "https://www.injuredhelp.ai/sitemap.xml", expectStatus: 200 },
];

async function check({ url, expectStatus = 200, expectTitle, expectBody }) {
  const res = await fetch(url, { redirect: "follow" });
  const text = await res.text();
  const title = text.match(/<title[^>]*>([^<]+)/i)?.[1] ?? "";
  const issues = [];
  if (res.status !== expectStatus) issues.push(`status ${res.status} != ${expectStatus}`);
  if (expectTitle && !title.includes(expectTitle)) issues.push(`title "${title}" missing "${expectTitle}"`);
  if (expectBody && !text.toLowerCase().includes(expectBody.toLowerCase())) issues.push(`body missing "${expectBody}"`);
  return { url, ok: issues.length === 0, issues };
}

async function main() {
  let failed = 0;
  for (const c of CHECKS) {
    const r = await check(c);
    if (r.ok) console.log(`OK  ${r.url}`);
    else {
      console.log(`FAIL ${r.url}: ${r.issues.join("; ")}`);
      failed++;
    }
  }
  console.log(`\n${failed ? `${failed} failed` : "All checks passed"}.`);
  process.exit(failed ? 1 : 0);
}

main();
