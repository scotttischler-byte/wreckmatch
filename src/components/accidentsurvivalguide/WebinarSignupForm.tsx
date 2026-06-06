"use client";

import { useState } from "react";
import { GraduationCap, Loader2 } from "lucide-react";
import { useAsgLocale } from "@/components/accidentsurvivalguide/AsgLocaleProvider";
import { AsgConsentRow, AsgFormError, AsgFormField } from "@/components/accidentsurvivalguide/AsgFormField";
import { asg, asgCn } from "@/components/accidentsurvivalguide/asg-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { US_STATES } from "@/lib/accidentsurvivalguide";
import { submitWebinarRegistration } from "@/lib/asg-form-submit";
import { trackAsgEvent } from "@/lib/analytics";

type Variant = "hero" | "page" | "card";

export function WebinarSignupForm({
  variant = "page",
  formName,
}: {
  variant?: Variant;
  formName?: string;
}) {
  const { locale, messages, href } = useAsgLocale();
  const w = messages.webinarForm;
  const f = messages.form;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isHero = variant === "hero";
  const fieldVariant = isHero ? "dark" : "light";
  const inputClass = isHero ? asg.inputDark : asg.inputLight;
  const selectClass = isHero ? asg.selectDark : asg.selectLight;
  const noteClass = isHero ? asg.noteDark : asg.note;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!consent) {
      setError(w.consentRequired);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await submitWebinarRegistration({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        state,
        consentEmail: true,
        consentSms: true,
        preferredLanguage: locale,
        form_name: formName ?? `asg-webinar-${variant}`,
      });

      if (!data.success) {
        setError(data.message ?? w.error);
        return;
      }

      trackAsgEvent("webinar_registration_submit", {
        source: variant,
        email: data.emailAutomationTriggered ? "yes" : "no",
      });

      const redirect =
        data.redirectTo ??
        href(
          `/webinar/thank-you?email=${encodeURIComponent(email.trim())}&firstName=${encodeURIComponent(firstName.trim())}`,
        );
      window.location.href = redirect;
    } catch {
      setError(w.error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={asgCn("flex flex-col", isHero && "text-white")} noValidate>
      {variant === "page" ? (
        <div className="mb-5">
          <h2 className={asg.h3}>{w.formTitle}</h2>
          <p className={asgCn(asg.bodySm, "mt-2")}>{w.formSubtitle}</p>
        </div>
      ) : null}

      <div className={asgCn("grid gap-3", variant === "page" ? "sm:grid-cols-2" : "grid-cols-1")}>
        <AsgFormField label={f.firstName} variant={fieldVariant} required>
          <Input
            className={inputClass}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            autoComplete="given-name"
            required
          />
        </AsgFormField>
        {variant === "page" ? (
          <AsgFormField label={f.lastName} variant={fieldVariant}>
            <Input
              className={inputClass}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              autoComplete="family-name"
            />
          </AsgFormField>
        ) : null}
        <AsgFormField label={f.email} variant={fieldVariant} required>
          <Input
            type="email"
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </AsgFormField>
        <AsgFormField label={f.phone} variant={fieldVariant} required>
          <Input
            type="tel"
            className={inputClass}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
            required
          />
        </AsgFormField>
        <AsgFormField
          label={f.state}
          variant={fieldVariant}
          className={variant === "page" ? undefined : "sm:col-span-1"}
        >
          <select
            className={selectClass}
            value={state}
            onChange={(e) => setState(e.target.value)}
          >
            <option value="">{f.selectState}</option>
            {US_STATES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </AsgFormField>
      </div>

      <p className={asgCn(noteClass, "mt-4")}>{w.noCostNote}</p>

      <AsgConsentRow checked={consent} onChange={setConsent} variant={fieldVariant}>
        {w.consent}
      </AsgConsentRow>

      {error ? (
        <div className="mt-3">
          <AsgFormError message={error} variant={fieldVariant} />
        </div>
      ) : null}

      <Button
        type="submit"
        disabled={loading}
        className={asgCn(
          asg.btnPrimary,
          "mt-4 w-full gap-2",
          isHero && "bg-asg-sage hover:bg-asg-sage/90",
          variant === "card" && "bg-asg-sage hover:bg-asg-sage/90",
        )}
      >
        {loading ? (
          <>
            <Loader2 className="size-5 animate-spin" aria-hidden />
            {w.submitting}
          </>
        ) : (
          <>
            <GraduationCap className="size-5" aria-hidden />
            {w.submit}
          </>
        )}
      </Button>
    </form>
  );
}
