#!/usr/bin/env node
/**
 * Submit sitemap URLs to IndexNow (Bing/Yandex instant indexing).
 * Usage: node scripts/submit-indexnow.mjs [wreckmatch|asg|injuredhelp|all]
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const HOSTS = {
  wreckmatch: "www.wreckmatch.com",
  asg: "www.accidentsurvivalguide.com",
  injuredhelp: "www.injuredhelp.ai",
};

const SITEMAP_URLS = {
  wreckmatch: "https://www.wreckmatch.com/sitemap.xml",
  asg: "https://www.accidentsurvivalguide.com/sitemap.xml",
  injuredhelp: "https://www.injuredhelp.ai/sitemap.xml",
};

const KEY = process.env.INDEXNOW_KEY ?? "wreckmatch-indexnow-key";

function parseSitemapXml(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

async function fetchSitemapUrls(sitemapUrl) {
  const res = await fetch(sitemapUrl);
  if (!res.ok) throw new Error(`Failed to fetch ${sitemapUrl}: ${res.status}`);
  const xml = await res.text();
  return parseSitemapXml(xml);
}

async function submitIndexNow(host, urlList) {
  const payload = {
    host,
    key: KEY,
    keyLocation: `https://${host}/${KEY}.txt`,
    urlList: urlList.slice(0, 10000),
  };

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });

  console.log(`IndexNow ${host}: ${res.status} (${urlList.length} URLs)`);
  return res.ok;
}

async function main() {
  const target = process.argv[2] ?? "all";
  const keys = target === "all" ? Object.keys(HOSTS) : [target];

  for (const key of keys) {
    const host = HOSTS[key];
    const sitemapUrl = SITEMAP_URLS[key];
    if (!host || !sitemapUrl) {
      console.error(`Unknown target: ${key}`);
      process.exit(1);
    }
    try {
      const urls = await fetchSitemapUrls(sitemapUrl);
      await submitIndexNow(host, urls);
    } catch (e) {
      console.error(`[${key}]`, e.message);
    }
  }
}

main();
