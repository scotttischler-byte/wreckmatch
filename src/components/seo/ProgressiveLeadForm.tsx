"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { US_STATES } from "@/lib/accidentsurvivalguide";
import { trackWreckmatchEvent } from "@/lib/analytics";

type DefaultValues = {
  city?: string;
  state?: string;
  leadSource?: string;
};

export function ProgressiveLeadForm({
  defaultValues = {},
  compact = false,
}: {
  defaultValues?: DefaultValues;
  compact?: boolean;
}) {
  const [step, setStep] = useState<1 | 2>(1);
  const [stateAbbr, setStateAbbr] = useState(defaultValues.state ?? "");
  const [phone, setPhone] = useState("");
  const [accidentType, setAccidentType] = useState("");
  const [injured, setInjured] = useState("");
  const [cityState, setCityState] = useState(
    defaultValues.city && defaultValues.state
      ? `${defaultValues.city}, ${defaultValues.state}`
      : "",
  );
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  function goStep2(e: React.FormEvent) {
    e.preventDefault();
    trackWreckmatchEvent("form_start", { source: defaultValues.leadSource ?? "seo" });
    setStep(2);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const stateLabel =
      US_STATES.find((s) => s.value === stateAbbr)?.label ?? stateAbbr;
    const location =
      cityState ||
      (defaultValues.city && stateLabel
        ? `${defaultValues.city}, ${stateLabel}`
        : stateLabel || "Not specified — SEO page");

    try {
      const res = await fetch("/api/submit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName: lastName || ".",
          email,
          phone,
          cityState: location,
          accidentType: accidentType || "Not specified",
          injured: injured || "Not specified",
          lead_source: defaultValues.leadSource ?? "wreckmatch-seo",
        }),
      });
      const data = (await res.json()) as { success?: boolean; message?: string; redirectTo?: string };

      if (!res.ok || !data.success) {
        setError(data.message ?? "Something went wrong. Please try again.");
        trackWreckmatchEvent("form_error", { source: defaultValues.leadSource ?? "seo" });
        return;
      }

      trackWreckmatchEvent("form_submit", { source: defaultValues.leadSource ?? "seo" });
      setDone(true);
      if (data.redirectTo) {
        window.location.href = data.redirectTo;
      }
    } catch {
      setError("Network error. Please try again.");
      trackWreckmatchEvent("form_error", { source: defaultValues.leadSource ?? "seo" });
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <p className="rounded-xl border border-[#d4e8dc] bg-white p-4 text-sm text-[#475569]">
        Thank you — we received your information and will follow up shortly.
      </p>
    );
  }

  return (
    <div
      id="match-form"
      className={`rounded-[1.35rem] border border-[#c9a227]/30 bg-gradient-to-br from-[#081428] via-[#0c1f3f] to-[#040a14] p-6 text-white shadow-lg ${compact ? "" : "sm:p-8"}`}
    >
      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#fde68a]">
        Free attorney matching
      </p>
      <h2 className="mt-2 font-serif text-2xl font-semibold text-[#fffaf0]">
        {step === 1 ? "Where did it happen?" : "A few more details"}
      </h2>
      <p className="mt-2 text-sm text-[#dbe7f6]">
        Step {step} of 2 — WreckMatch LLC is a referral service, not a law firm.
      </p>

      {step === 1 ? (
        <form onSubmit={goStep2} className="mt-6 space-y-4">
          <select
            required
            value={stateAbbr}
            onChange={(e) => setStateAbbr(e.target.value)}
            className="h-11 w-full rounded-lg border border-white/20 bg-white/10 px-3 text-sm text-white"
            aria-label="State"
          >
            <option value="" className="text-[#152238]">
              State where accident happened
            </option>
            {US_STATES.map((s) => (
              <option key={s.value} value={s.value} className="text-[#152238]">
                {s.label}
              </option>
            ))}
          </select>
          <Input
            required
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="Mobile phone (best number to reach you)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="h-11 border-white/20 bg-white/10 text-white placeholder:text-[#94a3b8]"
          />
          <Button
            type="submit"
            className="h-11 w-full rounded-xl bg-[#c9a227] text-sm font-semibold text-[#152238] hover:bg-[#fde68a]"
          >
            Continue
          </Button>
        </form>
      ) : (
        <form onSubmit={submit} className="mt-6 space-y-3">
          <select
            required
            value={accidentType}
            onChange={(e) => setAccidentType(e.target.value)}
            className="h-11 w-full rounded-lg border border-white/20 bg-white/10 px-3 text-sm text-white"
            aria-label="Accident type"
          >
            <option value="" className="text-[#152238]">
              Accident type
            </option>
            <option value="Car accident" className="text-[#152238]">
              Car accident
            </option>
            <option value="Truck accident" className="text-[#152238]">
              Truck accident
            </option>
            <option value="Rideshare accident" className="text-[#152238]">
              Rideshare accident
            </option>
            <option value="Pedestrian / cyclist" className="text-[#152238]">
              Pedestrian / cyclist
            </option>
          </select>
          <select
            required
            value={injured}
            onChange={(e) => setInjured(e.target.value)}
            className="h-11 w-full rounded-lg border border-white/20 bg-white/10 px-3 text-sm text-white"
            aria-label="Were you injured?"
          >
            <option value="" className="text-[#152238]">
              Were you injured?
            </option>
            <option value="Yes — seeking treatment" className="text-[#152238]">
              Yes — seeking treatment
            </option>
            <option value="Yes — not yet treated" className="text-[#152238]">
              Yes — not yet treated
            </option>
            <option value="No injuries" className="text-[#152238]">
              No injuries
            </option>
          </select>
          <Input
            placeholder="City (optional)"
            value={cityState}
            onChange={(e) => setCityState(e.target.value)}
            className="h-11 border-white/20 bg-white/10 text-white placeholder:text-[#94a3b8]"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              required
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="h-11 border-white/20 bg-white/10 text-white placeholder:text-[#94a3b8]"
            />
            <Input
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="h-11 border-white/20 bg-white/10 text-white placeholder:text-[#94a3b8]"
            />
          </div>
          <Input
            required
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 border-white/20 bg-white/10 text-white placeholder:text-[#94a3b8]"
          />
          {error ? (
            <p className="text-sm text-[#fca5a5]" role="alert">
              {error}
            </p>
          ) : null}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(1)}
              className="h-11 flex-1 border-white/30 bg-transparent text-white hover:bg-white/10"
            >
              Back
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="h-11 flex-[2] rounded-xl bg-[#c9a227] text-sm font-semibold text-[#152238] hover:bg-[#fde68a]"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Submitting…
                </>
              ) : (
                "Get matched"
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
