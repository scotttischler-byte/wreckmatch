import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ThankYouSuccess } from "@/components/accidentsurvivalguide/ThankYouSuccess";
import { getMessages } from "@/lib/i18n/get-messages";
import { localizeHref } from "@/lib/i18n/locale-path";
import { getAsgLocale } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = getMessages(getAsgLocale()).thankYou;
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    robots: { index: false, follow: false },
  };
}

type PageProps = {
  searchParams: Promise<{
    email?: string;
    firstName?: string;
    state?: string;
    phone?: string;
    city?: string;
  }>;
};

export default async function ThankYouPage({ searchParams }: PageProps) {
  const locale = getAsgLocale();
  const params = await searchParams;
  const email = params.email?.trim();

  if (!email) {
    redirect(localizeHref("/", locale));
  }

  return (
    <ThankYouSuccess
      email={email}
      firstName={params.firstName}
      state={params.state}
      phone={params.phone}
      city={params.city}
    />
  );
}
