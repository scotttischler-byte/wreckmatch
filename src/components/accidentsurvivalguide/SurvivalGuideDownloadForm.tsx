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
  fullName: string;
  email: string;
  phone: string;
  state: string;
  consent: boolean;
};

const INITIAL: FormState = {
  fullName: "",
  email: "",
  phone: "",
  state: "",
  consent: false,
};

const HEADLINES = {
  default: "Get your free Survival Guide",
  checklist: "Get My Free Checklist PDF Now",
} as const;

type HeadlineKey = keyof typeof HEADLINES;

function formProgress(form: FormState): number {
  let score = 0;
  if (form.fullName.trim()) score += 25;
  if (form.email.trim()) score += 25;
  if (form.phone.trim()) score += 25;
  if (form.state) score += 15;
  if (form.consent) score += 10;
  return score;
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
    const t = setTimeout(() => {
      if (form.fullName || form.email) {
        setStarted(true);
        trackAsgEvent("form_start");
      }
    }, 0);
    return () => clearTimeout(t);
  }, [form.fullName, form.email, started]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    if (!started && (key === "fullName" || key === "email")) {
      setStarted(true);
      trackAsgEvent("form_start");
    }
    setForm((prev) => ({ ...prev, [key]: value }));
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.consent) {
      setError("Please confirm you agree to be contacted about your guide request.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/submit-survival-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          state: form.state,
        }),
      });
      const data = (await res.json()) as {
        success?: boolean;
        message?: string;
        pdfUrl?: string;
        redirectTo?: string;
      };

      if (!res.ok || !data.success) {
        trackAsgEvent("form_error", { message: data.message ?? "unknown" });
        setError(data.message ?? "Something went wrong. Please try again.");
        return;
      }

      trackAsgEvent("form_submit", { state: form.state || "unspecified" });

      if (data.pdfUrl) {
        trackAsgEvent("pdf_download");
        window.open(data.pdfUrl, "_blank", "noopener,noreferrer");
      }

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
          2026 edition PDF — free, no obligation. Educational resource only.
        </p>

        <div className="mt-4">
          <div className="mb-1 flex justify-between text-xs text-[#7a8a98]">
            <span>Form progress</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" aria-valuenow={progress} />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-medium text-[#3d5568]">
              Full name <span className="text-[#c45c5c]">*</span>
            </span>
            <Input
              required
              autoComplete="name"
              aria-required="true"
              value={form.fullName}
              onChange={(e) => updateField("fullName", e.target.value)}
              className="h-11 border-[#c5dce8] bg-[#fafcfd] px-3"
              placeholder="Jane Smith"
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
              aria-required="true"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              className="h-11 border-[#c5dce8] bg-[#fafcfd] px-3"
              placeholder="you@email.com"
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
              aria-required="true"
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              className="h-11 border-[#c5dce8] bg-[#fafcfd] px-3"
              placeholder="(555) 555-5555"
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-medium text-[#3d5568]">
              State <span className="font-normal text-[#7a8a98]">(optional)</span>
            </span>
            <select
              value={form.state}
              onChange={(e) => updateField("state", e.target.value)}
              className="h-11 w-full rounded-lg border border-[#c5dce8] bg-[#fafcfd] px-3 text-sm text-[#1a3a52] outline-none focus-visible:border-[#2a7a9b] focus-visible:ring-3 focus-visible:ring-[#2a7a9b]/20"
              aria-label="Select your state"
            >
              <option value="">Select your state</option>
              {US_STATES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex gap-3 sm:col-span-2">
            <input
              type="checkbox"
              checked={form.consent}
              onChange={(e) => updateField("consent", e.target.checked)}
              className="mt-1 size-4 rounded border-[#c5dce8]"
              aria-required="true"
            />
            <span className="text-[0.78rem] leading-relaxed text-[#5b6b7f]">
              I agree WreckMatch LLC may contact me about my guide request by phone, email, or text.
              Msg &amp; data rates may apply. Reply STOP to unsubscribe. Not legal advice.
            </span>
          </label>
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
          See our{" "}
          <a href="/privacy-policy" className="underline underline-offset-2">
            Privacy Policy
          </a>
          .
        </p>
      </form>
    </section>
  );
}
