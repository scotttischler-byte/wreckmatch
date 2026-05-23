"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { OnboardingNav } from "@/components/wreckmatch/onboarding/OnboardingNav";
import { OnboardingProgress } from "@/components/wreckmatch/onboarding/OnboardingProgress";
import { SelectChip } from "@/components/wreckmatch/onboarding/SelectChip";
import { WmInput, WmTextarea } from "@/components/wreckmatch/ui/WmPrimitives";
import { saveOnboardingProfile } from "@/lib/wreckmatch/actions/auth";
import {
  TOTAL_STEPS,
  useOnboarding,
} from "@/lib/wreckmatch/context/OnboardingProvider";
import { useAuth } from "@/lib/wreckmatch/context/AuthProvider";
import { US_STATES } from "@/lib/accidentsurvivalguide";
import {
  INJURY_OPTIONS,
  MOOD_OPTIONS,
  WRECK_TYPES,
  type InjuryOption,
  type WreckType,
} from "@/lib/wreckmatch/site";
import { wm } from "@/lib/wreckmatch/theme";

export function OnboardingWizard() {
  const router = useRouter();
  const { user } = useAuth();
  const { data, step, setStep, updateData } = useOnboarding();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canContinue = (() => {
    if (step === 1) return data.wreckType !== null;
    if (step === 2) return data.injuries.length > 0;
    if (step === 3) return Boolean(data.state && data.accidentDate);
    if (step === 5) return data.moodCheckin !== null;
    return true;
  })();

  const toggleInjury = (injury: InjuryOption) => {
    const next = data.injuries.includes(injury)
      ? data.injuries.filter((item) => item !== injury)
      : [...data.injuries, injury];
    updateData({ injuries: next });
  };

  const handleNext = async () => {
    if (!canContinue) return;

    if (step < TOTAL_STEPS) {
      setStep(step + 1);
      return;
    }

    setSaving(true);
    setError(null);
    const result = await saveOnboardingProfile(data);
    setSaving(false);

    if (result.ok === false && result.error) {
      setError(result.error);
      return;
    }

    router.push(user ? "/home" : "/signup");
  };

  return (
    <div className={wm.page}>
      <OnboardingProgress step={step} />

      {step === 1 && (
        <section>
          <h1 className={wm.heading}>What kind of wreck was it?</h1>
          <p className={`mt-2 ${wm.subheading}`}>
            There is no wrong answer. This helps us connect you with people who understand.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {WRECK_TYPES.map((type) => (
              <SelectChip
                key={type}
                label={type}
                selected={data.wreckType === type}
                onClick={() => updateData({ wreckType: type as WreckType })}
              />
            ))}
          </div>
        </section>
      )}

      {step === 2 && (
        <section>
          <h1 className={wm.heading}>What injuries are you navigating?</h1>
          <p className={`mt-2 ${wm.subheading}`}>
            Select all that apply. Your pain is valid, visible or not.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {INJURY_OPTIONS.map((injury) => (
              <SelectChip
                key={injury}
                label={injury}
                selected={data.injuries.includes(injury)}
                onClick={() => toggleInjury(injury)}
              />
            ))}
          </div>
        </section>
      )}

      {step === 3 && (
        <section>
          <h1 className={wm.heading}>Where and when did it happen?</h1>
          <p className={`mt-2 ${wm.subheading}`}>
            An approximate date is fine. You can update this later.
          </p>
          <div className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#2B2B2B]">State</span>
              <select
                className={wm.input}
                value={data.state ?? ""}
                onChange={(event) => updateData({ state: event.target.value || null })}
              >
                <option value="">Select a state</option>
                {US_STATES.map((state) => (
                  <option key={state.value} value={state.value}>
                    {state.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#2B2B2B]">
                Approximate accident date
              </span>
              <WmInput
                type="date"
                value={data.accidentDate ?? ""}
                onChange={(event) =>
                  updateData({ accidentDate: event.target.value || null })
                }
              />
            </label>
          </div>
        </section>
      )}

      {step === 4 && (
        <section>
          <h1 className={wm.heading}>Share your story, if you&apos;d like</h1>
          <p className={`mt-2 ${wm.subheading}`}>
            This is optional. Share only what feels safe right now.
          </p>
          <WmTextarea
            className="mt-6"
            placeholder="What happened, how you're feeling, or what support would help..."
            value={data.story}
            onChange={(event) => updateData({ story: event.target.value })}
          />
        </section>
      )}

      {step === 5 && (
        <section>
          <h1 className={wm.heading}>How are you feeling today?</h1>
          <p className={`mt-2 ${wm.subheading}`}>
            However you feel is okay. Healing is not a straight line.
          </p>
          <div className="mt-6 space-y-3">
            {MOOD_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => updateData({ moodCheckin: option.value })}
                className={`block w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
                  data.moodCheckin === option.value
                    ? "border-[#006D77] bg-[#006D77]/10 text-[#006D77]"
                    : "border-[#006D77]/15 bg-white text-[#2B2B2B] hover:border-[#006D77]/30"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <p className="mt-8 rounded-2xl bg-[#2A9D8F]/10 px-4 py-4 text-sm leading-relaxed text-[#2B2B2B]">
            You showed up for yourself today. That matters. WreckMatch is here when you need
            connection, not pressure.
          </p>
        </section>
      )}

      {error && (
        <p className="mt-4 rounded-xl bg-[#FF8C42]/10 px-4 py-3 text-sm text-[#8a4b1a]">
          {error}
        </p>
      )}

      <OnboardingNav
        step={step}
        canContinue={canContinue && !saving}
        onBack={() => setStep(step - 1)}
        onNext={handleNext}
      />
    </div>
  );
}
