#!/usr/bin/env node
/**
 * Submit sitemap URLs to IndexNow (Bing/Yandex instant indexing).
 * Usage: node scripts/submit-indexnow.mjs [wreckmatch|asg|injuredhelp|bobbygarcia|all] [--fallback]
 */
import fs from "fs";
import path from "path";

const secretsPath = path.join(process.cwd(), ".secrets-setup");
if (fs.existsSync(secretsPath)) {
  for (const line of fs.readFileSync(secretsPath, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#") || !t.includes("=")) continue;
    const i = t.indexOf("=");
    const k = t.slice(0, i).trim();
    const v = t.slice(i + 1).trim();
    if (k && v && !process.env[k]) process.env[k] = v;
  }
}

const HOSTS = {
  wreckmatch: "www.wreckmatch.com",
  asg: "www.accidentsurvivalguide.com",
  injuredhelp: "www.injuredhelp.ai",
  bobbygarcia: "www.bobbygarcia.com",
};

const FALLBACK_SITEMAPS = {
  wreckmatch: "https://wreckmatch.vercel.app/sitemap.xml",
};

const SITEMAP_URLS = {
  wreckmatch: "https://www.wreckmatch.com/sitemap.xml",
  asg: "https://www.accidentsurvivalguide.com/sitemap.xml",
  injuredhelp: "https://www.injuredhelp.ai/sitemap.xml",
  bobbygarcia: "https://www.bobbygarcia.com/sitemap.xml",
};

const KEY = process.env.INDEXNOW_KEY ?? "wreckmatch-indexnow-key";
const PENDING_PATH = path.join(process.cwd(), "content/autopilot/indexnow_pending.json");
const WRECKMATCH_BASE = "https://www.wreckmatch.com";

function loadPendingSlugs() {
  if (!fs.existsSync(PENDING_PATH)) return [];
  try {
    const data = JSON.parse(fs.readFileSync(PENDING_PATH, "utf8"));
    return data.slugs ?? [];
  } catch {
    return [];
  }
}

function slugToBlogUrl(slug) {
  return `${WRECKMATCH_BASE}/blog/${slug}`;
}

function mergeUrls(sitemapUrls, pendingSlugs, host) {
  const set = new Set(sitemapUrls);
  if (host === HOSTS.wreckmatch && pendingSlugs.length) {
    for (const slug of pendingSlugs) {
      set.add(slugToBlogUrl(slug));
    }
    console.log(`  + ${pendingSlugs.length} pending blog slug URL(s) merged`);
  }
  return [...set];
}

function parseSitemapXml(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

async function fetchSitemapUrls(sitemapUrl) {
  const res = await fetch(sitemapUrl);
  if (!res.ok) throw new Error(`Failed to fetch ${sitemapUrl}: ${res.status}`);
  const xml = await res.text();
  return parseSitemapXml(xml);
}

async function verifyKey(host) {
  const url = `https://${host}/${KEY}.txt`;
  const res = await fetch(url);
  if (!res.ok) {
    console.warn(`  Key not reachable at ${url} (${res.status}) — IndexNow may return 403`);
    return false;
  }
  const text = (await res.text()).trim();
  if (text !== KEY) {
    console.warn(`  Key mismatch at ${url}`);
    return false;
  }
  return true;
}

async function submitIndexNow(host, urlList) {
  await verifyKey(host);
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

  const ok = res.status >= 200 && res.status < 300;
  if (!ok && res.status === 403) {
    const body = await res.text().catch(() => "");
    if (body.includes("UserForbiddedToAccessSite")) {
      console.warn(
        `  Add ${host} to Bing Webmaster Tools and verify via https://${host}/${KEY}.txt`,
      );
    }
  }
  console.log(`IndexNow ${host}: ${res.status} (${urlList.length} URLs)${ok ? "" : " — check key at /" + KEY + ".txt"}`);
  return ok;
}

async function main() {
  const args = process.argv.slice(2);
  const useFallback = args.includes("--fallback");
  const target = args.find((a) => !a.startsWith("--")) ?? "all";
  const keys = target === "all" ? Object.keys(HOSTS) : [target];

  for (const key of keys) {
    const host = HOSTS[key];
    const sitemapUrl = SITEMAP_URLS[key];
    if (!host || !sitemapUrl) {
      console.error(`Unknown target: ${key}`);
      process.exit(1);
    }
    try {
      let urls;
      try {
        urls = await fetchSitemapUrls(sitemapUrl);
      } catch (e) {
        if (useFallback && FALLBACK_SITEMAPS[key]) {
          console.warn(`[${key}] ${e.message} — using fallback sitemap`);
          urls = await fetchSitemapUrls(FALLBACK_SITEMAPS[key]);
        } else {
          throw e;
        }
      }
      const pending = key === "wreckmatch" ? loadPendingSlugs() : [];
      urls = mergeUrls(urls, pending, host);
      await submitIndexNow(host, urls);
    } catch (e) {
      console.error(`[${key}]`, e.message);
    }
  }
}

main();
