"use client";

import Link from "next/link";
import { useState } from "react";
import { WmButton, WmInput } from "@/components/wreckmatch/ui/WmPrimitives";
import { createClientSafe } from "@/lib/wreckmatch/supabase/client";
import { AUTH_DISCLAIMER } from "@/lib/wreckmatch/site";
import { wm } from "@/lib/wreckmatch/theme";
import { signUpWithEmail } from "@/lib/wreckmatch/actions/auth";

export function SignUpForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleGoogleSignIn() {
    const supabase = createClientSafe();
    if (!supabase) {
      setError("Supabase is not configured yet. Add your env keys to .env.local.");
      return;
    }

    setLoading(true);
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/home`,
      },
    });
    setLoading(false);
    if (oauthError) setError(oauthError.message);
  }

  return (
    <div className="space-y-5">
      <p className="rounded-xl bg-[#006D77]/5 px-4 py-3 text-sm leading-relaxed text-[#5C5C5C]">
        {AUTH_DISCLAIMER}
      </p>

      <form
        action={async (formData) => {
          setError(null);
          setLoading(true);
          const result = await signUpWithEmail(formData);
          if (result?.error) {
            setError(result.error);
            setLoading(false);
          }
        }}
        className="space-y-4"
      >
        <label className="block">
          <span className="mb-2 block text-sm font-medium">First name or nickname</span>
          <WmInput name="displayName" type="text" autoComplete="nickname" />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium">Email</span>
          <WmInput name="email" type="email" required autoComplete="email" />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium">Password</span>
          <WmInput
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
          />
        </label>
        {error && (
          <p className="rounded-xl bg-[#FF8C42]/10 px-4 py-3 text-sm text-[#8a4b1a]">
            {error}
          </p>
        )}
        <WmButton type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </WmButton>
      </form>

      <div className="relative py-2 text-center text-sm text-[#5C5C5C]">
        <span className="bg-[#F8F5F2] px-3">or</span>
        <div className="absolute inset-x-0 top-1/2 -z-10 h-px bg-[#006D77]/10" />
      </div>

      <WmButton
        type="button"
        variant="outline"
        className="w-full"
        disabled={loading}
        onClick={handleGoogleSignIn}
      >
        Continue with Google
      </WmButton>

      <p className={`text-center text-sm ${wm.textMuted}`}>
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-[#006D77] hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
