/**
 * Enrich thin blog drafts using programmatic city/state templates.
 * Usage: npx tsx scripts/enrich-blog-drafts.ts [--publish]
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";
import type { BlogPost } from "../src/lib/blog/types";
import type { BlogTemplateId } from "../data/types";
import { CITIES, getStateForCity } from "../src/lib/seo/cities";
import { buildProgrammaticBlogPost } from "../src/lib/seo/build-blog-post";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DRAFTS_DIR = path.join(ROOT, "content/blog/drafts");
const POSTS_DIR = path.join(ROOT, "content/blog/posts");

const TOPIC_TEMPLATE: Record<string, BlogTemplateId> = {
  "immediate-steps": "immediate-steps",
  "claims-adjusters": "settlement-timeline",
  "insurance-pitfalls": "insurance-denied",
  "injuries-medical": "whiplash-claims",
  "state-local-laws": "statute-limitations",
  "uninsured-hit-run": "uninsured-driver",
  "rideshare-truck": "truck-accident",
  "prevention-safety": "costly-mistakes",
};

function inferTemplate(draft: BlogPost): BlogTemplateId {
  if (draft.topic && TOPIC_TEMPLATE[draft.topic]) return TOPIC_TEMPLATE[draft.topic];
  const slug = draft.slug.toLowerCase();
  if (slug.includes("immediate") || slug.includes("what-to-do")) return "immediate-steps";
  if (slug.includes("insurance")) return "insurance-denied";
  if (slug.includes("claims") || slug.includes("adjuster")) return "settlement-timeline";
  if (slug.includes("injur") || slug.includes("medical")) return "whiplash-claims";
  if (slug.includes("law") || slug.includes("understanding")) return "statute-limitations";
  if (slug.includes("mistake")) return "costly-mistakes";
  return "immediate-steps";
}

function findCity(draft: BlogPost) {
  return CITIES.find(
    (c) =>
      c.city.toLowerCase() === draft.city.toLowerCase() &&
      c.state_abbr.toLowerCase() === draft.stateAbbr.toLowerCase(),
  );
}

function appendLocalSections(
  post: BlogPost,
  city: NonNullable<ReturnType<typeof findCity>>,
  state: NonNullable<ReturnType<typeof getStateForCity>>,
): BlogPost["sections"] {
  const highways = city.major_highways.join(", ");
  const hospitals = city.major_hospitals.join(", ");
  const hotspots = city.accident_hotspots.join("; ");
  const extra: BlogPost["sections"] = [
    {
      heading: `${city.city} medical resources after a crash`,
      paragraphs: [
        `${city.city} residents often use ${hospitals} after serious collisions. ${city.trauma_centers_level1[0] ? `Level I trauma care is available at ${city.trauma_centers_level1[0]}.` : "Verify the nearest trauma center if injuries may be serious."}`,
        `Document every provider visit — gaps in treatment are a common reason ${city.state_abbr} insurers reduce settlement offers.`,
        `Keep receipts for prescriptions, imaging (MRI/CT), physical therapy, and medical transport.`,
      ],
      list: [
        "Photograph visible injuries the same day when safe",
        "Follow discharge instructions and keep all after-visit summaries",
        "Do not sign blanket medical authorizations for the adjuster",
      ],
    },
    {
      heading: `Local crash patterns: ${highways || city.city}`,
      paragraphs: [
        `The metro area sees roughly ${city.annual_crashes?.toLocaleString() ?? "thousands of"} reported crashes annually (est.). High-risk areas include ${hotspots || "major commuter corridors"}.`,
        `If your collision occurred near ${city.major_highways[0] ?? "a busy interchange"}, note mile markers, exit numbers, and direction of travel for the police report.`,
        `${state.name} DOT data is available via ${state.dot_url} — useful when disputing fault or road conditions.`,
      ],
    },
    {
      heading: `${city.county} reports, courts, and evidence`,
      paragraphs: [
        `Request the official crash report through ${city.police_accident_report_link ? "local law enforcement" : "the investigating agency"}. ${city.county_court ? `${city.county_court} handles many civil injury filings in the region.` : ""}`,
        `Business security video near ${city.city} retail corridors is often deleted within 7–30 days — send preservation letters quickly when appropriate.`,
        `The ${city.local_bar_association} offers lawyer-referral resources; WreckMatch LLC can also connect you with independent ${state.name} attorneys at no obligation.`,
      ],
    },
    {
      heading: "Educational disclaimer",
      paragraphs: [
        `WreckMatch LLC is a legal referral service — not a law firm. This ${city.city} guide is general education only and does not create an attorney-client relationship.`,
        `Laws and insurance rules change; verify all deadlines, coverage, and rights with a licensed ${state.name} attorney before making decisions about your claim.`,
      ],
    },
    {
      heading: `Settlement timeline expectations in ${city.city}`,
      paragraphs: [
        `Minor property-damage claims in ${city.city} may resolve in weeks, but injury claims involving treatment, lost wages, or disputed fault often take months. Insurers may request recorded statements, independent medical exams, and broad medical authorizations — review each request carefully.`,
        `${state.name} uses ${state.comparative_negligence_rule} comparative negligence rules with a ${state.statute_limitations_years}-year statute of limitations for most injury cases. Calendar your deadline from the date of injury and confirm exceptions with counsel.`,
        `If you were transported from ${city.major_highways[0] ?? "a local corridor"} to ${city.major_hospitals[0] ?? "a hospital"}, keep ambulance, ER, and follow-up bills organized. UM/UIM, MedPay, and PIP endorsements on your policy may apply even when the other driver is underinsured.`,
      ],
      list: [
        "Do not accept the first settlement check if treatment is ongoing",
        "Avoid discussing fault on social media",
        "Request the adjuster's denial or reservation of rights in writing",
        "Compare repair estimates with your insurer's appraisal",
        "Consult a licensed attorney before signing general releases",
      ],
    },
  ];
  return [...post.sections, ...extra];
}

function enrichDraft(draft: BlogPost): BlogPost | null {
  const city = findCity(draft);
  if (!city) {
    console.warn(`  No city data for ${draft.city}, ${draft.stateAbbr} — skip`);
    return null;
  }
  const state = getStateForCity(city);
  if (!state) return null;

  const template = inferTemplate(draft);
  const rich = buildProgrammaticBlogPost(city, state, template);
  const sections = appendLocalSections(rich, city, state);

  const faq = [
    ...rich.faq,
    {
      question: `Where can I get a crash report in ${city.city}?`,
      answer: `Contact the investigating agency listed on your exchange-of-information form. ${city.county} reports may also be available through local police or ${state.dot_url}.`,
    },
    {
      question: `Does WreckMatch provide legal advice in ${city.city}?`,
      answer: `No. WreckMatch LLC is a referral service that connects accident victims with independent ${state.name} attorneys. We are not a law firm and do not provide legal advice.`,
    },
  ];

  return {
    ...rich,
    slug: draft.slug,
    title: draft.title || rich.title,
    status: "draft",
    publishedAt: draft.publishedAt ?? new Date().toISOString(),
    metaDescription:
      draft.metaDescription && draft.metaDescription.length > 80
        ? draft.metaDescription
        : rich.metaDescription,
    excerpt: rich.excerpt,
    sections,
    faq,
  };
}

function main() {
  const publish = process.argv.includes("--publish");
  if (!fs.existsSync(DRAFTS_DIR)) {
    console.log("No drafts directory.");
    return;
  }

  const files = fs.readdirSync(DRAFTS_DIR).filter((f) => f.endsWith(".json"));
  let enriched = 0;
  let published = 0;

  for (const file of files) {
    const filePath = path.join(DRAFTS_DIR, file);
    const draft = JSON.parse(fs.readFileSync(filePath, "utf8")) as BlogPost;
    const updated = enrichDraft(draft);
    if (!updated) continue;

    fs.writeFileSync(filePath, JSON.stringify(updated, null, 2));
    enriched++;
    console.log(`Enriched: ${updated.slug}`);

    const gate = spawnSync("node", ["scripts/quality-gate.mjs", filePath], { cwd: ROOT });
    if (gate.status !== 0) {
      console.warn(`  Quality gate still failing for ${file}`);
      continue;
    }

    if (publish) {
      updated.status = "published";
      updated.publishedAt = new Date().toISOString();
      fs.writeFileSync(path.join(POSTS_DIR, file), JSON.stringify(updated, null, 2));
      fs.unlinkSync(filePath);
      published++;
      console.log(`  Published: ${updated.slug}`);
    }
  }

  console.log(`\nDone: ${enriched} enriched, ${published} published.`);
}

main();
