import type { InjuryOption, WreckType } from "@/lib/wreckmatch/site";

export type Profile = {
  id: string;
  display_name: string | null;
  anonymous_mode: boolean;
  wreck_type: WreckType | null;
  injuries: InjuryOption[];
  state: string | null;
  accident_date: string | null;
  story: string | null;
  mood_checkin: number | null;
  created_at: string;
};

export type OnboardingData = {
  wreckType: WreckType | null;
  injuries: InjuryOption[];
  state: string | null;
  accidentDate: string | null;
  story: string;
  moodCheckin: number | null;
};

export const emptyOnboardingData = (): OnboardingData => ({
  wreckType: null,
  injuries: [],
  state: null,
  accidentDate: null,
  story: "",
  moodCheckin: null,
});
