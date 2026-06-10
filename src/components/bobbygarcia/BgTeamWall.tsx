"use client";

import { BgLink } from "@/components/bobbygarcia/BgLink";
import { BgTeamMemberCard } from "@/components/bobbygarcia/BgTeamMemberCard";
import { useBgLocale } from "@/components/bobbygarcia/BgLocaleProvider";
import { TEAM, TEAM_STATS } from "@/lib/bobbygarcia/team";

export function BgTeamWall() {
  const { locale } = useBgLocale();
  const es = locale === "es";

  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {TEAM.map((member) => (
        <BgTeamMemberCard
          key={member.slug}
          member={member}
          role={es ? member.roleEs : member.roleEn}
          compact
        />
      ))}
    </div>
  );
}

export function BgTeamWallSection() {
  const { locale } = useBgLocale();
  const es = locale === "es";

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c9a227]">
            {es ? "Nuestro equipo" : "Our team"}
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold text-white sm:text-4xl">
            {es
              ? `${TEAM_STATS.members} profesionales dedicados a su caso`
              : `${TEAM_STATS.members} professionals dedicated to your case`}
          </h2>
          <p className="mt-3 max-w-2xl text-[#b8c4d4]">
            {es
              ? "Abogados litigantes, analistas legales, especialistas médicos y paralegales — un equipo completo, no solo un abogado."
              : "Trial attorneys, legal analysts, medical specialists, and paralegals — a full team, not just one lawyer."}
          </p>
        </div>
        <BgLink href="/meet-our-attorneys" className="shrink-0 text-sm font-semibold text-[#c9a227]">
          {es ? "Conozca al equipo →" : "Meet the team →"}
        </BgLink>
      </div>
      <div className="mt-10">
        <BgTeamWall />
      </div>
    </section>
  );
}
