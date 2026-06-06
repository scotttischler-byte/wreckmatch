import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Free Masterclass",
  robots: { index: false, follow: false },
};

/** Legacy short link → on-site webinar signup (separate GHL channel). */
export default function MasterclassRedirectPage() {
  redirect("/webinar");
}
