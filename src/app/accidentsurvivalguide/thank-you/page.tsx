import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ThankYouSuccess } from "@/components/accidentsurvivalguide/ThankYouSuccess";

export const metadata: Metadata = {
  title: "Thank You – Your Guide is On the Way",
  description:
    "Your free Accident Survival Guide PDF has been sent. Explore optional next steps with Sarah or a free attorney match.",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Promise<{
    email?: string;
    firstName?: string;
    state?: string;
    phone?: string;
  }>;
};

export default async function ThankYouPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const email = params.email?.trim();

  if (!email) {
    redirect("/");
  }

  return (
    <ThankYouSuccess
      email={email}
      firstName={params.firstName}
      state={params.state}
      phone={params.phone}
    />
  );
}
