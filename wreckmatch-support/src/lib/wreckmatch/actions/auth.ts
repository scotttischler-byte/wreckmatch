"use server";

import { redirect } from "next/navigation";
import { WM } from "@/lib/wreckmatch/routes";
import { createClientSafe } from "@/lib/wreckmatch/supabase/server";
import type { OnboardingData } from "@/lib/wreckmatch/models/profile";

export async function signInWithEmail(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? WM.home);

  const supabase = await createClientSafe();
  if (!supabase) {
    return { error: "Supabase is not configured yet. Add your env keys to .env.local." };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };

  redirect(next.startsWith("/") ? next : WM.home);
}

export async function signUpWithEmail(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const displayName = String(formData.get("displayName") ?? "").trim();

  const supabase = await createClientSafe();
  if (!supabase) {
    return { error: "Supabase is not configured yet. Add your env keys to .env.local." };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName || "Survivor" },
    },
  });

  if (error) return { error: error.message };

  if (data.user) {
    await supabase.from("profiles").upsert({
      id: data.user.id,
      display_name: displayName || "Survivor",
      anonymous_mode: false,
    });
  }

  redirect(WM.home);
}

export async function signOutAction() {
  const supabase = await createClientSafe();
  if (supabase) await supabase.auth.signOut();
  redirect(WM.splash);
}

export async function saveOnboardingProfile(data: OnboardingData) {
  const supabase = await createClientSafe();
  if (!supabase) {
    return { ok: true, offline: true };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: true, pendingAuth: true };
  }

  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    wreck_type: data.wreckType,
    injuries: data.injuries,
    state: data.state,
    accident_date: data.accidentDate,
    story: data.story || null,
    mood_checkin: data.moodCheckin,
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function updateAnonymousMode(anonymousMode: boolean) {
  const supabase = await createClientSafe();
  if (!supabase) return { ok: false };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false };

  const { error } = await supabase
    .from("profiles")
    .update({ anonymous_mode: anonymousMode })
    .eq("id", user.id);

  return { ok: !error };
}
