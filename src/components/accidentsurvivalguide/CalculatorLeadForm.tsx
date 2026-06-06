"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { useAsgLocale } from "@/components/accidentsurvivalguide/AsgLocaleProvider";
import { AsgAccidentIntakeFields } from "@/components/accidentsurvivalguide/AsgAccidentIntakeFields";
import {
  AsgConsentRow,
  AsgFormError,
  AsgFormField,
} from "@/components/accidentsurvivalguide/AsgFormField";
import { asg, asgCn } from "@/components/accidentsurvivalguide/asg-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { US_STATES } from "@/lib/accidentsurvivalguide";
import { EMPTY_ASG_ACCIDENT_INTAKE, isAccidentIntakeComplete, type AsgAccidentIntake } from "@/lib/asg-intake";
import { saveCalculatorLead } from "@/lib/asg-lead-storage";
import { submitAsgLeadForm } from "@/lib/asg-form-submit";
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
  const [city, setCity] = useState("");
  const [intake, setIntake] = useState<AsgAccidentIntake>(EMPTY_ASG_ACCIDENT_INTAKE);
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!consent) {
      setError(h.calculatorLeadConsentRequired);
      return;
    }
    if (!isAccidentIntakeComplete(intake)) {
      setError(h.calculatorLeadIntakeRequired);
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
      city: city.trim(),
    };

    try {
      const data = await submitAsgLeadForm({
        ...lead,
        ...intake,
        magnet_type: "calculator-lead-magnet",
        form_name: "homepage-calculator-lead",
        state,
        consentEmail: true,
        consentSms: true,
        preferredLanguage: locale,
      });

      if (!data.success) {
        setError(data.message ?? h.calculatorLeadError);
        return;
      }

      saveCalculatorLead({ ...lead, ...intake });
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
    <form onSubmit={handleSubmit} className="flex flex-1 flex-col text-white" noValidate>
      <div>
        <h2 className="font-serif text-xl font-semibold sm:text-2xl">{h.calculatorCardTitle}</h2>
        <p className={asgCn(asg.bodySm, "mt-2 text-asg-sky")}>{h.calculatorCardSubtitle}</p>
      </div>

      <p className={asgCn(asg.noteDark, "mt-4")}>{h.calculatorCardDisclaimer}</p>

      <div className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-2">
        <AsgFormField label={f.firstName} required variant="dark">
          <Input
            required
            autoComplete="given-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={asg.inputDark}
          />
        </AsgFormField>
        <AsgFormField label={f.lastName} required variant="dark">
          <Input
            required
            autoComplete="family-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={asg.inputDark}
          />
        </AsgFormField>
        <AsgFormField label={f.email} required variant="dark">
          <Input
            required
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={asg.inputDark}
          />
        </AsgFormField>
        <AsgFormField label={f.phone} required variant="dark">
          <Input
            required
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={asg.inputDark}
          />
        </AsgFormField>
        <AsgFormField label={f.state} variant="dark">
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className={asg.selectDark}
          >
            <option value="">{f.selectState}</option>
            {US_STATES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </AsgFormField>
        <AsgFormField label={f.city} required variant="dark">
          <Input
            required
            autoComplete="address-level2"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={asg.inputDark}
          />
        </AsgFormField>
      </div>

      <AsgAccidentIntakeFields
        className="mt-4"
        variant="dark"
        messages={f.intake}
        values={intake}
        onChange={(key, value) => setIntake((prev) => ({ ...prev, [key]: value }))}
      />

      <div className="mt-4">
        <AsgConsentRow checked={consent} onChange={setConsent} variant="dark">
          {h.calculatorLeadConsent}
        </AsgConsentRow>
      </div>

      {error ? (
        <div className="mt-3">
          <AsgFormError message={error} variant="dark" />
        </div>
      ) : null}

      <Button
        type="submit"
        disabled={loading}
        className="mt-5 min-h-[48px] w-full rounded-lg bg-white text-base font-semibold text-asg-navy shadow-sm hover:bg-asg-page disabled:opacity-70"
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

      <p className={asgCn(asg.legal, "mt-3 text-center text-asg-sky/80")}>{h.calculatorPromoBadges}</p>
    </form>
  );
}
