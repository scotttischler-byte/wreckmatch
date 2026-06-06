"use client";

import { useState } from "react";
import { Headphones, Loader2, PhoneCall } from "lucide-react";
import { useAsgLocale } from "@/components/accidentsurvivalguide/AsgLocaleProvider";
import { AsgAccidentIntakeFields } from "@/components/accidentsurvivalguide/AsgAccidentIntakeFields";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { US_STATES } from "@/lib/accidentsurvivalguide";
import {
  EMPTY_ASG_ACCIDENT_INTAKE,
  isAccidentIntakeComplete,
  type AsgAccidentIntake,
} from "@/lib/asg-intake";
import { submitAsgLeadForm } from "@/lib/asg-form-submit";
import { trackAsgEvent } from "@/lib/analytics";

const fieldClass =
  "h-12 w-full min-h-[48px] rounded-xl border border-[#f5d0a8] bg-white text-base text-[#1a3a52] shadow-sm placeholder:text-[#94a8b8] focus-visible:ring-2 focus-visible:ring-[#e8a04c]/60";

export function ExpertIntakeForm() {
  const { locale, messages, href } = useAsgLocale();
  const h = messages.home;
  const f = messages.form;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState("");
  const [intake, setIntake] = useState<AsgAccidentIntake>({
    ...EMPTY_ASG_ACCIDENT_INTAKE,
    preferredCallbackTime: "asap",
  });
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!consent) {
      setError(h.expertIntakeConsentRequired);
      return;
    }
    if (!isAccidentIntakeComplete(intake)) {
      setError(f.errors.intakeIncomplete);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await submitAsgLeadForm({
        firstName: firstName.trim(),
        lastName: lastName.trim() || ".",
        email: email.trim(),
        phone: phone.trim(),
        state,
        ...intake,
        magnet_type: "expert-intake-asap",
        form_name: "expert-intake-asap",
        consentEmail: true,
        consentSms: true,
        priority_intake: true,
        preferredLanguage: locale,
        lead_source: "accidentsurvivalguide-expert-intake-asap",
      });

      if (!data.success) {
        setError(data.message ?? h.expertIntakeError);
        return;
      }

      trackAsgEvent("expert_intake_asap_submit", {
        state: state || "unspecified",
        sarah: data.sarahCallStarted ? "yes" : "no",
      });
      setDone(true);
      window.setTimeout(() => {
        window.location.href = href("/thank-you");
      }, 1800);
    } catch {
      setError(h.expertIntakeError);
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <p className="rounded-xl border border-[#5a9a82]/40 bg-white/90 px-4 py-4 text-center text-sm font-medium text-[#1a3a52]">
        {h.expertIntakeSuccess}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate id="expert-intake">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Input
          required
          autoComplete="given-name"
          placeholder={f.firstName}
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className={fieldClass}
        />
        <Input
          required
          autoComplete="family-name"
          placeholder={f.lastName}
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className={fieldClass}
        />
        <Input
          required
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder={f.email}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={fieldClass}
        />
        <Input
          required
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder={f.phone}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={fieldClass}
        />
        <select
          value={state}
          onChange={(e) => setState(e.target.value)}
          aria-label={f.state}
          className={`${fieldClass} sm:col-span-2`}
        >
          <option value="">{f.selectState}</option>
          {US_STATES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <AsgAccidentIntakeFields
        variant="light"
        messages={f.intake}
        values={intake}
        onChange={(key, value) => setIntake((prev) => ({ ...prev, [key]: value }))}
      />

      <p
        role="note"
        className="rounded-lg border border-amber-300/60 bg-white/70 px-3 py-2 text-[0.68rem] leading-relaxed text-amber-950 sm:text-xs"
      >
        {h.expertIntakeDisclaimer}
      </p>

      <label className="flex gap-2.5 rounded-lg bg-white/60 p-3 text-[0.68rem] leading-relaxed text-[#3d5568] sm:text-xs">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 size-[1.125rem] shrink-0 accent-[#c45c00]"
          required
        />
        <span>{h.expertIntakeConsent}</span>
      </label>

      {error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
          {error}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={loading}
        className="min-h-[56px] w-full rounded-xl bg-gradient-to-r from-[#c45c00] to-[#e8a04c] py-4 text-base font-bold text-white shadow-lg transition hover:from-[#a84d00] hover:to-[#d49030] active:scale-[0.98] disabled:opacity-70"
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 className="size-5 animate-spin" aria-hidden />
            {h.expertIntakeSubmitting}
          </span>
        ) : (
          <span className="inline-flex items-center justify-center gap-2">
            <PhoneCall className="size-5" aria-hidden />
            {h.expertIntakeCta}
          </span>
        )}
      </Button>
    </form>
  );
}

export function ExpertIntakeBanner() {
  const { messages } = useAsgLocale();
  const h = messages.home;

  return (
    <section
      id="expert-intake"
      className="scroll-mt-24 overflow-hidden rounded-2xl border-2 border-[#e8a04c] bg-gradient-to-br from-[#fff8f0] via-[#fff4e6] to-[#ffe8cc] shadow-[0_20px_50px_-20px_rgba(196,92,0,0.35)] sm:rounded-3xl"
      aria-labelledby="expert-intake-heading"
    >
      <div className="border-b border-[#f5d0a8]/80 bg-gradient-to-r from-[#c45c00]/10 to-transparent px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex items-start gap-3">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#c45c00] text-white shadow-md">
            <Headphones className="size-6" aria-hidden />
          </span>
          <div>
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#c45c00] sm:text-xs">
              {h.expertIntakeEyebrow}
            </p>
            <h2
              id="expert-intake-heading"
              className="mt-1 font-serif text-xl font-bold text-[#1a3a52] sm:text-2xl"
            >
              {h.expertIntakeTitle}
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-[#5b6b7f]">{h.expertIntakeSubtitle}</p>
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-6">
        <ExpertIntakeForm />
      </div>
    </section>
  );
}
