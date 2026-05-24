#!/usr/bin/env node
/**
 * Post-domain-fix checklist for Google Search Console + Bing Webmaster.
 * Usage: node scripts/seo-post-domain-checklist.mjs
 */

const STEPS = [
  {
    title: "1. Verify production deploy",
    command: "npm run seo:verify",
    urls: [],
  },
  {
    title: "2. Google Search Console — submit sitemaps",
    urls: [
      "https://www.wreckmatch.com/sitemap-index.xml",
      "https://www.accidentsurvivalguide.com/sitemap.xml",
      "https://www.injuredhelp.ai/sitemap.xml",
    ],
    link: "https://search.google.com/search-console",
  },
  {
    title: "3. GSC — request indexing (priority URLs)",
    urls: [
      "https://www.wreckmatch.com/car-accident-help-houston",
      "https://www.wreckmatch.com/car-accident-help-los-angeles",
      "https://www.wreckmatch.com/resources",
      "https://www.wreckmatch.com/llms-full.txt",
    ],
  },
  {
    title: "4. Bing Webmaster Tools — submit sitemaps",
    urls: [
      "https://www.wreckmatch.com/sitemap-index.xml",
      "https://www.accidentsurvivalguide.com/sitemap.xml",
    ],
    link: "https://www.bing.com/webmasters",
  },
  {
    title: "5. IndexNow (instant Bing/Yandex)",
    command: "node scripts/submit-indexnow.mjs all",
  },
  {
    title: "6. GitHub secrets (optional automation)",
    items: [
      "OPENAI_API_KEY — autopilot 279-city queue",
      "GOOGLE_CSE_API_KEY + GOOGLE_CSE_CX — link outreach",
      "INDEXNOW_KEY — optional override",
    ],
    link: "https://github.com/scotttischler-byte/wreckmatch/settings/secrets/actions",
  },
];

console.log("# SEO post-domain checklist\n");
for (const step of STEPS) {
  console.log(`## ${step.title}`);
  if (step.link) console.log(`   ${step.link}`);
  if (step.command) console.log(`   Run: ${step.command}`);
  if (step.urls?.length) step.urls.forEach((u) => console.log(`   - ${u}`));
  if (step.items?.length) step.items.forEach((i) => console.log(`   - ${i}`));
  console.log("");
}
