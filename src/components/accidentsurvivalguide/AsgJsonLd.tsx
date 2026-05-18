import { ASG_BASE_URL } from "@/lib/accidentsurvivalguide";

type FaqItem = { question: string; answer: string };

type AsgJsonLdProps = {
  pageTitle?: string;
  pageDescription?: string;
  includeFaq?: boolean;
  siteName?: string;
  faqItems?: readonly FaqItem[];
};

export function AsgJsonLd({
  pageTitle,
  pageDescription,
  includeFaq = false,
  siteName = "Accident Survival Guide",
  faqItems = [],
}: AsgJsonLdProps) {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "WreckMatch LLC",
    url: ASG_BASE_URL,
    logo: `${ASG_BASE_URL}/favicon.ico`,
    description:
      "Educational accident survival resources and legal referral services operated by WreckMatch LLC.",
    sameAs: ["https://www.wreckmatch.com"],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: ASG_BASE_URL,
    publisher: { "@type": "Organization", name: "WreckMatch LLC" },
  };

  const article = pageTitle
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: pageTitle,
        description: pageDescription,
        author: { "@type": "Person", name: "Scott" },
        publisher: { "@type": "Organization", name: "WreckMatch LLC" },
        mainEntityOfPage: ASG_BASE_URL,
      }
    : null;

  const faq =
    includeFaq && faqItems.length
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        }
      : null;

  const graphs = [organization, website, article, faq].filter(Boolean);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graphs) }}
    />
  );
}
