import Link from "next/link";
import { CheckCircle2, Heart } from "lucide-react";
import { WmButton, WmCard } from "@/components/wreckmatch/ui/WmPrimitives";
import { wm } from "@/lib/wreckmatch/theme";

export default function IntroRequestedPage() {
  return (
    <main className={wm.page}>
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="inline-flex size-16 items-center justify-center rounded-full bg-[#006D77]/10 text-[#006D77]">
          <CheckCircle2 className="size-8" aria-hidden />
        </div>
        <h1 className="mt-6 text-2xl font-semibold text-[#2B2B2B]">
          We received your request
        </h1>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#5C5C5C]">
          Thank you for trusting us. Someone from our team will reach out gently —
          only when you&apos;re ready. There is no pressure and no obligation.
        </p>

        <WmCard className="mt-8 w-full max-w-md text-left">
          <p className="flex items-start gap-2 text-sm text-[#5C5C5C]">
            <Heart className="mt-0.5 size-4 shrink-0 text-[#FF8C42]" aria-hidden />
            In the meantime, the community and support resources are always here for
            you.
          </p>
        </WmCard>

        <div className="mt-8 flex w-full max-w-md flex-col gap-3">
          <Link href="/help">
            <WmButton type="button" className="w-full">
              Support resources
            </WmButton>
          </Link>
          <Link href="/home">
            <WmButton type="button" variant="outline" className="w-full">
              Back to home
            </WmButton>
          </Link>
        </div>
      </div>
    </main>
  );
}
