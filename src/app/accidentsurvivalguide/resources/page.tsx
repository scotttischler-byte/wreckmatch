import type { Metadata } from "next";
import Link from "next/link";
import { ASG_RESOURCES } from "@/lib/accidentsurvivalguide";
import { SurvivalGuideDownloadForm } from "@/components/accidentsurvivalguide/SurvivalGuideDownloadForm";

export const metadata: Metadata = {
  title: "Free Resources",
  description:
    "Free accident guides, checklists, and state-specific educational resources from Accident Survival Guide.",
};

export default function ResourcesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <h1 className="font-serif text-4xl font-semibold text-[#1a3a52]">Free resources</h1>
      <p className="mt-4 max-w-2xl text-[#5b6b7f] leading-relaxed">
        Educational materials to help after a car crash. Not legal advice—general information only.
      </p>

      <ul className="mt-12 grid gap-4 sm:grid-cols-2">
        {ASG_RESOURCES.map((resource) => (
          <li key={resource.href + resource.title}>
            {resource.external ? (
              <a
                href={resource.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full rounded-xl border border-[#c5dce8] bg-white p-6 transition hover:border-[#2a7a9b]/40"
              >
                <h2 className="font-semibold text-[#1a3a52]">{resource.title}</h2>
                <p className="mt-2 text-sm text-[#5b6b7f]">{resource.description}</p>
              </a>
            ) : (
              <Link
                href={resource.href}
                className="block h-full rounded-xl border border-[#c5dce8] bg-white p-6 transition hover:border-[#2a7a9b]/40"
              >
                <h2 className="font-semibold text-[#1a3a52]">{resource.title}</h2>
                <p className="mt-2 text-sm text-[#5b6b7f]">{resource.description}</p>
              </Link>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-16 max-w-xl">
        <SurvivalGuideDownloadForm />
      </div>
    </div>
  );
}
