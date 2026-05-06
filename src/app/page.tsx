"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  Calculator,
  CheckCircle2,
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
  const [headerElevated, setHeaderElevated] = useState(false);
  const [showFloatAva, setShowFloatAva] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setHeaderElevated(y > 10);
      setShowFloatAva(y > 360);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    "h-14 w-full rounded-2xl border border-slate-200/90 bg-white/95 px-4 text-sm text-slate-800 shadow-sm outline-none transition-all duration-200 hover:border-amber-200/80 hover:shadow-md focus:border-amber-400/70 focus:ring-4 focus:ring-amber-100/60";

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
      <div className="space-y-4">
        <p className="text-sm font-medium tracking-wide text-slate-800">{label}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {options.map((o) => (
            <label
              key={o.id}
              className={cn(
                "group flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-4 text-sm leading-relaxed shadow-sm transition-all duration-200",
                value === o.id
                  ? "border-amber-400/45 bg-gradient-to-br from-amber-50/95 to-white shadow-md ring-2 ring-amber-200/35"
                  : "border-slate-200/75 bg-white/95 hover:-translate-y-0.5 hover:border-amber-200/55 hover:shadow-md",
              )}
            >
              <input type="radio" name={name} checked={value === o.id} onChange={() => onChange(o.id)} className="mt-1" />
              <span className="text-slate-700">{o.label}</span>
            </label>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7f2] text-slate-900 antialiased selection:bg-amber-200/40 selection:text-slate-900">
      <header
        className={cn(
          "sticky top-0 z-40 border-b backdrop-blur-xl transition-[box-shadow,border-color,background-color] duration-300",
          headerElevated
            ? "border-slate-200/70 bg-[#faf7f2]/92 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.12)]"
            : "border-transparent bg-[#faf7f2]/80",
        )}
      >
        <div className="mx-auto flex max-w-[72rem] items-center justify-between gap-6 px-6 py-5 sm:px-10 lg:px-12">
          <div className="flex items-center gap-3 font-semibold tracking-tight text-slate-900">
            <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-white shadow-inner ring-1 ring-amber-200/60">
              <Shield className="size-5 text-[#a16207]" aria-hidden />
            </span>
            <span className="text-xl tracking-[0.01em] sm:text-2xl">WreckMatch</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={openRetellWidget}
              className="hidden rounded-full border-amber-200/80 bg-white/90 shadow-sm transition hover:border-amber-300 hover:shadow md:inline-flex md:h-10 md:px-4"
            >
              <MessageSquare className="size-4 text-amber-800" />
              Ava 24/7
            </Button>
            <a
              href={telHref}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200/90 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition-all duration-200 hover:-translate-y-px hover:border-amber-200/90 hover:shadow-md"
            >
              <Phone className="size-4 text-amber-800" />
              <span className="hidden lg:inline">{SUPPORT_PHONE_DISPLAY}</span>
              <span className="lg:hidden">Call</span>
            </a>
          </div>
        </div>
      </header>

      <section className="relative">
        <div className="relative min-h-[85vh] w-full overflow-hidden lg:min-h-[88vh]">
          <Image
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=2200&q=82"
            alt="Hopeful, caring support after an accident—not alone"
            fill
            priority
            className="object-cover object-[center_22%] scale-105 sm:scale-100"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/88 via-[#172554]/82 to-[#0c1222]/92" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(251,191,36,0.12),_transparent_55%)]" />

          <div className="relative z-10 mx-auto flex min-h-[85vh] max-w-5xl flex-col justify-center px-6 py-24 sm:px-10 lg:min-h-[88vh] lg:max-w-6xl lg:px-14 lg:py-32">
            <div className="mb-8 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/[0.09] px-5 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-amber-100/95 shadow-sm backdrop-blur-md">
              <Sparkles className="size-3.5 text-amber-200" />
              Confidential · Fast · Nationwide
            </div>
            <h1 className="max-w-[20ch] text-balance font-semibold tracking-[-0.02em] text-white text-[2.35rem] leading-[1.05] sm:max-w-none sm:text-6xl sm:leading-[1.02] lg:text-[3.65rem]">
              Injured in a Car Accident?
              <span className="mt-4 block bg-gradient-to-r from-amber-50 via-amber-100 to-amber-200/90 bg-clip-text font-medium text-transparent sm:mt-5">
                Welcome Home to Real Help.
              </span>
            </h1>
            <p className="mt-10 max-w-2xl text-pretty font-light leading-[1.7] text-slate-100/95 text-lg sm:text-xl lg:text-[1.35rem]">
              Whatever happened, you deserve steadiness—not stress. Attorneys in our network have recovered{" "}
              <span className="font-semibold text-white">$1 Billion+</span> for families like yours. Match in about{" "}
              <span className="font-medium text-white">60&nbsp;seconds</span>.{" "}
              <span className="font-medium text-amber-100/98">No Win, No Fee</span>
              <span className="text-slate-300/90"> · </span>
              <span className="font-medium text-amber-100/98">Ava is here 24/7</span>
              {" — tender, clear, human help whenever you are ready."}
            </p>
            <div className="mt-14 flex max-w-xl flex-col gap-4 sm:max-w-none sm:flex-row sm:flex-wrap sm:gap-5">
              <a
                href="#intake"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "inline-flex min-h-[3.5rem] items-center justify-center rounded-2xl bg-gradient-to-b from-amber-400 to-amber-500 px-10 text-base font-semibold text-slate-950 shadow-[0_12px_40px_-10px_rgba(245,158,11,0.55)] transition-all duration-200 hover:-translate-y-0.5 hover:from-amber-300 hover:to-amber-400 hover:shadow-[0_16px_44px_-8px_rgba(245,158,11,0.5)] active:translate-y-0",
                )}
              >
                Start free review
                <ArrowRight className="size-4" />
              </a>
              <a
                href={telHref}
                className="inline-flex min-h-[3.5rem] flex-1 touch-manipulation items-center justify-center gap-2.5 rounded-2xl border border-white/35 bg-white/[0.08] px-8 text-base font-semibold text-white shadow-inner backdrop-blur-md transition-all duration-200 hover:border-white/50 hover:bg-white/[0.14] hover:shadow-lg sm:min-w-[16rem]"
              >
                <Phone className="size-5 text-amber-200" />
                Call {SUPPORT_PHONE_DISPLAY}
              </a>
              <button
                type="button"
                onClick={openRetellWidget}
                className={cn(
                  buttonVariants({ size: "lg", variant: "secondary" }),
                  "inline-flex min-h-[3.5rem] flex-1 items-center justify-center gap-2 rounded-2xl border border-amber-300/25 bg-slate-950/40 px-9 text-base font-semibold text-amber-50 shadow-lg shadow-slate-950/30 backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-200/40 hover:bg-slate-950/55 sm:flex-initial sm:min-w-[16rem]",
                )}
              >
                <MessageSquare className="size-4 text-amber-200" />
                Speak with Ava 24/7
              </button>
            </div>
            <p className="mt-12 max-w-xl text-sm font-light leading-relaxed text-slate-300/90 sm:text-[0.95rem]">
              There is no wrong time to ask for help. We move gently, answer honestly, and protect your privacy like it
              were our own family on the line.
            </p>
          </div>
        </div>

        <div className="border-y border-slate-200/60 bg-gradient-to-b from-white to-[#faf7f2] py-14 sm:py-16">
          <div className="mx-auto grid max-w-[72rem] gap-5 px-6 sm:grid-cols-2 sm:gap-6 sm:px-10 lg:grid-cols-5 lg:gap-6 lg:px-12">
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
                className="group flex gap-4 rounded-2xl border border-slate-100/90 bg-white/80 px-5 py-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-200/40 hover:shadow-lg"
              >
                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-50 to-white shadow-sm ring-1 ring-amber-100/80 transition group-hover:ring-amber-200/60">
                  <Icon className="size-5 text-[#b45309]" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold tracking-tight text-slate-900">{headline}</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="calculator"
        className="scroll-mt-28 border-t border-slate-200/50 bg-gradient-to-b from-[#f3ece4] via-[#faf7f2] to-[#faf7f2] py-24 sm:py-28 lg:py-32"
      >
        <div className="mx-auto max-w-3xl px-6 sm:max-w-[40rem] sm:px-10 lg:px-12">
          <div className="text-center">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.26em] text-amber-900/80">
              <Calculator className="size-4 text-amber-800" />
              Case value snapshot
            </p>
            <h2 className="mt-6 text-balance text-[2rem] font-semibold tracking-[-0.02em] text-slate-900 sm:text-[2.5rem] lg:text-[2.75rem]">
              Six calm questions—not a courtroom
            </h2>
            <p className="mx-auto mt-6 max-w-lg text-pretty text-base leading-[1.7] text-slate-600 sm:text-lg">
              A soft range—not a verdict—before you speak with Ava or counsel. Take your time; skip anything that feels
              heavy. Completely optional.
            </p>
          </div>

          <Card className="mt-16 overflow-hidden rounded-3xl border-slate-200/80 bg-white shadow-[0_24px_60px_-28px_rgba(15,23,42,0.22)] ring-1 ring-slate-900/[0.04]">
            <CardHeader className="space-y-3 border-b border-slate-100/90 bg-gradient-to-br from-white to-[#fffbf6] px-8 pb-10 pt-10 sm:px-10">
              <CardTitle className="text-2xl font-semibold tracking-tight text-slate-900">Illustrative band</CardTitle>
              <CardDescription className="text-[1rem] leading-relaxed text-slate-600">
                Education only—not legal advice. Real outcomes depend on evidence, jurisdiction, and coverage limits.
                We show this so you can breathe a little easier while you decide your next step.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-12 bg-gradient-to-b from-[#fffdf9] to-[#faf7f2] px-8 pb-12 pt-12 sm:px-10">
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

              <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
                <Button
                  type="button"
                  disabled={!calcComplete}
                  onClick={runCalculator}
                  className="h-14 flex-1 rounded-2xl bg-gradient-to-b from-[#1e293b] to-[#0f172a] text-[0.9375rem] font-semibold text-white shadow-[0_12px_32px_-8px_rgba(15,23,42,0.45)] transition-all duration-200 hover:-translate-y-0.5 hover:from-[#334155] hover:to-[#1e293b] disabled:pointer-events-none disabled:translate-y-0 disabled:opacity-35"
                >
                  Reveal range
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetCalculator}
                  className="h-14 shrink-0 rounded-2xl border-slate-200 bg-white px-8 font-medium text-slate-700 shadow-sm transition hover:border-amber-200/70 hover:bg-amber-50/50 hover:shadow"
                >
                  Clear
                </Button>
              </div>

              {calcResult && (
                <div className="rounded-3xl border border-amber-200/50 bg-gradient-to-br from-amber-50 via-white to-[#fffdfb] p-10 text-center shadow-[inset_0_2px_0_rgba(255,255,255,0.8)] sm:p-11">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-900/60">Soft estimate band</p>
                  <p className="mt-6 font-serif text-3xl font-medium tracking-tight text-slate-900 sm:text-4xl">
                    {formatUsd(calcResult.low)} — {formatUsd(calcResult.high)}
                  </p>
                  <p className="mx-auto mt-6 max-w-md text-[0.9375rem] leading-relaxed text-slate-600">
                    Numbers can feel cold; this moment is anything but. When you want warmth and precision together, Ava or
                    our intake team can personalize this—with no fee to talk it through.
                  </p>
                  <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
                    <Button
                      type="button"
                      onClick={openRetellWidget}
                      className="h-14 rounded-2xl bg-slate-900 text-[0.9375rem] font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-800 sm:px-8"
                    >
                      <MessageSquare />
                      Chat with Ava
                    </Button>
                    <a
                      href="#intake"
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "inline-flex h-14 items-center justify-center rounded-2xl border-slate-200 bg-white px-8 text-[0.9375rem] font-semibold text-slate-900 shadow-sm transition hover:border-amber-200/70 hover:bg-amber-50/40 hover:shadow",
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

      <section className="border-t border-slate-200/55 bg-white py-24 sm:py-28 lg:py-32">
        <div className="mx-auto max-w-[72rem] px-6 sm:px-10 lg:px-12">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-balance text-[2rem] font-semibold tracking-[-0.02em] text-slate-900 sm:text-[2.5rem] lg:text-[2.75rem]">
              Eight questions—weighted toward kindness
            </h2>
            <p className="mt-8 text-pretty text-lg leading-[1.75] text-slate-600 sm:text-xl">
              You might be juggling grief, pain, paperwork, and sleepless nights. We keep wording soft, spacing wide, and
              judgment nowhere in sight—most folks finish calmly in minutes.
            </p>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7">
            {INTRO_STEPS.map((item, idx) => {
              const Ico = item.icon;
              return (
                <article
                  key={item.title}
                  className="group flex gap-5 rounded-[1.35rem] border border-slate-100 bg-gradient-to-b from-[#fffdfb] to-[#faf7f2] p-7 shadow-[0_14px_40px_-26px_rgba(15,23,42,0.18)] transition-all duration-200 hover:border-amber-200/35 hover:shadow-xl"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white text-sm font-bold text-[#92400e] shadow-sm ring-1 ring-amber-100/90">
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-start gap-2.5">
                      <Ico className="mt-0.5 size-4 text-slate-400 transition group-hover:text-amber-800/70" aria-hidden />
                      <h3 className="font-semibold leading-snug tracking-tight text-slate-900">{item.title}</h3>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.hint}</p>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="mt-16 flex flex-col items-center justify-center gap-5 sm:flex-row">
            <a
              href="#intake"
              className={cn(
                buttonVariants({ size: "lg" }),
                "min-w-[15.5rem] rounded-2xl bg-gradient-to-b from-[#1e293b] to-[#0f172a] px-12 text-[0.9375rem] font-semibold text-white shadow-[0_14px_40px_-14px_rgba(15,23,42,0.45)] transition hover:-translate-y-0.5 hover:shadow-xl",
              )}
            >
              Gentle intake →
              <ArrowRight className="size-4" />
            </a>
            <button
              type="button"
              onClick={openRetellWidget}
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "min-w-[15.5rem] rounded-2xl border-amber-200/80 bg-amber-50/50 text-[0.9375rem] font-semibold text-slate-900 shadow-sm transition hover:border-amber-300 hover:bg-amber-50 hover:shadow-md",
              )}
            >
              Start with Ava
            </button>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200/55 bg-gradient-to-b from-[#fcf8f5] to-[#faf7f2] py-24 sm:py-28 lg:py-32">
        <div className="mx-auto max-w-[72rem] px-6 sm:px-10 lg:px-12">
          <h2 className="text-center text-balance text-[2rem] font-semibold tracking-[-0.02em] text-slate-900 sm:text-[2.5rem]">
            How WreckMatch works
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-center text-[1.05rem] leading-[1.7] text-slate-600 sm:text-lg">
            Four restrained steps—from racing heart to grounded next steps—with none of the billboard-noise hustle.
          </p>
          <div className="mt-16 grid gap-9 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
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
                <div
                  key={item.n}
                  className="group rounded-[1.35rem] border border-white/80 bg-white/90 p-8 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.2)] backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:border-amber-200/40 hover:shadow-xl"
                >
                  <span className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">{item.n}</span>
                  <div className="mt-6 flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-50 to-white shadow-inner ring-1 ring-amber-100/90">
                    <I className="size-5 text-[#b45309]" aria-hidden />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold tracking-tight text-slate-900">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.copy}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="intake" className="scroll-mt-28 border-t border-slate-200/50 bg-[#ebe4da]/55 py-24 sm:py-28 lg:py-32">
        <div className="mx-auto w-full max-w-lg px-6 sm:max-w-xl sm:px-10 lg:max-w-[28rem]">
          <Card className="overflow-hidden rounded-[1.65rem] border-slate-200/85 shadow-[0_28px_70px_-32px_rgba(15,23,42,0.28)] ring-1 ring-slate-900/[0.04]">
            <CardHeader className="border-b border-slate-100 bg-gradient-to-br from-white to-[#fffcf8] pb-8 pt-8">
              <CardTitle className="text-2xl font-semibold tracking-tight text-slate-900">Soft intake doorway</CardTitle>
              <CardDescription className="mt-2 text-[1rem] text-slate-600">
                Step {step} of 8 · pause anytime · your pace is perfect
              </CardDescription>
              <div className="pt-4">
                <Progress value={progress}>
                  <div className="mb-2 flex justify-between gap-2 text-xs text-stone-500">
                    <ProgressLabel>Journey</ProgressLabel>
                    <span className="tabular-nums">{progress}%</span>
                  </div>
                </Progress>
              </div>
            </CardHeader>
            <CardContent className="space-y-7 bg-white px-8 pb-10 pt-10 sm:px-10">
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
                  <Input
                    className="h-14 rounded-2xl border-slate-200 shadow-sm transition focus-visible:ring-amber-100"
                    placeholder="e.g. Knoxville, TN"
                    value={form.cityState}
                    onChange={(e) => update("cityState", e.target.value)}
                  />
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
                  <Input
                    type="tel"
                    autoComplete="tel"
                    placeholder="digits only okay"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    className="h-14 rounded-2xl border-slate-200 shadow-sm transition focus-visible:ring-amber-100"
                  />
                </div>
              )}
              {stepError && (
                <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{stepError}</p>
              )}
              {submitError && (
                <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{submitError}</p>
              )}
            </CardContent>
            <CardFooter className="flex flex-col-reverse gap-4 border-t border-slate-100 bg-gradient-to-b from-[#fffdfb] to-[#faf7f2] px-8 pb-10 pt-8 sm:flex-row sm:justify-between sm:px-10">
              <Button
                type="button"
                variant="outline"
                onClick={goBack}
                disabled={step === 1 || submitting}
                className="h-14 rounded-2xl border-slate-200 bg-white font-medium shadow-sm transition hover:border-amber-200/70 hover:bg-amber-50/30"
              >
                Previous
              </Button>
              {step < 8 ? (
                <Button
                  type="button"
                  onClick={goNext}
                  className="h-14 rounded-2xl bg-gradient-to-b from-amber-600 to-amber-700 px-10 text-[0.9375rem] font-semibold text-white shadow-lg shadow-amber-900/25 transition hover:-translate-y-0.5 hover:from-amber-500 hover:to-amber-600"
                >
                  Continue
                  <ArrowRight />
                </Button>
              ) : (
                <Button
                  type="button"
                  disabled={submitting}
                  onClick={handleSubmit}
                  className="h-14 rounded-2xl bg-gradient-to-b from-[#1e293b] to-[#0f172a] px-8 text-[0.9375rem] font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:from-slate-700 hover:to-slate-900 disabled:translate-y-0"
                >
                  {submitting ? "Submitting…" : "Secure consult request"}
                </Button>
              )}
            </CardFooter>
          </Card>
          <p className="mt-12 max-w-md text-center text-sm leading-relaxed text-slate-600 mx-auto">
            Prefer your voice to a keyboard? Ring{" "}
            <a href={telHref} className="font-semibold text-amber-950 underline decoration-amber-200/70 underline-offset-4 hover:text-amber-900">
              {SUPPORT_PHONE_DISPLAY}
            </a>{" "}
            or{" "}
            <button
              type="button"
              onClick={openRetellWidget}
              className="font-semibold text-amber-950 underline decoration-amber-200/70 underline-offset-4 hover:text-amber-900"
            >
              open Ava
            </button>
            {" — we welcome both."}
          </p>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-slate-900/80 bg-gradient-to-b from-[#0f172a] via-[#0c1526] to-[#080d18] py-24 text-slate-200 sm:py-28 lg:py-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(251,191,36,0.09),transparent)]" />
        <div className="relative mx-auto max-w-[72rem] px-6 sm:px-10 lg:px-12">
          <h2 className="text-center text-balance text-[2rem] font-semibold tracking-[-0.02em] text-white sm:text-[2.5rem]">
            Voices that felt the difference
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-center text-[1.05rem] font-light leading-relaxed text-slate-400 sm:text-lg">
            Real people, real relief—shared so you know you are not walking this path alone.
          </p>
          <div className="mt-16 grid gap-9 lg:grid-cols-3 lg:gap-10">
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
                className="group relative flex min-h-[22rem] flex-col overflow-hidden rounded-[1.5rem] border border-white/[0.09] bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-10 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.55)] backdrop-blur-md transition duration-300 hover:border-amber-200/20 hover:shadow-[0_28px_70px_-24px_rgba(251,191,36,0.12)] sm:min-h-0 sm:p-11"
              >
                <span
                  className="pointer-events-none absolute left-8 top-8 font-serif text-6xl leading-none text-amber-200/15 transition group-hover:text-amber-200/25"
                  aria-hidden
                >
                  &ldquo;
                </span>
                <div className="relative flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-500/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-emerald-200/95">
                    <CheckCircle2 className="size-3.5 text-emerald-300" aria-hidden />
                    Verified
                  </span>
                </div>
                <p className="relative mt-8 flex-1 text-lg font-light leading-[1.7] tracking-tight text-slate-100 sm:text-xl">
                  {t.q}
                </p>
                <footer className="relative mt-10 border-t border-white/[0.12] pt-8">
                  <p className="text-base font-semibold tracking-tight text-white">{t.n}</p>
                  <p className="mt-2 text-sm text-slate-500">{t.s}</p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200/70 bg-[#faf7f2] pb-20 pt-16 sm:pb-24">
        <div className="mx-auto flex max-w-[72rem] flex-col items-center gap-10 px-6 text-center sm:px-10 lg:px-12">
          <div className="flex items-center gap-3 text-xl font-semibold tracking-tight text-slate-900">
            <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-white shadow-inner ring-1 ring-amber-200/50">
              <Shield className="size-6 text-[#a16207]" />
            </span>
            WreckMatch
          </div>
          <p className="max-w-xl text-[1.05rem] leading-[1.75] text-slate-600">
            We connect injured people—not case files—to attorneys who know billion-dollar work yet still answer frightened
            callers with patience and care.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={telHref}
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-14 rounded-2xl bg-gradient-to-b from-amber-500 to-amber-600 px-10 text-[0.9375rem] font-semibold text-slate-950 shadow-lg shadow-amber-900/20 transition hover:-translate-y-0.5 hover:from-amber-400 hover:to-amber-500",
              )}
            >
              <Phone /> {SUPPORT_PHONE_DISPLAY}
            </a>
            <button
              type="button"
              onClick={openRetellWidget}
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "h-14 rounded-2xl border-slate-200/90 bg-white px-12 text-[0.9375rem] font-semibold shadow-sm transition hover:border-amber-200/80 hover:shadow-md",
              )}
            >
              <MessageSquare /> Ava
            </button>
          </div>
          <p className="max-w-xl text-[0.72rem] leading-relaxed text-slate-500">
            Paid attorney advertising coordinated by participating counsel. Past verdicts/settlements are not warranties of future results.
            Communication does not form an attorney–client bond by itself.
          </p>
        </div>
      </footer>

      {showFloatAva && !exitModalOpen ? (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 sm:bottom-8 sm:right-8">
          <button
            type="button"
            onClick={openRetellWidget}
            className="inline-flex items-center gap-3 rounded-full border border-amber-200/55 bg-gradient-to-r from-[#1e293b] to-[#0f172a] px-5 py-3.5 text-[0.9rem] font-semibold text-amber-50 shadow-[0_18px_50px_-12px_rgba(15,23,42,0.55)] ring-2 ring-white/10 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_22px_56px_-10px_rgba(245,158,11,0.35)] active:translate-y-0"
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-amber-400/20 ring-1 ring-amber-300/30">
              <MessageSquare className="size-4 text-amber-200" />
            </span>
            <span className="pr-1">Speak with Ava</span>
          </button>
          <p className="hidden max-w-[12rem] text-right text-[0.65rem] font-medium uppercase tracking-wider text-slate-500 sm:block">
            24/7 · always free to ask
          </p>
        </div>
      ) : null}

      {exitModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="exit-modal-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/65 backdrop-blur-sm"
            aria-label="Close dialog background"
            onClick={() => setExitModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-[26rem] overflow-hidden rounded-[1.65rem] border border-white/60 bg-gradient-to-br from-[#fffdfb] via-[#faf7f2] to-[#f5ede4] p-9 shadow-[0_30px_90px_-24px_rgba(15,23,42,0.5)] sm:p-11">
            <button
              type="button"
              onClick={() => setExitModalOpen(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 transition hover:bg-white/90 hover:text-slate-700"
              aria-label="Close"
            >
              <X className="size-5" />
            </button>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-amber-800/85">Before you go</p>
            <h2 id="exit-modal-title" className="mt-4 text-[1.65rem] font-semibold leading-snug tracking-[-0.02em] text-slate-900 sm:text-[1.85rem]">
              Leaving already? You don&apos;t have to go through this alone.
            </h2>
            <p className="mt-5 text-[0.95rem] leading-[1.65] text-slate-600">
              However today feels—we are steady beside you. A calm specialist—or Ava—can walk you through options in plain language. Still no pressure,
              still no cost just to talk.
            </p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <Button
                type="button"
                onClick={() => {
                  setExitModalOpen(false);
                  openRetellWidget();
                }}
                className="h-14 flex-1 rounded-2xl bg-gradient-to-b from-[#1e293b] to-[#0f172a] text-[0.9375rem] font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl sm:min-w-[10.5rem]"
              >
                <MessageSquare className="size-4" />
                Chat with Ava
              </Button>
              <a
                href={telHref}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "inline-flex h-14 flex-1 items-center justify-center rounded-2xl border-slate-200/90 bg-white text-[0.9375rem] font-semibold text-slate-900 shadow-sm transition hover:border-amber-200/70 hover:shadow-md sm:min-w-[10.5rem]",
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
              className="mt-8 w-full text-center text-sm font-medium text-slate-500 underline-offset-4 transition hover:text-slate-700 hover:underline"
            >
              Continue browsing
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
