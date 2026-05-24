#!/usr/bin/env node
/**
 * Ping RSS/feed URLs for faster discovery (best-effort).
 * Usage: node scripts/ping-feeds.mjs
 */

const FEEDS = [
  "https://wreckmatch.vercel.app/feed.xml",
  "https://www.accidentsurvivalguide.com/feed.xml",
  "https://www.wreckmatch.com/feed.xml",
];

async function pingFeed(url) {
  try {
    const res = await fetch(url, { redirect: "follow" });
    const ok = res.ok && (await res.text()).toLowerCase().includes("rss");
    console.log(`${ok ? "OK" : "FAIL"}  ${url} (${res.status})`);
    return ok;
  } catch (e) {
    console.log(`FAIL  ${url}: ${e.message}`);
    return false;
  }
}

async function main() {
  console.log("Feed health check:\n");
  const results = await Promise.all(FEEDS.map(pingFeed));
  process.exit(results.every(Boolean) ? 0 : 1);
}

main();
