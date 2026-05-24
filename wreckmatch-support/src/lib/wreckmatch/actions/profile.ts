"use server";

import { createClientSafe } from "@/lib/wreckmatch/supabase/server";
import type { Profile } from "@/lib/wreckmatch/models/profile";

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClientSafe();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !data) return null;
  return data as Profile;
}

export async function updateProfile(
  patch: Partial<
    Pick<
      Profile,
      | "display_name"
      | "anonymous_mode"
      | "wreck_type"
      | "injuries"
      | "state"
      | "accident_date"
      | "story"
      | "mood_checkin"
    >
  >,
) {
  const supabase = await createClientSafe();
  if (!supabase) return { ok: false, error: "Supabase not configured" };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in" };

  const { error } = await supabase
    .from("profiles")
    .update(patch)
    .eq("id", user.id);

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
