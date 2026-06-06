import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { asgFunnelRedirectTarget } from "@/lib/asg-funnel-redirect";

export const metadata: Metadata = {
  title: "Free Masterclass",
  robots: { index: false, follow: false },
};

export default function MasterclassRedirectPage() {
  redirect(asgFunnelRedirectTarget("masterclass"));
}
