"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { SUPPORT_PHONE_DISPLAY } from "@/lib/constants";
import { openRetellVoiceWidget, WM_GHL_STACK_Z, WM_RETELL_STACK_Z } from "@/lib/retell-open";

/** Sent when the streamlined form does not collect city/insurance/attorney fields. */
const WEB_INTAKE_DEFAULT = "Not specified — web intake";

const INTAKE_FIELDS = [
  { step: 1, question: "When did the accident happen?", type: "date" as const },
  {
    step: 2,
    question: "What type of accident was it?",
    type: "select" as const,
    options: ["Rear-end", "T-bone", "Intersection", "Highway", "Other"],
  },
  {
    step: 3,
    question: "Were you injured?",
    type: "select" as const,
    options: ["Yes — serious", "Yes — minor", "No"],
  },
  { step: 4, question: "Any medical treatment received?", type: "text" as const },
] as const;

const HOW_IT_WORKS = [
  { num: "1", title: "Tell Us What Happened", desc: "Answer quick questions about your accident" },
  { num: "2", title: "We Match You", desc: "Our system connects you with the right attorney" },
  { num: "3", title: "Free Case Review", desc: "Speak directly with a top local attorney" },
  { num: "4", title: "Get the Compensation You Deserve", desc: "No win, no fee — we only get paid if you do" },
] as const;

const TESTIMONIALS = [
  {
    quote:
      "I went from voicemail purgatory to clarity in one conversation. They treated me like a person—not a lead barcode.",
    name: "Alicia K.",
    detail: "Rear-impact cervical strain",
  },
  {
    quote:
      "The carrier stopped slow-walking us once counsel stepped in. Fees were explained plainly—zero theater.",
    name: "Devon L.",
    detail: "Uninsured motorist strategy",
  },
  {
    quote: "I expected a hard sell. Instead: empathy first, then timelines. I finally slept.",
    name: "Rosa F.",
    detail: "T-bone disputed liability",
  },
] as const;

export default function Home() {
  const router = useRouter();
  const telHref = `tel:${SUPPORT_PHONE_DISPLAY.replace(/\D/g, "")}`;

  const [accidentDate, setAccidentDate] = useState("");
  const [accidentType, setAccidentType] = useState("");
  const [injured, setInjured] = useState("");
  const [medicalTreatment, setMedicalTreatment] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const openAva = useCallback(() => {
    openRetellVoiceWidget();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let last = 0;
    const sync = () => {
      const now = Date.now();
      if (now - last < 400) return;
      last = now;

      for (const child of Array.from(document.body.children)) {
        if (!(child instanceof HTMLElement)) continue;
        if (child.shadowRoot?.querySelector("#retell-fab")) {
          child.style.setProperty("z-index", WM_RETELL_STACK_Z, "important");
          child.style.setProperty(
            "bottom",
            "max(5.25rem, calc(84px + env(safe-area-inset-bottom, 0px)))",
            "important",
          );
          child.style.setProperty("right", "max(1rem, env(safe-area-inset-right, 0px))", "important");
          break;
        }
      }

      document.querySelectorAll("iframe").forEach((frame) => {
        const src = frame.getAttribute("src") || "";
        if (!/leadconnectorhq|gohighlevel|msgsndr/i.test(src)) return;
        let el: HTMLElement | null = frame;
        for (let d = 0; d < 14 && el; d += 1) {
          const { position } = getComputedStyle(el);
          if (position === "fixed" || position === "absolute") {
            el.style.setProperty("z-index", WM_GHL_STACK_Z, "important");
            break;
          }
          el = el.parentElement;
        }
      });
    };

    sync();
    const t1 = window.setTimeout(sync, 900);
    const t2 = window.setTimeout(sync, 2800);
    const t3 = window.setTimeout(sync, 5200);
    const obs = new MutationObserver(sync);
    obs.observe(document.body, { childList: true, subtree: false });
    const slow = window.setInterval(sync, 4000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearInterval(slow);
      obs.disconnect();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const d = phone.replace(/\D/g, "");
    if (!accidentDate.trim()) {
      setFormError("Please choose when the accident happened.");
      return;
    }
    if (!accidentType) {
      setFormError("Please select an accident type.");
      return;
    }
    if (!injured) {
      setFormError("Please tell us if you were injured.");
      return;
    }
    if (!medicalTreatment.trim()) {
      setFormError("Please describe medical treatment (or enter “none”).");
      return;
    }
    if (d.length < 10) {
      setFormError("Enter a valid U.S. phone number.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/submit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accidentTime: accidentDate,
          cityState: WEB_INTAKE_DEFAULT,
          accidentType,
          injured,
          medicalTreatment: medicalTreatment.trim(),
          insurance: WEB_INTAKE_DEFAULT,
          hasAttorney: WEB_INTAKE_DEFAULT,
          phone,
        }),
      });
      const data = (await res.json()) as { success?: boolean; redirectTo?: string; message?: string };
      if (!res.ok || !data.success) {
        setFormError(data.message ?? "Something went wrong. Please call us.");
        return;
      }
      if (data.redirectTo) router.push(data.redirectTo);
    } catch {
      setFormError("Connection issue. Please try again or call.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* === WRECKMATCH HUGE PASS - CLEAN & FUNCTIONAL === */}
      <main className="min-h-screen bg-white text-neutral-900">
        {/* Hero */}
        <section className="bg-gradient-to-r from-red-700 to-red-900 py-16 text-white sm:py-20">
          <div className="mx-auto max-w-6xl px-6 text-center">
            <h1 className="mb-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              Were You Injured in a Car Accident?
            </h1>
            <p className="mb-8 text-xl md:text-2xl lg:text-3xl">
              Get Matched with a Top Personal Injury Attorney in{" "}
              <span className="font-bold">60 Seconds</span>
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="#intake"
                className="rounded-2xl bg-white px-10 py-5 text-xl font-semibold text-red-700 transition hover:bg-gray-100"
              >
                Start Free Case Review →
              </a>
              <a
                href={telHref}
                className="rounded-2xl border-2 border-white px-10 py-5 text-xl font-semibold transition hover:bg-white/10"
              >
                Call {SUPPORT_PHONE_DISPLAY}
              </a>
              <button
                type="button"
                onClick={openAva}
                className="rounded-2xl border-2 border-white/80 px-8 py-5 text-lg font-semibold text-white/95 transition hover:bg-white/10"
              >
                Request a call (Ava)
              </button>
            </div>
            <p className="mt-6 text-sm opacity-75">No Win, No Fee · 100% Confidential</p>
          </div>
        </section>

        {/* Intake Form - Prominent & Functional */}
        <div className="-mt-10 px-6 pb-20">
          <form
            id="intake"
            onSubmit={handleSubmit}
            className="mx-auto max-w-4xl scroll-mt-28 rounded-3xl bg-white p-8 shadow-2xl sm:p-10"
          >
            <h2 className="mb-8 text-center text-2xl font-bold sm:text-3xl">
              Tell Us What Happened (2 Minutes)
            </h2>

            {INTAKE_FIELDS.map((field) => {
              if (field.type === "date") {
                return (
                  <div key={field.step} className="mb-8">
                    <label className="mb-3 block text-lg font-medium" htmlFor="wm-accident-date">
                      {field.question}
                    </label>
                    <input
                      id="wm-accident-date"
                      type="date"
                      value={accidentDate}
                      onChange={(e) => setAccidentDate(e.target.value)}
                      className="w-full rounded-2xl border border-neutral-300 p-4 text-lg focus:border-red-600 focus:outline-none"
                      required
                    />
                  </div>
                );
              }
              if (field.type === "select") {
                const value = field.step === 2 ? accidentType : injured;
                const set =
                  field.step === 2
                    ? setAccidentType
                    : setInjured;
                return (
                  <div key={field.step} className="mb-8">
                    <label className="mb-3 block text-lg font-medium">{field.question}</label>
                    <select
                      value={value}
                      onChange={(e) => set(e.target.value)}
                      className="w-full rounded-2xl border border-neutral-300 p-4 text-lg focus:border-red-600 focus:outline-none"
                      required
                    >
                      <option value="">Choose…</option>
                      {field.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              }
              return (
                <div key={field.step} className="mb-8">
                  <label className="mb-3 block text-lg font-medium" htmlFor="wm-medical">
                    {field.question}
                  </label>
                  <input
                    id="wm-medical"
                    type="text"
                    placeholder="Your answer..."
                    value={medicalTreatment}
                    onChange={(e) => setMedicalTreatment(e.target.value)}
                    className="w-full rounded-2xl border border-neutral-300 p-4 text-lg focus:border-red-600 focus:outline-none"
                  />
                </div>
              );
            })}

            <div className="mb-8">
              <label className="mb-3 block text-lg font-medium" htmlFor="wm-phone">
                Best phone number
              </label>
              <input
                id="wm-phone"
                type="tel"
                autoComplete="tel"
                aria-describedby="wm-intake-sms-consent"
                placeholder="digits only okay"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-2xl border border-neutral-300 p-4 text-lg focus:border-red-600 focus:outline-none"
              />
              <p
                id="wm-intake-sms-consent"
                role="note"
                className="mt-3 rounded-xl border border-amber-200 bg-amber-50/90 p-4 text-sm leading-relaxed text-neutral-700"
              >
                By providing your phone number, you consent to receive SMS updates from WreckMatch and MVA Match (DBAs of
                Tophundred Global Ventures LLC) for case support and scheduling. Message & data rates may apply. Reply STOP
                to opt-out anytime.
              </p>
            </div>

            {formError ? (
              <p className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{formError}</p>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-3xl bg-red-600 py-6 text-2xl font-bold text-white transition hover:bg-red-700 disabled:opacity-60"
            >
              {submitting ? "Sending…" : "Get My Free Case Review Now"}
            </button>
            <p className="mt-6 text-center text-sm text-gray-500">Your information is 100% confidential and secure.</p>
          </form>
        </div>

        {/* How It Works */}
        <section className="bg-gray-50 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="mb-12 text-center text-3xl font-bold sm:text-4xl">How WreckMatch Works</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {HOW_IT_WORKS.map((step) => (
                <div key={step.num} className="text-center">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-4xl font-bold text-red-600">
                    {step.num}
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
                  <p className="text-gray-600">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="mb-12 text-center text-3xl font-bold sm:text-4xl">Kind Words From Real Clients</h2>
            <div className="grid gap-8 md:grid-cols-3">
              {TESTIMONIALS.map((t) => (
                <blockquote
                  key={t.name}
                  className="rounded-2xl border border-gray-200 bg-white p-8 shadow-md"
                >
                  <p className="mb-6 text-gray-700">&ldquo;{t.quote}&rdquo;</p>
                  <footer>
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-sm text-gray-500">{t.detail}</p>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        {/* Footer — no towns/zip lists */}
        <footer className="border-t border-gray-200 bg-gray-50 pb-24 pt-12">
          <div className="mx-auto max-w-6xl px-6 text-center text-sm text-gray-600">
            <p className="text-lg font-semibold text-neutral-900">WreckMatch</p>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed">
              Paid attorney advertising coordinated by participating counsel. Past results do not guarantee future outcomes.
            </p>
            <p className="mx-auto mt-4 max-w-xl rounded-xl border border-gray-300 bg-white px-4 py-3 text-neutral-800">
              <span className="font-semibold">DBA:</span> WreckMatch and MVA Match are DBAs of Tophundred Global Ventures LLC.
            </p>
            <nav aria-label="Legal policies" className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
              <Link href="/privacy" className="underline decoration-red-300 underline-offset-4 hover:text-red-700">
                Privacy Policy
              </Link>
              <span aria-hidden className="text-gray-400">
                ·
              </span>
              <Link href="/terms" className="underline decoration-red-300 underline-offset-4 hover:text-red-700">
                Terms of Use
              </Link>
            </nav>
            <p className="mt-8">
              Prefer the phone?{" "}
              <a href={telHref} className="font-semibold text-red-700 underline">
                {SUPPORT_PHONE_DISPLAY}
              </a>
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}
