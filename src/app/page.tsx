"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Calculator,
  CalendarClock,
  Clock,
  HeartHandshake,
  MapPin,
  MessageSquare,
  Phone,
  Scale,
  Shield,
  Sparkles,
  Stethoscope,
  UserCheck,
  X,
} from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress, ProgressLabel } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  RETELL_CHAT_AGENT_ID,
  RETELL_PUBLIC_KEY,
  SUPPORT_PHONE_DISPLAY,
} from "@/lib/constants";

declare global {
  interface Window {
    RetellWidget?: { open?: () => void };
  }
}

const INTRO_STEPS = [
  {
    title: "When did the accident happen?",
    hint: "So we can move at the right urgency for you.",
    icon: CalendarClock,
  },
  {
    title: "Where did it occur?",
    hint: "City and state help route you to specialists who know local courts.",
    icon: MapPin,
  },
  {
    title: "What type of crash was it?",
    hint: "Rear-end, T-bone, hit and run—we have seen every pattern.",
    icon: Scale,
  },
  {
    title: "Were you hurt?",
    hint: "Your health always comes first—we match with that in mind.",
    icon: HeartHandshake,
  },
  {
    title: "Medical care so far?",
    hint: "ER, urgent care, therapy—every honest answer is the right one.",
    icon: Stethoscope,
  },
  {
    title: "Insurance picture?",
    hint: "We decipher coverage, UM/UIM, and tough adjuster games.",
    icon: BadgeCheck,
  },
  {
    title: "Already have a lawyer?",
    hint: "Totally fine either way. No judgment—just clarity.",
    icon: UserCheck,
  },
  {
    title: "Best phone number?",
    hint: "Someone kind can follow up fast—often within minutes.",
    icon: Phone,
  },
];

const ACCIDENT_TIMES = [
  "Today",
  "Yesterday",
  "2–3 days ago",
  "4–7 days ago",
  "1–2 weeks ago",
  "2–4 weeks ago",
  "More than a month ago",
];

const ACCIDENT_TYPES = [
  "Rear-end collision",
  "T-bone (side impact)",
  "Head-on collision",
  "Sideswipe",
  "Rollover",
  "Hit and run",
  "Multi-vehicle accident",
  "Other",
];

const INJURY_OPTIONS = [
  "Yes — neck or back pain / whiplash",
  "Yes — broken bones or hospital visit",
  "Yes — other injuries",
  "No — I was not injured",
];

const MEDICAL_OPTIONS = [
  "Hospital / ER",
  "Urgent care",
  "Chiropractor",
  "Primary care doctor",
  "None yet",
  "Other",
];

const INSURANCE_OPTIONS = [
  "My own insurance",
  "Other driver’s insurance",
  "Both",
  "Uninsured / not sure",
];

const ATTORNEY_OPTIONS = [
  "No — not yet",
  "Yes — I have counsel now",
  "Yes — but I want a second opinion",
];

type FormState = {
  accidentTime: string;
  cityState: string;
  accidentType: string;
  injured: string;
  medicalTreatment: string;
  insurance: string;
  hasAttorney: string;
  phone: string;
};

const initialForm: FormState = {
  accidentTime: "",
  cityState: "",
  accidentType: "",
  injured: "",
  medicalTreatment: "",
  insurance: "",
  hasAttorney: "",
  phone: "",
};

const CALC_SEVERITY = [
  { id: "none", label: "Minimal or no lasting injury", weight: 0.62 },
  { id: "soft", label: "Soft tissue pain that hangs on", weight: 1 },
  { id: "moderate", label: "Ongoing treatment, clear impact on daily life", weight: 1.52 },
  { id: "serious", label: "Hospital stay, fractures, procedures, concussion", weight: 2.28 },
];

const CALC_BILLS = [
  { id: "b0", label: "$0–$7,500", weight: 0.88 },
  { id: "b5", label: "$7,500–$40,000", weight: 1.12 },
  { id: "b25", label: "$40,000+", weight: 1.52 },
];

const CALC_WORK = [
  { id: "w0", label: "Almost no missed income", weight: 0.92 },
  { id: "w1", label: "Several days / shifts lost", weight: 1.06 },
  { id: "w2", label: "Weeks away from work", weight: 1.28 },
  { id: "w3", label: "Months or career-level disruption", weight: 1.62 },
];

const CALC_FAULT = [
  { id: "clear", label: "Other party chiefly at fault", weight: 1.14 },
  { id: "shared", label: "Mixed fault / facts still disputed", weight: 0.9 },
];

const CALC_CRASH = [
  { id: "high", label: "Hard impact—rear-end, head-on, rollover", weight: 1.12 },
  { id: "low", label: "Low-speed scrape or gentle sideswipe", weight: 0.94 },
];

const CALC_ONGOING = [
  { id: "yes", label: "Still actively treating", weight: 1.08 },
  { id: "no", label: "Released or stabilized", weight: 0.96 },
];

function formatUsd(n: number) {
  if (n >= 1_000_000)
    return `$${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function estimateCaseRange(a: Record<string, string>) {
  const sev = CALC_SEVERITY.find((x) => x.id === a.severity)?.weight ?? 1;
  const bills = CALC_BILLS.find((x) => x.id === a.medBills)?.weight ?? 1;
  const work = CALC_WORK.find((x) => x.id === a.workLoss)?.weight ?? 1;
  const fault = CALC_FAULT.find((x) => x.id === a.fault)?.weight ?? 1;
  const crash = CALC_CRASH.find((x) => x.id === a.crashType)?.weight ?? 1;
  const ongoing = CALC_ONGOING.find((x) => x.id === a.ongoing)?.weight ?? 1;
  const combined = sev * bills * work * fault * crash * ongoing;
  const mid = Math.round(36000 + combined * 42500);
  const low = Math.round(Math.max(11000, mid * 0.34));
  const high = Math.round(mid * (combined > 1.35 ? 2.82 : 2.32));
  return { low, high, mid };
}

export default function Home() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [stepError, setStepError] = useState<string | null>(null);

  const [calc, setCalc] = useState({
    severity: "",
    medBills: "",
    workLoss: "",
    fault: "",
    crashType: "",
    ongoing: "",
  });
  const [calcResult, setCalcResult] = useState<{ low: number; high: number } | null>(null);

  const telHref = `tel:${SUPPORT_PHONE_DISPLAY.replace(/\D/g, "")}`;
  const progress = Math.round((step / 8) * 100);
  const [exitModalOpen, setExitModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const key = "wreckmatch_exit_modal_v1";
    if (sessionStorage.getItem(key)) return;
    const onLeave = (e: MouseEvent) => {
      if (e.clientY > 24) return;
      sessionStorage.setItem(key, "1");
      setExitModalOpen(true);
    };
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => document.documentElement.removeEventListener("mouseleave", onLeave);
  }, []);

  useEffect(() => {
    if (!exitModalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExitModalOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [exitModalOpen]);

  useEffect(() => {
    const id = "retell-widget-script";
    if (document.getElementById(id)) return;
    if (!RETELL_PUBLIC_KEY || RETELL_PUBLIC_KEY.includes("replace")) return;
    if (!RETELL_CHAT_AGENT_ID || RETELL_CHAT_AGENT_ID.includes("replace")) return;

    const s = document.createElement("script");
    s.id = id;
    s.src = "https://dashboard.retellai.com/retell-widget.js";
    s.async = true;
    s.setAttribute("data-public-key", RETELL_PUBLIC_KEY);
    s.setAttribute("data-agent-id", RETELL_CHAT_AGENT_ID);
    s.setAttribute("data-title", "WreckMatch · Ava");
    s.setAttribute("data-bot-name", "Ava");
    s.setAttribute("data-show-ai-popup", "false");
    document.body.appendChild(s);
  }, []);

  const openRetellWidget = useCallback(() => {
    const tryOpen = () => {
      if (typeof window === "undefined") return;
      window.RetellWidget?.open?.();
      const launcher = Array.from(
        document.querySelectorAll<HTMLElement>(
          "[class*='retell'], [class*='Retell'], [data-retell-launcher]",
        ),
      ).find((el) => el.offsetParent !== null);
      launcher?.click();
    };

    const ensureScript = () => {
      const id = "retell-widget-script";
      if (document.getElementById(id)) return;
      if (!RETELL_PUBLIC_KEY?.length || RETELL_PUBLIC_KEY.includes("replace")) return;
      if (!RETELL_CHAT_AGENT_ID?.length || RETELL_CHAT_AGENT_ID.includes("replace")) return;
      const s = document.createElement("script");
      s.id = id;
      s.src = "https://dashboard.retellai.com/retell-widget.js";
      s.async = true;
      s.setAttribute("data-public-key", RETELL_PUBLIC_KEY);
      s.setAttribute("data-agent-id", RETELL_CHAT_AGENT_ID);
      s.setAttribute("data-title", "WreckMatch · Ava");
      s.setAttribute("data-bot-name", "Ava");
      s.setAttribute("data-show-ai-popup", "false");
      document.body.appendChild(s);
    };

    ensureScript();
    tryOpen();
    let i = 0;
    const t = window.setInterval(() => {
      i += 1;
      tryOpen();
      if (i > 38) window.clearInterval(t);
    }, 125);
  }, []);

  const update = (key: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setStepError(null);
  };

  const validateStep = () => {
    switch (step) {
      case 1:
        return form.accidentTime.trim() ? null : "Select when your accident occurred.";
      case 2:
        return form.cityState.trim().length > 2 ? null : "Add city and state.";
      case 3:
        return form.accidentType ? null : "Choose the closest collision type.";
      case 4:
        return form.injured ? null : "Tell us if you were injured.";
      case 5:
        return form.medicalTreatment ? null : "Select medical care.";
      case 6:
        return form.insurance ? null : "Pick the closest insurance option.";
      case 7:
        return form.hasAttorney ? null : "Let us know your attorney status.";
      case 8: {
        const d = form.phone.replace(/\D/g, "");
        return d.length >= 10 ? null : "Enter a valid U.S. phone number.";
      }
      default:
        return null;
    }
  };

  const goNext = () => {
    const err = validateStep();
    if (err) {
      setStepError(err);
      return;
    }
    setStepError(null);
    if (step < 8) setStep((s) => s + 1);
  };

  const goBack = () => {
    setStepError(null);
    if (step > 1) setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    const err = validateStep();
    if (err) {
      setStepError(err);
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/submit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accidentTime: form.accidentTime,
          cityState: form.cityState,
          accidentType: form.accidentType,
          injured: form.injured,
          medicalTreatment: form.medicalTreatment,
          insurance: form.insurance,
          hasAttorney: form.hasAttorney,
          phone: form.phone,
        }),
      });
      const data = (await res.json()) as {
        success?: boolean;
        redirectTo?: string;
        message?: string;
      };
      if (!res.ok || !data.success) {
        setSubmitError(data.message ?? "Please try again or call—we pick up.");
        return;
      }
      if (data.redirectTo) router.push(data.redirectTo);
    } catch {
      setSubmitError("Connection issue. Call us—we are here.");
    } finally {
      setSubmitting(false);
    }
  };

  const runCalculator = () => {
    const keys = ["severity", "medBills", "workLoss", "fault", "crashType", "ongoing"] as const;
    for (const k of keys) {
      if (!calc[k]) return;
    }
    const { low, high } = estimateCaseRange(calc);
    setCalcResult({ low, high });
  };

  const resetCalculator = () => {
    setCalc({ severity: "", medBills: "", workLoss: "", fault: "", crashType: "", ongoing: "" });
    setCalcResult(null);
  };

  const calcComplete = useMemo(
    () =>
      !!(calc.severity && calc.medBills && calc.workLoss && calc.fault && calc.crashType && calc.ongoing),
    [calc],
  );

  const selectClass =
    "h-12 w-full rounded-2xl border border-stone-200/90 bg-white px-3 text-sm text-stone-800 shadow-sm outline-none transition focus:border-amber-300/70 focus:ring-2 focus:ring-amber-100";

  function OptionGroup({
    label,
    options,
    value,
    onChange,
    name,
  }: {
    label: string;
    options: { id: string; label: string }[];
    value: string;
    onChange: (v: string) => void;
    name: string;
  }) {
    return (
      <div className="space-y-3">
        <p className="text-sm font-medium text-stone-800">{label}</p>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {options.map((o) => (
            <label
              key={o.id}
              className={cn(
                "flex cursor-pointer items-start gap-2.5 rounded-2xl border px-3.5 py-3 text-sm leading-snug shadow-sm transition",
                value === o.id
                  ? "border-amber-300/70 bg-amber-50/90 ring-1 ring-amber-200/50"
                  : "border-stone-200/80 bg-white hover:border-stone-300",
              )}
            >
              <input type="radio" name={name} checked={value === o.id} onChange={() => onChange(o.id)} className="mt-1" />
              <span className="text-stone-700">{o.label}</span>
            </label>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f5ef] text-slate-900 antialiased">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-[#f9f5ef]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div className="flex items-center gap-2 font-semibold tracking-tight text-slate-900">
            <Shield className="size-7 text-amber-800" aria-hidden />
            <span className="text-lg sm:text-xl">WreckMatch</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={openRetellWidget}
              className="hidden rounded-full border-amber-200/70 bg-white sm:inline-flex md:h-9"
            >
              <MessageSquare className="size-4" />
              Ava 24/7
            </Button>
            <a
              href={telHref}
              className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm transition hover:bg-stone-50"
            >
              <Phone className="size-4 text-amber-800" />
              <span className="hidden lg:inline">{SUPPORT_PHONE_DISPLAY}</span>
              <span className="lg:hidden">Call</span>
            </a>
          </div>
        </div>
      </header>

      <section className="relative">
        <div className="relative min-h-[78vh] w-full overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=2200&q=82"
            alt="Hopeful, caring support after an accident—not alone"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-[#1e293b]/78 to-[#0f172a]/90" />

          <div className="relative z-10 mx-auto flex max-w-5xl min-h-[78vh] flex-col justify-center px-5 py-20 sm:px-8 lg:py-28">
            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-amber-100/95">
              <Sparkles className="size-3.5" />
              Confidential · Fast · Nationwide
            </div>
            <h1 className="max-w-4xl text-balance font-semibold tracking-tight text-white text-[2rem] leading-[1.08] sm:text-5xl lg:text-[3.25rem]">
              Injured in a Car Accident?
              <span className="mt-3 block bg-gradient-to-r from-amber-100 to-amber-50/95 bg-clip-text text-transparent">
                Welcome Home to Real Help.
              </span>
            </h1>
            <p className="mt-8 max-w-2xl text-pretty text-lg leading-relaxed text-slate-100/95 sm:text-xl">
              Network attorneys have recovered <span className="font-semibold text-white">$1 Billion+</span> for
              families like yours—get matched in about <span className="font-semibold">60&nbsp;seconds</span>.
              {" "}
              <span className="font-medium text-amber-100/95">No Win, No Fee</span>
              {" · "}
              <span className="font-medium text-amber-100/95">Ava is here 24/7</span>
              {" — free to talk anytime."}
            </p>
            <div className="mt-12 flex max-w-xl flex-col gap-4 sm:max-w-none sm:flex-row sm:flex-wrap">
              <a
                href="#intake"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "inline-flex min-h-[3.35rem] items-center justify-center rounded-2xl bg-amber-500 px-8 text-base font-semibold text-stone-950 shadow-lg shadow-black/25 hover:bg-amber-400",
                )}
              >
                Start free review
                <ArrowRight className="size-4" />
              </a>
              <a
                href={telHref}
                className="inline-flex min-h-[3.35rem] flex-1 touch-manipulation items-center justify-center gap-2 rounded-2xl border-2 border-white/45 bg-white/10 px-7 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/14 sm:min-w-[15.5rem]"
              >
                <Phone className="size-5 text-amber-200" />
                Call {SUPPORT_PHONE_DISPLAY}
              </a>
              <button
                type="button"
                onClick={openRetellWidget}
                className={cn(
                  buttonVariants({ size: "lg", variant: "secondary" }),
                  "inline-flex min-h-[3.35rem] flex-1 items-center justify-center gap-2 rounded-2xl border border-amber-200/35 bg-stone-900/50 px-8 text-base font-semibold text-amber-50 backdrop-blur-sm hover:bg-stone-900/65 sm:flex-initial sm:min-w-[15.5rem]",
                )}
              >
                <MessageSquare className="size-4 text-amber-200" />
                Speak with Ava 24/7
              </button>
            </div>
          </div>
        </div>

        <div className="border-y border-stone-200/80 bg-white py-10">
          <div className="mx-auto grid max-w-6xl gap-4 px-5 sm:grid-cols-2 sm:gap-6 sm:px-8 lg:grid-cols-5">
            {(
              [
                { headline: "$1 Billion+", sub: "network recoveries", Icon: Sparkles },
                { headline: "No Win, No Fee", sub: "when attorneys take your case", Icon: Scale },
                { headline: "100% Confidential", sub: "your story stays yours", Icon: Shield },
                { headline: "~60 sec match", sub: "then human follow-through", Icon: Clock },
                { headline: "Ava 24/7", sub: "always on duty", Icon: MessageSquare },
              ] as const
            ).map(({ headline, sub, Icon }) => (
              <div
                key={headline}
                className="flex gap-4 rounded-2xl border border-stone-100 bg-[#fdf8f4] px-4 py-4 shadow-sm"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-stone-100">
                  <Icon className="size-5 text-amber-800" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-bold text-stone-900">{headline}</p>
                  <p className="text-xs leading-snug text-stone-600">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="calculator" className="scroll-mt-28 border-t border-stone-200/50 bg-[#f5ebe3]/85 py-18 sm:py-24">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <div className="text-center">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-900/75">
              <Calculator className="size-4" />
              Case value snapshot
            </p>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Six plain questions—not a courtroom
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-pretty text-base leading-relaxed text-stone-600">
              A soft range—not a verdict—before you chat with Ava or counsel. Completely optional.
            </p>
          </div>

          <Card className="mt-14 border-stone-200/85 shadow-[0_20px_50px_-28px_rgba(0,0,0,0.2)] ring-1 ring-black/[0.04]">
            <CardHeader className="space-y-1 border-b border-stone-100 bg-white pb-8">
              <CardTitle className="text-xl">Illustrative band</CardTitle>
              <CardDescription className="text-[0.95rem] text-stone-600">
                Education only—not legal advice. Real outcomes depend on evidence, jurisdiction, and coverage limits.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-10 bg-[#fdfaf6] pt-10">
              <OptionGroup
                name="sev"
                label="1. Injury description"
                value={calc.severity}
                onChange={(v) => setCalc((c) => ({ ...c, severity: v }))}
                options={CALC_SEVERITY}
              />
              <OptionGroup
                name="bills"
                label="2. Medical expenses (rough estimate)"
                value={calc.medBills}
                onChange={(v) => setCalc((c) => ({ ...c, medBills: v }))}
                options={CALC_BILLS}
              />
              <OptionGroup
                name="wk"
                label="3. Lost income"
                value={calc.workLoss}
                onChange={(v) => setCalc((c) => ({ ...c, workLoss: v }))}
                options={CALC_WORK}
              />
              <OptionGroup
                name="flt"
                label="4. Fault clarity"
                value={calc.fault}
                onChange={(v) => setCalc((c) => ({ ...c, fault: v }))}
                options={CALC_FAULT}
              />
              <OptionGroup
                name="cr"
                label="5. Severity of collision"
                value={calc.crashType}
                onChange={(v) => setCalc((c) => ({ ...c, crashType: v }))}
                options={CALC_CRASH}
              />
              <OptionGroup
                name="on"
                label="6. Ongoing treatment"
                value={calc.ongoing}
                onChange={(v) => setCalc((c) => ({ ...c, ongoing: v }))}
                options={CALC_ONGOING}
              />

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  type="button"
                  disabled={!calcComplete}
                  onClick={runCalculator}
                  className="h-12 flex-1 rounded-2xl bg-amber-800 text-white hover:bg-amber-900 disabled:pointer-events-none disabled:opacity-35"
                >
                  Reveal range
                </Button>
                <Button type="button" variant="outline" onClick={resetCalculator} className="h-12 rounded-2xl">
                  Clear
                </Button>
              </div>

              {calcResult && (
                <div className="rounded-2xl border border-amber-200/65 bg-gradient-to-b from-amber-50 to-white p-8 text-center shadow-inner">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-900/65">Soft estimate band</p>
                  <p className="mt-4 text-xl font-semibold text-stone-900 sm:text-2xl">
                    {formatUsd(calcResult.low)} — {formatUsd(calcResult.high)}
                  </p>
                  <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-stone-600">
                    When you are ready for detail, Ava or live intake can personalize this—for free.
                  </p>
                  <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                    <Button type="button" onClick={openRetellWidget} className="h-12 rounded-2xl bg-stone-900 text-white hover:bg-stone-800">
                      <MessageSquare />
                      Chat with Ava
                    </Button>
                    <a
                      href="#intake"
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "inline-flex h-12 items-center justify-center rounded-2xl border-stone-200 bg-white px-6 font-medium",
                      )}
                    >
                      Official intake →
                    </a>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="border-t border-stone-200/50 bg-white py-18 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Eight questions—weighted toward kindness
            </h2>
            <p className="mt-6 text-pretty text-lg leading-relaxed text-stone-600">
              You are moving through grief, pain, paperwork, sleepless nights. We keep wording soft and space generous.
              Most survivors finish quietly in minutes.
            </p>
          </div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {INTRO_STEPS.map((item, idx) => {
              const Ico = item.icon;
              return (
                <article
                  key={item.title}
                  className="flex gap-4 rounded-3xl border border-stone-100 bg-[#faf6f2] p-6 shadow-[0_8px_30px_-20px_rgba(0,0,0,0.12)]"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-sm font-bold text-amber-900 shadow-sm ring-1 ring-stone-100">
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-start gap-2">
                      <Ico className="mt-0.5 size-4 text-stone-400" aria-hidden />
                      <h3 className="font-semibold leading-snug text-stone-900">{item.title}</h3>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-stone-600">{item.hint}</p>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="mt-14 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#intake"
              className={cn(
                buttonVariants({ size: "lg" }),
                "min-w-[15rem] rounded-2xl bg-stone-900 px-10 text-white hover:bg-stone-800",
              )}
            >
              Gentle intake →
              <ArrowRight className="size-4" />
            </a>
            <button
              type="button"
              onClick={openRetellWidget}
              className={cn(buttonVariants({ size: "lg", variant: "outline" }), "min-w-[15rem] rounded-2xl border-amber-200 bg-amber-50/60")}
            >
              Start with Ava
            </button>
          </div>
        </div>
      </section>

      <section className="border-t border-stone-200/55 bg-[#fdf9f6] py-18 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <h2 className="text-center text-balance text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            How WreckMatch works
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-center text-base leading-relaxed text-stone-600">
            Four restrained steps—from panic to posture—without the billboard-noise hustle.
          </p>
          <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-10">
            {[
              {
                n: "01",
                title: "Tell your story privately",
                copy: "Short answers—we never overwhelm you.",
                icon: MessageSquare,
              },
              {
                n: "02",
                title: "~60-second matchmaking",
                copy: "We align you with litigators fluent in verdicts—not volume dialers.",
                icon: Clock,
              },
              {
                n: "03",
                title: "Zero-pressure consult",
                copy: "Discuss fees plainly. Fees tied to wins when allowed.",
                icon: Phone,
              },
              {
                n: "04",
                title: "Heal; they escalate",
                copy: "Evidence, demands, courtroom muscle—handled while you recover.",
                icon: HeartHandshake,
              },
            ].map((item) => {
              const I = item.icon;
              return (
                <div key={item.n} className="rounded-3xl border border-slate-100 bg-white p-7 shadow-sm">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">{item.n}</span>
                  <div className="mt-5 flex size-11 items-center justify-center rounded-2xl bg-amber-50 ring-1 ring-amber-100">
                    <I className="size-5 text-amber-800" aria-hidden />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-600">{item.copy}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="intake" className="scroll-mt-28 border-t border-stone-200/55 bg-[#efe8df]/70 py-18 sm:py-24">
        <div className="mx-auto w-full max-w-lg px-5 sm:max-w-xl sm:px-8">
          <Card className="overflow-hidden rounded-3xl border-stone-200/90 shadow-xl ring-1 ring-black/[0.04]">
            <CardHeader className="border-b border-stone-100 bg-white pb-6">
              <CardTitle className="text-xl">Soft intake doorway</CardTitle>
              <CardDescription className="text-[0.95rem]">Step {step} of 8 · pause anytime</CardDescription>
              <div className="pt-4">
                <Progress value={progress}>
                  <div className="mb-2 flex justify-between gap-2 text-xs text-stone-500">
                    <ProgressLabel>Journey</ProgressLabel>
                    <span className="tabular-nums">{progress}%</span>
                  </div>
                </Progress>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 bg-white pb-8 pt-8">
              {step === 1 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">When?</label>
                  <select className={selectClass} value={form.accidentTime} onChange={(e) => update("accidentTime", e.target.value)}>
                    <option value="">Choose…</option>
                    {ACCIDENT_TIMES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              )}
              {step === 2 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Where (city & state)?</label>
                  <Input className="h-12 rounded-2xl" placeholder="e.g. Knoxville, TN" value={form.cityState} onChange={(e) => update("cityState", e.target.value)} />
                </div>
              )}
              {step === 3 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Accident shape</label>
                  <select className={selectClass} value={form.accidentType} onChange={(e) => update("accidentType", e.target.value)}>
                    <option value="">Choose…</option>
                    {ACCIDENT_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              )}
              {step === 4 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Injuries?</label>
                  <select className={selectClass} value={form.injured} onChange={(e) => update("injured", e.target.value)}>
                    <option value="">Choose…</option>
                    {INJURY_OPTIONS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              )}
              {step === 5 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Care received?</label>
                  <select className={selectClass} value={form.medicalTreatment} onChange={(e) => update("medicalTreatment", e.target.value)}>
                    <option value="">Choose…</option>
                    {MEDICAL_OPTIONS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              )}
              {step === 6 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Insurance context</label>
                  <select className={selectClass} value={form.insurance} onChange={(e) => update("insurance", e.target.value)}>
                    <option value="">Choose…</option>
                    {INSURANCE_OPTIONS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              )}
              {step === 7 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Attorney already?</label>
                  <select className={selectClass} value={form.hasAttorney} onChange={(e) => update("hasAttorney", e.target.value)}>
                    <option value="">Choose…</option>
                    {ATTORNEY_OPTIONS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              )}
              {step === 8 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Your phone</label>
                  <Input type="tel" autoComplete="tel" placeholder="digits only okay" value={form.phone} onChange={(e) => update("phone", e.target.value)} className="h-12 rounded-2xl" />
                </div>
              )}
              {stepError && (
                <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{stepError}</p>
              )}
              {submitError && (
                <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{submitError}</p>
              )}
            </CardContent>
            <CardFooter className="flex flex-col-reverse gap-3 border-t bg-[#fcf9f6] pb-8 pt-6 sm:flex-row sm:justify-between">
              <Button type="button" variant="outline" onClick={goBack} disabled={step === 1 || submitting} className="h-12 rounded-2xl">
                Previous
              </Button>
              {step < 8 ? (
                <Button type="button" onClick={goNext} className="h-12 rounded-2xl bg-amber-900 text-white hover:bg-[#78350f]">
                  Continue
                  <ArrowRight />
                </Button>
              ) : (
                <Button type="button" disabled={submitting} onClick={handleSubmit} className="h-12 rounded-2xl bg-stone-900 text-white hover:bg-stone-800">
                  {submitting ? "Submitting…" : "Secure consult request"}
                </Button>
              )}
            </CardFooter>
          </Card>
          <p className="mt-10 text-center text-sm text-stone-600">
            Voice easier? Ring <a href={telHref} className="font-semibold text-amber-950 underline underline-offset-2">{SUPPORT_PHONE_DISPLAY}</a> or{" "}
            <button type="button" onClick={openRetellWidget} className="font-semibold text-amber-950 underline underline-offset-2">open Ava</button>.
          </p>
        </div>
      </section>

      <section className="border-t border-slate-900/90 bg-[#0f172a] py-18 text-slate-200 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <h2 className="text-center text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Voices that felt the difference
          </h2>
          <div className="mt-14 grid gap-8 lg:grid-cols-3 lg:gap-10">
            {[
              {
                q: "I went from voicemail hell to clarity in one calm conversation—they treated it like dignity, not a lead ID.",
                n: "Alicia K.",
                s: "Rear-impact cervical strain",
              },
              {
                q: "Insurance stopped slow-walking us when serious counsel surfaced. Transparent fees. Zero theatrics.",
                n: "Devon L.",
                s: "Uninsured motorist stack",
              },
              {
                q: "Honestly I expected a sales trap. Got empathy first, timelines second—that built trust instantly.",
                n: "Rosa F.",
                s: "T-bone disputed liability",
              },
            ].map((t) => (
              <blockquote
                key={t.n}
                className="flex h-full flex-col rounded-3xl border border-white/[0.08] bg-white/[0.04] p-8 backdrop-blur-sm"
              >
                <p className="flex-1 text-sm leading-relaxed sm:text-[0.9375rem]">&ldquo;{t.q}&rdquo;</p>
                <footer className="mt-8 border-t border-white/[0.1] pt-5 text-xs">
                  <p className="font-semibold text-white">{t.n}</p>
                  <p className="mt-1 text-stone-500">{t.s}</p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-stone-200 bg-[#faf6f2] pb-14 pt-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-5 text-center sm:px-8">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Shield className="size-7 text-amber-800" />
            WreckMatch
          </div>
          <p className="max-w-xl text-sm text-slate-600">
            We connect injured people—not case files—to attorneys hardened by billion-dollar arenas yet gentle on frightened callers.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href={telHref} className={cn(buttonVariants({ size: "lg" }), "rounded-2xl bg-amber-800 text-white hover:bg-amber-900")}>
              <Phone /> {SUPPORT_PHONE_DISPLAY}
            </a>
            <button type="button" onClick={openRetellWidget} className={cn(buttonVariants({ size: "lg", variant: "outline" }), "rounded-2xl border-stone-300 bg-white px-10")}>
              <MessageSquare /> Ava
            </button>
          </div>
          <p className="max-w-xl text-[0.7rem] leading-relaxed text-slate-500">
            Paid attorney advertising coordinated by participating counsel. Past verdicts/settlements are not warranties of future results.
            Communication does not form an attorney–client bond by itself.
          </p>
        </div>
      </footer>

      {exitModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="exit-modal-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/55 backdrop-blur-[2px]"
            aria-label="Close dialog background"
            onClick={() => setExitModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-md rounded-3xl border border-slate-200/90 bg-[#fdfaf6] p-8 shadow-[0_25px_80px_-20px_rgba(15,23,42,0.45)]">
            <button
              type="button"
              onClick={() => setExitModalOpen(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close"
            >
              <X className="size-5" />
            </button>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-800/80">Before you go</p>
            <h2 id="exit-modal-title" className="mt-3 text-2xl font-semibold leading-snug tracking-tight text-slate-900 sm:text-[1.65rem]">
              Leaving already? You don&apos;t have to go through this alone.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              A calm specialist—or Ava—can walk you through options in plain language. No pressure, no cost to talk.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button
                type="button"
                onClick={() => {
                  setExitModalOpen(false);
                  openRetellWidget();
                }}
                className="h-12 flex-1 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 sm:min-w-[10rem]"
              >
                <MessageSquare className="size-4" />
                Chat with Ava
              </Button>
              <a
                href={telHref}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "inline-flex h-12 flex-1 items-center justify-center rounded-2xl border-slate-300 bg-white font-semibold text-slate-900 sm:min-w-[10rem]",
                )}
                onClick={() => setExitModalOpen(false)}
              >
                <Phone className="size-4" />
                Call now
              </a>
            </div>
            <button
              type="button"
              onClick={() => setExitModalOpen(false)}
              className="mt-6 w-full text-center text-sm font-medium text-slate-500 underline-offset-4 hover:text-slate-700 hover:underline"
            >
              Continue browsing
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
