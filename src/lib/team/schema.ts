import { WRECKMATCH_BASE } from "@/lib/domains";
import type { TeamMember } from "@/lib/team/people";
import { displayName, personSameAs, teamMemberPath } from "@/lib/team/people";
import { getTeamGeo } from "@/lib/team/geo-content";

const ORG_ID = `${WRECKMATCH_BASE}/#organization`;

export function personJsonLd(member: TeamMember) {
  const sameAs = personSameAs(member);
  const geo = getTeamGeo(member.slug);
  const description = geo?.aiSummary ?? member.description;

  return {
    "@type": "Person",
    "@id": `${WRECKMATCH_BASE}/#person-${member.slug}`,
    name: displayName(member),
    jobTitle: member.jobTitle,
    worksFor: { "@id": ORG_ID },
    url: `${WRECKMATCH_BASE}${teamMemberPath(member.slug)}`,
    description,
    knowsAbout: [...member.focusAreas, ...(geo?.keywords.slice(0, 5) ?? [])],
    ...(member.location ? { homeLocation: { "@type": "Place", name: member.location } } : {}),
    ...(member.image ? { image: `${WRECKMATCH_BASE}${member.image}` } : {}),
    ...(sameAs.length ? { sameAs } : {}),
    ...(geo
      ? {
          subjectOf: {
            "@type": "CreativeWork",
            name: `${displayName(member)} extended profile (AI/GEO)`,
            url: `${WRECKMATCH_BASE}${teamMemberPath(member.slug)}/profile.txt`,
            encodingFormat: "text/plain",
          },
        }
      : {}),
  };
}

export function personFaqJsonLd(member: TeamMember) {
  const geo = getTeamGeo(member.slug);
  if (!geo?.faqs.length) return null;

  return {
    "@type": "FAQPage",
    "@id": `${WRECKMATCH_BASE}${teamMemberPath(member.slug)}#faq`,
    mainEntity: geo.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function teamPageJsonLd(members: TeamMember[]) {
  return {
    "@context": "https://schema.org",
    "@graph": members.map((member) => personJsonLd(member)),
  };
}
