/**
 * Enrich thin blog drafts using programmatic city/state templates.
 * Usage:
 *   npx tsx scripts/enrich-blog-drafts.ts [--publish] [--all-locales]
 *   npx tsx scripts/enrich-blog-drafts.ts --locale es --file content/blog/drafts/es/foo.json
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";
import type { BlogPost } from "../src/lib/blog/types";
import type { BlogLocale } from "../src/lib/blog/types";
import type { BlogTemplateId } from "../data/types";
import { CITIES, getStateForCity } from "../src/lib/seo/cities";
import { buildProgrammaticBlogPost } from "../src/lib/seo/build-blog-post";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

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

function draftsDir(locale: BlogLocale) {
  return locale === "es"
    ? path.join(ROOT, "content/blog/drafts/es")
    : path.join(ROOT, "content/blog/drafts");
}

function postsDir(locale: BlogLocale) {
  return locale === "es"
    ? path.join(ROOT, "content/blog/posts/es")
    : path.join(ROOT, "content/blog/posts");
}

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

type CityRecord = NonNullable<ReturnType<typeof findCity>>;
type StateRecord = NonNullable<ReturnType<typeof getStateForCity>>;

function appendLocalSections(
  post: BlogPost,
  city: CityRecord,
  state: StateRecord,
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
        `${state.name} uses ${state.comparative_negligence_rule} comparative negligence with a ${state.statute_limitations_years}-year statute of limitations for most injury cases. Calendar your deadline from the date of injury.`,
        `If you were transported from ${city.major_highways[0] ?? "a local corridor"} to ${city.major_hospitals[0] ?? "a hospital"}, keep ambulance, ER, and follow-up bills organized. UM/UIM and MedPay endorsements may apply when the other driver is underinsured.`,
      ],
      list: [
        "Do not accept the first settlement check if treatment is ongoing",
        "Avoid discussing fault on social media",
        "Request adjuster denials or reservations of rights in writing",
        "Compare repair estimates with your insurer's appraisal",
        "Consult a licensed attorney before signing general releases",
      ],
    },
    {
      heading: `Document checklist for ${city.city} claims`,
      paragraphs: [
        `Organize a folder (physical or digital) for every document tied to your ${city.city} crash: police report number, insurance claim numbers, tow and storage receipts, and rental car agreements.`,
        `Request itemized medical bills from ${city.major_hospitals[0] ?? "each provider"} rather than summary statements — itemized bills help catch billing errors and support future negotiations.`,
      ],
      list: [
        "Photos of all vehicles and the scene from multiple angles",
        "Witness names and phone numbers",
        "Employer note for any missed work shifts",
        "Insurance adjuster name, phone, and claim number",
        "Repair estimates from at least two body shops",
        "Mileage log for medical appointments",
      ],
    },
  ];
  return [...post.sections, ...extra];
}

function appendSpanishLocalSections(
  post: BlogPost,
  city: CityRecord,
  state: StateRecord,
): BlogPost["sections"] {
  const highways = city.major_highways.join(", ");
  const hospitals = city.major_hospitals.join(", ");
  const hotspots = city.accident_hotspots.join("; ");
  const extra: BlogPost["sections"] = [
    {
      heading: `Recursos médicos en ${city.city} después de un choque`,
      paragraphs: [
        `Residentes de ${city.city} suelen acudir a ${hospitals} tras colisiones graves. ${city.trauma_centers_level1[0] ? `Atención de trauma nivel I disponible en ${city.trauma_centers_level1[0]}.` : "Verifique el centro de trauma más cercano si las lesiones pueden ser graves."}`,
        `Documente cada visita médica — los huecos en el tratamiento son una razón frecuente para que las aseguradoras en ${city.state_abbr} reduzcan ofertas.`,
        `Guarde recibos de medicamentos, estudios (MRI/CT), fisioterapia y transporte médico.`,
      ],
      list: [
        "Fotografíe lesiones visibles el mismo día cuando sea seguro",
        "Siga instrucciones de alta y conserve resúmenes de visitas",
        "No firme autorizaciones médicas amplias para el ajustador",
      ],
    },
    {
      heading: `Patrones locales de choques: ${highways || city.city}`,
      paragraphs: [
        `El área metropolitana reporta aproximadamente ${city.annual_crashes?.toLocaleString() ?? "miles de"} accidentes anuales (est.). Zonas de alto riesgo incluyen ${hotspots || "corredores principales"}.`,
        `Si el choque ocurrió cerca de ${city.major_highways[0] ?? "una intercambiador"}, anote marcadores, salidas y dirección para el reporte policial.`,
        `Datos del DOT de ${state.name} en ${state.dot_url} — útiles al disputar culpa o condiciones del camino.`,
      ],
    },
    {
      heading: `Reportes, tribunales y evidencia en ${city.county}`,
      paragraphs: [
        `Solicite el reporte oficial a ${city.police_accident_report_link ? "la policía local" : "la agencia investigadora"}. ${city.county_court ? `${city.county_court} maneja muchos casos civiles en la región.` : ""}`,
        `Videos de seguridad comercial cerca de ${city.city} suelen borrarse en 7–30 días — envíe cartas de preservación cuando corresponda.`,
        `${city.local_bar_association} ofrece referencias; WreckMatch LLC también puede conectarle con abogados independientes en ${state.name} sin obligación.`,
      ],
    },
    {
      heading: "Aviso educativo",
      paragraphs: [
        `WreckMatch LLC es un servicio de referencia legal — no un bufete. Esta guía de ${city.city} es educación general y no crea relación abogado-cliente.`,
        `Las leyes y reglas de seguros cambian; verifique plazos, cobertura y derechos con un abogado licenciado en ${state.name} antes de decisiones sobre su reclamación.`,
      ],
    },
    {
      heading: `Plazos de acuerdo en ${city.city}`,
      paragraphs: [
        `Reclamos menores de daños materiales en ${city.city} pueden resolverse en semanas, pero lesiones con tratamiento, salarios perdidos o culpa disputada suelen tomar meses. Las aseguradoras pueden pedir declaraciones grabadas, exámenes médicos independientes y autorizaciones amplias — revise cada solicitud.`,
        `${state.name} usa negligencia comparativa ${state.comparative_negligence_rule} con un plazo de prescripción de ${state.statute_limitations_years} años para muchos casos de lesiones.`,
        `Si fue transportado desde ${city.major_highways[0] ?? "un corredor local"} a ${city.major_hospitals[0] ?? "un hospital"}, organice facturas de ambulancia, ER y seguimiento. UM/UIM y MedPay pueden aplicar si el otro conductor está bajoasegurado.`,
      ],
      list: [
        "No acepte el primer cheque si el tratamiento continúa",
        "Evite discutir culpa en redes sociales",
        "Pida denegaciones o reservas de derechos por escrito",
        "Compare estimaciones de reparación con la aseguradora",
        "Consulte un abogado licenciado antes de firmar liberaciones",
      ],
    },
    {
      heading: `Lista de documentos para reclamaciones en ${city.city}`,
      paragraphs: [
        `Organice un folder con número de reporte policial, reclamos de seguro, remolque y renta de auto.`,
        `Solicite facturas médicas detalladas de ${city.major_hospitals[0] ?? "cada proveedor"} — ayudan a detectar errores y negociar.`,
      ],
      list: [
        "Fotos de vehículos y escena desde varios ángulos",
        "Nombres y teléfonos de testigos",
        "Nota del empleador por turnos perdidos",
        "Nombre, teléfono y número de reclamo del ajustador",
        "Estimaciones de reparación de al menos dos talleres",
        "Registro de millas a citas médicas",
      ],
    },
  ];
  return [...post.sections, ...extra];
}

function enrichDraft(draft: BlogPost, locale: BlogLocale): BlogPost | null {
  const city = findCity(draft);
  if (!city) {
    console.warn(`  No city data for ${draft.city}, ${draft.stateAbbr} — skip`);
    return null;
  }
  const state = getStateForCity(city);
  if (!state) return null;

  const template = inferTemplate(draft);
  const rich = buildProgrammaticBlogPost(city, state, template);

  if (locale === "es") {
    const sections = appendSpanishLocalSections(
      { ...draft, sections: draft.sections?.length ? draft.sections : rich.sections },
      city,
      state,
    );
    const faq = [
      ...(draft.faq?.length ? draft.faq : []),
      {
        question: `¿Dónde obtengo el reporte de accidente en ${city.city}?`,
        answer: `Contacte la agencia investigadora en su formulario de intercambio. Reportes en ${city.county} también pueden estar disponibles vía policía local o ${state.dot_url}.`,
      },
      {
        question: `¿WreckMatch da asesoramiento legal en ${city.city}?`,
        answer: `No. WreckMatch LLC es un servicio de referencia que conecta víctimas con abogados independientes en ${state.name}. No somos un bufete y no brindamos asesoramiento legal.`,
      },
      {
        question: "¿Hay costo por la referencia de WreckMatch?",
        answer: "WreckMatch LLC es un servicio de referencia gratuito. Los abogados suelen trabajar por contingencia — confirme honorarios directamente con cualquier abogado.",
      },
    ];
    return {
      ...draft,
      locale: "es",
      slug: draft.slug,
      title: draft.title || `Qué hacer después de un accidente en ${city.city}, ${city.state_abbr}`,
      status: "draft",
      publishedAt: draft.publishedAt ?? new Date().toISOString(),
      metaDescription:
        draft.metaDescription && draft.metaDescription.length > 80
          ? draft.metaDescription
          : `Guía educativa para accidentes en ${city.city}, ${city.state_abbr}. WreckMatch LLC — servicio de referencia, no bufete. No es asesoramiento legal.`,
      excerpt:
        draft.excerpt ||
        `Pasos prácticos después de un choque en ${city.city}, ${state.name}. Educación general, no asesoramiento legal.`,
      sections,
      faq,
      city: city.city,
      state: city.state,
      stateAbbr: city.state_abbr,
      stateSlug: city.state_slug,
      topic: draft.topic || rich.topic,
      keywords: draft.keywords?.length ? draft.keywords : rich.keywords,
    };
  }

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
    {
      question: `Is there a fee to get matched through WreckMatch?`,
      answer: `WreckMatch LLC is a free referral service for accident victims. Matched attorneys typically work on contingency — you pay no upfront attorney fee for the referral itself. Always confirm fee terms directly with any attorney you hire.`,
    },
  ];

  return {
    ...rich,
    locale: "en",
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

function processFile(filePath: string, locale: BlogLocale, publish: boolean) {
  let enriched = 0;
  let published = 0;

  if (!fs.existsSync(filePath)) return { enriched, published };

  const draft = JSON.parse(fs.readFileSync(filePath, "utf8")) as BlogPost;
  const updated = enrichDraft(draft, locale);
  if (!updated) return { enriched, published };

  fs.writeFileSync(filePath, JSON.stringify(updated, null, 2));
  enriched++;
  console.log(`Enriched [${locale}]: ${updated.slug}`);

  const gate = spawnSync("node", ["scripts/quality-gate.mjs", filePath], { cwd: ROOT });
  if (gate.status !== 0) {
    console.warn(`  Quality gate still failing for ${path.basename(filePath)}`);
    return { enriched, published };
  }

  if (publish) {
    const posts = postsDir(locale);
    fs.mkdirSync(posts, { recursive: true });
    updated.status = "published";
    updated.publishedAt = new Date().toISOString();
    fs.writeFileSync(path.join(posts, path.basename(filePath)), JSON.stringify(updated, null, 2));
    fs.unlinkSync(filePath);
    published++;
    console.log(`  Published [${locale}]: ${updated.slug}`);
  }

  return { enriched, published };
}

function main() {
  const argv = process.argv.slice(2);
  const publish = argv.includes("--publish");
  const allLocales = argv.includes("--all-locales");
  const localeArg = argv.find((a, i) => argv[i - 1] === "--locale") as BlogLocale | undefined;
  const fileArg = argv.find((a, i) => argv[i - 1] === "--file");

  const locales: BlogLocale[] = fileArg
    ? [localeArg === "es" ? "es" : "en"]
    : allLocales || localeArg
      ? localeArg === "es"
        ? ["es"]
        : ["en"]
      : ["en", "es"];

  let totalEnriched = 0;
  let totalPublished = 0;

  if (fileArg) {
    const { enriched, published } = processFile(fileArg, locales[0], publish);
    totalEnriched += enriched;
    totalPublished += published;
  } else {
    for (const locale of locales) {
      const dir = draftsDir(locale);
      if (!fs.existsSync(dir)) continue;
      const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
      for (const file of files) {
        const { enriched, published } = processFile(path.join(dir, file), locale, publish);
        totalEnriched += enriched;
        totalPublished += published;
      }
    }
  }

  console.log(`\nDone: ${totalEnriched} enriched, ${totalPublished} published.`);
}

main();
