import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { asgFunnelRedirectTarget } from "@/lib/asg-funnel-redirect";

export const metadata: Metadata = {
  title: "Book a Call",
  robots: { index: false, follow: false },
};

export default function BookCallRedirectPage() {
  redirect(asgFunnelRedirectTarget("bookCall"));
}
