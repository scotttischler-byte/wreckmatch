"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { LegalDisclaimerBanner } from "@/components/wreckmatch/LegalDisclaimerBanner";
import { WmButton, WmInput, WmTextarea } from "@/components/wreckmatch/ui/WmPrimitives";
import { submitAttorneyIntro } from "@/lib/wreckmatch/actions/attorney-intro";
import { WM } from "@/lib/wreckmatch/routes";
import type { Profile } from "@/lib/wreckmatch/models/profile";
import { LEGAL_DISCLAIMER } from "@/lib/wreckmatch/site";

type AttorneyIntroFormProps = {
  attorneyId: string;
  attorneyName: string;
  profile: Profile | null;
  defaultFirstName?: string;
  defaultEmail?: string;
};

export function AttorneyIntroForm({
  attorneyId,
  attorneyName,
  profile,
  defaultFirstName = "",
  defaultEmail = "",
}: AttorneyIntroFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);

  const nameParts = (profile?.display_name ?? defaultFirstName).trim().split(/\s+/);
  const defaultFirst = nameParts[0] ?? "";
  const defaultLast = nameParts.slice(1).join(" ") ?? "";

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await submitAttorneyIntro({
        firstName: String(form.get("firstName") ?? ""),
        lastName: String(form.get("lastName") ?? ""),
        email: String(form.get("email") ?? ""),
        phone: String(form.get("phone") ?? ""),
        message: String(form.get("message") ?? ""),
        attorneyId,
        attorneyName,
        consent,
      });

      if (!result.ok) {
        setError(result.error ?? "Something went wrong. Please try again.");
        return;
      }

      router.push(WM.introRequested);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
      <LegalDisclaimerBanner variant="compact" text={LEGAL_DISCLAIMER} />

      <p className="text-sm leading-relaxed text-[#5C5C5C]">
        If and when you&apos;re ready, share a few details. Our team will reach out
        gently — no pressure, no obligation. You choose what happens next.
      </p>

      {profile?.wreck_type && (
        <p className="rounded-xl bg-[#006D77]/5 px-4 py-3 text-xs text-[#5C5C5C]">
          From your profile: {profile.wreck_type} wreck
          {profile.state ? ` · ${profile.state}` : ""}
          {profile.injuries.length ? ` · ${profile.injuries.slice(0, 2).join(", ")}` : ""}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-[#2B2B2B]">First name</span>
          <WmInput name="firstName" required defaultValue={defaultFirst} autoComplete="given-name" />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-[#2B2B2B]">Last name</span>
          <WmInput name="lastName" required defaultValue={defaultLast} autoComplete="family-name" />
        </label>
      </div>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-[#2B2B2B]">Email</span>
        <WmInput name="email" type="email" required defaultValue={defaultEmail} autoComplete="email" />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-[#2B2B2B]">Phone</span>
        <WmInput name="phone" type="tel" required autoComplete="tel" placeholder="(555) 555-5555" />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-[#2B2B2B]">
          Anything you&apos;d like us to know? <span className="font-normal text-[#5C5C5C]">(optional)</span>
        </span>
        <WmTextarea
          name="message"
          placeholder="Only share what feels comfortable..."
          defaultValue={profile?.story ?? ""}
        />
      </label>

      <label className="flex items-start gap-3 rounded-xl border border-[#006D77]/15 bg-[#F8F5F2] px-4 py-4">
        <input
          type="checkbox"
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
          className="mt-1 size-4 rounded border-[#006D77]/30 text-[#006D77]"
          required
        />
        <span className="text-xs leading-relaxed text-[#5C5C5C]">
          I understand WreckMatch is a referral service, not a law firm. This is not
          legal advice and does not create an attorney-client relationship. I consent
          to be contacted about a confidential introduction.
        </span>
      </label>

      {error && (
        <p className="rounded-xl bg-[#FF8C42]/10 px-4 py-3 text-sm text-[#8a4b1a]">{error}</p>
      )}

      <WmButton type="submit" className="w-full" size="lg" disabled={pending || !consent}>
        {pending ? "Sending..." : "Request a confidential intro"}
      </WmButton>

      <p className="text-center text-xs leading-relaxed text-[#5C5C5C]">
        You can change your mind at any time. We will never share your story without
        permission.
      </p>
    </form>
  );
}
