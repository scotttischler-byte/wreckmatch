import type { Metadata } from "next";
import Link from "next/link";
import { Download, MessageCircle, Scale } from "lucide-react";
import { SurvivalGuideDisclaimer } from "@/components/SurvivalGuideDisclaimer";
import { SURVIVAL_GUIDE_PDF, WRECKMATCH_URL } from "@/lib/accidentsurvivalguide";

export const metadata: Metadata = {
  title: "Thank You",
  description: "Your free Accident Survival Guide is on the way.",
};

export default function ThankYouPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="rounded-2xl border border-[#c5dce8] bg-white p-8 text-center shadow-sm sm:p-12">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#e8f4fa] text-[#2a7a9b]">
          <Download className="size-7" aria-hidden />
        </div>
        <h1 className="mt-6 font-serif text-3xl font-semibold text-[#1a3a52]">
          Thank you — your guide is ready
        </h1>
        <p className="mt-4 text-[#5b6b7f] leading-relaxed">
          Your free Survival Guide should open in a new tab. If it didn&apos;t, you can download it
          again below. We&apos;ve also saved your request so our team can follow up if needed.
        </p>
        <a
          href={SURVIVAL_GUIDE_PDF}
          download
          className="mt-6 inline-flex rounded-full bg-[#2a7a9b] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#236884]"
        >
          Download PDF again
        </a>
      </div>

      <SurvivalGuideDisclaimer variant="compact" className="mt-8" />

      <div className="mt-10 space-y-4">
        <h2 className="text-center font-serif text-xl font-semibold text-[#1a3a52]">
          Need immediate help?
        </h2>

        <article className="flex gap-4 rounded-xl border border-[#c5dce8] bg-white p-6">
          <MessageCircle className="size-6 shrink-0 text-[#2a7a9b]" aria-hidden />
          <div>
            <h3 className="font-semibold text-[#1a3a52]">Talk to Sarah (24/7)</h3>
            <p className="mt-1 text-sm leading-relaxed text-[#5b6b7f]">
              Use the chat widget in the lower-right corner for educational support and next steps.
              Sarah can help you understand common post-accident questions—not legal advice.
            </p>
          </div>
        </article>

        <article className="flex gap-4 rounded-xl border border-[#c5dce8] bg-white p-6">
          <Scale className="size-6 shrink-0 text-[#5a9a82]" aria-hidden />
          <div>
            <h3 className="font-semibold text-[#1a3a52]">Free attorney match</h3>
            <p className="mt-1 text-sm leading-relaxed text-[#5b6b7f]">
              Get matched with a licensed attorney in your state through WreckMatch — free, no
              obligation. WreckMatch LLC is a legal referral service, not a law firm.
            </p>
            <a
              href={WRECKMATCH_URL}
              className="mt-3 inline-flex text-sm font-semibold text-[#2a7a9b] underline underline-offset-2"
              rel="noopener noreferrer"
            >
              Visit wreckmatch.com →
            </a>
          </div>
        </article>
      </div>

      <p className="mt-10 text-center">
        <Link href="/" className="text-sm font-medium text-[#2a7a9b] underline underline-offset-2">
          ← Back to homepage
        </Link>
      </p>
    </section>
  );
}
