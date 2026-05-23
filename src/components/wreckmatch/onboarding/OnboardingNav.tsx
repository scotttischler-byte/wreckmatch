"use client";

import { WmButton } from "@/components/wreckmatch/ui/WmPrimitives";
import { TOTAL_STEPS } from "@/lib/wreckmatch/context/OnboardingProvider";

type OnboardingNavProps = {
  step: number;
  canContinue: boolean;
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
};

export function OnboardingNav({
  step,
  canContinue,
  onBack,
  onNext,
  nextLabel = "Continue",
}: OnboardingNavProps) {
  return (
    <div className="mt-8 flex items-center gap-3">
      {step > 1 ? (
        <WmButton type="button" variant="outline" className="flex-1" onClick={onBack}>
          Back
        </WmButton>
      ) : (
        <div className="flex-1" />
      )}
      <WmButton
        type="button"
        className="flex-[2]"
        disabled={!canContinue}
        onClick={onNext}
      >
        {step === TOTAL_STEPS ? "Finish" : nextLabel}
      </WmButton>
    </div>
  );
}
