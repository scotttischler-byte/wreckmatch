"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  emptyOnboardingData,
  type OnboardingData,
} from "@/lib/wreckmatch/models/profile";

type OnboardingContextValue = {
  data: OnboardingData;
  step: number;
  setStep: (step: number) => void;
  updateData: (patch: Partial<OnboardingData>) => void;
  reset: () => void;
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

const TOTAL_STEPS = 5;

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<OnboardingData>(emptyOnboardingData);
  const [step, setStep] = useState(1);

  const updateData = (patch: Partial<OnboardingData>) => {
    setData((current) => ({ ...current, ...patch }));
  };

  const reset = () => {
    setData(emptyOnboardingData());
    setStep(1);
  };

  const value = useMemo(
    () => ({ data, step, setStep, updateData, reset }),
    [data, step],
  );

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within OnboardingProvider");
  }
  return context;
}

export { TOTAL_STEPS };
