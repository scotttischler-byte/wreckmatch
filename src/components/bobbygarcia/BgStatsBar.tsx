"use client";

import { useBgLocale } from "@/components/bobbygarcia/BgLocaleProvider";

export function BgStatsBar({ guideCount }: { guideCount: number }) {
  const { locale } = useBgLocale();
  const es = locale === "es";

  const STATS = [
    { valueEn: "35+", valueEs: "35+", labelEn: "Years Experience", labelEs: "Años de Experiencia" },
    { valueEn: "Bilingual", valueEs: "Bilingüe", labelEn: "English & Español", labelEs: "Inglés y Español" },
    { valueEn: "24/7", valueEs: "24/7", labelEn: "Always Available", labelEs: "Siempre Disponible" },
    { valueEn: String(guideCount), valueEs: String(guideCount), labelEn: "Legal Guides", labelEs: "Guías Legales" },
    { valueEn: "2", valueEs: "2", labelEn: "Texas Offices", labelEs: "Oficinas en Texas" },
    { valueEn: "4.7★", valueEs: "4.7★", labelEn: "Google Rating", labelEs: "Calificación Google" },
  ];

  return (
    <div className="border-y border-[#c9a227]/20 bg-[#0f1c2e]">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px bg-[#c9a227]/10 sm:grid-cols-3 lg:grid-cols-6">
        {STATS.map((s) => (
          <div key={s.labelEn} className="bg-[#0f1c2e] px-4 py-6 text-center">
            <p className="font-serif text-2xl font-semibold text-[#c9a227] sm:text-3xl">
              {es ? s.valueEs : s.valueEn}
            </p>
            <p className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-[#8fa3bc] sm:text-xs">
              {es ? s.labelEs : s.labelEn}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
