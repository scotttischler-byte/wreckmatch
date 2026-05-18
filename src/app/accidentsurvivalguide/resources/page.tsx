import type { Metadata } from "next";
import Link from "next/link";
import { SurvivalGuideDownloadForm } from "@/components/accidentsurvivalguide/SurvivalGuideDownloadForm";
import { getLocalizedResources } from "@/lib/i18n/resources";
import { getMessages } from "@/lib/i18n/get-messages";
import { localizeHref } from "@/lib/i18n/locale-path";
import { getAsgLocale } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const m = getMessages(getAsgLocale()).resources;
  return { title: m.metaTitle, description: m.metaDescription };
}

export default function ResourcesPage() {
  const locale = getAsgLocale();
  const r = getMessages(locale).resources;
  const resources = getLocalizedResources(locale);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <h1 className="font-serif text-4xl font-semibold text-[#1a3a52]">{r.title}</h1>
      <p className="mt-4 max-w-2xl text-[#5b6b7f] leading-relaxed">{r.pageIntroEducational}</p>

      <ul className="mt-12 grid gap-4 sm:grid-cols-2">
        {resources.map((resource) => (
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
                href={localizeHref(resource.href, locale)}
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

      <p className="mt-10">
        <Link
          href={localizeHref("/", locale)}
          className="text-sm font-medium text-[#2a7a9b] underline underline-offset-2"
        >
          {r.back}
        </Link>
      </p>
    </div>
  );
}
