"use client";

import { useEffect, useMemo, useState } from "react";
import { WmButton } from "@/components/wreckmatch/ui/WmPrimitives";
import { useWmLocale } from "@/lib/wreckmatch/context/WmLocaleProvider";

const STEP_KEYS = ["breatheIn", "hold", "breatheOut", "rest"] as const;
const STEP_DURATIONS = [4, 4, 6, 2] as const;
const STEP_SCALES = ["scale-110", "scale-110", "scale-90", "scale-100"] as const;

export function GroundingExercise() {
  const { messages } = useWmLocale();
  const t = messages.grounding;
  const steps = useMemo(
    () =>
      STEP_KEYS.map((key, index) => ({
        label: t[key],
        duration: STEP_DURATIONS[index],
        scale: STEP_SCALES[index],
      })),
    [t],
  );

  const [active, setActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (!active) return;

    const step = steps[stepIndex];
    const timer = window.setTimeout(() => {
      const next = stepIndex + 1;
      if (next >= steps.length) {
        const nextCycle = cycle + 1;
        if (nextCycle >= 3) {
          setActive(false);
          setStepIndex(0);
          setCycle(0);
          return;
        }
        setCycle(nextCycle);
        setStepIndex(0);
      } else {
        setStepIndex(next);
      }
    }, step.duration * 1000);

    return () => window.clearTimeout(timer);
  }, [active, stepIndex, cycle, steps]);

  const current = steps[stepIndex];

  return (
    <div className="overflow-hidden rounded-3xl border border-[#006D77]/12 bg-gradient-to-br from-white to-[#F8F5F2] shadow-[0_8px_30px_-12px_rgba(0,109,119,0.18)]">
      <div className="border-b border-[#006D77]/8 px-5 py-5 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#006D77]">
          {t.title}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-[#5C5C5C]">{t.description}</p>
      </div>

      <div className="flex flex-col items-center px-5 py-6 sm:px-6">
        <div
          className={`flex size-28 items-center justify-center rounded-full bg-[#006D77]/10 transition-transform duration-[4000ms] ease-in-out ${active ? current.scale : "scale-100"}`}
          aria-hidden
        >
          <div className="size-16 rounded-full bg-[#006D77]/25" />
        </div>
        <p className="mt-5 text-lg font-medium text-[#2B2B2B]">
          {active ? current.label : t.ready}
        </p>
        {active && (
          <p className="mt-1 text-xs text-[#5C5C5C]">
            {t.breathOf.replace("{current}", String(cycle + 1)).replace("{total}", "3")}
          </p>
        )}
      </div>

      <div className="border-t border-[#006D77]/8 px-5 pb-5 pt-2 sm:px-6">
        <WmButton
          type="button"
          variant={active ? "outline" : "primary"}
          size="xl"
          className="w-full"
          onClick={() => {
            if (active) {
              setActive(false);
              setStepIndex(0);
              setCycle(0);
            } else {
              setActive(true);
              setStepIndex(0);
              setCycle(0);
            }
          }}
        >
          {active ? t.stop : t.start}
        </WmButton>
      </div>
    </div>
  );
}
