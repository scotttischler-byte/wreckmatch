import type { Metadata } from "next";
import { GeoAutoFaqInjector } from "@/components/seo/GeoAutoFaqInjector";
import { BgFooter } from "@/components/bobbygarcia/BgFooter";
import { BgHeader } from "@/components/bobbygarcia/BgHeader";
import { BgLocaleProvider } from "@/components/bobbygarcia/BgLocaleProvider";
import { bgLocaleHtmlLang } from "@/lib/bobbygarcia/i18n/config";
import { getBgMessages } from "@/lib/bobbygarcia/i18n/get-messages";
import { getBgLocale } from "@/lib/bobbygarcia/i18n/server";
import { BG_BASE_URL } from "@/lib/bobbygarcia/site";

export async function generateMetadata(): Promise<Metadata> {
  const locale = getBgLocale();
  const m = getBgMessages(locale);

  return {
    metadataBase: new URL(BG_BASE_URL),
    title: {
      default: m.meta.siteName,
      template: m.meta.titleTemplate,
    },
    robots: { index: true, follow: true },
    alternates: {
      languages: {
        en: BG_BASE_URL,
        es: `${BG_BASE_URL}/es`,
      },
    },
  };
}

export default function BobbyGarciaLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = getBgLocale();
  const messages = getBgMessages(locale);

  return (
    <BgLocaleProvider locale={locale} messages={messages}>
      <div
        lang={bgLocaleHtmlLang(locale)}
        className="min-h-screen bg-[#0a1220] text-[#e8edf4] antialiased"
      >
        <BgHeader />
        <main>{children}</main>
        <GeoAutoFaqInjector />
        <BgFooter />
      </div>
    </BgLocaleProvider>
  );
}
