import { teamGeoDocument } from "@/lib/team/geo-content";

/** Plain-text extended leadership bios for LLM / GEO crawlers. */
export async function GET() {
  return new Response(teamGeoDocument(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
