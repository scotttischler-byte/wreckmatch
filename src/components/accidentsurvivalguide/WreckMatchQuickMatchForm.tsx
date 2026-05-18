"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { US_STATES } from "@/lib/accidentsurvivalguide";
import { trackAsgEvent } from "@/lib/analytics";

type DefaultValues = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  state?: string;
};

export function WreckMatchQuickMatchForm({ defaultValues = {} }: { defaultValues?: DefaultValues }) {
  const [firstName, setFirstName] = useState(defaultValues.firstName ?? "");
  const [lastName, setLastName] = useState(defaultValues.lastName ?? "");
  const [email, setEmail] = useState(defaultValues.email ?? "");
  const [phone, setPhone] = useState(defaultValues.phone ?? "");
  const [state, setState] = useState(defaultValues.state ?? "");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/submit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName: lastName || ".",
          email,
          phone,
          cityState: state ? `, ${state}` : "Not specified — ASG thank you",
          lead_source: "accidentsurvivalguide-thank-you",
        }),
      });
      const data = (await res.json()) as { success?: boolean; message?: string };

      if (!res.ok || !data.success) {
        setError(data.message ?? "Unable to submit. Please try wreckmatch.com directly.");
        return;
      }

      trackAsgEvent("wreckmatch_referral", { source: "thank_you_form" });
      setDone(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <p className="mt-6 rounded-lg border border-[#d4e8dc] bg-white p-4 text-sm text-[#5b6b7f]">
        Thank you — a specialist should reach out shortly about your free attorney match.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          required
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="h-10 border-[#c5dce8] bg-white"
        />
        <Input
          placeholder="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="h-10 border-[#c5dce8] bg-white"
        />
      </div>
      <Input
        required
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="h-10 border-[#c5dce8] bg-white"
      />
      <Input
        required
        type="tel"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="h-10 border-[#c5dce8] bg-white"
      />
      <select
        value={state}
        onChange={(e) => setState(e.target.value)}
        className="h-10 w-full rounded-lg border border-[#c5dce8] bg-white px-3 text-sm"
        aria-label="State"
      >
        <option value="">State</option>
        {US_STATES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      {error ? (
        <p className="text-sm text-[#b42318]" role="alert">
          {error}
        </p>
      ) : null}
      <Button
        type="submit"
        disabled={loading}
        className="h-11 w-full rounded-xl bg-[#5a9a82] text-sm font-semibold text-white hover:bg-[#4d8872]"
      >
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Submitting…
          </>
        ) : (
          "Get Free Attorney Match →"
        )}
      </Button>
    </form>
  );
}
