import { WRECKMATCH_SEO_BASE } from "@/lib/seo/site";
import { ASG_BASE_URL } from "@/lib/domains";
import { INJUREDHELP_BASE } from "@/lib/injuredhelp";
import { blogPostPath } from "@/lib/seo/site";

export function blogCrossDomainAlternates(slug: string) {
  const path = blogPostPath(slug);
  return {
    canonical: `${WRECKMATCH_SEO_BASE}${path}`,
    languages: {
      "en-US": `${WRECKMATCH_SEO_BASE}${path}`,
      "x-default": `${WRECKMATCH_SEO_BASE}${path}`,
    },
    types: {
      "application/rss+xml": [
        { url: `${WRECKMATCH_SEO_BASE}/feed.xml`, title: "WreckMatch Blog RSS" },
        { url: `${ASG_BASE_URL}/feed.xml`, title: "Accident Survival Guide RSS" },
      ],
    },
  };
}

export function blogOpenGraphUrls(slug: string) {
  const path = blogPostPath(slug);
  return {
    wreckmatch: `${WRECKMATCH_SEO_BASE}${path}`,
    asg: `${ASG_BASE_URL}${path}`,
    injuredhelp: `${INJUREDHELP_BASE}${path}`,
  };
}
