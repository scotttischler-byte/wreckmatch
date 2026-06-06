import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { WebinarThankYou } from "@/components/accidentsurvivalguide/WebinarThankYou";
import { getMessages } from "@/lib/i18n/get-messages";
import { localizeHref } from "@/lib/i18n/locale-path";
import { getAsgLocale } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const w = getMessages(getAsgLocale()).webinarForm;
  return {
    title: w.thankYouMetaTitle,
    description: w.thankYouMetaDescription,
    robots: { index: false, follow: false },
  };
}

type PageProps = {
  searchParams: Promise<{
    email?: string;
    firstName?: string;
  }>;
};

export default async function WebinarThankYouPage({ searchParams }: PageProps) {
  const locale = getAsgLocale();
  const params = await searchParams;
  const email = params.email?.trim();

  if (!email) {
    redirect(localizeHref("/webinar", locale));
  }

  return <WebinarThankYou email={email} firstName={params.firstName} />;
}
