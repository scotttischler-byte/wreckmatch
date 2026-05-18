import type { Locale } from "@/lib/i18n/config";
import { formatMessage, getMessages } from "@/lib/i18n/get-messages";
import {
  STATE_GUIDES,
  STATE_SLUGS,
  SURVIVAL_GUIDE_PDF,
  type StateSlug,
} from "@/lib/accidentsurvivalguide";

export function getLocalizedResources(locale: Locale) {
  const m = getMessages(locale).resources;

  return [
    {
      title: m.pdfTitle,
      description: m.pdfDesc,
      href: SURVIVAL_GUIDE_PDF,
      external: true,
    },
    {
      title: m.checklistTitle,
      description: m.checklistDesc,
      href: "/#first-24-hours",
      external: false,
    },
    {
      title: m.mistakesTitle,
      description: m.mistakesDesc,
      href: "/#common-mistakes",
      external: false,
    },
    {
      title: m.rightsTitle,
      description: m.rightsDesc,
      href: "/#your-rights",
      external: false,
    },
    ...STATE_SLUGS.map((slug) => ({
      title: formatMessage(m.stateGuideTitle, { state: STATE_GUIDES[slug as StateSlug].name }),
      description: STATE_GUIDES[slug as StateSlug].headline,
      href: `/${slug}`,
      external: false,
    })),
  ];
}
