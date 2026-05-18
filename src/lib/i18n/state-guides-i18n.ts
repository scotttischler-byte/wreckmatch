import type { Locale } from "@/lib/i18n/config";
import type { StateGuide, StateSlug } from "@/lib/accidentsurvivalguide";
import { STATE_GUIDES } from "@/lib/accidentsurvivalguide";

type LocalizedStateGuide = Pick<StateGuide, "headline" | "intro" | "tips" | "statuteNote">;

const ES_STATE_GUIDES: Partial<Record<StateSlug, LocalizedStateGuide>> = {
  texas: {
    headline: "Qué hacer después de un accidente de auto en Texas",
    intro:
      "Texas tiene reglas específicas de reporte y requisitos de seguro. Estos pasos son educación general—no asesoría legal para su situación.",
    tips: [
      "Llame al 911 si hay lesionados y muévase a un lugar seguro cuando sea posible.",
      "Intercambie nombres, seguro e información de contacto con otros conductores.",
      "Presente un Reporte de Choque (CR-2) ante TxDOT cuando sea requerido por daños.",
      "Fotografíe vehículos, condiciones del camino y lesiones visibles.",
      "Busque atención médica aunque el dolor aparezca después—documente cada visita.",
      "Notifique a su aseguradora con prontitud; evite declaraciones grabadas hasta entender sus derechos.",
    ],
    statuteNote:
      "Texas usa negligencia comparativa modificada. Hablar con un abogado licenciado puede ayudarle a entender cómo la culpa puede afectar un reclamo.",
  },
  florida: {
    headline: "Qué hacer después de un accidente de auto en Florida",
    intro:
      "El sistema de seguro sin culpa de Florida puede confundir después de un choque. Use esta lista para mantenerse organizado mientras se recupera.",
    tips: [
      "Llame al 911 si hay heridos y no bloquee el tráfico innecesariamente.",
      "Intercambie información de seguro, licencia y registro.",
      "Fotografíe daños, señales y la escena general.",
      "Busque atención médica de inmediato o tan pronto como sea posible.",
      "Reporte el accidente a su aseguradora con hechos claros.",
      "Guarde todos los recibos médicos y de reparación.",
    ],
    statuteNote:
      "Florida tiene plazos estrictos para PIP y reclamos por lesiones. Un abogado licenciado puede explicar sus opciones.",
  },
  california: {
    headline: "Qué hacer después de un accidente de auto en California",
    intro:
      "California requiere reportes en muchos casos. Estos pasos educativos ayudan a proteger su salud y registros.",
    tips: [
      "Mueva el vehículo fuera del tráfico si es seguro hacerlo.",
      "Llame al 911 si hay lesionados.",
      "Intercambie licencia, seguro e información de contacto.",
      "Presente el reporte SR-1 al DMV cuando aplique.",
      "Documente la escena con fotos y testigos.",
      "Busque atención médica y guarde todos los registros.",
    ],
    statuteNote:
      "California usa negligencia comparativa pura—puede recuperar daños incluso si comparte parte de la culpa.",
  },
  "new-york": {
    headline: "Qué hacer después de un accidente de auto en Nueva York",
    intro:
      "Nueva York combina seguro sin culpa con reclamos por lesiones graves. Mantenga registros claros desde el primer día.",
    tips: [
      "Llame al 911 si alguien está herido.",
      "Intercambie información en el lugar si es seguro.",
      "Fotografíe vehículos, placas y condiciones del camino.",
      "Busque atención médica y siga las indicaciones del proveedor.",
      "Notifique a su aseguradora dentro de los plazos requeridos.",
      "Evite declaraciones grabadas hasta entender sus derechos.",
    ],
    statuteNote:
      "NY tiene umbrales para reclamos fuera del sistema sin culpa—consulte a un abogado licenciado si tiene lesiones serias.",
  },
  georgia: {
    headline: "Qué hacer después de un accidente de auto en Georgia",
    intro:
      "Georgia requiere reportes policiales en muchos choques. Use esta guía educativa para organizarse.",
    tips: [
      "Llame al 911 si hay lesionados.",
      "Intercambie seguro y datos de contacto.",
      "Obtenga el número del reporte policial cuando responda la policía.",
      "Fotografíe daños y la escena.",
      "Busque atención médica incluso si el dolor es leve.",
      "Guarde correspondencia con aseguradoras.",
    ],
    statuteNote:
      "Georgia usa negligencia modificada comparativa—su recuperación puede reducirse si se le considera parcialmente responsable.",
  },
  illinois: {
    headline: "Qué hacer después de un accidente de auto en Illinois",
    intro:
      "Illinois tiene reglas de reporte y plazos de reclamo. Estos pasos son educación general.",
    tips: [
      "Asegure la escena y llame al 911 si hay heridos.",
      "Intercambie información con otros conductores.",
      "Fotografíe vehículos y condiciones.",
      "Busque atención médica y documente tratamiento.",
      "Notifique a su aseguradora con prontitud.",
      "No firme liberaciones sin entender los términos.",
    ],
    statuteNote:
      "Illinois usa negligencia contributiva modificada—hable con un abogado licenciado sobre cómo la culpa afecta su caso.",
  },
  pennsylvania: {
    headline: "Qué hacer después de un accidente de auto en Pennsylvania",
    intro:
      "Pennsylvania ofrece opciones de seguro limitado o completo. Mantenga registros claros después de un choque.",
    tips: [
      "Llame al 911 si hay lesionados.",
      "Intercambie información en el lugar.",
      "Fotografíe daños y la escena.",
      "Busque atención médica de inmediato.",
      "Reporte a su aseguradora según su póliza.",
      "Guarde facturas y estimados de reparación.",
    ],
    statuteNote:
      "PA tiene reglas únicas de tort limitado vs. completo—un abogado licenciado puede explicar su cobertura.",
  },
  ohio: {
    headline: "Qué hacer después de un accidente de auto en Ohio",
    intro:
      "Ohio requiere intercambio de información y reportes en muchos casos. Organícese con esta lista.",
    tips: [
      "Mueva vehículos fuera del tráfico si es seguro.",
      "Llame al 911 si hay heridos.",
      "Intercambie seguro y contacto.",
      "Fotografíe la escena y lesiones.",
      "Busque atención médica y guarde registros.",
      "Notifique a su aseguradora con hechos claros.",
    ],
    statuteNote:
      "Ohio usa negligencia comparativa modificada—consulte a un abogado licenciado sobre plazos de reclamo.",
  },
  "north-carolina": {
    headline: "Qué hacer después de un accidente de auto en Carolina del Norte",
    intro:
      "La regla de negligencia contributiva de Carolina del Norte hace especialmente importante la documentación.",
    tips: [
      "Llame al 911 si hay lesionados y solicite reporte policial.",
      "Intercambie información de seguro y contacto.",
      "Fotografíe daños, señales y la escena.",
      "Busque evaluación médica incluso con síntomas tardíos.",
      "Notifique a su aseguradora con información factual.",
      "Evite discutir culpa en redes sociales.",
    ],
    statuteNote:
      "Carolina del Norte es uno de pocos estados con negligencia contributiva—la consulta legal puede valer la pena.",
  },
  arizona: {
    headline: "Qué hacer después de un accidente de auto en Arizona",
    intro:
      "Arizona requiere reportes de accidente en muchos casos. Estos pasos educativos protegen su salud y registros.",
    tips: [
      "Muévase a un lugar seguro y llame al 911 si hay heridos.",
      "Intercambie licencia, seguro y registro.",
      "Presente el Formulario 39-4001 ante MVD cuando la policía no investigue.",
      "Documente la escena con fotos y testigos.",
      "Busque atención médica y organice registros de tratamiento.",
      "Registre tiempo perdido de trabajo y gastos de bolsillo.",
    ],
    statuteNote:
      "Arizona usa negligencia comparativa pura—puede recuperar incluso si es parcialmente responsable, con reducciones.",
  },
};

export function getLocalizedStateGuide(slug: string, locale: Locale): StateGuide | undefined {
  const base = STATE_GUIDES[slug as StateSlug];
  if (!base) return undefined;
  if (locale === "en") return base;

  const localized = ES_STATE_GUIDES[slug as StateSlug];
  if (!localized) return base;

  return { ...base, ...localized };
}
