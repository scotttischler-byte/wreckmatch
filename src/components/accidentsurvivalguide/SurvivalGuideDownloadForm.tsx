"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { SurvivalGuideDisclaimer } from "@/components/SurvivalGuideDisclaimer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { US_STATES } from "@/lib/accidentsurvivalguide";
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

const HEADLINES = {
  default: "Get your free Survival Guide",
  checklist: "Get My Free Checklist PDF Now",
} as const;

type HeadlineKey = keyof typeof HEADLINES;

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
}: {
  id?: string;
  headline?: HeadlineKey;
}) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INITIAL);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);

  const progress = formProgress(form);

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
      setError("Please confirm you agree to receive your guide by email and/or text.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/submit-survival-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          state: form.state,
          city: form.city,
          zip: form.zip,
          consentEmail: form.consentEmail,
          consentSms: form.consentSms,
        }),
      });
      const data = (await res.json()) as {
        success?: boolean;
        message?: string;
        redirectTo?: string;
      };

      if (!res.ok || !data.success) {
        trackAsgEvent("form_error", { message: data.message ?? "unknown" });
        setError(data.message ?? "Something went wrong. Please try again.");
        return;
      }

      trackAsgEvent("form_submit", { state: form.state || "unspecified" });
      router.push(data.redirectTo ?? "/thank-you");
    } catch {
      trackAsgEvent("form_error", { message: "network" });
      setError("Unable to submit right now. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id={id} className="scroll-mt-24" aria-labelledby={`${id}-heading`}>
      <SurvivalGuideDisclaimer variant="compact" className="mb-5" />

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-[#c5dce8] bg-white p-6 shadow-[0_20px_50px_-30px_rgba(26,58,82,0.25)] sm:p-8"
        noValidate
      >
        <h2
          id={`${id}-heading`}
          className="font-serif text-2xl font-semibold text-[#1a3a52]"
        >
          {HEADLINES[headline]}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[#5b6b7f]">
          2026 edition PDF — we&apos;ll email it to you within minutes. Free, no obligation.
        </p>

        <div className="mt-4">
          <div className="mb-1 flex justify-between text-xs text-[#7a8a98]">
            <span>Form progress</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" aria-valuenow={progress} />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-[#3d5568]">
              First name <span className="text-[#c45c5c]">*</span>
            </span>
            <Input
              required
              autoComplete="given-name"
              value={form.firstName}
              onChange={(e) => updateField("firstName", e.target.value)}
              className="h-11 border-[#c5dce8] bg-[#fafcfd] px-3"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-[#3d5568]">
              Last name <span className="text-[#c45c5c]">*</span>
            </span>
            <Input
              required
              autoComplete="family-name"
              value={form.lastName}
              onChange={(e) => updateField("lastName", e.target.value)}
              className="h-11 border-[#c5dce8] bg-[#fafcfd] px-3"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-[#3d5568]">
              Email <span className="text-[#c45c5c]">*</span>
            </span>
            <Input
              required
              type="email"
              inputMode="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              className="h-11 border-[#c5dce8] bg-[#fafcfd] px-3"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-[#3d5568]">
              Phone <span className="text-[#c45c5c]">*</span>
            </span>
            <Input
              required
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              className="h-11 border-[#c5dce8] bg-[#fafcfd] px-3"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-[#3d5568]">
              State <span className="text-[#7a8a98]">(recommended)</span>
            </span>
            <select
              value={form.state}
              onChange={(e) => updateField("state", e.target.value)}
              className="h-11 w-full rounded-lg border border-[#c5dce8] bg-[#fafcfd] px-3 text-sm text-[#1a3a52] outline-none focus-visible:border-[#2a7a9b] focus-visible:ring-3 focus-visible:ring-[#2a7a9b]/20"
            >
              <option value="">Select state</option>
              {US_STATES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-[#3d5568]">
              City <span className="text-[#7a8a98]">(optional)</span>
            </span>
            <Input
              autoComplete="address-level2"
              value={form.city}
              onChange={(e) => updateField("city", e.target.value)}
              className="h-11 border-[#c5dce8] bg-[#fafcfd] px-3"
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-medium text-[#3d5568]">
              ZIP code <span className="text-[#7a8a98]">(optional)</span>
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
            <legend className="text-sm font-medium text-[#3d5568]">How should we send your guide?</legend>
            <label className="flex gap-3">
              <input
                type="checkbox"
                checked={form.consentEmail}
                onChange={(e) => updateField("consentEmail", e.target.checked)}
                className="mt-1 size-4"
              />
              <span className="text-[0.78rem] leading-relaxed text-[#5b6b7f]">
                Email me the Survival Guide PDF
              </span>
            </label>
            <label className="flex gap-3">
              <input
                type="checkbox"
                checked={form.consentSms}
                onChange={(e) => updateField("consentSms", e.target.checked)}
                className="mt-1 size-4"
              />
              <span className="text-[0.78rem] leading-relaxed text-[#5b6b7f]">
                Text me updates (Msg &amp; data rates may apply. Reply STOP to unsubscribe.)
              </span>
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
          className="mt-6 h-12 w-full rounded-xl bg-[#2a7a9b] text-base font-semibold text-white hover:bg-[#236884] disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Sending your guide…
            </>
          ) : (
            "Send Me the Free Survival Guide"
          )}
        </Button>

        <p className="mt-4 text-[0.72rem] leading-relaxed text-[#7a8a98]">
          WreckMatch LLC is a legal referral service, not a law firm. Not legal advice.{" "}
          <a href="/privacy-policy" className="underline underline-offset-2">
            Privacy Policy
          </a>
        </p>
      </form>
    </section>
  );
}
