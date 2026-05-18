import type { Metadata } from "next";
import { SurvivalGuideDisclaimer } from "@/components/SurvivalGuideDisclaimer";
import { SurvivalGuideHeader } from "@/components/accidentsurvivalguide/SurvivalGuideHeader";
import { SurvivalGuideFooter } from "@/components/accidentsurvivalguide/SurvivalGuideFooter";
import { AsgJsonLd } from "@/components/accidentsurvivalguide/AsgJsonLd";
import { ASG_BASE_URL, ASG_SITE_NAME } from "@/lib/accidentsurvivalguide";

export const metadata: Metadata = {
  metadataBase: new URL(ASG_BASE_URL),
  title: {
    default: `${ASG_SITE_NAME} | What To Do After a Car Crash`,
    template: `%s | ${ASG_SITE_NAME}`,
  },
  description:
    "Free, calm educational guide for what to do after a car accident. Operated by WreckMatch LLC — not a law firm.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: ASG_BASE_URL,
    siteName: ASG_SITE_NAME,
    title: `${ASG_SITE_NAME} | What To Do After a Car Crash`,
    description:
      "Step-by-step help for the first 24 hours after a crash. Free Survival Guide PDF from WreckMatch LLC.",
  },
  robots: { index: true, follow: true },
};

export default function AccidentSurvivalGuideLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-[#f8fbfd] text-[#1a3a52] antialiased">
      <AsgJsonLd includeFaq />
      <SurvivalGuideDisclaimer />
      <SurvivalGuideHeader />
      <main>{children}</main>
      <SurvivalGuideFooter />
    </div>
  );
}
