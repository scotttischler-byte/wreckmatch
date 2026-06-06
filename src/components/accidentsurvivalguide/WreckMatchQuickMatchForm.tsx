"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useAsgLocale } from "@/components/accidentsurvivalguide/AsgLocaleProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { US_STATES } from "@/lib/accidentsurvivalguide";
import { submitAsgLeadForm } from "@/lib/asg-form-submit";
import { trackAsgEvent } from "@/lib/analytics";

type DefaultValues = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  state?: string;
  city?: string;
};

export function WreckMatchQuickMatchForm({ defaultValues = {} }: { defaultValues?: DefaultValues }) {
  const { locale, messages } = useAsgLocale();
  const q = messages.thankYou;
  const f = messages.form;
  const [firstName, setFirstName] = useState(defaultValues.firstName ?? "");
  const [lastName, setLastName] = useState(defaultValues.lastName ?? "");
  const [email, setEmail] = useState(defaultValues.email ?? "");
  const [phone, setPhone] = useState(defaultValues.phone ?? "");
  const [state, setState] = useState(defaultValues.state ?? "");
  const [city, setCity] = useState(defaultValues.city ?? "");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await submitAsgLeadForm({
        firstName,
        lastName,
        email,
        phone,
        state,
        city: city.trim(),
        magnet_type: "attorney-match",
        form_name: "thank-you-attorney-match",
        consentEmail: true,
        consentSms: true,
        preferredLanguage: locale,
        lead_source: "accidentsurvivalguide-thank-you",
      });

      if (!data.success) {
        setError(data.message ?? q.networkError);
        return;
      }

      trackAsgEvent("wreckmatch_referral", { source: "thank_you_form" });
      setDone(true);
    } catch {
      setError(q.networkError);
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <p className="mt-6 rounded-lg border border-[#d4e8dc] bg-white p-4 text-sm text-[#5b6b7f]">
        {q.matchDone}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          required
          placeholder={q.formFirstName}
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="h-10 border-[#c5dce8] bg-white"
        />
        <Input
          placeholder={q.formLastName}
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="h-10 border-[#c5dce8] bg-white"
        />
      </div>
      <Input
        required
        type="email"
        placeholder={q.formEmail}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="h-10 border-[#c5dce8] bg-white"
      />
      <Input
        required
        type="tel"
        placeholder={q.formPhone}
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="h-10 border-[#c5dce8] bg-white"
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <select
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="h-10 w-full rounded-lg border border-[#c5dce8] bg-white px-3 text-sm"
          aria-label={q.formState}
        >
          <option value="">{q.formState}</option>
          {US_STATES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <Input
          required
          autoComplete="address-level2"
          placeholder={f.city}
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="h-10 border-[#c5dce8] bg-white"
        />
      </div>
      {error ? (
        <p className="text-sm text-[#b42318]" role="alert">
          {error}
        </p>
      ) : null}
      <Button
        type="submit"
        disabled={loading}
        className="h-11 w-full rounded-xl bg-[#5a9a82] text-sm font-semibold text-white hover:bg-[#4d8872]"
      >
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            {q.submitting}
          </>
        ) : (
          q.getMatch
        )}
      </Button>
    </form>
  );
}
