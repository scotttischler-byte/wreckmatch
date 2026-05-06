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

const INTAKE_WHISPER: Record<number, string> = {
  1: "Rough timing helps us honor urgency—never to rush you.",
  2: "Exact street address not required—city and state guide us gently.",
  3: "Choose what feels closest. Everything can be clarified later, calmly.",
  4: "Your symptoms are valid whichever box you tap.",
  5: "Whether you visited the ER yesterday or haven’t gone yet—you are still deserving of clarity.",
  6: "Insurance riddles are common; decoding them together is exactly what we do.",
  7: "Shopping for counsel is prudent. Exploring options builds confidence.",
  8: "We reach out thoughtfully—often within minutes—with warmth, not hustle.",
};

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
                  ? "border-[#d4af72]/55 bg-gradient-to-br from-[#fffdf6] via-amber-50/98 to-white shadow-[0_10px_38px_-16px_rgba(212,175,114,0.35)] ring-2 ring-amber-200/45"
                  : "border-slate-200/70 bg-white/98 hover:-translate-y-1 hover:border-[#d4af72]/35 hover:shadow-[0_14px_40px_-20px_rgba(15,23,42,0.12)]",
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
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `@keyframes wm-ken{0%{transform:scale(1.05)translate3d(0,0,0)}100%{transform:scale(1.11)translate3d(-0.75%,0.35%,0)}}@keyframes wm-badge{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}@keyframes wm-fade-up{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}@keyframes wm-gold-line{0%,100%{opacity:.55}50%{opacity:1}}.wm-ken{animation:wm-ken 32s ease-in-out infinite alternate}.wm-badge-motion{animation:wm-badge 6.5s ease-in-out infinite}.wm-result-rise{animation:wm-fade-up .75s cubic-bezier(.22,1,.36,1) both}.wm-gold-line{animation:wm-gold-line 4s ease-in-out infinite}@media (prefers-reduced-motion:reduce){.wm-ken,.wm-badge-motion,.wm-result-rise,.wm-gold-line{animation:none!important}.wm-ken{transform:scale(1.06)}}`,
        }}
      />
      <div className="min-h-screen bg-[#f4efe6] text-slate-900 antialiased selection:bg-amber-200/45 selection:text-slate-900">
      <header
        className={cn(
          "sticky top-0 z-40 border-b backdrop-blur-xl transition-[box-shadow,border-color,background-color] duration-300",
          headerElevated
            ? "border-slate-200/60 bg-[#f4efe6]/94 shadow-[0_12px_40px_-14px_rgba(15,23,42,0.14)]"
            : "border-transparent bg-[#f4efe6]/75",
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
        <div className="relative min-h-[92vh] w-full overflow-hidden lg:min-h-[93vh]">
          <div className="pointer-events-none absolute inset-0 z-0 wm-ken">
            <Image
              src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=2400&q=88"
              alt="Warm, professional advocates offering calm guidance—hope after difficulty"
              fill
              priority
              className="object-cover object-[center_30%]"
              sizes="100vw"
            />
          </div>
          <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_110%_80%_at_50%_0%,rgba(15,23,42,0.15),transparent_52%)]" />
          <div className="absolute inset-0 z-[2] bg-gradient-to-br from-slate-950/90 via-[#0f1c3f]/85 to-[#061018]/93" />
          <div className="pointer-events-none absolute inset-0 z-[3] bg-[radial-gradient(ellipse_at_20%_20%,rgba(212,175,114,0.14),transparent_45%)]" />
          <div className="pointer-events-none absolute inset-0 z-[3] bg-[radial-gradient(ellipse_at_80%_80%,rgba(251,191,36,0.08),transparent_50%)]" />

          <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-5xl flex-col justify-center px-6 py-28 sm:px-10 lg:min-h-[93vh] lg:max-w-[76rem] lg:px-16 lg:py-36">
            <div className="mb-10 inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/[0.07] px-6 py-2.5 text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-amber-100/95 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.35)] backdrop-blur-xl">
              <Sparkles className="size-3.5 text-amber-200 wm-gold-line" />
              Boutique care · National reach · Private by design
            </div>
            <h1 className="max-w-[22ch] text-balance font-semibold tracking-[-0.03em] text-white text-[2.5rem] leading-[1.03] sm:max-w-none sm:text-[3.25rem] sm:leading-[1.02] lg:text-[4rem] lg:tracking-[-0.035em]">
              Injured in a Car Accident?
              <span className="mt-5 block bg-gradient-to-r from-[#fff8e7] via-amber-100 to-[#d4af72] bg-clip-text font-medium text-transparent sm:mt-6 lg:text-[3.55rem]">
                Welcome Home to Real Help.
              </span>
            </h1>
            <p className="mt-11 max-w-2xl text-pretty font-light leading-[1.75] text-slate-100/95 text-lg sm:max-w-3xl sm:text-xl lg:text-[1.45rem] lg:leading-[1.72]">
              We built WreckMatch for the moment your world feels loud: a composed team, clear language, and advocates who
              treat you like a person—not a file number. When you are ready, we move with quiet confidence beside you.
            </p>
            <div className="mt-9 flex flex-wrap gap-2.5 sm:mt-10 sm:gap-3">
              {(
                [
                  { t: "$1 Billion+ recovered", Icon: Sparkles },
                  { t: "~60 second personal match", Icon: Clock },
                  { t: "No Win, No Fee", Icon: Scale },
                  { t: "Ava 24/7", Icon: MessageSquare },
                ] as const
              ).map(({ t, Icon }, i) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-[0.8125rem] font-medium text-amber-50/95 shadow-sm backdrop-blur-md transition hover:border-amber-200/25 hover:bg-white/[0.1] sm:text-sm"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <Icon className="size-3.5 shrink-0 text-amber-200/90" aria-hidden />
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-14 flex max-w-xl flex-col gap-5 sm:max-w-none sm:flex-row sm:flex-wrap lg:mt-16 lg:gap-6">
              <a
                href="#intake"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "inline-flex min-h-[3.75rem] items-center justify-center rounded-2xl bg-gradient-to-b from-[#e8c87a] via-amber-400 to-[#c9953a] px-11 text-[1.05rem] font-semibold text-slate-950 shadow-[0_16px_50px_-12px_rgba(212,175,72,0.55)] ring-1 ring-white/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_60px_-10px_rgba(245,200,105,0.45)] active:translate-y-0",
                )}
              >
                Begin your free review
                <ArrowRight className="size-5" />
              </a>
              <a
                href={telHref}
                className="inline-flex min-h-[3.85rem] min-w-0 flex-1 touch-manipulation items-center justify-center gap-3 rounded-2xl border-2 border-amber-200/55 bg-white/[0.12] px-10 text-[1.05rem] font-semibold tabular-nums text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-amber-200/80 hover:bg-white/[0.18] hover:shadow-2xl sm:min-h-[4rem] sm:min-w-[18.5rem] sm:flex-initial sm:text-[1.125rem]"
              >
                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-200 to-amber-400 text-slate-900 shadow-inner ring-2 ring-white/20">
                  <Phone className="size-6" aria-hidden />
                </span>
                <span className="flex flex-col items-start gap-0.5 text-left">
                  <span className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-amber-100/90">Speak live now</span>
                  <span>{SUPPORT_PHONE_DISPLAY}</span>
                </span>
              </a>
              <button
                type="button"
                onClick={openRetellWidget}
                className={cn(
                  buttonVariants({ size: "lg", variant: "secondary" }),
                  "inline-flex min-h-[3.75rem] flex-1 items-center justify-center gap-2 rounded-2xl border border-white/12 bg-[#071018]/55 px-10 text-[1.03rem] font-semibold text-amber-50 shadow-[0_16px_50px_-20px_rgba(0,0,0,0.55)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-amber-200/35 hover:bg-[#0a1822]/70 sm:flex-initial sm:min-w-[17.5rem]",
                )}
              >
                <MessageSquare className="size-5 text-amber-200" />
                Speak with Ava 24/7
              </button>
            </div>
            <p className="mt-14 max-w-xl text-sm font-light leading-[1.8] text-slate-300/95 sm:max-w-2xl sm:text-[0.95rem]">
              No obligation. No ambush scripts. Quiet expertise for the moments that shake you—and a promise to treat your
              story with the dignity it deserves.
            </p>
          </div>
        </div>

        <div className="relative border-y border-slate-200/50 bg-gradient-to-b from-white via-[#faf6ef] to-[#f4efe6] py-16 sm:py-20">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d4af72]/50 to-transparent" />
          <div className="mx-auto grid max-w-[76rem] gap-6 px-6 sm:grid-cols-2 sm:gap-7 sm:px-10 lg:grid-cols-5 lg:px-14">
            {(
              [
                { headline: "$1 Billion+", sub: "combined network recoveries", Icon: Sparkles },
                { headline: "No Win, No Fee", sub: "when counsel accepts your matter", Icon: Scale },
                { headline: "100% Confidential", sub: "discretion as a first principle", Icon: Shield },
                { headline: "~60 sec match", sub: "then white-glove follow-through", Icon: Clock },
                { headline: "Ava 24/7", sub: "empathetic voice, always on duty", Icon: MessageSquare },
              ] as const
            ).map(({ headline, sub, Icon }, idx) => (
              <div
                key={headline}
                className="wm-badge-motion group relative flex gap-5 overflow-hidden rounded-[1.15rem] border border-white/90 bg-white/75 px-6 py-6 shadow-[0_14px_40px_-26px_rgba(15,23,42,0.2)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-200/45 hover:shadow-xl"
                style={{ animationDelay: `${idx * 0.65}s` }}
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-50/0 via-amber-50/30 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
                <span className="relative flex size-[3.25rem] shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#fff8e7] to-white shadow-inner ring-1 ring-amber-200/60">
                  <Icon className="size-[1.35rem] text-[#9a5b0a]" aria-hidden />
                </span>
                <div className="relative min-w-0">
                  <p className="text-[0.95rem] font-bold tracking-tight text-slate-900">{headline}</p>
                  <p className="mt-1.5 text-[0.8rem] leading-relaxed text-slate-600">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="calculator"
        className="relative scroll-mt-28 overflow-hidden border-t border-slate-200/45 bg-gradient-to-b from-[#ebe4d8] via-[#f4efe6] to-[#f0e9df] py-28 sm:py-32 lg:py-36"
      >
        <div className="pointer-events-none absolute right-[-20%] top-[-30%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,rgba(212,175,114,0.12),transparent_68%)]" />
        <div className="mx-auto max-w-3xl px-6 sm:max-w-[41rem] sm:px-10 lg:px-14">
          <div className="text-center">
            <p className="inline-flex items-center gap-2 font-serif text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-amber-900/85">
              <Calculator className="size-[1.08rem] text-[#92400e]" />
              Case value atelier
            </p>
            <h2 className="mt-8 text-balance font-serif text-[2.15rem] font-medium tracking-tight text-slate-900 sm:text-[2.85rem] lg:text-[3.1rem]">
              Six discerning questions—not a courtroom
            </h2>
            <p className="mx-auto mt-7 max-w-xl text-pretty text-[1.05rem] leading-[1.8] text-slate-600 sm:max-w-2xl sm:text-[1.12rem]">
              An illustrative band—not a verdict—crafted to settle your mind before Ava or distinguished counsel deepen the
              picture. Luxuriously optional; never an interrogation.
            </p>
          </div>

          <Card className="relative mt-20 overflow-hidden rounded-[1.75rem] border border-white/95 bg-white/90 shadow-[0_32px_80px_-32px_rgba(15,23,42,0.28)] ring-1 ring-[#d4af72]/25">
            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#d4af72]/70 to-transparent" />
            <CardHeader className="relative space-y-4 border-b border-slate-100/80 bg-gradient-to-br from-white via-[#fffdf9] to-[#faf6ee] px-9 pb-12 pt-12 sm:px-12">
              <CardTitle className="font-serif text-[1.75rem] font-medium tracking-tight text-slate-900 sm:text-3xl">
                Illustrative valuation band
              </CardTitle>
              <CardDescription className="text-[1.02rem] leading-[1.75] text-slate-600">
                Education only—not legal advice. Matters resolve along evidence, geography, insurer appetite, and human
                story. Consider this compass rose: orienting—not binding.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-14 bg-gradient-to-b from-[#fefcf8] to-[#f4efe6] px-9 pb-14 pt-14 sm:px-12">
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

              {calcResult ? (
                <div className="wm-result-rise rounded-[1.5rem] border border-[#d4af72]/40 bg-gradient-to-br from-[#fffaf0] via-white to-[#fffdfb] p-11 text-center shadow-[inset_0_3px_0_rgba(255,255,255,0.85),0_28px_60px_-32px_rgba(212,175,114,0.22)] sm:p-12">
                  <p className="font-serif text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-amber-900/55">
                    Sculpted estimate span
                  </p>
                  <p className="mt-8 font-serif text-[2.1rem] font-medium tracking-[0.01em] text-slate-900 sm:text-[2.65rem]">
                    <span className="bg-gradient-to-r from-slate-800 to-slate-900 bg-clip-text text-transparent">
                      {formatUsd(calcResult.low)}
                    </span>
                    <span className="mx-3 align-middle text-[#d4af72]/80">—</span>
                    <span className="bg-gradient-to-r from-slate-800 to-slate-900 bg-clip-text text-transparent">
                      {formatUsd(calcResult.high)}
                    </span>
                  </p>
                  <p className="mx-auto mt-6 max-w-md text-[0.9375rem] leading-relaxed text-slate-600">
                    Numbers can feel cold; this moment is anything but. When you want warmth and precision together, Ava or
                    our intake team can personalize this—with no fee to talk it through.
                  </p>
                  <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row sm:gap-4">
                    <Button
                      type="button"
                      onClick={openRetellWidget}
                      className="h-14 rounded-2xl bg-gradient-to-b from-[#1e293b] to-[#0b1220] text-[0.95rem] font-semibold text-white shadow-[0_16px_40px_-12px_rgba(15,23,42,0.45)] transition hover:-translate-y-1 hover:shadow-xl sm:px-9"
                    >
                      <MessageSquare />
                      Chat with Ava
                    </Button>
                    <a
                      href="#intake"
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "inline-flex h-14 items-center justify-center rounded-2xl border-slate-200/90 bg-white px-9 text-[0.95rem] font-semibold text-slate-900 shadow-md transition hover:-translate-y-1 hover:border-[#d4af72]/45 hover:bg-[#fffefb] hover:shadow-lg",
                      )}
                    >
                      Official intake →
                    </a>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="border-t border-slate-200/50 bg-[#fdfcfa] py-28 sm:py-32 lg:py-36">
        <div className="mx-auto max-w-[76rem] px-6 sm:px-10 lg:px-14">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-balance font-serif text-[2.2rem] font-medium tracking-tight text-slate-900 sm:text-[2.75rem] lg:text-[3.05rem]">
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

      <section className="border-t border-slate-200/50 bg-gradient-to-b from-[#f8f3ec] to-[#f0e9df] py-28 sm:py-32 lg:py-36">
        <div className="mx-auto max-w-[76rem] px-6 sm:px-10 lg:px-14">
          <h2 className="text-center text-balance font-serif text-[2.2rem] font-medium tracking-tight text-slate-900 sm:text-[2.75rem]">
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
                  className="group rounded-[1.35rem] border border-white/90 bg-white/95 p-9 shadow-[0_22px_55px_-32px_rgba(15,23,42,0.22)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-[6px] hover:border-[#d4af72]/35 hover:shadow-[0_30px_70px_-28px_rgba(212,175,114,0.18)]"
                >
                  <span className="text-[0.65rem] font-bold uppercase tracking-[0.28em] text-slate-400">{item.n}</span>
                  <div className="mt-8 flex justify-start">
                    <div className="relative flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#fffaf0] to-amber-100/95 shadow-inner ring-[1.5px] ring-[#d4af72]/35 transition group-hover:ring-[#d4af72]/55">
                      <div className="absolute inset-[3px] rotate-45 rounded-lg border border-[#d4af72]/20 bg-white/30" aria-hidden />
                      <span className="relative">
                        <I className="size-[1.35rem] text-[#8a5412]" aria-hidden />
                      </span>
                    </div>
                  </div>
                  <h3 className="mt-7 text-xl font-semibold tracking-tight text-slate-900">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.copy}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="intake" className="relative scroll-mt-28 overflow-hidden border-t border-slate-200/45 bg-[#e8dfd4]/65 py-28 sm:py-32 lg:py-36">
        <div className="pointer-events-none absolute left-[-35%] bottom-[-40%] h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,251,243,0.9),transparent_65%)]" />
        <div className="relative mx-auto w-full max-w-lg px-6 sm:max-w-xl sm:px-10 lg:max-w-[29rem]">
          <Card className="overflow-hidden rounded-[1.85rem] border border-white/90 shadow-[0_36px_90px_-36px_rgba(15,23,42,0.32)] ring-1 ring-[#d4af72]/22">
            <CardHeader className="border-b border-slate-100/90 bg-gradient-to-br from-white via-[#fefdfb] to-[#faf6ef] pb-10 pt-10">
              <CardTitle className="font-serif text-[1.85rem] font-medium tracking-tight text-slate-900 sm:text-[2rem]">
                Concierge intake
              </CardTitle>
              <CardDescription className="mt-3 text-[1.02rem] leading-relaxed text-slate-600">
                Step {step} of 8 · breathe between beats · perfection is optional
              </CardDescription>
              <div className="pt-5">
                <Progress value={progress}>
                  <div className="mb-2 flex justify-between gap-2 text-xs text-stone-500">
                    <ProgressLabel>Journey</ProgressLabel>
                    <span className="tabular-nums">{progress}%</span>
                  </div>
                </Progress>
              </div>
            </CardHeader>
            <CardContent className="space-y-8 bg-white px-8 pb-11 pt-10 sm:px-11">
              <p className="rounded-[1rem] border border-amber-100/80 bg-[#fffdf8] px-4 py-3 text-[0.8125rem] italic leading-relaxed text-slate-600">
                {INTAKE_WHISPER[step]}
              </p>
              {step === 1 && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold tracking-wide text-slate-900">When did it happen?</label>
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
                  <label className="text-sm font-semibold tracking-wide text-slate-900">Where (city & state)?</label>
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
                  <label className="text-sm font-semibold tracking-wide text-slate-900">Accident shape</label>
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
                  <label className="text-sm font-semibold tracking-wide text-slate-900">Injuries?</label>
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
                  <label className="text-sm font-semibold tracking-wide text-slate-900">Care received?</label>
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
                  <label className="text-sm font-semibold tracking-wide text-slate-900">Insurance context</label>
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
                  <label className="text-sm font-semibold tracking-wide text-slate-900">Attorney already?</label>
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
                  <label className="text-sm font-semibold tracking-wide text-slate-900">Your phone number</label>
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
                <p className="relative mt-9 flex-1 text-[1.35rem] font-light leading-[1.75] tracking-tight text-slate-100 sm:text-[1.45rem] lg:text-[1.55rem]">
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

      <footer className="border-t border-slate-200/65 bg-[#f4efe6] pb-24 pt-20 sm:pb-28 sm:pt-24">
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
            className="inline-flex items-center gap-3 rounded-full border border-amber-300/50 bg-gradient-to-r from-[#172554] via-[#0f172a] to-[#0c1526] px-5 py-3.5 text-[0.82rem] font-semibold text-amber-50 shadow-[0_22px_56px_-14px_rgba(15,23,42,0.58)] ring-[3px] ring-black/5 transition-all duration-300 hover:-translate-y-[3px] hover:border-amber-200/80 hover:shadow-[0_26px_62px_-12px_rgba(251,191,36,0.38)] active:translate-y-0 sm:px-7 sm:text-[0.9rem]"
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-amber-400/20 ring-1 ring-amber-300/30">
              <MessageSquare className="size-4 text-amber-200" />
            </span>
            <span className="pr-1 sm:whitespace-nowrap">Speak with Ava 24/7</span>
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
          <div className="relative z-10 w-full max-w-[26rem] overflow-hidden rounded-[1.65rem] border border-white/70 bg-gradient-to-br from-[#fffdfb] via-[#faf7f2] to-[#f0e6dc] p-9 shadow-[0_34px_96px_-28px_rgba(15,23,42,0.52)] sm:p-11">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-[#d4af72]/90 to-transparent" aria-hidden />
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
    </>
  );
}
