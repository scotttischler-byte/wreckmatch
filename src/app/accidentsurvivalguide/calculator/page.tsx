import type { Metadata } from "next";
import { CompensationCalculator } from "@/components/accidentsurvivalguide/CompensationCalculator";
import { getMessages } from "@/lib/i18n/get-messages";
import { getAsgLocale } from "@/lib/i18n/server";
import { ASG_BASE_URL } from "@/lib/accidentsurvivalguide";

export async function generateMetadata(): Promise<Metadata> {
  const c = getMessages(getAsgLocale()).calculator;
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    openGraph: {
      title: c.metaTitle,
      description: c.metaDescription,
      url: `${ASG_BASE_URL}/calculator`,
    },
    alternates: {
      canonical: `${ASG_BASE_URL}/calculator`,
    },
  };
}

export default function CalculatorPage() {
  return <CompensationCalculator />;
}
