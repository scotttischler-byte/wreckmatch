import type { AttorneyRecord } from "@/lib/bobbygarcia/attorneys";
import type { BgAttorneyMessages } from "@/lib/bobbygarcia/i18n/messages/en";
import { AttorneyPortrait } from "@/components/bobbygarcia/AttorneyPortrait";

type AttorneyCardProps = {
  attorney: AttorneyRecord;
  copy: BgAttorneyMessages;
};

export function AttorneyCard({ attorney, copy }: AttorneyCardProps) {
  return (
    <article className="flex h-full flex-col rounded-xl border border-[#c9a227]/20 bg-[#0f1c2e] p-6 transition hover:border-[#c9a227]/45">
      <div className="flex flex-col items-center text-center">
        <AttorneyPortrait name={copy.name} initials={attorney.initials} image={attorney.image} />
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#c9a227]">
          {copy.role}
        </p>
        <h3 className="mt-2 font-serif text-xl font-semibold text-white">{copy.name}</h3>
      </div>
      <blockquote className="mt-5 flex-1">
        <p className="text-sm italic leading-relaxed text-[#b8c4d4]">
          &ldquo;{copy.quote}&rdquo;
        </p>
      </blockquote>
    </article>
  );
}
