import { WRECKMATCH_BASE, ASG_BASE_URL, INJUREDHELP_BASE } from "@/lib/domains";

export async function GET() {
  const sitemaps = [
    { loc: `${WRECKMATCH_BASE}/sitemap.xml`, label: "WreckMatch" },
    { loc: `${ASG_BASE_URL}/sitemap.xml`, label: "Accident Survival Guide" },
    { loc: `${INJUREDHELP_BASE}/sitemap.xml`, label: "InjuredHelp.ai" },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps
  .map(
    (s) => `  <sitemap>
    <loc>${s.loc}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`,
  )
  .join("\n")}
</sitemapindex>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
