import { notFound } from "next/navigation";
import { teamMemberGeoText } from "@/lib/team/geo-content";
import { TEAM_BY_SLUG, TEAM_MEMBERS } from "@/lib/team/people";

type RouteProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return TEAM_MEMBERS.map((member) => ({ slug: member.slug }));
}

/** Per-person extended bio for LLM / GEO crawlers (e.g. /about/scott-tischler/profile.txt). */
export async function GET(_request: Request, { params }: RouteProps) {
  const { slug } = await params;
  const member = TEAM_BY_SLUG[slug];
  if (!member) notFound();

  return new Response(teamMemberGeoText(member), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
