"use client";

import { ChevronDown, Scale } from "lucide-react";
import { useState } from "react";
import { LegalDisclaimerBanner } from "@/components/wreckmatch/LegalDisclaimerBanner";
import {
  WmButton,
  WmInput,
  WmSelect,
  WmTextarea,
} from "@/components/wreckmatch/ui/WmPrimitives";
import { US_STATES } from "@/lib/accidentsurvivalguide";
import { useWmLocale } from "@/lib/wreckmatch/context/WmLocaleProvider";
import { cn } from "@/lib/utils";

type GetMatchedFormProps = {
  source?: string;
  defaultFirstName?: string;
  defaultLastName?: string;
  defaultEmail?: string;
  defaultPhone?: string;
  defaultState?: string;
  compact?: boolean;
  collapsible?: boolean;
};

export function GetMatchedForm({
  source = "wreckmatch-app",
  defaultFirstName = "",
  defaultLastName = "",
  defaultEmail = "",
  defaultPhone = "",
  defaultState = "",
  compact = false,
  collapsible = false,
}: GetMatchedFormProps) {
  const { messages } = useWmLocale();
  const t = messages.form;
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const [expanded, setExpanded] = useState(!collapsible);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const form = new FormData(event.currentTarget);
    const firstName = String(form.get("firstName") ?? "").trim();
    const lastName = String(form.get("lastName") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const phone = String(form.get("phone") ?? "").trim();
    const state = String(form.get("state") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();

    try {
      const res = await fetch("/api/submit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName: lastName || ".",
          email,
          phone,
          cityState: state ? `, ${state}` : "Not specified — WreckMatch app",
          accidentType: "Car accident / wreck",
          caseDescription: message,
          lead_source: source,
          hasAttorney: "Requesting help via WreckMatch app",
        }),
      });

      const data = (await res.json()) as { success?: boolean; message?: string };
      if (!res.ok || !data.success) {
        setError(data.message ?? t.errorGeneric);
        return;
      }

      setDone(true);
      setExpanded(true);
    } catch {
      setError(t.errorNetwork);
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-[#006D77]/15 bg-gradient-to-br from-[#006D77]/8 to-white px-5 py-7 text-center">
        <p className="text-lg font-semibold text-[#2B2B2B]">{t.successTitle}</p>
        <p className="mt-2 text-sm leading-relaxed text-[#5C5C5C]">{t.successBody}</p>
      </div>
    );
  }

  if (collapsible && !expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="wm-press flex w-full min-h-14 items-center justify-between gap-3 rounded-2xl border border-dashed border-[#006D77]/25 bg-white px-5 py-4 text-left transition hover:border-[#006D77]/40 hover:bg-[#006D77]/3"
      >
        <span className="flex items-center gap-3">
          <span className="inline-flex size-10 items-center justify-center rounded-xl bg-[#006D77]/10 text-[#006D77]">
            <Scale className="size-5" aria-hidden />
          </span>
          <span>
            <span className="block font-semibold text-[#2B2B2B]">{t.requestFreeHelp}</span>
            <span className="block text-sm text-[#5C5C5C]">{t.tapToFill}</span>
          </span>
        </span>
        <ChevronDown className="size-5 shrink-0 text-[#006D77]" aria-hidden />
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!compact && (
        <div className="flex items-start gap-3 pb-1">
          <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#006D77]/10 text-[#006D77]">
            <Scale className="size-5" aria-hidden />
          </span>
          <div>
            <p className="font-semibold text-[#2B2B2B]">{t.getMatchedTitle}</p>
            <p className="mt-1 text-sm leading-relaxed text-[#5C5C5C]">
              {t.getMatchedDescription}
            </p>
          </div>
        </div>
      )}

      {compact && !collapsible && (
        <p className="font-semibold text-[#2B2B2B]">{t.requestFreeHelp}</p>
      )}

      <LegalDisclaimerBanner variant="compact" text={messages.legal.disclaimer} />

      <div className={cn("grid gap-4", !compact && "sm:grid-cols-2")}>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-[#2B2B2B]">{t.firstName}</span>
          <WmInput name="firstName" required defaultValue={defaultFirstName} autoComplete="given-name" />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-[#2B2B2B]">{t.lastName}</span>
          <WmInput name="lastName" defaultValue={defaultLastName} autoComplete="family-name" />
        </label>
      </div>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-[#2B2B2B]">{t.phone}</span>
        <WmInput
          name="phone"
          type="tel"
          inputMode="tel"
          required
          defaultValue={defaultPhone}
          autoComplete="tel"
          placeholder={t.phonePlaceholder}
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-[#2B2B2B]">{t.email}</span>
        <WmInput
          name="email"
          type="email"
          inputMode="email"
          required
          defaultValue={defaultEmail}
          autoComplete="email"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-[#2B2B2B]">{t.state}</span>
        <WmSelect name="state" defaultValue={defaultState} aria-label={t.state}>
          <option value="">{t.selectState}</option>
          {US_STATES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </WmSelect>
      </label>

      {!compact && (
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-[#2B2B2B]">
            {t.messageLabel}{" "}
            <span className="font-normal text-[#5C5C5C]">{t.optional}</span>
          </span>
          <WmTextarea name="message" placeholder={t.messagePlaceholder} rows={3} />
        </label>
      )}

      <label className="flex min-h-[3.25rem] items-start gap-3 rounded-2xl border border-[#006D77]/12 bg-[#F8F5F2] px-4 py-4">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 size-5 shrink-0 rounded-md border-[#006D77]/30 text-[#006D77]"
          required
        />
        <span className="text-sm leading-relaxed text-[#5C5C5C]">{t.consent}</span>
      </label>

      {error && (
        <p className="rounded-xl bg-[#FF8C42]/10 px-4 py-3 text-sm text-[#8a4b1a]">{error}</p>
      )}

      <WmButton type="submit" className="w-full" size="xl" disabled={pending || !consent}>
        {pending ? t.sending : t.submit}
      </WmButton>
    </form>
  );
}
