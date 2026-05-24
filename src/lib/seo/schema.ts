import type { CityRecord } from "../../../data/types";
import type { StateRecord } from "../../../data/types";
import type { BlogPost } from "@/lib/blog/types";
import type { BreadcrumbItem } from "./internal-links";
import { SARAH_PHONE_E164 } from "@/lib/constants";
import { getBlogCoverImage } from "@/lib/blog/covers";
import { absoluteUrl, blogPostPath, cityPagePath } from "./site";
import { ASG_BASE_URL, INJUREDHELP_BASE } from "@/lib/domains";

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "WreckMatch",
    url: absoluteUrl("/"),
    description:
      "Legal referral service connecting car accident victims with licensed attorneys. Educational content only — not a law firm.",
    publisher: {
      "@type": "Organization",
      name: "WreckMatch LLC",
      url: absoluteUrl("/"),
      telephone: SARAH_PHONE_E164,
      sameAs: [ASG_BASE_URL, INJUREDHELP_BASE],
    },
  };
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: absoluteUrl(item.href),
    })),
  };
}

export function cityPageJsonLd(city: CityRecord, state: StateRecord, breadcrumbs: BreadcrumbItem[]) {
  const pageUrl = absoluteUrl(cityPagePath(city.slug));
  return [
    breadcrumbJsonLd(breadcrumbs),
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: `Car Accident Help in ${city.city}, ${state.name}`,
      description: `Educational guide for ${city.city} car accident victims — ${state.name} SOL, insurance, hospitals, and next steps.`,
      url: pageUrl,
      inLanguage: "en-US",
      isPartOf: { "@type": "WebSite", name: "WreckMatch", url: absoluteUrl("/") },
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["article .seo-markdown h1", "article .seo-markdown p"],
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "LegalService",
      name: "WreckMatch LLC",
      description: "Legal referral service connecting car accident victims with licensed attorneys. Not a law firm.",
      url: absoluteUrl("/"),
      telephone: SARAH_PHONE_E164,
      serviceType: "Legal Referral Service",
      areaServed: {
        "@type": "City",
        name: city.city,
        containedInPlace: { "@type": "State", name: state.name },
      },
      audience: { "@type": "PeopleAudience", audienceType: "Car accident victims" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: `How long do I have to file a car accident claim in ${state.name}?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: `Most ${state.name} personal injury claims have a ${state.statute_limitations_years}-year statute of limitations. Verify your specific deadline with a licensed attorney.`,
          },
        },
        {
          "@type": "Question",
          name: `Is WreckMatch a law firm?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. WreckMatch LLC is a legal referral service that connects accident victims with independent attorneys. We do not provide legal advice.",
          },
        },
        {
          "@type": "Question",
          name: `What is the minimum auto insurance in ${state.name}?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: `${state.name} requires at least ${state.min_liability_insurance} in liability coverage for most drivers. Verify current limits with your insurer or state DMV.`,
          },
        },
        {
          "@type": "Question",
          name: `What should I do right after a car accident in ${city.city}?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: `Move to safety, call 911 if anyone is hurt, exchange driver and insurance information, document the scene with photos, seek medical care, and notify your insurer. Consider speaking with a licensed ${state.name} attorney before giving a recorded statement.`,
          },
        },
      ],
    },
  ];
}

export function statePageJsonLd(state: StateRecord, breadcrumbs: BreadcrumbItem[]) {
  const pageUrl = absoluteUrl(cityPagePath(state.slug));
  return [
    breadcrumbJsonLd(breadcrumbs),
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: `Car Accident Help in ${state.name}`,
      description: `${state.name} car accident guide — ${state.statute_limitations_years}-year SOL, ${state.min_liability_insurance} insurance minimums, and city resources.`,
      url: pageUrl,
      inLanguage: "en-US",
      isPartOf: { "@type": "WebSite", name: "WreckMatch", url: absoluteUrl("/") },
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["article .seo-markdown h1", "article .seo-markdown p"],
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "LegalService",
      name: "WreckMatch LLC",
      description: "Legal referral service connecting car accident victims with licensed attorneys. Not a law firm.",
      url: absoluteUrl("/"),
      telephone: SARAH_PHONE_E164,
      serviceType: "Legal Referral Service",
      areaServed: { "@type": "State", name: state.name },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: `How long do I have to file a car accident claim in ${state.name}?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: `Most ${state.name} personal injury claims have a ${state.statute_limitations_years}-year statute of limitations. Verify your specific deadline with a licensed attorney.`,
          },
        },
        {
          "@type": "Question",
          name: `Is WreckMatch a law firm?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. WreckMatch LLC is a legal referral service that connects accident victims with independent attorneys. We do not provide legal advice.",
          },
        },
        {
          "@type": "Question",
          name: `What is the minimum auto insurance in ${state.name}?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: `${state.name} requires at least ${state.min_liability_insurance} in liability coverage for most drivers. Verify current limits with your insurer or state DMV.`,
          },
        },
      ],
    },
  ];
}

export function blogPostJsonLd(post: BlogPost, breadcrumbs: BreadcrumbItem[]) {
  return [
    breadcrumbJsonLd(breadcrumbs),
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.metaDescription,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt ?? post.publishedAt,
      author: { "@type": "Organization", name: "WreckMatch LLC" },
      publisher: {
        "@type": "Organization",
        name: "WreckMatch LLC",
        url: absoluteUrl("/"),
      },
      image: absoluteUrl(getBlogCoverImage(post)),
      mainEntityOfPage: absoluteUrl(blogPostPath(post.slug)),
    },
    ...(post.faq.length
      ? [
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: post.faq.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          },
        ]
      : []),
  ];
}
