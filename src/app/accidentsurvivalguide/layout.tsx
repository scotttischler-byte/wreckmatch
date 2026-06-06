import type { Metadata } from "next";
import { SurvivalGuideHeader } from "@/components/accidentsurvivalguide/SurvivalGuideHeader";
import { SurvivalGuideFooter } from "@/components/accidentsurvivalguide/SurvivalGuideFooter";
import { AsgJsonLd } from "@/components/accidentsurvivalguide/AsgJsonLd";
import { AsgShell } from "@/components/accidentsurvivalguide/AsgShell";
import { StickyDownloadBar } from "@/components/accidentsurvivalguide/StickyDownloadBar";
import { AsgLocaleProvider } from "@/components/accidentsurvivalguide/AsgLocaleProvider";
import { ASG_BASE_URL } from "@/lib/accidentsurvivalguide";
import { getMessages } from "@/lib/i18n/get-messages";
import { localeHtmlLang, localeOpenGraph } from "@/lib/i18n/config";
import { getAsgLocale } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = getAsgLocale();
  const m = getMessages(locale);

  return {
    metadataBase: new URL(ASG_BASE_URL),
    title: {
      default: m.meta.titleDefault,
      template: m.meta.titleTemplate,
    },
    description: m.meta.description,
    openGraph: {
      type: "website",
      locale: localeOpenGraph(locale),
      url: locale === "es" ? `${ASG_BASE_URL}/es` : ASG_BASE_URL,
      siteName: m.meta.siteName,
      title: m.meta.titleDefault,
      description: m.meta.ogDescription,
    },
    robots: { index: true, follow: true },
    alternates: {
      canonical: locale === "es" ? `${ASG_BASE_URL}/es` : ASG_BASE_URL,
      languages: {
        en: ASG_BASE_URL,
        es: `${ASG_BASE_URL}/es`,
      },
    },
  };
}

export default function AccidentSurvivalGuideLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = getAsgLocale();
  const messages = getMessages(locale);

  return (
    <AsgLocaleProvider locale={locale} messages={messages}>
      <AsgShell lang={localeHtmlLang(locale)}>
        <AsgJsonLd includeFaq siteName={messages.meta.siteName} faqItems={messages.faq} />
        <SurvivalGuideHeader />
        <main className="max-sm:pb-safe-bar">{children}</main>
        <StickyDownloadBar />
        <SurvivalGuideFooter />
      </AsgShell>
    </AsgLocaleProvider>
  );
}
