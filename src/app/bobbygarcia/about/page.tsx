import type { Metadata } from "next";
import Image from "next/image";
import { BgLink } from "@/components/bobbygarcia/BgLink";
import { getBgMessages } from "@/lib/bobbygarcia/i18n/get-messages";
import { getBgLocale } from "@/lib/bobbygarcia/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = getBgLocale();
  const a = getBgMessages(locale).aboutPage;
  return { title: a.metaTitle, description: a.metaDescription };
}

export default function AboutPage() {
  const locale = getBgLocale();
  const a = getBgMessages(locale).aboutPage;

  return (
    <article className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c9a227]">{a.eyebrow}</p>
      <h1 className="mt-3 font-serif text-4xl font-semibold text-white">{a.title}</h1>
      <div className="mt-8 overflow-hidden rounded-2xl border border-[#c9a227]/25">
        <div className="relative aspect-[16/9]">
          <Image src="/bobbygarcia/hero/bobby-portrait.jpg" alt="Bobby Garcia" fill className="object-cover object-top" sizes="800px" />
        </div>
      </div>
      <div className="mt-8 space-y-5 text-lg leading-relaxed text-[#b8c4d4]">
        {a.paragraphs.map((p) => (
          <p key={p.slice(0, 40)}>{p}</p>
        ))}
      </div>
      <BgLink href="/meet-our-attorneys" className="mt-10 inline-block font-semibold text-[#c9a227]">
        {a.meetTeam} →
      </BgLink>
    </article>
  );
}
