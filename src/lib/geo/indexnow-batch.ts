import geoSites from "../../../config/geo-sites.json";

type GeoSite = {
  id: string;
  origin: string;
  indexNow?: boolean;
};

export async function submitIndexNowForOrigin(origin: string, urlList: string[]) {
  const key = process.env.INDEXNOW_KEY?.trim() ?? "wreckmatch-indexnow-key";
  const host = origin.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const payload = { host, key, keyLocation: `https://${host}/${key}.txt`, urlList: urlList.slice(0, 10_000) };
  const endpoints = ["https://api.indexnow.org/indexnow", "https://www.bing.com/indexnow"];
  const results = await Promise.all(
    endpoints.map(async (endpoint) => {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(payload),
      });
      return { endpoint, ok: res.ok, status: res.status };
    }),
  );
  return { host, urlCount: urlList.length, ok: results.some((r) => r.ok), results };
}

export async function fetchSitemapUrls(sitemapUrl: string): Promise<string[]> {
  const res = await fetch(sitemapUrl, { next: { revalidate: 0 } });
  if (!res.ok) return [];
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

export function geoSitesForCron(): GeoSite[] {
  return (geoSites.sites as GeoSite[]).filter((s) => s.indexNow !== false);
}

export async function indexNowAllSitesFromSitemaps() {
  const out = [];
  for (const site of geoSitesForCron()) {
    const origin = site.origin.replace(/\/$/, "");
    const urls = await fetchSitemapUrls(`${origin}/sitemap.xml`);
    const batch = await submitIndexNowForOrigin(origin, urls.length ? urls : [`${origin}/`, `${origin}/llms.txt`]);
    out.push({ siteId: site.id, ...batch });
  }
  return out;
}
