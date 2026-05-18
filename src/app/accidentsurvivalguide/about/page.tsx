import type { Metadata } from "next";
import Link from "next/link";
import { SurvivalGuideDownloadForm } from "@/components/accidentsurvivalguide/SurvivalGuideDownloadForm";
import { AsgJsonLd } from "@/components/accidentsurvivalguide/AsgJsonLd";

export const metadata: Metadata = {
  title: "About Scott's Story",
  description:
    "Why Scott created the free Accident Survival Guide after his own car wreck — an educational resource from WreckMatch LLC.",
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      <AsgJsonLd
        pageTitle="About Scott's Story"
        pageDescription="The personal story behind the Accident Survival Guide."
      />

      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#5b8fa8]">About</p>
      <h1 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.02em] text-[#1a3a52]">
        Why I built this guide
      </h1>

      <div className="mt-10 space-y-6 text-[#4a6578] leading-relaxed">
        <p>
          When I got in a car wreck, I had no idea what to do. Within hours, the insurance company
          was calling. I was in pain, trying to figure out medical appointments, and every
          conversation felt like it had stakes I didn&apos;t understand.
        </p>
        <p>
          I wasn&apos;t looking for a sales pitch—I needed a calm checklist. Something that told me
          what to do in the first 24 hours, what to document, and what mistakes to avoid while I was
          still overwhelmed.
        </p>
        <p>
          That experience is why I created the Accident Survival Guide. It&apos;s free, educational,
          and written in plain language. It is not legal advice, and it won&apos;t replace a licensed
          attorney when you need one—but it can help you breathe, organize, and take the next right
          step.
        </p>
        <p>
          AccidentSurvivalGuide.com is operated by{" "}
          <strong className="font-medium text-[#1a3a52]">WreckMatch LLC</strong>, a legal referral
          service. If you want help finding a licensed attorney in your state, you can also use{" "}
          <a
            href="https://www.wreckmatch.com"
            className="font-medium text-[#2a7a9b] underline underline-offset-2"
            rel="noopener noreferrer"
          >
            WreckMatch
          </a>{" "}
          at no obligation to you.
        </p>
        <p className="text-sm text-[#7a8a98]">
          — Scott
        </p>
      </div>

      <div className="mt-14">
        <SurvivalGuideDownloadForm />
      </div>

      <p className="mt-10">
        <Link href="/" className="text-sm font-medium text-[#2a7a9b] underline underline-offset-2">
          ← Back to homepage
        </Link>
      </p>
    </article>
  );
}
