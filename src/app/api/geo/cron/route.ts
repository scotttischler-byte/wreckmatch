import { NextRequest, NextResponse } from "next/server";
import { verifyCronSecret } from "@/lib/automation-auth";
import { calculateGeoScore } from "@/lib/geo/geo-score";
import { geoSitesForCron, indexNowAllSitesFromSitemaps } from "@/lib/geo/indexnow-batch";

export async function GET(req: NextRequest) {
  if (!verifyCronSecret(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const sites = await indexNowAllSitesFromSitemaps();
  const ok = sites.some((s) => s.ok);

  return NextResponse.json({
    ok,
    mode: "geo-cron-wreckmatch-repo",
    sites,
    geoScoreTemplate: calculateGeoScore({
      robotsAllowsAiCrawlers: true,
      llmsTxt: true,
      indexNowKeyDeployed: Boolean(process.env.INDEXNOW_KEY),
      faqPageJsonLd: true,
    }),
    properties: geoSitesForCron().map((s) => s.id),
    playbook: "/secret-sauce.html",
  });
}
