"use client";

import Image from "next/image";
import { BgLink } from "@/components/bobbygarcia/BgLink";
import { useBgLocale } from "@/components/bobbygarcia/BgLocaleProvider";
import { PRACTICE_AREAS } from "@/lib/bobbygarcia/practice-areas";

export function BgPracticeGrid({ limit }: { limit?: number }) {
  const { locale } = useBgLocale();
  const es = locale === "es";
  const areas = limit ? PRACTICE_AREAS.slice(0, limit) : PRACTICE_AREAS;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {areas.map((area) => (
        <BgLink
          key={area.slug}
          href={`/blog/${area.blogSlug}`}
          className="group overflow-hidden rounded-xl border border-[#c9a227]/20 bg-[#0f1c2e] transition hover:border-[#c9a227]/50"
        >
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image
              src={area.image}
              alt={es ? area.titleEs : area.titleEn}
              fill
              className="object-cover transition duration-300 group-hover:scale-105"
              sizes="400px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a1220] via-[#0a1220]/40 to-transparent" />
          </div>
          <div className="p-5">
            <h3 className="font-serif text-lg font-semibold text-white group-hover:text-[#c9a227]">
              {es ? area.titleEs : area.titleEn}
            </h3>
            <p className="mt-1 text-sm text-[#8fa3bc]">{es ? area.descEs : area.descEn}</p>
          </div>
        </BgLink>
      ))}
    </div>
  );
}
