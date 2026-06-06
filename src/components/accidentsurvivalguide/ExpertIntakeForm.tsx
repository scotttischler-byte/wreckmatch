"use client";

import { useState } from "react";
import { Headphones, Loader2, Lock, PhoneCall, ShieldCheck } from "lucide-react";
import { useAsgLocale } from "@/components/accidentsurvivalguide/AsgLocaleProvider";
import { AsgAccidentIntakeFields } from "@/components/accidentsurvivalguide/AsgAccidentIntakeFields";
import { AsgConsentRow, AsgFormError, AsgFormField } from "@/components/accidentsurvivalguide/AsgFormField";
import { asg, asgCn } from "@/components/accidentsurvivalguide/asg-ui";
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

export function ExpertIntakeForm() {
  const { locale, messages, href } = useAsgLocale();
  const h = messages.home;
  const f = messages.form;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
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
        city: city.trim(),
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
      <p className={asgCn(asg.cardPad, "text-center text-sm font-medium text-asg-navy")}>
        {h.expertIntakeSuccess}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate id="expert-intake">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <AsgFormField label={f.firstName} required>
          <Input
            required
            autoComplete="given-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={asg.inputLight}
          />
        </AsgFormField>
        <AsgFormField label={f.lastName} required>
          <Input
            required
            autoComplete="family-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={asg.inputLight}
          />
        </AsgFormField>
        <AsgFormField label={f.email} required>
          <Input
            required
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={asg.inputLight}
          />
        </AsgFormField>
        <AsgFormField label={f.phone} required>
          <Input
            required
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={asg.inputLight}
          />
        </AsgFormField>
        <AsgFormField label={f.state}>
          <select value={state} onChange={(e) => setState(e.target.value)} className={asg.selectLight}>
            <option value="">{f.selectState}</option>
            {US_STATES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </AsgFormField>
        <AsgFormField label={f.city} required>
          <Input
            required
            autoComplete="address-level2"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={asg.inputLight}
          />
        </AsgFormField>
      </div>

      <AsgAccidentIntakeFields
        variant="light"
        messages={f.intake}
        values={intake}
        onChange={(key, value) => setIntake((prev) => ({ ...prev, [key]: value }))}
      />

      <p className={asg.note} role="note">
        {h.expertIntakeDisclaimer}
      </p>

      <AsgConsentRow checked={consent} onChange={setConsent}>
        {h.expertIntakeConsent}
      </AsgConsentRow>

      {error ? <AsgFormError message={error} /> : null}

      <Button type="submit" disabled={loading} className={asgCn(asg.btnPrimary, "w-full")}>
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
      className="scroll-mt-24 overflow-hidden rounded-2xl border border-asg-border bg-asg-surface shadow-md"
      aria-labelledby="expert-intake-heading"
    >
      <div className="border-b border-asg-border bg-asg-elevated px-5 py-4">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-asg-teal text-white">
            <Headphones className="size-5" aria-hidden />
          </span>
          <div>
            <p className={asg.eyebrow}>{h.expertIntakeEyebrow}</p>
            <h2 id="expert-intake-heading" className={asgCn(asg.h3, "mt-1")}>
              {h.expertIntakeTitle}
            </h2>
            <p className={asgCn(asg.bodySm, "mt-1")}>{h.expertIntakeSubtitle}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {[h.expertIntakeBadgeFree, h.expertIntakeBadgeNoCost, h.expertIntakeBadgeConfidential].map(
                (badge, index) => (
                  <li
                    key={badge}
                    className="inline-flex items-center gap-1.5 rounded-full border border-asg-teal/30 bg-asg-teal/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-asg-teal"
                  >
                    {index === 2 ? (
                      <Lock className="size-3.5" aria-hidden />
                    ) : (
                      <ShieldCheck className="size-3.5" aria-hidden />
                    )}
                    {badge}
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      </div>
      <div className="p-5">
        <ExpertIntakeForm />
      </div>
    </section>
  );
}
