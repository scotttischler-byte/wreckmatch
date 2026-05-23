"use client";

import { useEffect, useRef } from "react";
import { saveOnboardingProfile } from "@/lib/wreckmatch/actions/auth";
import { useAuth } from "@/lib/wreckmatch/context/AuthProvider";
import { useOnboarding } from "@/lib/wreckmatch/context/OnboardingProvider";

export function OnboardingPersist() {
  const { user } = useAuth();
  const { data } = useOnboarding();
  const savedRef = useRef(false);

  useEffect(() => {
    if (!user || !data.wreckType || savedRef.current) return;

    savedRef.current = true;
    void saveOnboardingProfile(data);
  }, [user, data]);

  return null;
}
