"use client";

import { TOTAL_STEPS } from "@/lib/wreckmatch/context/OnboardingProvider";

type OnboardingProgressProps = {
  step: number;
};

export function OnboardingProgress({ step }: OnboardingProgressProps) {
  const value = (step / TOTAL_STEPS) * 100;

  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center justify-between text-sm text-[#5C5C5C]">
        <span>
          Step {step} of {TOTAL_STEPS}
        </span>
        <span>{Math.round(value)}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-[#006D77]/10">
        <div
          className="h-full rounded-full bg-[#006D77] transition-all duration-300"
          style={{ width: `${value}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
