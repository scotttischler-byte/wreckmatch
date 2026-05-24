import { WRECKMATCH_BASE } from "@/lib/domains";
import { SARAH_PHONE_E164 } from "@/lib/constants";

export function SiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${WRECKMATCH_BASE}/#organization`,
        name: "WreckMatch LLC",
        url: WRECKMATCH_BASE,
        logo: `${WRECKMATCH_BASE}/blog/covers/attorney-consultation-1.png`,
        description:
          "Legal referral service connecting car accident victims with licensed attorneys. Not a law firm.",
        telephone: SARAH_PHONE_E164,
        sameAs: [
          "https://www.accidentsurvivalguide.com",
          "https://www.injuredhelp.ai",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${WRECKMATCH_BASE}/#website`,
        url: WRECKMATCH_BASE,
        name: "WreckMatch",
        publisher: { "@id": `${WRECKMATCH_BASE}/#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: `${WRECKMATCH_BASE}/blog?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
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
