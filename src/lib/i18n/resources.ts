import type { Locale } from "@/lib/i18n/config";
import { formatMessage, getMessages } from "@/lib/i18n/get-messages";
import {
  SURVIVAL_GUIDE_PDF,
} from "@/lib/accidentsurvivalguide";
import { ALL_STATE_SLUGS, getStateGuideBySlug } from "@/lib/asg/state-guides";

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
    ...ALL_STATE_SLUGS.map((slug) => {
      const guide = getStateGuideBySlug(slug)!;
      return {
        title: formatMessage(m.stateGuideTitle, { state: guide.name }),
        description: guide.headline,
        href: `/${slug}`,
        external: false,
      };
    }),
  ];
}
