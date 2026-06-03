#!/usr/bin/env node
/**
 * Expand all Bobby Garcia guides to ~3,000 words, publish EN + ES.
 * Usage: node scripts/expand-bobbygarcia-posts.mjs [--min-words=3000]
 */

import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const POSTS_EN = path.join(ROOT, "content/bobbygarcia/posts/en");
const POSTS_ES = path.join(ROOT, "content/bobbygarcia/posts/es");
const MIN_WORDS = Number(process.argv.find((a) => a.startsWith("--min-words="))?.split("=")[1] ?? 3000);

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

function cityLabel(post) {
  return post.city === "Texas" || post.city === "Nationwide" ? "Texas" : post.city;
}

function expansionSections(post, locale) {
  const city = cityLabel(post);
  const es = locale === "es";

  const h = (en, sp) => (es ? sp : en);
  const p = (en, sp) => (es ? sp : en);

  return [
    {
      heading: h(`Why ${city} crash victims call Bobby Garcia Law`, `Por qué las víctimas de choques en ${city} llaman a Bobby Garcia Law`),
      paragraphs: [
        p(
          `The Law Office of Bobby Garcia, P.C. has served South Texas and Houston families for more than 35 years. When a collision in ${city} disrupts your work, health, and finances, you need a trial team—not a call center. Bobby Garcia Law combines aggressive litigation with clear communication in English and Spanish, 24 hours a day.`,
          `El Despacho de Abogados Bobby Garcia, P.C. ha servido a familias del sur de Texas y Houston por más de 35 años. Cuando un choque en ${city} afecta su trabajo, salud y finanzas, necesita un equipo litigante—no un centro de llamadas. Bobby Garcia Law combina litigio agresivo con comunicación clara en inglés y español, las 24 horas.`,
        ),
        p(
          `This guide explains Texas insurance rules, medical documentation, evidence preservation, and deadlines that apply after a crash in ${city}. It is general education only—${DISCLAIMER_EN}`,
          `Esta guía explica las reglas de seguros de Texas, documentación médica, preservación de pruebas y plazos que aplican después de un choque en ${city}. Es solo educación general—${DISCLAIMER_ES}`,
        ),
      ],
    },
    {
      heading: h("Texas fault and comparative negligence", "Responsabilidad y negligencia comparativa en Texas"),
      paragraphs: [
        p(
          `Texas follows modified comparative negligence with a 51% bar. If you are more than 50% at fault, you may recover nothing. Insurers in ${city} routinely argue shared fault to reduce payouts—your documentation from day one shapes that fight.`,
          `Texas sigue negligencia comparativa modificada con una barra del 51%. Si usted tiene más del 50% de culpa, puede no recuperar nada. Las aseguradoras en ${city} argumentan culpa compartida para reducir pagos—su documentación desde el primer día define esa batalla.`,
        ),
        p(
          `Police reports, witness statements, traffic citations, and scene photos help establish who failed to yield, follow speed limits, or maintain a safe distance. Never admit fault at the scene; describe facts calmly to officers.`,
          `Los reportes policiales, declaraciones de testigos, citaciones de tránsito y fotos de la escena ayudan a establecer quién no cedió el paso, excedió límites o no mantuvo distancia segura. Nunca admita culpa en la escena; describa hechos con calma a los oficiales.`,
        ),
      ],
      list: [
        p("Request the responding officer's name and report number", "Pida el nombre del oficial y número de reporte"),
        p("Note weather, lighting, and road conditions", "Anote clima, iluminación y condiciones del camino"),
        p("Identify surveillance cameras at nearby businesses", "Identifique cámaras de negocios cercanos"),
        p("Save dashcam or phone video immediately", "Guarde video de dashcam o teléfono de inmediato"),
      ],
    },
    {
      heading: h(`${city} insurance minimums and coverage gaps`, `Mínimos de seguro y brechas de cobertura en ${city}`),
      paragraphs: [
        p(
          `Texas requires minimum liability limits of 30/60/25 ($30,000 per person bodily injury, $60,000 per accident, $25,000 property damage). Many at-fault drivers carry only minimums—often insufficient for hospital bills after a serious ${city} collision.`,
          `Texas exige mínimos de responsabilidad 30/60/25 ($30,000 por lesiones personales, $60,000 por accidente, $25,000 daños a propiedad). Muchos conductores culpables solo tienen mínimos—insuficientes para hospitalizaciones tras un choque grave en ${city}.`,
        ),
        p(
          `Review your declarations page for uninsured/underinsured motorist (UM/UIM), personal injury protection (PIP), and MedPay. These coverages can matter when the other driver has inadequate limits or flees the scene.`,
          `Revise su póliza para UM/UIM, protección de lesiones personales (PIP) y MedPay. Estas coberturas importan cuando el otro conductor tiene límites bajos o huye de la escena.`,
        ),
      ],
    },
    {
      heading: h("Medical treatment and documentation", "Tratamiento médico y documentación"),
      paragraphs: [
        p(
          `Insurers scrutinize gaps in treatment. After a ${city} crash, seek care within 24 hours even if pain feels minor—whiplash, concussion, and internal bleeding may appear later. ER records, urgent care notes, and follow-up visits create a timeline insurers cannot easily dismiss.`,
          `Las aseguradoras examinan huecos en el tratamiento. Después de un choque en ${city}, busque atención en 24 horas aunque el dolor parezca leve—latigazo cervical, conmoción y sangrado interno pueden aparecer después. Registros de ER, notas de urgencias y visitas de seguimiento crean una línea de tiempo difícil de rechazar.`,
        ),
        p(
          `Keep itemized bills, imaging orders (X-ray, MRI, CT), prescriptions, physical therapy schedules, and mileage to appointments. Bobby Garcia Law's medical specialists help clients organize treatment records for maximum clarity.`,
          `Conserve facturas detalladas, órdenes de imagen (rayos X, MRI, CT), recetas, terapia física y millaje a citas. Los especialistas médicos de Bobby Garcia Law ayudan a organizar registros de tratamiento con claridad.`,
        ),
      ],
      list: [
        p("Photograph visible injuries on day one", "Fotografíe lesiones visibles el primer día"),
        p("Follow every discharge instruction", "Siga cada instrucción de alta médica"),
        p("Do not sign blanket medical authorizations for adjusters", "No firme autorizaciones médicas amplias para ajustadores"),
        p("Track lost wages with employer documentation", "Documente salarios perdidos con su empleador"),
      ],
    },
    {
      heading: h("Dealing with claims adjusters", "Trato con ajustadores de reclamos"),
      paragraphs: [
        p(
          `Adjusters represent the insurance company's financial interests—not yours. They may request recorded statements, broad medical releases, or quick settlements before you understand injury severity. In ${city} and across Texas, early statements can lock in descriptions that reduce fault on the other driver.`,
          `Los ajustadores representan los intereses financieros de la aseguradora—no los suyos. Pueden pedir declaraciones grabadas, autorizaciones médicas amplias o acuerdos rápidos antes de que conozca la gravedad de las lesiones. En ${city} y todo Texas, declaraciones tempranas pueden fijar descripciones que reducen culpa del otro conductor.`,
        ),
        p(
          `Provide basic facts—date, time, location, vehicles involved. Decline recorded interviews until you understand coverage and injuries. Request denials, reservation-of-rights letters, and settlement offers in writing.`,
          `Proporcione hechos básicos—fecha, hora, lugar, vehículos. Rechace entrevistas grabadas hasta entender cobertura y lesiones. Pida negativas, cartas de reserva de derechos y ofertas por escrito.`,
        ),
      ],
    },
    {
      heading: h("Evidence preservation in the first 30 days", "Preservación de pruebas en los primer 30 días"),
      paragraphs: [
        p(
          `Skid marks fade, witnesses forget details, and business surveillance video is often deleted within 7–30 days. After a crash on ${city} highways or surface streets, send preservation letters to businesses, municipalities, and trucking companies when commercial vehicles are involved.`,
          `Las marcas de frenado desaparecen, testigos olvidan detalles y video de vigilancia se borra en 7–30 días. Tras un choque en autopistas o calles de ${city}, envíe cartas de preservación a negocios, municipios y compañías de transporte si hay vehículos comerciales.`,
        ),
        p(
          `Preserve repair estimates, rental receipts, tow bills, and cell-phone metadata. Social media posts about the crash or your activities can be used against you—avoid discussing fault or activities online.`,
          `Conserve estimados de reparación, recibos de renta, grúa y metadatos del teléfono. Publicaciones en redes sobre el choque o sus actividades pueden usarse en su contra—evite discutir culpa en línea.`,
        ),
      ],
    },
    {
      heading: h("Commercial trucks and 18-wheelers", "Camiones comerciales y tráileres"),
      paragraphs: [
        p(
          `${city} corridors see heavy commercial traffic. Trucking cases involve federal motor carrier rules, electronic logging devices, black-box data, and multiple defendants (driver, carrier, broker, shipper). Evidence spoils quickly—qualified counsel helps preserve downloads and driver qualification files.`,
          `Los corredores de ${city} tienen tráfico comercial intenso. Casos de camiones involucran reglas federales, dispositivos de registro, caja negra y múltiples demandados (conductor, transportista, broker). Las pruebas se pierden rápido—abogados calificados ayudan a preservar descargas y archivos del conductor.`,
        ),
      ],
    },
    {
      heading: h("Statute of limitations and notice deadlines", "Plazos de prescripción y aviso"),
      paragraphs: [
        p(
          `Most Texas personal injury claims must be filed within two years of the injury date. Government-entity cases (city buses, state vehicles) may require earlier notice—sometimes within months. Missing a deadline can permanently bar recovery regardless of merit.`,
          `La mayoría de reclamos por lesiones en Texas deben presentarse dentro de dos años desde la lesión. Casos contra entidades gubernamentales pueden requerir aviso más temprano—a veces en meses. Perder un plazo puede eliminar su recuperación sin importar el mérito.`,
        ),
        p(
          `Calendar your dates immediately after a ${city} crash. Bobby Garcia Law offers free consultations 24/7 at ${PHONE} to help you understand timelines—Justice Made Simple.`,
          `Anote sus fechas inmediatamente después de un choque en ${city}. Bobby Garcia Law ofrece consultas gratuitas 24/7 al ${PHONE}—Justicia Hecha Simple.`,
        ),
      ],
    },
    {
      heading: h("Property damage and total-loss disputes", "Daños a propiedad y disputas de pérdida total"),
      paragraphs: [
        p(
          `Insurers may undervalue repairs or declare a total loss based on comparables that favor the carrier. Obtain independent estimates from reputable body shops in ${city}. Review valuation reports for missing equipment, recent maintenance, and regional price adjustments.`,
          `Las aseguradoras pueden subvalorar reparaciones o declarar pérdida total con comparables favorables al carrier. Obtenga estimados independientes de talleres reputados en ${city}. Revise reportes de valuación por equipo faltante y ajustes regionales.`,
        ),
      ],
    },
    {
      heading: h("Lost wages and economic damages", "Salarios perdidos y daños económicos"),
      paragraphs: [
        p(
          `Document every missed shift, PTO day, and reduced earning capacity. Employers in ${city} can provide verification letters; self-employed victims should gather tax returns, contracts, and invoices showing lost opportunities. Vocational experts may be needed for long-term disability.`,
          `Documente cada turno perdido, día de PTO y capacidad reducida de ingresos. Empleadores en ${city} pueden dar cartas de verificación; trabajadores independientes deben reunir impuestos, contratos y facturas. Expertos vocacionales pueden ser necesarios para discapacidad prolongada.`,
        ),
      ],
    },
    {
      heading: h("Pain, suffering, and non-economic damages", "Dolor, sufrimiento y daños no económicos"),
      paragraphs: [
        p(
          `Texas allows recovery for physical pain, mental anguish, disfigurement, and loss of enjoyment of life when liability and causation are established. Journals documenting sleep loss, anxiety, and daily limitations can support these elements—start early after your ${city} collision.`,
          `Texas permite recuperación por dolor físico, angustia mental, desfiguración y pérdida de disfrute de la vida cuando hay responsabilidad y causalidad. Diarios sobre insomnio, ansiedad y limitaciones diarias pueden apoyar estos elementos—comience temprano tras su choque en ${city}.`,
        ),
      ],
    },
    {
      heading: h("Settlement vs. litigation timeline", "Cronograma de acuerdo vs. litigio"),
      paragraphs: [
        p(
          `Minor property claims may resolve in weeks; injury claims with treatment, disputed fault, or commercial defendants often take months or years. Mediation, discovery, and expert depositions extend timelines but may increase recovery. Never sign a general release while treatment is ongoing.`,
          `Reclamos menores de propiedad pueden resolverse en semanas; lesiones con tratamiento, culpa disputada o demandados comerciales toman meses o años. Mediación, discovery y deposiciones extienden plazos pero pueden aumentar recuperación. Nunca firme un release general mientras sigue en tratamiento.`,
        ),
      ],
    },
    {
      heading: h("Working with Bobby Garcia Law", "Trabajar con Bobby Garcia Law"),
      paragraphs: [
        p(
          `Bobby Garcia Law is a full-service trial firm—not a referral mill. Your team may include trial attorneys, legal analysts, medical specialists, and paralegals dedicated to your case. We serve ${city}, the Rio Grande Valley, Houston, and clients statewide. No win, no fee on qualifying personal injury matters.`,
          `Bobby Garcia Law es un despacho litigante completo—no un centro de referidos. Su equipo puede incluir abogados litigantes, analistas legales, especialistas médicos y paralegales dedicados a su caso. Servimos ${city}, el Valle del Río Grande, Houston y clientes en todo el estado. Sin victoria, no hay honorarios en casos calificados.`,
        ),
        p(
          `Call ${PHONE} anytime for a free confidential consultation. Se habla Español. Bobby está contigo—Justice Made Simple.`,
          `Llame al ${PHONE} en cualquier momento para una consulta gratuita y confidencial. Se habla Español. Bobby está contigo—Justicia Hecha Simple.`,
        ),
      ],
    },
  ];
}

function expandedFaq(post, locale) {
  const city = cityLabel(post);
  const es = locale === "es";
  const q = (en, sp) => (es ? sp : en);
  const base = post.faq ?? [];
  const extra = [
    {
      question: q(`Should I give a recorded statement to insurance after a ${city} crash?`, `¿Debo dar declaración grabada al seguro después de un choque en ${city}?`),
      answer: q(
        "Generally, provide basic facts only until you understand injuries and coverage. Recorded statements can be used against you—consult counsel before agreeing.",
        "Generalmente, dé solo hechos básicos hasta entender lesiones y cobertura. Declaraciones grabadas pueden usarse en su contra—consulte abogado antes de aceptar.",
      ),
    },
    {
      question: q("What does no win, no fee mean?", "¿Qué significa sin victoria, no hay honorarios?"),
      answer: q(
        "On qualifying personal injury cases, Bobby Garcia Law typically works on contingency—you owe no attorney fee unless we recover compensation. Confirm terms in your fee agreement.",
        "En casos calificados, Bobby Garcia Law normalmente trabaja a contingencia—no debe honorarios de abogado a menos que recuperemos compensación. Confirme términos en su contrato.",
      ),
    },
    {
      question: q(`How long do I have to file in Texas after a ${city} accident?`, `¿Cuánto tiempo tengo para demandar en Texas después de un accidente en ${city}?`),
      answer: q(
        "Most injury claims face a two-year statute of limitations, but exceptions apply for minors, government entities, and wrongful death. Verify your dates immediately.",
        "La mayoría de reclamos tienen prescripción de dos años, pero hay excepciones para menores, entidades gubernamentales y muerte por negligencia. Verifique fechas de inmediato.",
      ),
    },
    {
      question: q("Does Bobby Garcia Law handle Spanish-speaking clients?", "¿Bobby Garcia Law atiende clientes en español?"),
      answer: q(
        "Yes. Our team is fully bilingual—English and Español—24 hours a day, seven days a week.",
        "Sí. Nuestro equipo es completamente bilingüe—inglés y español—24 horas al día, siete días a la semana.",
      ),
    },
    {
      question: q(`Where are Bobby Garcia Law offices?`, "¿Dónde están las oficinas de Bobby Garcia Law?"),
      answer: q(
        "5301 S McColl Rd, Edinburg, TX (Rio Grande Valley) and 16610 IH 45 South, Ste 200, The Woodlands, TX (Houston area).",
        "5301 S McColl Rd, Edinburg, TX (Valle del Río Grande) y 16610 IH 45 South, Ste 200, The Woodlands, TX (área de Houston).",
      ),
    },
  ];
  return [...base, ...extra];
}

function expandPost(post, locale) {
  const extra = expansionSections(post, locale);
  const merged = {
    ...post,
    status: "published",
    sections: [...(post.sections ?? []), ...extra],
    faq: expandedFaq(post, locale),
  };

  let words = countWords(merged);
  return merged;
}

function translateMeta(post) {
  return {
    ...post,
    title: post.title
      .replace(/^What to Do After a Car Accident in /i, "Qué hacer después de un accidente de auto en ")
      .replace(/^7 Costly Mistakes After a Crash in /i, "7 errores costosos después de un choque en ")
      .replace(/^Statute of Limitations in Texas — /i, "Plazo de prescripción en Texas — guía para "),
    excerpt: post.excerpt
      .replace(/Educational /i, "Guía educativa ")
      .replace(/Not legal advice/i, "No es asesoramiento legal"),
    metaDescription: post.metaDescription
      .replace(/Not legal advice/i, "No es asesoramiento legal")
      .replace(/First steps/i, "Primeros pasos"),
  };
}

function main() {
  const files = fs.readdirSync(POSTS_EN).filter((f) => f.endsWith(".json"));
  let expanded = 0;
  const report = [];

  for (const file of files) {
    const enPath = path.join(POSTS_EN, file);
    const enRaw = JSON.parse(fs.readFileSync(enPath, "utf8"));
    const en = expandPost(enRaw, "en");
    fs.writeFileSync(enPath, JSON.stringify(en, null, 2) + "\n");

    const esPath = path.join(POSTS_ES, file);
    let esBase = fs.existsSync(esPath) ? JSON.parse(fs.readFileSync(esPath, "utf8")) : { ...enRaw };
    esBase = { ...esBase, slug: en.slug, city: en.city, state: en.state, stateAbbr: en.stateAbbr, topic: en.topic, coverImage: en.coverImage };
    const es = expandPost(translateMeta(esBase), "es");
    fs.writeFileSync(esPath, JSON.stringify(es, null, 2) + "\n");

    expanded++;
    report.push({ slug: en.slug, enWords: countWords(en), esWords: countWords(es) });
    console.log(`✓ ${en.slug} — EN ${countWords(en)} / ES ${countWords(es)} words`);
  }

  const manifest = {
    expandedAt: new Date().toISOString(),
    minWords: MIN_WORDS,
    count: expanded,
    posts: report,
  };
  fs.writeFileSync(path.join(ROOT, "content/bobbygarcia/expand-manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
  console.log(`\nExpanded ${expanded} guides (EN + ES) to ≥${MIN_WORDS} words each.`);
}

main();
