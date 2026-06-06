import type { Metadata } from "next";
import { AsgJsonLd } from "@/components/accidentsurvivalguide/AsgJsonLd";
import { WebinarPageHero } from "@/components/accidentsurvivalguide/WebinarPageHero";
import { getMessages } from "@/lib/i18n/get-messages";
import { getAsgLocale } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const w = getMessages(getAsgLocale()).webinarForm;
  return { title: w.metaTitle, description: w.metaDescription };
}

export default function WebinarPage() {
  const w = getMessages(getAsgLocale()).webinarForm;

  return (
    <div className="bg-asg-page">
      <AsgJsonLd pageTitle={w.metaTitle} pageDescription={w.metaDescription} />
      <WebinarPageHero />
    </div>
  );
}
