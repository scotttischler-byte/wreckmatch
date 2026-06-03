import type { Metadata } from "next";
import { BgPracticeGrid } from "@/components/bobbygarcia/BgPracticeGrid";
import { getBgMessages } from "@/lib/bobbygarcia/i18n/get-messages";
import { getBgLocale } from "@/lib/bobbygarcia/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = getBgLocale();
  const p = getBgMessages(locale).practicePage;
  return { title: p.metaTitle, description: p.metaDescription };
}

export default function PracticeAreasPage() {
  const locale = getBgLocale();
  const p = getBgMessages(locale).practicePage;

  return (
    <>
      <section className="border-b border-[#c9a227]/15 bg-gradient-to-b from-[#0f1c2e] to-[#0a1220]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c9a227]">{p.eyebrow}</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold text-white sm:text-5xl">{p.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-[#b8c4d4]">{p.intro}</p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <BgPracticeGrid />
      </section>
    </>
  );
}
