"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { useAsgLocale } from "@/components/accidentsurvivalguide/AsgLocaleProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { US_STATES } from "@/lib/accidentsurvivalguide";
import { saveCalculatorLead } from "@/lib/asg-lead-storage";
import { submitAsgLeadForm } from "@/lib/asg-form-submit";
import { trackAsgEvent } from "@/lib/analytics";

const fieldClass =
  "h-12 w-full min-h-[48px] rounded-xl border-0 bg-white text-base text-[#1a3a52] shadow-sm placeholder:text-[#94a8b8] focus-visible:ring-2 focus-visible:ring-white/80";

export function CalculatorLeadForm() {
  const { locale, messages, href } = useAsgLocale();
  const h = messages.home;
  const f = messages.form;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!consent) {
      setError(h.calculatorLeadConsentRequired);
      return;
    }

    setLoading(true);
    setError("");

    const lead = {
      firstName: firstName.trim(),
      lastName: lastName.trim() || ".",
      email: email.trim(),
      phone: phone.trim(),
      state,
    };

    try {
      const data = await submitAsgLeadForm({
        ...lead,
        magnet_type: "calculator-lead-magnet",
        form_name: "homepage-calculator-lead",
        state,
        consentEmail: true,
        preferredLanguage: locale,
      });

      if (!data.success) {
        setError(data.message ?? h.calculatorLeadError);
        return;
      }

      saveCalculatorLead(lead);
      trackAsgEvent("calculator_lead_magnet_submit", {
        state: state || "unspecified",
        sarah: data.sarahCallStarted ? "yes" : "no",
        email: data.emailAutomationTriggered ? "yes" : "no",
      });
      window.location.href = href("/calculator");
    } catch {
      setError(h.calculatorLeadError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 flex-col" noValidate>
      <div>
        <h2 className="font-serif text-xl font-bold leading-tight text-white sm:text-2xl">
          {h.calculatorCardTitle}
        </h2>
        <p className="mt-1.5 text-[0.8rem] leading-relaxed text-[#d4e8f4] sm:text-sm">
          {h.calculatorCardSubtitle}
        </p>
      </div>

      <p
        role="note"
        className="mt-3 rounded-lg bg-black/20 px-3 py-2 text-[0.65rem] leading-relaxed text-amber-100 sm:text-xs"
      >
        {h.calculatorCardDisclaimer}
      </p>

      <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
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

      <label className="mt-3 flex gap-2.5 rounded-lg bg-black/15 p-3 text-[0.65rem] leading-relaxed text-[#e8f4fa] sm:text-xs">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 size-[1.125rem] shrink-0 accent-white"
          required
        />
        <span>{h.calculatorLeadConsent}</span>
      </label>

      {error ? (
        <p className="mt-2 rounded-lg bg-red-950/40 px-3 py-2 text-sm text-red-100" role="alert">
          {error}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={loading}
        className="mt-4 min-h-[52px] w-full rounded-xl bg-white py-3.5 text-base font-bold text-[#1a3a52] shadow-lg transition active:scale-[0.98] hover:bg-[#f4faf8] disabled:opacity-70"
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 className="size-5 animate-spin" aria-hidden />
            {f.submitting}
          </span>
        ) : (
          <span className="inline-flex items-center justify-center gap-2">
            {h.calculatorCardCta}
            <ArrowRight className="size-5" aria-hidden />
          </span>
        )}
      </Button>

      <p className="mt-2.5 text-center text-[0.65rem] text-[#a8c5d8] sm:text-xs">
        {h.calculatorPromoBadges}
      </p>
    </form>
  );
}
