"use client";

import { useState } from "react";
import { ArrowRight, Calculator, Loader2 } from "lucide-react";
import { useAsgLocale } from "@/components/accidentsurvivalguide/AsgLocaleProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { US_STATES } from "@/lib/accidentsurvivalguide";
import { saveCalculatorLead } from "@/lib/asg-lead-storage";
import { trackAsgEvent } from "@/lib/analytics";

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
      const res = await fetch("/api/submit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...lead,
          cityState: state ? `, ${state}` : "Not specified — calculator lead magnet",
          accidentType: "Calculator interest",
          injured: "Unspecified",
          lead_source: "accidentsurvivalguide-calculator-lead-magnet",
          preferredLanguage: locale,
        }),
      });
      const data = (await res.json()) as { success?: boolean; message?: string };

      if (!res.ok || !data.success) {
        setError(data.message ?? h.calculatorLeadError);
        return;
      }

      saveCalculatorLead(lead);
      trackAsgEvent("calculator_lead_magnet_submit", { state: state || "unspecified" });
      window.location.href = href("/calculator");
    } catch {
      setError(h.calculatorLeadError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 flex-col" noValidate>
      <div className="flex items-start gap-3">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/20">
          <Calculator className="size-6 text-white" aria-hidden />
        </span>
        <div>
          <h2 className="font-serif text-2xl font-bold leading-tight sm:text-3xl">
            {h.calculatorCardTitle}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#d4e8f4]">{h.calculatorCardSubtitle}</p>
        </div>
      </div>

      <p
        role="note"
        className="mt-4 rounded-lg border border-amber-300/50 bg-amber-950/40 px-3 py-2.5 text-xs leading-relaxed text-amber-100"
      >
        {h.calculatorCardDisclaimer}
      </p>

      <div className="mt-5 grid flex-1 gap-3 sm:grid-cols-2">
        <Input
          required
          placeholder={f.firstName}
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="h-11 border-white/30 bg-white/95 text-[#1a3a52] placeholder:text-[#7a8a98]"
        />
        <Input
          required
          placeholder={f.lastName}
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="h-11 border-white/30 bg-white/95 text-[#1a3a52] placeholder:text-[#7a8a98]"
        />
        <Input
          required
          type="email"
          placeholder={f.email}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-11 border-white/30 bg-white/95 text-[#1a3a52] placeholder:text-[#7a8a98]"
        />
        <Input
          required
          type="tel"
          placeholder={f.phone}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="h-11 border-white/30 bg-white/95 text-[#1a3a52] placeholder:text-[#7a8a98]"
        />
        <select
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="h-11 rounded-lg border border-white/30 bg-white/95 px-3 text-sm text-[#1a3a52] sm:col-span-2"
        >
          <option value="">{f.selectState}</option>
          {US_STATES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <label className="mt-4 flex gap-2 text-xs leading-relaxed text-[#d4e8f4]">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 size-4 shrink-0"
          required
        />
        {h.calculatorLeadConsent}
      </label>

      {error ? (
        <p className="mt-2 text-sm text-amber-200" role="alert">
          {error}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={loading}
        className="mt-5 h-14 w-full rounded-2xl bg-white text-base font-bold text-[#1a3a52] shadow-lg hover:bg-[#f4faf8] disabled:opacity-70"
      >
        {loading ? (
          <>
            <Loader2 className="size-5 animate-spin" aria-hidden />
            {f.submitting}
          </>
        ) : (
          <>
            {h.calculatorCardCta}
            <ArrowRight className="ml-2 size-5" aria-hidden />
          </>
        )}
      </Button>

      <p className="mt-3 text-center text-xs text-[#a8c5d8]">{h.calculatorPromoBadges}</p>
    </form>
  );
}
