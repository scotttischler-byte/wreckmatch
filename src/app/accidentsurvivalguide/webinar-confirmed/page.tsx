import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { asgFunnelRedirectTarget } from "@/lib/asg-funnel-redirect";

export const metadata: Metadata = {
  title: "Webinar Confirmed",
  robots: { index: false, follow: false },
};

export default function WebinarConfirmedRedirectPage() {
  redirect(asgFunnelRedirectTarget("webinarConfirmed"));
}
