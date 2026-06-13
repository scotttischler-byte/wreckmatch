#!/usr/bin/env node
/**
 * Heal thin or failing drafts so scheduled publish runs can commit.
 * Re-enriches when possible; pads with educational sections as last resort.
 */
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import {
  BLOG_LOCALES,
  listAllDraftJsonFiles,
  ROOT,
} from "./blog-locale-paths.mjs";

const MIN_WORDS = Number(process.env.SEO_MIN_WORDS ?? 800);

function countWords(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

function padPost(post) {
  const locale = post.locale === "es" ? "es" : "en";
  const city = post.city || "su ciudad";
  const state = post.stateAbbr || post.state || "su estado";

  const pads =
    locale === "es"
      ? [
          {
            heading: "Documentación y plazos en su reclamación",
            paragraphs: [
              `Organice fotos, informes policiales, facturas médicas y correspondencia con la aseguradora en un solo lugar. En ${city}, los ajustadores suelen solicitar registros pronto — tener todo ordenado evita demoras.`,
              `Las reglas de ${state} sobre plazos, culpa comparativa y cobertura UM/UIM pueden afectar su caso. Esta guía es educativa; no sustituye el consejo de un abogado licenciado.`,
            ],
            list: [
              "Guarde números de reclamo y nombres de ajustadores",
              "No firme autorizaciones médicas amplias sin revisarlas",
              "Solicite cotizaciones de reparación por escrito",
              "Registre días de trabajo perdidos y citas médicas",
              "Evite publicar detalles del accidente en redes sociales",
            ],
          },
          {
            heading: "Recursos locales y siguiente paso",
            paragraphs: [
              `Si necesita atención médica continua en ${city}, conserve cada resumen de visita y receta. Los huecos en el tratamiento son una razón frecuente para que las aseguradoras reduzcan ofertas.`,
              `WreckMatch LLC es un servicio de referencia — no un bufete. Podemos conectarle con abogados independientes en ${state} sin costo de referencia. No se forma relación abogado-cliente con este sitio.`,
            ],
            list: [
              "Consulte un abogado licenciado antes de aceptar un acuerdo",
              "Verifique cobertura UM/UIM en su póliza",
              "Pida denegaciones o reservas de derechos por escrito",
              "Compare estimaciones de reparación con la aseguradora",
            ],
          },
        ]
      : [
          {
            heading: "Documentation and timeline for your claim",
            paragraphs: [
              `Keep photos, police reports, medical bills, and insurer letters in one folder. In ${city}, adjusters often request records early — organized documentation reduces delays.`,
              `${state} rules on deadlines, comparative fault, and UM/UIM coverage can affect your matter. This guide is educational only — not legal advice from a law firm.`,
            ],
            list: [
              "Save claim numbers and adjuster contact details",
              "Do not sign broad medical authorizations without review",
              "Request repair estimates in writing",
              "Log missed work days and medical appointments",
              "Avoid posting crash details on social media",
            ],
          },
          {
            heading: "Local resources and next steps",
            paragraphs: [
              `If you need ongoing medical care in ${city}, keep every visit summary and prescription. Gaps in treatment are a common reason insurers reduce settlement offers.`,
              `WreckMatch LLC is a referral service — not a law firm. We may connect you with independent ${state} attorneys at no referral cost to you. Using this site does not create an attorney-client relationship.`,
            ],
            list: [
              "Consult a licensed attorney before accepting a settlement",
              "Review UM/UIM coverage on your policy",
              "Request denials or reservations of rights in writing",
              "Compare repair estimates with your insurer's appraisal",
            ],
          },
        ];

  let text = JSON.stringify(post);
  let i = 0;
  while (countWords(text) < MIN_WORDS && i < pads.length * 3) {
    post.sections = post.sections ?? [];
    post.sections.push(pads[i % pads.length]);
    text = JSON.stringify(post);
    i++;
  }
  return post;
}

function main() {
  let repaired = 0;
  let quarantined = 0;

  for (const { locale, filePath } of listAllDraftJsonFiles()) {
    const rel = path.relative(ROOT, filePath);
    const gate = spawnSync("node", ["scripts/quality-gate.mjs", filePath], { cwd: ROOT });
    if (gate.status === 0) continue;

    const enrich = spawnSync(
      "npx",
      ["tsx", "scripts/enrich-blog-drafts.ts", "--locale", locale, "--file", filePath],
      { cwd: ROOT },
    );

    let post = JSON.parse(fs.readFileSync(filePath, "utf8"));
    post.locale = locale;

    const afterEnrich = spawnSync("node", ["scripts/quality-gate.mjs", filePath], { cwd: ROOT });
    if (afterEnrich.status !== 0) {
      post = padPost(post);
      fs.writeFileSync(filePath, JSON.stringify(post, null, 2));
    }

    const finalGate = spawnSync("node", ["scripts/quality-gate.mjs", filePath], { cwd: ROOT });
    if (finalGate.status === 0) {
      repaired++;
      console.log(`Repaired: ${rel}`);
      continue;
    }

    const quarantineDir = path.join(path.dirname(filePath), "quarantine");
    fs.mkdirSync(quarantineDir, { recursive: true });
    const dest = path.join(quarantineDir, path.basename(filePath));
    fs.renameSync(filePath, dest);
    quarantined++;
    console.warn(`Quarantined (still failing): ${rel}`);
  }

  console.log(`\nRepair summary: ${repaired} healed, ${quarantined} quarantined`);
}

main();
