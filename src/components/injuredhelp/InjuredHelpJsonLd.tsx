import { INJUREDHELP_BASE } from "@/lib/injuredhelp";
import { WRECKMATCH_BASE, ASG_BASE_URL } from "@/lib/domains";
import { SARAH_PHONE_E164 } from "@/lib/constants";

export function InjuredHelpJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${INJUREDHELP_BASE}/#organization`,
        name: "InjuredHelp.ai",
        url: INJUREDHELP_BASE,
        parentOrganization: {
          "@type": "Organization",
          name: "WreckMatch LLC",
          url: WRECKMATCH_BASE,
          telephone: SARAH_PHONE_E164,
        },
        sameAs: [WRECKMATCH_BASE, ASG_BASE_URL],
        description:
          "AI-friendly discovery index for car accident help resources. Operated by WreckMatch LLC — not a law firm.",
      },
      {
        "@type": "WebSite",
        "@id": `${INJUREDHELP_BASE}/#website`,
        name: "InjuredHelp.ai",
        url: INJUREDHELP_BASE,
        publisher: { "@id": `${INJUREDHELP_BASE}/#organization` },
        description: "Curated index pointing to canonical WreckMatch city guides, state statutes, and articles.",
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What is InjuredHelp.ai?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "InjuredHelp.ai is an AI discovery hub operated by WreckMatch LLC. It indexes canonical car accident help content on WreckMatch.com and Accident Survival Guide — educational only, not legal advice.",
            },
          },
          {
            "@type": "Question",
            name: "Where is the canonical car accident content?",
            acceptedAnswer: {
              "@type": "Answer",
              text: `City and state guides live at ${WRECKMATCH_BASE}. Survival checklists and PDF resources are at ${ASG_BASE_URL}.`,
            },
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
