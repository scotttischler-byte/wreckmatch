"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { AsgLink } from "@/components/accidentsurvivalguide/AsgLink";
import { useAsgLocale } from "@/components/accidentsurvivalguide/AsgLocaleProvider";
import { SurvivalGuideDisclaimer } from "@/components/SurvivalGuideDisclaimer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { US_STATES } from "@/lib/accidentsurvivalguide";
import { submitSurvivalGuideForm } from "@/lib/asg-form-submit";
import { trackAsgEvent } from "@/lib/analytics";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  state: string;
  city: string;
  zip: string;
  consentEmail: boolean;
  consentSms: boolean;
};

const INITIAL: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  state: "",
  city: "",
  zip: "",
  consentEmail: true,
  consentSms: true,
};

type HeadlineKey = "default" | "checklist";

function formProgress(form: FormState): number {
  let score = 0;
  if (form.firstName.trim()) score += 15;
  if (form.lastName.trim()) score += 15;
  if (form.email.trim()) score += 20;
  if (form.phone.trim()) score += 20;
  if (form.state) score += 15;
  if (form.city) score += 5;
  if (form.zip) score += 5;
  if (form.consentEmail || form.consentSms) score += 5;
  return Math.min(100, score);
}

export function SurvivalGuideDownloadForm({
  id = "download",
  headline = "default",
  embedded = false,
}: {
  id?: string;
  headline?: HeadlineKey;
  /** Side-by-side lead magnet card — no outer section shell */
  embedded?: boolean;
}) {
  const router = useRouter();
  const { locale, messages, href } = useAsgLocale();
  const f = messages.form;
  const [form, setForm] = useState<FormState>(INITIAL);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);

  const progress = formProgress(form);
  const headlineText = headline === "checklist" ? f.checklistHeadline : f.defaultHeadline;

  useEffect(() => {
    if (started) return;
    if (form.firstName || form.email) {
      setStarted(true);
      trackAsgEvent("form_start");
    }
  }, [form.firstName, form.email, started]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    if (!started && (key === "firstName" || key === "email")) {
      setStarted(true);
      trackAsgEvent("form_start");
    }
    setForm((prev) => ({ ...prev, [key]: value }));
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.consentEmail && !form.consentSms) {
      setError(f.consentError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await submitSurvivalGuideForm({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        state: form.state,
        city: form.city,
        zip: form.zip,
        consentEmail: form.consentEmail,
        consentSms: form.consentSms,
        preferredLanguage: locale,
        form_name: embedded ? "embedded-survival-guide" : "survival-guide-download",
      });

      if (!data.success) {
        trackAsgEvent("form_error", { message: data.message ?? "unknown" });
        setError(data.message ?? f.consentError);
        return;
      }

      trackAsgEvent("form_submit", {
        state: form.state || "unspecified",
        sarah: data.sarahCallStarted ? "yes" : "no",
        email: data.emailAutomationTriggered ? "yes" : "no",
      });
      router.push(data.redirectTo ?? href("/thank-you"));
    } catch {
      trackAsgEvent("form_error", { message: "network" });
      setError(f.consentError);
    } finally {
      setLoading(false);
    }
  }

  const formEl = (
      <form
        onSubmit={handleSubmit}
        className={
          embedded
            ? "flex flex-1 flex-col px-4 pb-4 pt-2 sm:px-5 sm:pb-5 sm:pt-3"
            : "rounded-2xl border border-[#c5dce8] bg-white p-6 shadow-[0_20px_50px_-30px_rgba(26,58,82,0.25)] sm:p-8"
        }
        noValidate
      >
        {!embedded ? (
          <>
            <h2 id={`${id}-heading`} className="font-serif text-2xl font-semibold text-[#1a3a52]">
              {headlineText}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#5b6b7f]">{f.subtitle}</p>
          </>
        ) : null}

        {!embedded ? (
          <div className="mt-4">
            <div className="mb-1 flex justify-between text-xs text-[#7a8a98]">
              <span>{f.progress}</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" aria-valuenow={progress} />
          </div>
        ) : null}

        <div
          className={
            embedded ? "mt-2 grid grid-cols-1 gap-3 md:grid-cols-2" : "mt-6 grid gap-4 sm:grid-cols-2"
          }
        >
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-[#3d5568]">
              {f.firstName} <span className="text-[#c45c5c]">*</span>
            </span>
            <Input
              required
              autoComplete="given-name"
              value={form.firstName}
              onChange={(e) => updateField("firstName", e.target.value)}
              className="h-12 min-h-[48px] border-[#c5dce8] bg-[#fafcfd] px-3 text-base"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-[#3d5568]">
              {f.lastName} <span className="text-[#c45c5c]">*</span>
            </span>
            <Input
              required
              autoComplete="family-name"
              value={form.lastName}
              onChange={(e) => updateField("lastName", e.target.value)}
              className="h-12 min-h-[48px] border-[#c5dce8] bg-[#fafcfd] px-3 text-base"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-[#3d5568]">
              {f.email} <span className="text-[#c45c5c]">*</span>
            </span>
            <Input
              required
              type="email"
              inputMode="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              className="h-12 min-h-[48px] border-[#c5dce8] bg-[#fafcfd] px-3 text-base"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-[#3d5568]">
              {f.phone} <span className="text-[#c45c5c]">*</span>
            </span>
            <Input
              required
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              className="h-12 min-h-[48px] border-[#c5dce8] bg-[#fafcfd] px-3 text-base"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-[#3d5568]">
              {f.state} <span className="text-[#7a8a98]">{f.stateRecommended}</span>
            </span>
            <select
              value={form.state}
              onChange={(e) => updateField("state", e.target.value)}
              className="h-12 min-h-[48px] w-full rounded-lg border border-[#c5dce8] bg-[#fafcfd] px-3 text-base text-[#1a3a52] outline-none focus-visible:border-[#2a7a9b] focus-visible:ring-3 focus-visible:ring-[#2a7a9b]/20"
            >
              <option value="">{f.selectState}</option>
              {US_STATES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-[#3d5568]">
              {f.city} <span className="text-[#7a8a98]">{f.optional}</span>
            </span>
            <Input
              autoComplete="address-level2"
              value={form.city}
              onChange={(e) => updateField("city", e.target.value)}
              className="h-12 min-h-[48px] border-[#c5dce8] bg-[#fafcfd] px-3 text-base"
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-medium text-[#3d5568]">
              {f.zip} <span className="text-[#7a8a98]">{f.optional}</span>
            </span>
            <Input
              autoComplete="postal-code"
              inputMode="numeric"
              value={form.zip}
              onChange={(e) => updateField("zip", e.target.value)}
              className="h-11 max-w-xs border-[#c5dce8] bg-[#fafcfd] px-3"
            />
          </label>

          <fieldset className="space-y-2 sm:col-span-2">
            <legend className="text-sm font-medium text-[#3d5568]">{f.consentLegend}</legend>
            <label className="flex gap-3">
              <input
                type="checkbox"
                checked={form.consentEmail}
                onChange={(e) => updateField("consentEmail", e.target.checked)}
                className="mt-1 size-4"
              />
              <span className="text-[0.78rem] leading-relaxed text-[#5b6b7f]">{f.consentEmail}</span>
            </label>
            <label className="flex gap-3">
              <input
                type="checkbox"
                checked={form.consentSms}
                onChange={(e) => updateField("consentSms", e.target.checked)}
                className="mt-1 size-4"
              />
              <span className="text-[0.78rem] leading-relaxed text-[#5b6b7f]">{f.consentSms}</span>
            </label>
          </fieldset>
        </div>

        {error ? (
          <p className="mt-4 text-sm text-[#b42318]" role="alert">
            {error}
          </p>
        ) : null}

        <Button
          type="submit"
          disabled={loading}
          className={
            embedded
              ? "mt-4 min-h-[52px] w-full rounded-xl bg-[#2a7a9b] py-3.5 text-base font-bold text-white shadow-md transition active:scale-[0.98] hover:bg-[#236884] disabled:opacity-70"
              : "mt-6 h-12 w-full rounded-xl bg-[#2a7a9b] text-base font-semibold text-white hover:bg-[#236884] disabled:opacity-70"
          }
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              {f.submitting}
            </>
          ) : (
            f.submit
          )}
        </Button>

        <p
          className={
            embedded
              ? "mt-3 text-[0.65rem] leading-relaxed text-[#7a8a98] sm:text-xs"
              : "mt-4 text-[0.72rem] leading-relaxed text-[#7a8a98]"
          }
        >
          {f.footerLegal}{" "}
          <AsgLink href="/privacy-policy" className="underline underline-offset-2">
            {f.privacy}
          </AsgLink>
        </p>
      </form>
  );

  if (embedded) {
    return formEl;
  }

  return (
    <section id={id} className="scroll-mt-24" aria-labelledby={`${id}-heading`}>
      <SurvivalGuideDisclaimer variant="compact" className="mb-5" />
      {formEl}
    </section>
  );
}
