"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { SurvivalGuideDisclaimer } from "@/components/SurvivalGuideDisclaimer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { US_STATES } from "@/lib/accidentsurvivalguide";

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  state: string;
};

const INITIAL: FormState = {
  fullName: "",
  email: "",
  phone: "",
  state: "",
};

export function SurvivalGuideDownloadForm({ id = "download" }: { id?: string }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INITIAL);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/submit-survival-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await res.json()) as {
        success?: boolean;
        message?: string;
        pdfUrl?: string;
        redirectTo?: string;
      };

      if (!res.ok || !data.success) {
        setError(data.message ?? "Something went wrong. Please try again.");
        return;
      }

      if (data.pdfUrl) {
        window.open(data.pdfUrl, "_blank", "noopener,noreferrer");
      }

      router.push(data.redirectTo ?? "/thank-you");
    } catch {
      setError("Unable to submit right now. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id={id} className="scroll-mt-24">
      <SurvivalGuideDisclaimer variant="compact" className="mb-5" />

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-[#c5dce8] bg-white p-6 shadow-[0_20px_50px_-30px_rgba(26,58,82,0.25)] sm:p-8"
      >
        <h2 className="font-serif text-2xl font-semibold text-[#1a3a52]">
          Get your free Survival Guide
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[#5b6b7f]">
          Enter your details and we&apos;ll send the PDF. No obligation. Educational resource only.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-medium text-[#3d5568]">
              Full name <span className="text-[#c45c5c]">*</span>
            </span>
            <Input
              required
              autoComplete="name"
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
              autoComplete="email"
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
              autoComplete="tel"
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
            >
              <option value="">Select your state</option>
              {US_STATES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
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
          By submitting, you agree we may contact you about your request. WreckMatch LLC is a legal
          referral service, not a law firm. See our{" "}
          <a href="/privacy-policy" className="underline underline-offset-2">
            Privacy Policy
          </a>
          .
        </p>
      </form>
    </section>
  );
}
