#!/usr/bin/env node
/**
 * Post-deploy SEO health check — run after domain alias changes.
 * Usage: node scripts/verify-seo-live.mjs
 */

const INDEXNOW_KEY = process.env.INDEXNOW_KEY ?? "wreckmatch-indexnow-key";

const WWW_CHECKS = [
  { url: "https://www.wreckmatch.com/", expectTitle: "Secure Chat Support" },
  { url: "https://www.wreckmatch.com/sitemap.xml", expectStatus: 200, expectBody: "car-accident-help" },
  { url: "https://www.wreckmatch.com/sitemap-index.xml", expectStatus: 200 },
  { url: "https://www.wreckmatch.com/feed.xml", expectStatus: 200, expectBody: "rss" },
  { url: "https://www.wreckmatch.com/llms.txt", expectStatus: 200, expectBody: "WreckMatch" },
  { url: "https://www.wreckmatch.com/ai.txt", expectStatus: 200, expectBody: "ai.txt" },
  { url: "https://www.wreckmatch.com/resources", expectStatus: 200, expectBody: "Car Accident Help Resources" },
  { url: `https://www.wreckmatch.com/${INDEXNOW_KEY}.txt`, expectStatus: 200, expectBody: INDEXNOW_KEY },
  { url: "https://www.accidentsurvivalguide.com/sitemap.xml", expectStatus: 200 },
  { url: "https://www.accidentsurvivalguide.com/llms.txt", expectStatus: 200 },
  { url: "https://www.accidentsurvivalguide.com/ai.txt", expectStatus: 200, expectBody: "ai.txt" },
  { url: "https://www.accidentsurvivalguide.com/feed.xml", expectStatus: 200, expectBody: "rss" },
  { url: "https://www.injuredhelp.ai/", expectStatus: 200, expectTitle: "AI-Friendly" },
  { url: "https://www.injuredhelp.ai/sitemap.xml", expectStatus: 200 },
  { url: "https://www.injuredhelp.ai/ai.txt", expectStatus: 200, expectBody: "ai.txt" },
  { url: "https://www.injuredhelp.ai/feed.xml", expectStatus: 200, expectBody: "rss" },
  { url: "https://www.injuredhelp.ai/llms.txt", expectStatus: 200, expectBody: "InjuredHelp" },
];

const VERCEL_FALLBACK = [
  { url: "https://wreckmatch.vercel.app/", expectTitle: "Secure Chat Support" },
  { url: "https://wreckmatch.vercel.app/sitemap-index.xml", expectStatus: 200 },
  { url: "https://wreckmatch.vercel.app/ai.txt", expectStatus: 200, expectBody: "ai.txt" },
  { url: "https://wreckmatch.vercel.app/resources", expectStatus: 200, expectBody: "Resources" },
  { url: "https://wreckmatch.vercel.app/resources?q=houston", expectStatus: 200, expectBody: "Houston" },
];

async function check({ url, expectStatus = 200, expectTitle, expectBody }) {
  const res = await fetch(url, { redirect: "follow" });
  const text = await res.text();
  const title = text.match(/<title[^>]*>([^<]+)/i)?.[1] ?? "";
  const issues = [];
  if (res.status !== expectStatus) issues.push(`status ${res.status} != ${expectStatus}`);
  if (expectTitle && !title.includes(expectTitle)) issues.push(`title "${title}" missing "${expectTitle}"`);
  if (expectBody && !text.toLowerCase().includes(expectBody.toLowerCase())) {
    issues.push(`body missing "${expectBody}"`);
  }
  return { url, ok: issues.length === 0, issues };
}

async function runSuite(label, checks) {
  let failed = 0;
  console.log(`\n=== ${label} ===`);
  for (const c of checks) {
    const r = await check(c);
    if (r.ok) console.log(`OK  ${r.url}`);
    else {
      console.log(`FAIL ${r.url}: ${r.issues.join("; ")}`);
      failed++;
    }
  }
  return failed;
}

async function main() {
  const wwwFailed = await runSuite("Production domains", WWW_CHECKS);
  let vercelFailed = 0;
  if (wwwFailed > 0) {
    vercelFailed = await runSuite("wreckmatch.vercel.app fallback (latest deploy)", VERCEL_FALLBACK);
    console.log(`
⚠️  DOMAIN ROUTING: Custom domains are not fully on the wreckmatch Vercel project.
   1. Remove www.wreckmatch.com from mva-funnel
   2. Remove wreckmatch.com from injuredhelp-ai
   3. Add wreckmatch.com, www.wreckmatch.com, injuredhelp.ai, www.injuredhelp.ai to wreckmatch
   Dashboard: https://vercel.com/scott-tischlers-projects/wreckmatch/settings/domains
   Reply "domains moved" after fixing.
`);
  }

  const exitCode = wwwFailed > 0 ? 1 : 0;
  console.log(`\n${wwwFailed ? `${wwwFailed} production check(s) failed` : "All production checks passed"}.`);
  if (wwwFailed > 0 && vercelFailed === 0) {
    console.log("Latest code is healthy on wreckmatch.vercel.app — domain alias is the remaining fix.");
  }
  process.exit(exitCode);
}

main();
