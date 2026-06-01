import type { AttorneyRecord } from "@/lib/bobbygarcia/attorneys";
import type { BgAttorneyMessages } from "@/lib/bobbygarcia/i18n/messages/en";
import { AttorneyPortrait } from "@/components/bobbygarcia/AttorneyPortrait";

type FeaturedAttorneyProps = {
  attorney: AttorneyRecord;
  copy: BgAttorneyMessages;
  featuredLabel: string;
};

export function FeaturedAttorney({ attorney, copy, featuredLabel }: FeaturedAttorneyProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-[#c9a227]/25 bg-gradient-to-br from-[#111d32] to-[#0a1220] p-8 sm:p-12">
      <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:gap-12">
        <AttorneyPortrait
          name={copy.name}
          initials={attorney.initials}
          image={attorney.image}
          featured
        />
        <div className="flex-1 text-center lg:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c9a227]">
            {featuredLabel}
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold text-white sm:text-4xl">
            {copy.name}
          </h2>
          <p className="mt-1 text-sm font-medium text-[#8fa3bc]">{copy.role}</p>
          {copy.bio ? (
            <p className="mt-4 text-sm leading-relaxed text-[#b8c4d4]">{copy.bio}</p>
          ) : null}
          <blockquote className="mt-6 border-l-2 border-[#c9a227] pl-5 text-left">
            <p className="font-serif text-lg italic leading-relaxed text-white/95 sm:text-xl">
              &ldquo;{copy.quote}&rdquo;
            </p>
          </blockquote>
          <p className="mt-6 text-sm font-semibold text-[#c9a227]">{copy.meetLabel} →</p>
        </div>
      </div>
    </section>
  );
}
