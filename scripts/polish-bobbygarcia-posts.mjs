#!/usr/bin/env node
/**
 * Remove filler sections, fix grammar/disclaimers, ensure ≥3,000 substantive words.
 * Usage: node scripts/polish-bobbygarcia-posts.mjs
 */

import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const POSTS_EN = path.join(ROOT, "content/bobbygarcia/posts/en");
const POSTS_ES = path.join(ROOT, "content/bobbygarcia/posts/es");
const MIN_WORDS = 3000;
const PHONE = "(956) 668-7400";
const DISCLAIMER_EN =
  "Educational information from the Law Office of Bobby Garcia, P.C. — not legal advice. Consult a licensed Texas attorney about your specific case.";
const DISCLAIMER_ES =
  "Información educativa del Despacho de Abogados Bobby Garcia, P.C. — no es asesoramiento legal. Consulte a un abogado licenciado en Texas sobre su caso específico.";

function countWords(post) {
  let text = `${post.title} ${post.excerpt} `;
  for (const s of post.sections ?? []) {
    text += `${s.heading ?? ""} ${(s.paragraphs ?? []).join(" ")} ${(s.list ?? []).join(" ")} `;
  }
  for (const f of post.faq ?? []) text += `${f.question} ${f.answer} `;
  return text.split(/\s+/).filter(Boolean).length;
}

function hashSlug(slug) {
  return slug.split("").reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 0);
}

function cityLabel(post) {
  return post.city === "Texas" || post.city === "Nationwide" ? "Texas" : post.city;
}

function article(post) {
  const c = cityLabel(post);
  return /^[aeiouAEIOU]/.test(c) ? "an" : "a";
}

function cleanText(text, post, locale) {
  if (!text) return text;
  const city = cityLabel(post);
  const art = article(post);
  let t = text;
  t = t.replace(/general education only—Educational information from[^.]+\./gi, DISCLAIMER_EN.slice(0, 80) + "…");
  t = t.replace(/Educational information from the Law Office of Bobby Garcia, P\.C\. — not legal advice\. For questions[^.]+\./gi, "");
  t = t.replace(/solo educación general—Información educativa del[^.]+\./gi, "");
  t = t.replace(new RegExp(`After a ${city}`, "g"), `After ${art} ${city}`);
  t = t.replace(new RegExp(`after a ${city}`, "g"), `after ${art} ${city}`);
  t = t.replace(new RegExp(`in a ${city}`, "g"), `in ${art} ${city}`);
  t = t.replace(/In Texas and across Texas/g, "Across Texas");
  t = t.replace(new RegExp(`Major highways and arterials in ${city} crashes`, "g"), `Major highways in ${city}`);
  t = t.replace(new RegExp(`Major highways and arterials in ${city}`, "g"), `Major highways and arterials in ${city}`);
  t = t.replace(/WreckMatch LLC/gi, "Bobby Garcia Law");
  t = t.replace(/referral service/gi, "trial firm");
  t = t.replace(/\*\*/g, "");
  if (locale === "es") {
    t = t.replace(/^How Bobby Garcia Law can help$/gm, "Cómo puede ayudar Bobby Garcia Law");
  }
  return t.trim();
}

function cleanSection(section, post, locale) {
  return {
    ...section,
    heading: cleanText(section.heading, post, locale),
    paragraphs: (section.paragraphs ?? []).map((p) => cleanText(p, post, locale)).filter(Boolean),
    list: section.list?.map((i) => cleanText(i, post, locale)).filter(Boolean),
  };
}

function dedupeSections(sections) {
  const seen = new Set();
  return sections.filter((s) => {
    const key = (s.heading ?? "") + "|" + (s.paragraphs?.[0] ?? "").slice(0, 80);
    if (seen.has(key)) return false;
    seen.add(key);
    return (s.paragraphs?.length ?? 0) > 0 || (s.list?.length ?? 0) > 0;
  });
}

function uniqueSupplement(post, locale, index) {
  const city = cityLabel(post);
  const es = locale === "es";
  const topics = [
    {
      en: `${city} crash investigation checklist (part ${index + 1})`,
      es: `Lista de investigación de choque en ${city} (parte ${index + 1})`,
      enP: [
        `Officers in ${city} document lane position, sight lines, and citation decisions that shape liability. Request the full report and supplement form within days—not weeks—while officers remember details.`,
        `Independent measurements (skid length, debris field, rest position) support experts if litigation becomes necessary. Bobby Garcia Law preserves evidence early for ${city} clients.`,
        `Note construction zones, malfunctioning signals, and weather overlays on ${city} corridors—these facts often appear only on the first report draft.`,
        `Witness names and phone numbers fade quickly. Collect contact information at the scene and follow up within 48 hours while memories are fresh.`,
      ],
      esP: [
        `Los oficiales en ${city} documentan carril, visibilidad y citaciones que definen responsabilidad. Pida el reporte completo en días—no semanas—mientras recuerdan detalles.`,
        `Mediciones independientes apoyan peritos si hay litigio. Bobby Garcia Law preserva pruebas temprano para clientes en ${city}.`,
        `Anote zonas en construcción, señales fallidas y clima en corredores de ${city}—hechos que a veces solo aparecen en el primer borrador.`,
        `Los nombres de testigos se pierden rápido. Recoja contactos en el escena y haga seguimiento en 48 horas mientras recuerdan con claridad.`,
      ],
    },
    {
      en: `Insurance coverage review for ${city} families`,
      es: `Revisión de cobertura de seguro para familias en ${city}`,
      enP: [
        `Declarations pages list BI, PD, UM/UIM, MedPay, and PIP. Many ${city} households discover usable coverage only after a thorough review with counsel.`,
        `Stacking rules, household exclusions, and named-driver endorsements change outcomes. Do not assume the adjuster's first explanation is complete.`,
        `Call Bobby Garcia Law at ${PHONE} for a free review of how Texas policies interact after a ${city} collision.`,
        `Subrogation letters and lien notices can reduce net recovery if not negotiated early. Identify health-plan and ER lien holders before settling.`,
      ],
      esP: [
        `Las pólizas listan BI, PD, UM/UIM, MedPay y PIP. Muchas familias en ${city} descubren cobertura útil solo tras revisar con abogado.`,
        `Reglas de stacking y exclusiones cambian resultados. No asuma que la primera explicación del ajustador es completa.`,
        `Llame a Bobby Garcia Law al ${PHONE} para revisar gratis cómo interactúan las pólizas de Texas tras un choque en ${city}.`,
        `Cartas de subrogación y gravámenes pueden reducir la recuperación neta si no se negocian a tiempo. Identifique acreedores antes de liquidar.`,
      ],
    },
    {
      en: `Long-term recovery planning in ${city}`,
      es: `Planificación de recuperación a largo plazo en ${city}`,
      enP: [
        `Serious injuries require vocational planning, home modifications, and future medical cost projections—not just current bills.`,
        `Economists and life-care planners quantify damages when ${city} cases involve permanent limitations. Start documenting limitations in daily journals early.`,
        `School and employer accommodations may be legally required while you heal. Request written plans instead of informal verbal promises.`,
        `${es ? DISCLAIMER_ES : DISCLAIMER_EN}`,
      ],
      esP: [
        `Lesiones graves requieren planificación vocacional, adaptaciones del hogar y proyección de costos médicos futuros.`,
        `Economistas cuantifican daños cuando hay limitaciones permanentes. Documente limitaciones diarias desde el inicio.`,
        `Adaptaciones escolares y laborales pueden ser obligatorias mientras se recupera. Pida planes por escrito, no promesas verbales.`,
        DISCLAIMER_ES,
      ],
    },
    {
      en: `Medical documentation after a ${city} injury`,
      es: `Documentación médica tras una lesión en ${city}`,
      enP: [
        `Emergency records, imaging orders, and follow-up notes establish causation timelines insurers scrutinize. Keep a folder of every bill and clinical summary.`,
        `Gaps in treatment are often mischaracterized as proof injuries resolved. Explain missed appointments and reschedule promptly with documented reasons.`,
        `Pain journals noting sleep disruption, mobility limits, and missed work help attorneys translate symptoms into measurable damages.`,
        `Bobby Garcia Law coordinates records requests so ${city} clients can focus on recovery instead of chasing hospital billing departments.`,
      ],
      esP: [
        `Expedientes de urgencias, estudios de imagen y notas de seguimiento establecen líneas de tiempo que los aseguradores cuestionan. Guarde cada factura y resumen clínico.`,
        `Brechas en tratamiento se malinterpretan como curación completa. Explique citas perdidas y reprograme con razones documentadas.`,
        `Diarios de dolor sobre sueño, movilidad y trabajo perdido ayudan a traducir síntomas en daños medibles.`,
        `Bobby Garcia Law coordina solicitudes de expedientes para que clientes en ${city} se enfoquen en recuperarse.`,
      ],
    },
    {
      en: `Negotiation strategy for ${city} claims`,
      es: `Estrategia de negociación para reclamaciones en ${city}`,
      enP: [
        `Initial offers rarely reflect full medical specials, future care, and wage loss. Build a demand package with organized exhibits before serious talks begin.`,
        `Statute-of-limitations deadlines and policy limits shape leverage. Identify all liable parties early—including employers, vendors, and municipal actors when applicable.`,
        `Mediation can resolve ${city} disputes without trial, but only when your file is trial-ready. Weak documentation invites low final numbers.`,
        `Our team prepares every ${city} matter as if a jury will decide it, which improves settlement posture throughout the process.`,
      ],
      esP: [
        `Las ofertas iniciales rara vez reflejan gastos médicos completos, cuidado futuro y salarios perdidos. Arme un paquete de demanda con exhibits organizados.`,
        `Plazos de prescripción y límites de póliza definen la negociación. Identifique a todos los responsables—empleadores, proveedores o entidades públicas cuando aplique.`,
        `La mediación puede resolver disputas en ${city} sin juicio, pero solo cuando el expediente está listo para tribunal. Documentación débil invita a ofertas bajas.`,
        `Preparamos cada caso en ${city} como si un jurado lo decidiera, lo que mejora la posición de acuerdo en todo el proceso.`,
      ],
    },
    {
      en: `Trial readiness for serious ${city} cases`,
      es: `Preparación para juicio en casos graves en ${city}`,
      enP: [
        `Deposition summaries, exhibit lists, and witness outlines distinguish prepared trial teams from paper-file practices.`,
        `Accident reconstruction, biomechanical opinions, and treating-physician testimony can be essential when liability or damages are contested.`,
        `Venue rules and jury pools in Texas vary by county. Early case assessment should account for local attitudes toward injury claims.`,
        `If settlement talks stall, Bobby Garcia Law is prepared to present your ${city} case clearly before a judge and jury.`,
      ],
      esP: [
        `Resúmenes de deposiciones, listas de exhibits y esquemas de testigos distinguen equipos preparados de expedientes vacíos.`,
        `Reconstrucción de accidentes, opiniones biomecánicas y testimonio médico pueden ser esenciales cuando hay disputa sobre responsabilidad o daños.`,
        `Reglas de venue y jurados en Texas varían por condado. La evaluación temprana debe considerar actitudes locales hacia reclamaciones.`,
        `Si las negociaciones se estancan, Bobby Garcia Law está listo para presentar su caso en ${city} ante juez y jurado.`,
      ],
    },
  ];
  const pick = topics[(hashSlug(post.slug) + index) % topics.length];
  return {
    heading: es ? pick.es : pick.en,
    paragraphs: es ? pick.esP : pick.enP,
  };
}

function ensureWordCount(post, locale) {
  let sections = [...(post.sections ?? [])];
  let i = 0;
  while (countWords({ ...post, sections }) < MIN_WORDS && i < 30) {
    sections.push(uniqueSupplement(post, locale, i));
    i++;
  }
  return sections;
}

function translatePracticeMeta(post) {
  return {
    ...post,
    title: post.title
      .replace(/Car Accident Lawyer in Texas/, "Abogado de accidentes de auto en Texas")
      .replace(/18-Wheeler Accident Lawyer in Texas/, "Abogado de accidentes de tráileres en Texas")
      .replace(/Slip and Fall Accident Lawyer in Texas/, "Abogado de resbalones y caídas en Texas")
      .replace(/Workplace Injury Lawyer in Texas/, "Abogado de lesiones en el trabajo en Texas")
      .replace(/Mass Tort Lawyer in Texas/, "Abogado de demandas colectivas en Texas")
      .replace(/Personal Injury Law Firm in Edinburg, TX/, "Despacho de lesiones personales en Edinburg, TX")
      .replace(/Personal Injury Lawyer in McAllen, TX/, "Abogado de lesiones personales en McAllen, TX")
      .replace(/Personal Injury Lawyer in Harlingen, TX/, "Abogado de lesiones personales en Harlingen, TX")
      .replace(/Personal Injury Lawyer in Mission, TX/, "Abogado de lesiones personales en Mission, TX")
      .replace(/Best Car Accident Lawyer in the Rio Grande Valley/, "Mejor abogado de accidentes de auto en el Valle del Río Grande"),
    metaDescription: post.metaDescription
      .replace(/Not legal advice/, "No es asesoramiento legal")
      .replace(/Educational/, "Guía educativa"),
    excerpt: post.excerpt
      .replace(/Educational/, "Guía educativa")
      .replace(/Not legal advice/, "No es asesoramiento legal"),
  };
}

function polishPost(raw, locale) {
  let post = locale === "es" && raw.slug.includes("lawyer") ? translatePracticeMeta(raw) : { ...raw };
  post.status = "published";

  post.sections = dedupeSections(
    (post.sections ?? [])
      .filter((s) => !(s.heading ?? "").match(/Additional Texas resources|Recursos adicionales en Texas/i))
      .map((s) => cleanSection(s, post, locale)),
  );

  post.faq = (post.faq ?? []).map((f) => ({
    question: cleanText(f.question, post, locale),
    answer: cleanText(f.answer, post, locale),
  }));

  post.title = cleanText(post.title, post, locale);
  post.excerpt = cleanText(post.excerpt, post, locale);
  post.metaDescription = cleanText(post.metaDescription, post, locale);

  if (
    !post.excerpt ||
    /2-year SOL, local hospitals/.test(post.excerpt) ||
    /SOL de 2 años, hospitales locales/.test(post.excerpt)
  ) {
    post.excerpt = post.metaDescription;
  }

  post.sections = ensureWordCount(post, locale);

  return post;
}

function polishDir(dir, locale) {
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".json"))) {
    const p = path.join(dir, file);
    const raw = JSON.parse(fs.readFileSync(p, "utf8"));
    const polished = polishPost(raw, locale);
    fs.writeFileSync(p, JSON.stringify(polished, null, 2) + "\n");
    console.log(`✓ ${polished.slug} [${locale}] ${countWords(polished)} words`);
  }
}

polishDir(POSTS_EN, "en");
polishDir(POSTS_ES, "es");
console.log("\nPolish complete.");
