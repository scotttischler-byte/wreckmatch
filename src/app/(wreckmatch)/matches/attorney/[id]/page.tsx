import Link from "next/link";
import { notFound } from "next/navigation";
import { LegalDisclaimerBanner } from "@/components/wreckmatch/LegalDisclaimerBanner";
import { WmButton, WmCard } from "@/components/wreckmatch/ui/WmPrimitives";
import { getAttorneyById } from "@/lib/wreckmatch/data/sample-attorneys";
import { wm } from "@/lib/wreckmatch/theme";

type AttorneyDetailPageProps = {
  params: { id: string };
};

export default function AttorneyDetailPage({ params }: AttorneyDetailPageProps) {
  const attorney = getAttorneyById(params.id);
  if (!attorney) notFound();

  return (
    <>
      <LegalDisclaimerBanner />
      <main className={wm.page}>
        <Link href="/matches" className="text-sm font-medium text-[#006D77] hover:underline">
          ← Back to matches
        </Link>

        <WmCard className="mt-6">
          <h1 className="text-2xl font-semibold text-[#2B2B2B]">{attorney.name}</h1>
          <p className="mt-2 text-sm text-[#5C5C5C]">
            {attorney.location} · {attorney.state}
          </p>
          <p className="mt-5 text-sm leading-relaxed text-[#2B2B2B]">{attorney.bio}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {attorney.practice_areas.map((area) => (
              <span
                key={area}
                className="rounded-full bg-[#006D77]/8 px-3 py-1 text-xs font-medium text-[#006D77]"
              >
                {area}
              </span>
            ))}
          </div>
        </WmCard>

        <LegalDisclaimerBanner variant="compact" className="mt-6" />

        <div className="mt-6 space-y-3">
          <WmButton type="button" className="w-full" disabled>
            Request intro (coming soon)
          </WmButton>
          <p className="text-center text-xs leading-relaxed text-[#5C5C5C]">
            This is informational only. WreckMatch does not guarantee outcomes or endorse
            any specific attorney.
          </p>
        </div>
      </main>
    </>
  );
}
