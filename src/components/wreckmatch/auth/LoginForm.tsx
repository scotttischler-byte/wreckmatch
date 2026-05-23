"use client";

import Link from "next/link";
import { useState } from "react";
import { WmButton, WmInput } from "@/components/wreckmatch/ui/WmPrimitives";
import { createClientSafe } from "@/lib/wreckmatch/supabase/client";
import { AUTH_DISCLAIMER } from "@/lib/wreckmatch/site";
import { wm } from "@/lib/wreckmatch/theme";
import { signInWithEmail } from "@/lib/wreckmatch/actions/auth";

type LoginFormProps = {
  nextPath?: string;
};

export function LoginForm({ nextPath = "/home" }: LoginFormProps) {
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
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
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
          const result = await signInWithEmail(formData);
          if (result?.error) {
            setError(result.error);
            setLoading(false);
          }
        }}
        className="space-y-4"
      >
        <input type="hidden" name="next" value={nextPath} />
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
            autoComplete="current-password"
          />
        </label>
        {error && (
          <p className="rounded-xl bg-[#FF8C42]/10 px-4 py-3 text-sm text-[#8a4b1a]">
            {error}
          </p>
        )}
        <WmButton type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
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
        New here?{" "}
        <Link href="/signup" className="font-medium text-[#006D77] hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
