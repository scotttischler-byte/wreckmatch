import type { CityRecord } from "../../../data/types";
import type { StateRecord } from "../../../data/types";
import type { BlogPost } from "@/lib/blog/types";
import type { BreadcrumbItem } from "./internal-links";
import { getBlogCoverImage } from "@/lib/blog/covers";
import { absoluteUrl, blogPostPath, cityPagePath } from "./site";

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
  return [
    breadcrumbJsonLd(breadcrumbs),
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: `Car Accident Help in ${city.city}, ${state.name}`,
      description: `Educational guide for ${city.city} car accident victims — ${state.name} SOL, insurance, hospitals, and next steps.`,
      url: absoluteUrl(cityPagePath(city.slug)),
      inLanguage: "en-US",
      isPartOf: { "@type": "WebSite", name: "WreckMatch", url: absoluteUrl("/") },
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
      ],
    },
  ];
}

export function statePageJsonLd(state: StateRecord, breadcrumbs: BreadcrumbItem[]) {
  return [
    breadcrumbJsonLd(breadcrumbs),
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: `Car Accident Help in ${state.name}`,
      description: `${state.name} car accident guide — ${state.statute_limitations_years}-year SOL, ${state.min_liability_insurance} insurance minimums, and city resources.`,
      url: absoluteUrl(cityPagePath(state.slug)),
      inLanguage: "en-US",
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
