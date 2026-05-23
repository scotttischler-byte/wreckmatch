"use client";

import { Progress, ProgressIndicator, ProgressTrack } from "@/components/ui/progress";
import { TOTAL_STEPS } from "@/lib/wreckmatch/context/OnboardingProvider";

type OnboardingProgressProps = {
  step: number;
};

export function OnboardingProgress({ step }: OnboardingProgressProps) {
  const value = (step / TOTAL_STEPS) * 100;

  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center justify-between text-sm text-[#5C5C5C]">
        <span>Step {step} of {TOTAL_STEPS}</span>
        <span>{Math.round(value)}%</span>
      </div>
      <Progress value={value}>
        <ProgressTrack className="h-2 bg-[#006D77]/10">
          <ProgressIndicator className="bg-[#006D77]" />
        </ProgressTrack>
      </Progress>
    </div>
  );
}
