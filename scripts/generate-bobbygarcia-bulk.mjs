#!/usr/bin/env node
/**
 * Import Texas PI guides + WordPress practice pages into content/bobbygarcia/posts/{en,es}
 * Usage: node scripts/generate-bobbygarcia-bulk.mjs [--clean] [--force]
 */

import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const SOURCE_DIR = path.join(ROOT, "content/blog/posts");
const OUT_EN = path.join(ROOT, "content/bobbygarcia/posts/en");
const OUT_ES = path.join(ROOT, "content/bobbygarcia/posts/es");
const MANIFEST_PATH = path.join(ROOT, "content/bobbygarcia/manifest.json");

const clean = process.argv.includes("--clean");
const force = process.argv.includes("--force");

const DISCLAIMER_EN =
  "Educational information from the Law Office of Bobby Garcia, P.C. — not legal advice. For questions about your specific situation, speak with a licensed attorney.";
const DISCLAIMER_ES =
  "Información educativa del Despacho de Abogados Bobby Garcia, P.C. — no es asesoramiento legal. Para preguntas sobre su situación específica, hable con un abogado licenciado.";

const TOPIC_LABELS = {
  en: {
    "immediate-steps": "After a crash",
    "insurance-pitfalls": "Insurance pitfalls",
    "injuries-medical": "Injuries & medical care",
    "state-local-laws": "Texas laws",
    "claims-adjusters": "Claims adjusters",
    "rideshare-truck": "Truck & rideshare",
    "uninsured-hit-run": "Uninsured & hit-and-run",
    "prevention-safety": "Safety tips",
    "statute-of-limitations": "Statute of limitations",
    "costly-mistakes": "Costly mistakes",
  },
  es: {
    "immediate-steps": "Después del choque",
    "insurance-pitfalls": "Trampas del seguro",
    "injuries-medical": "Lesiones y atención médica",
    "state-local-laws": "Leyes de Texas",
    "claims-adjusters": "Ajustadores de reclamos",
    "rideshare-truck": "Camiones y rideshare",
    "uninsured-hit-run": "Sin seguro y hit-and-run",
    "prevention-safety": "Consejos de seguridad",
    "statute-of-limitations": "Plazo de prescripción",
    "costly-mistakes": "Errores costosos",
  },
};

/** WordPress SEO landing pages from bobbygarcia.com sitemap */
const WP_GUIDES = [
  {
    slug: "car-accident-lawyer-texas",
    titleEn: "Car Accident Lawyer in Texas",
    titleEs: "Abogado de accidentes de auto en Texas",
    excerptEn:
      "Expert motor vehicle accident representation from the Law Office of Bobby Garcia — Edinburg, McAllen, Houston, and statewide.",
    excerptEs:
      "Representación experta en accidentes de vehículos motorizados del Despacho de Abogados Bobby Garcia — Edinburg, McAllen, Houston y todo el estado.",
    coverImage: "/bobbygarcia/practice/car-accident.webp",
    practiceArea: "car-accident",
  },
  {
    slug: "18-wheeler-accident-lawyer-texas",
    titleEn: "18-Wheeler Accident Lawyer in Texas",
    titleEs: "Abogado de accidentes de tráileres en Texas",
    excerptEn:
      "Complex trucking accident cases require experienced trial lawyers. Bobby Garcia Law fights trucking companies and insurers across Texas.",
    excerptEs:
      "Los casos complejos de accidentes de camiones requieren abogados litigantes con experiencia. Bobby Garcia Law lucha contra compañías de transporte y aseguradoras en Texas.",
    coverImage: "/bobbygarcia/practice/18-wheeler.webp",
    practiceArea: "18-wheeler",
  },
  {
    slug: "slip-and-fall-lawyer-texas",
    titleEn: "Slip and Fall Accident Lawyer in Texas",
    titleEs: "Abogado de resbalones y caídas en Texas",
    excerptEn:
      "Premises liability representation when property owners fail to keep visitors safe.",
    excerptEs:
      "Representación en responsabilidad de locales cuando los propietarios no mantienen la seguridad de los visitantes.",
    coverImage: "/bobbygarcia/practice/slip-and-fall.png",
    practiceArea: "slip-and-fall",
  },
  {
    slug: "personal-injury-law-firm-edinburg-tx",
    titleEn: "Personal Injury Law Firm in Edinburg, TX",
    titleEs: "Despacho de lesiones personales en Edinburg, TX",
    excerptEn:
      "Rio Grande Valley personal injury attorneys serving Edinburg from 124 E. Cano Street — free consultations 24/7.",
    excerptEs:
      "Abogados de lesiones personales en el Valle del Río Grande sirviendo Edinburg desde 124 E. Cano Street — consultas gratis 24/7.",
    coverImage: "/bobbygarcia/locations/edinburg-office.jpeg",
    practiceArea: "personal-injury",
    city: "Edinburg",
  },
  {
    slug: "personal-injury-lawyer-mcallen-tx",
    titleEn: "Personal Injury Lawyer in McAllen, TX",
    titleEs: "Abogado de lesiones personales en McAllen, TX",
    excerptEn: "Trusted McAllen personal injury representation — Bobby Garcia Law.",
    excerptEs: "Representación confiable en lesiones personales en McAllen — Bobby Garcia Law.",
    coverImage: "/bobbygarcia/locations/rio-grande-valley.jpg",
    practiceArea: "personal-injury",
    city: "McAllen",
  },
  {
    slug: "personal-injury-lawyer-harlingen-tx",
    titleEn: "Personal Injury Lawyer in Harlingen, TX",
    titleEs: "Abogado de lesiones personales en Harlingen, TX",
    excerptEn: "Harlingen accident victims deserve aggressive, compassionate advocacy.",
    excerptEs: "Las víctimas de accidentes en Harlingen merecen una defensa agresiva y compasiva.",
    coverImage: "/bobbygarcia/locations/harlingen.png",
    practiceArea: "personal-injury",
    city: "Harlingen",
  },
  {
    slug: "personal-injury-lawyer-mission-tx",
    titleEn: "Personal Injury Lawyer in Mission, TX",
    titleEs: "Abogado de lesiones personales en Mission, TX",
    excerptEn: "Mission, Texas injury claims handled by experienced trial lawyers.",
    excerptEs: "Reclamos por lesiones en Mission, Texas manejados por abogados litigantes con experiencia.",
    coverImage: "/bobbygarcia/locations/mission.png",
    practiceArea: "personal-injury",
    city: "Mission",
  },
  {
    slug: "workplace-injury-lawyer-texas",
    titleEn: "Workplace Injury Lawyer in Texas",
    titleEs: "Abogado de lesiones en el trabajo en Texas",
    excerptEn: "On-the-job injury representation across South Texas and Houston.",
    excerptEs: "Representación por lesiones en el trabajo en el sur de Texas y Houston.",
    coverImage: "/bobbygarcia/practice/workplace.png",
    practiceArea: "workplace",
  },
  {
    slug: "mass-tort-lawyer-texas",
    titleEn: "Mass Tort Lawyer in Texas",
    titleEs: "Abogado de demandas colectivas en Texas",
    excerptEn:
      "Mass tort actions against corporations that harm consumers — defective products, medications, and medical devices.",
    excerptEs:
      "Demandas colectivas contra corporaciones que dañan consumidores — productos defectuosos, medicamentos y dispositivos médicos.",
    coverImage: "/bobbygarcia/practice/mass-tort.webp",
    practiceArea: "mass-tort",
  },
  {
    slug: "rio-grande-valley-car-accident-lawyer",
    titleEn: "Best Car Accident Lawyer in the Rio Grande Valley",
    titleEs: "Mejor abogado de accidentes de auto en el Valle del Río Grande",
    excerptEn:
      "Bobby Garcia Law — Justice Made Simple. Serving the entire RGV from Edinburg with 35+ years of experience.",
    excerptEs:
      "Bobby Garcia Law — Justicia Hecha Simple. Sirviendo todo el RGV desde Edinburg con más de 35 años de experiencia.",
    coverImage: "/bobbygarcia/locations/rio-grande-valley.jpg",
    practiceArea: "car-accident",
    city: "Rio Grande Valley",
  },
];

function coverForSlug(slug) {
  return `/bobbygarcia/blog-covers/${slug}.jpg`;
}

function inferTopic(slug, title) {
  if (slug.includes("statute-of-limitations") || title.toLowerCase().includes("statute")) {
    return "statute-of-limitations";
  }
  if (slug.includes("costly-mistakes") || title.toLowerCase().includes("mistake")) {
    return "costly-mistakes";
  }
  if (slug.includes("insurance") || title.toLowerCase().includes("insurance")) {
    return "insurance-pitfalls";
  }
  if (slug.includes("immediate-steps") || title.toLowerCase().includes("what to do")) {
    return "immediate-steps";
  }
  return "immediate-steps";
}

function coverForTopic(topic, city) {
  void topic;
  void city;
  return null;
}

function rebrandText(text, locale) {
  if (!text) return text;
  const disclaimer = locale === "es" ? DISCLAIMER_ES : DISCLAIMER_EN;
  return text
    .replace(/WreckMatch LLC/gi, "Law Office of Bobby Garcia, P.C.")
    .replace(/WreckMatch/gi, "Bobby Garcia Law")
    .replace(/AccidentSurvivalGuide\.com/gi, "Bobby Garcia Law")
    .replace(/Accident Survival Guide/gi, "Bobby Garcia Law")
    .replace(/referral service[^.]*\./gi, disclaimer)
    .replace(/not a law firm[^.]*\./gi, disclaimer)
    .replace(/This is general education only\./gi, disclaimer);
}

function translateTitle(title, city, stateAbbr) {
  return title
    .replace(/^What to Do After a Car Accident in /i, "Qué hacer después de un accidente de auto en ")
    .replace(/^Immediate Steps to Take After a Car Accident in /i, "Pasos inmediatos después de un accidente de auto en ")
    .replace(/^Costly Mistakes to Avoid After a Crash in /i, "Errores costosos que debe evitar después de un choque en ")
    .replace(/^Statute of Limitations for Car Accidents in /i, "Plazo de prescripción para accidentes de auto en ")
    .replace(/: Step-by-Step Guide$/i, ": guía paso a paso")
    .replace(/, TX\b/g, `, ${stateAbbr}`)
    .replace(/, Texas\b/g, ", Texas");
}

function translateSectionHeading(heading) {
  const map = {
    "Immediate safety": "Seguridad inmediata",
    "Police reports and Texas documentation": "Reportes policiales y documentación en Texas",
    "Medical care and insurance next steps": "Atención médica y próximos pasos con el seguro",
    "Immediate safety on Houston freeways": "Seguridad inmediata en las autopistas de Houston",
  };
  return map[heading] ?? heading
    .replace(/^Immediate /i, "Inmediato ")
    .replace(/Police reports/i, "Reportes policiales")
    .replace(/Medical care/i, "Atención médica")
    .replace(/insurance/i, "seguro")
    .replace(/Texas/i, "Texas");
}

function toBgPost(source, locale) {
  const topic = source.topic ?? inferTopic(source.slug, source.title);
  const topicKey = topic in TOPIC_LABELS.en ? topic : "immediate-steps";

  if (locale === "en") {
    return {
      slug: source.slug,
      title: rebrandText(source.title, "en"),
      metaDescription: rebrandText(source.metaDescription, "en"),
      excerpt: rebrandText(source.excerpt, "en"),
      city: source.city ?? "Texas",
      state: source.state ?? "Texas",
      stateAbbr: source.stateAbbr ?? "TX",
      topic: topicKey,
      status: "published",
      publishedAt: source.publishedAt ?? new Date().toISOString(),
      keywords: (source.keywords ?? []).map((k) => rebrandText(k, "en")),
      sections: (source.sections ?? []).map((s) => ({
        heading: s.heading,
        paragraphs: (s.paragraphs ?? []).map((p) => rebrandText(p, "en")),
        list: s.list?.map((item) => rebrandText(item, "en")),
      })),
      faq: (source.faq ?? []).map((f) => ({
        question: rebrandText(f.question, "en"),
        answer: rebrandText(f.answer, "en"),
      })),
      coverImage: coverForSlug(source.slug),
      sourceSlug: source.sourceSlug,
      practiceArea: source.practiceArea,
    };
  }

  return {
    slug: source.slug,
    title: source.titleEs ?? translateTitle(source.title, source.city, source.stateAbbr ?? "TX"),
    metaDescription: rebrandText(source.metaDescription, "es")
      .replace(/Educational only/i, "Solo con fines educativos")
      .replace(/not legal advice/i, "no es asesoramiento legal"),
    excerpt: source.excerptEs ?? rebrandText(source.excerpt, "es"),
    city: source.city ?? "Texas",
    state: source.state ?? "Texas",
    stateAbbr: source.stateAbbr ?? "TX",
    topic: topicKey,
    status: "published",
    publishedAt: source.publishedAt ?? new Date().toISOString(),
    keywords: (source.keywords ?? []).map((k) => translateTitle(k, source.city, source.stateAbbr ?? "TX")),
    sections: (source.sections ?? []).map((s) => ({
      heading: s.heading ? translateSectionHeading(s.heading) : undefined,
      paragraphs: (s.paragraphs ?? []).map((p) => rebrandText(p, "es")),
      list: s.list?.map((item) => rebrandText(item, "es")),
    })),
    faq: (source.faq ?? []).map((f) => ({
      question: rebrandText(f.question, "es"),
      answer: rebrandText(f.answer, "es"),
    })),
    coverImage: coverForSlug(source.slug),
    sourceSlug: source.sourceSlug,
    practiceArea: source.practiceArea,
  };
}

function guideSections(guide, locale) {
  const phone = "(956) 668-7400";
  if (locale === "es") {
    return [
      {
        heading: "Cómo puede ayudar Bobby Garcia Law",
        paragraphs: [
          `${guide.excerptEs} Llame ${phone} — disponibles 24/7. Consultas gratuitas y confidenciales.`,
          DISCLAIMER_ES,
        ],
      },
    ];
  }
  return [
    {
      heading: "How Bobby Garcia Law can help",
      paragraphs: [
        `${guide.excerptEn} Call ${phone} — available 24/7. Free confidential consultations.`,
        DISCLAIMER_EN,
      ],
    },
  ];
}

function writePost(dir, post) {
  const file = path.join(dir, `${post.slug}.json`);
  if (fs.existsSync(file) && !force) return false;
  fs.writeFileSync(file, JSON.stringify(post, null, 2) + "\n");
  return true;
}

function main() {
  if (clean) {
    for (const dir of [OUT_EN, OUT_ES]) {
      if (fs.existsSync(dir)) {
        for (const f of fs.readdirSync(dir)) {
          if (f.endsWith(".json")) fs.unlinkSync(path.join(dir, f));
        }
      }
    }
  }

  fs.mkdirSync(OUT_EN, { recursive: true });
  fs.mkdirSync(OUT_ES, { recursive: true });

  const sources = [];
  const txFiles = fs.readdirSync(SOURCE_DIR).filter((f) => f.endsWith(".json"));
  for (const file of txFiles) {
    const raw = JSON.parse(fs.readFileSync(path.join(SOURCE_DIR, file), "utf8"));
    if (raw.stateAbbr !== "TX" || raw.status !== "published") continue;
    sources.push({ ...raw, sourceSlug: file.replace(/\.json$/, "") });
  }

  for (const guide of WP_GUIDES) {
    sources.push({
      slug: guide.slug,
      title: guide.titleEn,
      titleEs: guide.titleEs,
      metaDescription: guide.excerptEn,
      excerpt: guide.excerptEn,
      excerptEs: guide.excerptEs,
      city: guide.city ?? "Texas",
      state: "Texas",
      stateAbbr: "TX",
      topic: "immediate-steps",
      status: "published",
      publishedAt: "2024-08-01T12:00:00.000Z",
      keywords: [guide.titleEn, "Bobby Garcia Law", "Texas personal injury"],
      sections: guideSections(guide, "en"),
      coverImage: guide.coverImage ?? coverForSlug(guide.slug),
      practiceArea: guide.practiceArea,
      sourceSlug: `wordpress:${guide.slug}`,
    });
  }

  let written = 0;
  const slugs = [];

  for (const source of sources) {
    const en = toBgPost(source, "en");
    const esSource = {
      ...source,
      sections:
        source.sections?.length && !source.slug.startsWith("personal-injury")
          ? source.sections
          : guideSections(
              {
                excerptEn: source.excerpt,
                excerptEs: source.excerptEs ?? source.excerpt,
              },
              "es",
            ),
    };
    const es = toBgPost(esSource, "es");

    if (writePost(OUT_EN, en)) written++;
    if (writePost(OUT_ES, es)) written++;
    slugs.push(source.slug);
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    postCount: slugs.length,
    locales: ["en", "es"],
    slugs: [...new Set(slugs)].sort(),
    topics: TOPIC_LABELS,
  };
  fs.mkdirSync(path.dirname(MANIFEST_PATH), { recursive: true });
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n");

  console.log(`Imported ${sources.length} guides (${written} files written)`);
  console.log(`EN: ${OUT_EN}`);
  console.log(`ES: ${OUT_ES}`);
  console.log(`Manifest: ${MANIFEST_PATH}`);
  console.log(`Run: node scripts/curate-bobbygarcia-blogs.mjs && npm run bobbygarcia:blog:covers`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
