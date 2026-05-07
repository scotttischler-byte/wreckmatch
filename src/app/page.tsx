"use client";

import Image from "next/image";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  Calculator,
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

const fontDisplay = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--wm-display",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const fontSans = Outfit({
  subsets: ["latin"],
  variable: "--wm-sans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

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
  1: "You're safe here. Timing only helps us protect you—we never rush a hurting heart.",
  2: "No street number required unless you wish. City & state softly route you to advocates who speak your courts.",
  3: "Tap what feels closest. You're not alone anymore—everything can be clarified in calm daylight.",
  4: "Your body is yours; every symptom deserves witness. You're not imagining this—we've got you.",
  5: "ER yesterday or still postponing—that's human. You're still deserving of clarity and dignity.",
  6: "Insurance riddles confuse brilliant people daily. Untangling together is precisely why we exist.",
  7: "Exploring counsel is brave, not betrayal. Confidence often begins with a gentle second glance.",
  8: "Almost home. Warm follow-up—not hustle—often within minutes. You've done the hard part already.",
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
  const calcScrollSnapshot = useRef<number | null>(null);

  const captureCalcScroll = useCallback(() => {
    if (typeof window === "undefined") return;
    calcScrollSnapshot.current = window.scrollY;
  }, []);

  useLayoutEffect(() => {
    const y = calcScrollSnapshot.current;
    if (y === null) return;
    calcScrollSnapshot.current = null;
    const fix = () => window.scrollTo({ top: y, left: 0, behavior: "auto" });
    fix();
    requestAnimationFrame(() => {
      fix();
      requestAnimationFrame(fix);
    });
  }, [calc, calcResult]);

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
    const key = "wreckmatch_exit_modal_session_v4";
    if (sessionStorage.getItem(key)) return;

    let leaveTimer: number | null = null;

    const scrollDepthRatio = () => {
      const el = document.documentElement;
      const max = Math.max(1, el.scrollHeight - window.innerHeight);
      return window.scrollY / max;
    };

    const cancelLeaveTimer = () => {
      if (leaveTimer) clearTimeout(leaveTimer);
      leaveTimer = null;
    };

    const onLeave = (e: MouseEvent) => {
      if (sessionStorage.getItem(key)) return;
      if (e.clientY > 28) return;
      if (scrollDepthRatio() < 0.45) return;

      cancelLeaveTimer();
      leaveTimer = window.setTimeout(() => {
        leaveTimer = null;
        if (sessionStorage.getItem(key)) return;
        if (scrollDepthRatio() < 0.45) return;
        sessionStorage.setItem(key, "1");
        setExitModalOpen(true);
      }, 800);
    };

    const onEnter = () => cancelLeaveTimer();

    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      cancelLeaveTimer();
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
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

  const runCalculator = (e?: ReactMouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    e?.stopPropagation();
    captureCalcScroll();
    const keys = ["severity", "medBills", "workLoss", "fault", "crashType", "ongoing"] as const;
    for (const k of keys) {
      if (!calc[k]) return;
    }
    const { low, high } = estimateCaseRange(calc);
    setCalcResult({ low, high });
  };

  const resetCalculator = (e?: ReactMouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    e?.stopPropagation();
    captureCalcScroll();
    setCalc({ severity: "", medBills: "", workLoss: "", fault: "", crashType: "", ongoing: "" });
    setCalcResult(null);
  };

  const calcComplete = useMemo(
    () =>
      !!(calc.severity && calc.medBills && calc.workLoss && calc.fault && calc.crashType && calc.ongoing),
    [calc],
  );

  const selectClass =
    "h-12 w-full rounded-2xl border border-[#1e293b]/10 bg-[#fffdfb] px-3.5 text-sm text-[#162032] shadow-[0_10px_30px_-18px_rgba(15,23,42,0.18)] outline-none transition-all duration-200 hover:border-[#c9a227]/45 hover:shadow-[0_14px_36px_-20px_rgba(201,162,39,0.2)] focus:border-[#c9a227]/65 focus:ring-[3px] focus:ring-amber-100/55 sm:h-14 sm:px-4";

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
      <div className="space-y-3 sm:space-y-5 [overflow-anchor:none]">
        <p className="text-[0.8rem] font-semibold uppercase tracking-[0.2em] text-[#475569]">{label}</p>
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-3.5">
          {options.map((o) => (
            <label
              key={o.id}
              className={cn(
                "group flex cursor-pointer items-start gap-2.5 rounded-[1.1rem] border px-3.5 py-3.5 text-sm leading-relaxed shadow-[0_12px_40px_-26px_rgba(15,23,42,0.12)] transition-all duration-300 sm:gap-3 sm:rounded-[1.25rem] sm:px-4 sm:py-4",
                value === o.id
                  ? "border-[#c9a227]/55 bg-gradient-to-br from-[#fffdfa] via-[#fff9ed] to-white shadow-[0_22px_50px_-20px_rgba(201,162,39,0.25)] ring-[1.5px] ring-[#d4af72]/55"
                  : "border-[#1e293b]/10 bg-[#fefdfb] hover:-translate-y-0.5 hover:border-[#c9a227]/42 hover:shadow-[0_20px_48px_-22px_rgba(15,23,42,0.14)]",
              )}
              onPointerDownCapture={() => captureCalcScroll()}
            >
              <input
                type="radio"
                name={name}
                checked={value === o.id}
                onChange={() => { captureCalcScroll(); onChange(o.id); }}
                className="mt-1"
                onPointerDownCapture={() => captureCalcScroll()}
                onFocus={(ev) => {
                  captureCalcScroll();
                  (ev.target as HTMLInputElement).scrollIntoView({ block: "nearest", behavior: "auto" });
                }}
              />
              <span className="text-[#273449]">{o.label}</span>
            </label>
          ))}
        </div>
      </div>
    );
  }

  const wmBody = `[font-family:var(--wm-sans)]`;
  const wmDisplay = `[font-family:var(--wm-display)]`;

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `@keyframes wm-ken{0%{transform:scale(1.04)translate3d(0.4%,0,0)}100%{transform:scale(1.12)translate3d(-0.85%,0.6%,0)}}@keyframes wm-badge{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}@keyframes wm-fade-up{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}@keyframes wm-gold-line{0%,100%{opacity:.5}50%{opacity:1}}@keyframes wm-ava-soft{0%,100%{box-shadow:0 22px 56px -14px rgba(15,23,42,.52),0 0 0 1px rgba(212,175,114,.35)}50%{box-shadow:0 28px 64px -12px rgba(251,191,36,.42),0 0 28px rgba(212,175,114,.28)}}.wm-ken{animation:wm-ken 38s ease-in-out infinite alternate}.wm-badge-motion{animation:wm-badge 7s ease-in-out infinite}.wm-result-rise{animation:wm-fade-up .85s cubic-bezier(.22,1,.36,1) both}.wm-gold-line{animation:wm-gold-line 4.5s ease-in-out infinite}.wm-ava-soft{animation:wm-ava-soft 5s ease-in-out infinite}@media (prefers-reduced-motion:reduce){.wm-ken,.wm-badge-motion,.wm-result-rise,.wm-gold-line,.wm-ava-soft{animation:none!important}.wm-ken{transform:scale(1.06)}}`,
        }}
      />
      <div
        className={cn(
          fontDisplay.variable,
          fontSans.variable,
          wmBody,
          "min-h-screen bg-[#f7f2ea] text-[#152238] antialiased selection:bg-[#e8d4a8]/60 selection:text-[#0f172a]",
        )}
      >
      <header
        className={cn(
          "sticky top-0 z-40 border-b backdrop-blur-xl transition-[box-shadow,border-color,background-color] duration-500",
          headerElevated
            ? "border-[#c9a227]/20 bg-[#faf6ef]/94 shadow-[0_20px_50px_-18px_rgba(15,23,42,0.12)]"
            : "border-transparent bg-[#faf6ef]/70",
        )}
      >
        <div className="mx-auto flex max-w-[80rem] items-center justify-between gap-4 px-4 py-4 sm:gap-8 sm:px-10 sm:py-6 lg:px-16">
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#fdf6e9] via-white to-[#f5efe4] shadow-[0_14px_32px_-16px_rgba(201,162,39,0.35)] ring-1 ring-[#d4af72]/35 sm:size-11">
              <Shield className="size-5 text-[#8a6914] sm:size-[1.35rem]" aria-hidden />
            </span>
            <span className={cn(wmDisplay, "text-xl font-semibold tracking-[-0.02em] text-[#152238] sm:text-2xl")}>
              WreckMatch
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={openRetellWidget}
              className="hidden rounded-full border-[#d4af72]/55 bg-[#fffdfb] px-4 text-[#1e293b] shadow-[0_12px_32px_-20px_rgba(15,23,42,0.2)] transition hover:border-[#c9a227] hover:bg-[#fff9ed] hover:shadow-md md:inline-flex md:h-11 md:px-5"
            >
              <MessageSquare className="size-4 text-[#9a6b12]" />
              Ava 24/7
            </Button>
            <a
              href={telHref}
              className="inline-flex min-h-11 touch-manipulation items-center gap-2 rounded-full border border-[#1e293b]/10 bg-white px-4 py-2.5 text-sm font-semibold text-[#152238] shadow-[0_10px_34px_-20px_rgba(15,23,42,0.2)] transition-all duration-300 hover:-translate-y-px hover:border-[#c9a227]/45 hover:shadow-[0_16px_40px_-22px_rgba(201,162,39,0.25)] sm:px-6 sm:py-3"
            >
              <Phone className="size-4 shrink-0 text-[#b45309]" />
              <span className="hidden sm:inline">{SUPPORT_PHONE_DISPLAY}</span>
              <span className="sm:hidden">Call now</span>
            </a>
          </div>
        </div>
      </header>

      <section className="relative">
        <div className="relative min-h-[min(92vh,940px)] w-full overflow-hidden lg:min-h-[94vh]">
          <div className="pointer-events-none absolute inset-0 z-0 wm-ken">
            <Image
              src="https://images.unsplash.com/photo-1573497491208-6b1ecfcd8116?auto=format&fit=crop&w=2400&q=88"
              alt="Warm, professional reassurance—hopeful advocate in soft office light after an accident"
              fill
              priority
              quality={92}
              className="scale-105 object-cover object-[center_22%]"
              sizes="100vw"
            />
          </div>
          <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_120%_90%_at_50%_0%,rgba(8,47,73,0.22),transparent_55%)]" />
          <div className="absolute inset-0 z-[2] bg-gradient-to-br from-[#081428]/93 via-[#0c1f3f]/92 to-[#040a14]/96" />
          <div className="pointer-events-none absolute inset-0 z-[3] bg-[radial-gradient(ellipse_at_15%_30%,rgba(212,175,114,0.18),transparent_42%)]" />
          <div className="pointer-events-none absolute inset-0 z-[3] bg-[radial-gradient(ellipse_at_85%_70%,rgba(251,233,209,0.07),transparent_48%)]" />
          <div className="pointer-events-none absolute inset-0 z-[4] bg-gradient-to-t from-[#050b14]/90 via-transparent to-[#081428]/55" />

          <div className="relative z-10 mx-auto flex min-h-[min(92vh,940px)] max-w-[80rem] flex-col justify-center px-4 pb-28 pt-[calc(5rem+env(safe-area-inset-top))] sm:px-10 sm:pb-32 sm:pt-28 lg:min-h-[94vh] lg:px-24 lg:pb-40 lg:pt-36">
            <div className="mb-8 inline-flex w-fit items-center gap-2 rounded-full border border-white/22 bg-white/[0.065] px-5 py-2.5 shadow-[0_12px_40px_-14px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:mb-10 sm:px-7">
              <Sparkles className="size-3.5 shrink-0 text-[#fde68a] wm-gold-line" aria-hidden />
              <span className="text-[0.6rem] font-semibold uppercase tracking-[0.34em] text-[#fde68a]/95 sm:text-[0.62rem] sm:tracking-[0.38em]">
                White‑glove care · Nationwide · Your story stays yours
              </span>
            </div>
            <h1
              className={cn(
                wmDisplay,
                "max-w-[21ch] text-balance text-[2.55rem] font-semibold leading-[1.04] tracking-[-0.035em] text-white drop-shadow-[0_2px_48px_rgba(0,0,0,0.35)] sm:max-w-[19ch] sm:text-[2.85rem] sm:leading-[1.06] lg:max-w-none lg:text-[4.35rem] lg:leading-[1.02]",
              )}
            >
              Injured After a Crash?
              <span className="mt-4 block bg-gradient-to-r from-[#fff9ed] via-[#fde68a] to-[#d4af72] bg-clip-text font-medium text-transparent drop-shadow-none sm:mt-5 lg:mt-6 lg:text-[3.95rem]">
                You&apos;re Safe Here—and We&apos;ve Got You.
              </span>
            </h1>
            <p className="mt-10 max-w-2xl text-pretty font-light leading-[1.78] text-[#eef2f9]/93 sm:mt-12 sm:max-w-3xl sm:text-xl sm:leading-[1.74] lg:mt-14 lg:text-[1.425rem] lg:leading-[1.76]">
              Counsel in our network have secured{" "}
              <span className="font-semibold text-white">$1 Billion+</span>—proof that precision and compassion belong in the same
              sentence. Get personally matched in about{" "}
              <span className="font-semibold text-white">60 seconds</span>.{" "}
              <span className="text-[#fdebbf]">No Win, No Fee</span> when a lawyer steps in, and{" "}
              <span className="text-[#fdebbf]">Ava answers 24/7</span> so you&apos;re{" "}
              <span className="italic text-white/95">never alone with the spinning thoughts</span> again.
            </p>
            <div className="mt-8 flex flex-wrap gap-2 sm:mt-11 sm:gap-2.5">
              {(
                [
                  { t: "$1 Billion+ recovered", Icon: Sparkles },
                  { t: "~60s personal match", Icon: Clock },
                  { t: "No Win, No Fee", Icon: Scale },
                  { t: "Ava 24/7", Icon: MessageSquare },
                ] as const
              ).map(({ t, Icon }, i) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-2 rounded-full border border-white/16 bg-[#081428]/42 px-[0.875rem] py-2 text-[0.78rem] font-medium text-[#fdf6ec]/95 shadow-sm backdrop-blur-md transition hover:border-[#fde68a]/35 hover:bg-white/[0.08] sm:px-4 sm:py-2.5 sm:text-sm"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <Icon className="size-3.5 shrink-0 text-[#fde68a]/90" aria-hidden />
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-11 flex max-w-xl flex-col gap-3 sm:mt-14 sm:max-w-none sm:flex-row sm:flex-wrap sm:gap-4 lg:mt-[4.75rem] lg:gap-5">
              <a
                href="#intake"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  wmBody,
                  "inline-flex min-h-[3.5rem] min-w-0 flex-1 touch-manipulation items-center justify-center rounded-[1rem] bg-gradient-to-b from-[#f3dfa3] via-[#ebc85c] to-[#c9a227] px-8 text-[0.9375rem] font-semibold text-[#172032] shadow-[0_22px_50px_-12px_rgba(201,162,39,0.55)] ring-1 ring-white/45 transition-all duration-300 hover:-translate-y-[3px] hover:shadow-[0_28px_60px_-8px_rgba(245,200,105,0.45)] active:translate-y-0 sm:min-h-[3.75rem] sm:flex-none sm:px-12 sm:text-[1.0625rem]",
                )}
              >
                Begin your free review
                <ArrowRight className="size-5" />
              </a>
              <a
                href={telHref}
                className={cn(
                  wmBody,
                  "inline-flex min-h-[3.55rem] min-w-0 flex-1 touch-manipulation items-center justify-center gap-3 rounded-[1rem] border-[1.5px] border-[#fdebbf]/52 bg-[#050d14]/35 px-6 text-[0.9375rem] font-semibold tabular-nums text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_20px_50px_-20px_rgba(0,0,0,0.55)] backdrop-blur-xl transition-all hover:-translate-y-[3px] hover:border-[#fde68a]/75 hover:bg-[#081428]/50 sm:min-h-[4rem] sm:min-w-[18rem] sm:px-9 sm:text-[1.0625rem] lg:min-w-[18.75rem]",
                )}
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#fef3c7] via-[#fbbf24] to-[#ca8a04] text-[#172032] shadow-inner ring-[1.5px] ring-white/35 sm:size-[3rem]">
                  <Phone className="size-[1.125rem] sm:size-6" aria-hidden />
                </span>
                <span className="flex flex-col items-start gap-0.5 text-left">
                  <span className={cn(wmDisplay, "text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-[#fdebbf]/95 sm:text-[0.65rem]")}>
                    Speak live now
                  </span>
                  <span>{SUPPORT_PHONE_DISPLAY}</span>
                </span>
              </a>
              <button
                type="button"
                onClick={openRetellWidget}
                className={cn(
                  buttonVariants({ size: "lg", variant: "secondary" }),
                  wmBody,
                  "inline-flex min-h-[3.5rem] flex-1 touch-manipulation items-center justify-center gap-2.5 rounded-[1rem] border border-white/18 bg-[#050b12]/55 px-7 text-[0.92rem] font-semibold text-[#fff7ed] shadow-[0_22px_56px_-18px_rgba(0,0,0,0.65)] backdrop-blur-2xl transition-all hover:-translate-y-[3px] hover:border-[#fde68a]/38 hover:bg-[#0a1520]/68 sm:flex-initial sm:min-h-[3.75rem] sm:min-w-[17.5rem] sm:px-10 sm:text-[1.02rem]",
                )}
              >
                <MessageSquare className="size-[1.15rem] text-[#fde68a] sm:size-5" />
                Speak with Ava 24/7
              </button>
            </div>
            <p className="mt-10 max-w-2xl text-sm font-light leading-[1.88] text-slate-300/98 sm:mt-14 sm:text-[0.98rem] lg:max-w-3xl">
              No scripts. No ambush. Just steady hands on the wheel while you tell the truth of what happened—
              <span className="text-white/95">you&apos;re not alone anymore</span>.
            </p>
          </div>
        </div>

        <div className="relative border-y border-[#c9a227]/15 bg-gradient-to-b from-[#fffdfb] via-[#faf6ef] to-[#f2ebe1] py-14 sm:py-20 lg:py-24">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d4af72]/55 to-transparent" />
          <div className="mx-auto grid max-w-[80rem] gap-4 px-4 sm:grid-cols-2 sm:gap-5 sm:px-10 lg:grid-cols-5 lg:gap-6 lg:px-16">
            {(
              [
                { headline: "$1 Billion+", sub: "collective recoveries—real authority", Icon: Sparkles },
                { headline: "No Win, No Fee", sub: "when counsel accepts your case", Icon: Scale },
                { headline: "Sacred privacy", sub: "discretion before dashboards", Icon: Shield },
                { headline: "~60 sec match", sub: "then white-glove follow-up", Icon: Clock },
                { headline: "Ava 24/7", sub: "a calm voice in the dark", Icon: MessageSquare },
              ] as const
            ).map(({ headline, sub, Icon }, idx) => (
              <div
                key={headline}
                className="wm-badge-motion group relative flex gap-4 overflow-hidden rounded-[1.2rem] border border-white/95 bg-white/82 px-5 py-6 shadow-[0_20px_50px_-28px_rgba(15,23,42,0.18)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#d4af72]/45 hover:shadow-[0_28px_60px_-26px_rgba(201,162,39,0.22)] sm:gap-5 sm:rounded-[1.35rem] sm:px-6 sm:py-7"
                style={{ animationDelay: `${idx * 0.65}s` }}
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#fff8e7]/0 via-[#fff4d6]/45 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
                <span className="relative flex size-[2.85rem] shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#fff9ed] to-white shadow-inner ring-1 ring-[#d4af72]/38 sm:size-[3.35rem]">
                  <Icon className="size-[1.2rem] text-[#8a5a0f] sm:size-[1.35rem]" aria-hidden />
                </span>
                <div className="relative min-w-0">
                  <p className={cn(wmDisplay, "text-[0.98rem] font-semibold tracking-tight text-[#152238] sm:text-[1.05rem]")}>
                    {headline}
                  </p>
                  <p className="mt-1.5 text-[0.78rem] leading-relaxed text-[#475569] sm:text-[0.82rem]">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="calculator"
        className="relative scroll-mt-24 overflow-hidden border-t border-[#c9a227]/12 bg-gradient-to-b from-[#ebe4d8] via-[#f5efe6] to-[#ede6dc] py-20 sm:scroll-mt-28 sm:py-28 lg:py-36"
      >
        <div className="pointer-events-none absolute right-[-18%] top-[-28%] h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle_at_center,rgba(201,162,39,0.16),transparent_66%)]" />
        <div className="pointer-events-none absolute bottom-[-20%] left-[-12%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.04),transparent_70%)]" />
        <div className="mx-auto max-w-3xl px-4 sm:max-w-[42rem] sm:px-10 lg:max-w-[44rem] lg:px-12">
          <div className="text-center">
            <p
              className={cn(
                wmDisplay,
                "inline-flex items-center gap-2 text-[0.58rem] font-semibold uppercase tracking-[0.38em] text-[#6b4b0a] sm:text-[0.62rem]",
              )}
            >
              <Calculator className="size-[1.05rem] text-[#92400e] sm:size-[1.08rem]" />
              Case Value Atelier
            </p>
            <h2
              className={cn(
                wmDisplay,
                "mt-7 text-balance text-[2.05rem] font-semibold tracking-[-0.03em] text-[#142032] sm:mt-9 sm:text-[2.95rem] lg:text-[3.25rem]",
              )}
            >
              Six quiet questions—not a courtroom
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-pretty text-[1rem] font-light leading-[1.85] text-[#334155] sm:mt-7 sm:max-w-2xl sm:text-[1.125rem] sm:leading-[1.82]">
              Deep breath—we&apos;ll hold steady while numbers take shape. This is{" "}
              <span className="font-medium text-[#172032]">an illustrative band, never a promise</span>. Beautifully optional;
              unfurl at your pace before Ava or counsel refine it with you.
            </p>
          </div>

          <Card
            className="relative mt-11 overflow-hidden rounded-[1.5rem] border border-white shadow-[0_40px_100px_-38px_rgba(15,23,42,0.28)] ring-1 ring-[#c9a227]/38 [overflow-anchor:none] sm:mt-16 sm:rounded-[1.95rem]"
            onPointerDownCapture={captureCalcScroll}
            onFocusCapture={captureCalcScroll}
          >
            <div className="pointer-events-none absolute inset-x-10 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#d4af72]/88 to-transparent" />
            <div className="pointer-events-none absolute -left-24 top-28 h-64 w-64 rounded-full bg-[#fff9ed]/50 blur-3xl" />
            <CardHeader className="relative space-y-4 border-b border-[#e2e8f0]/90 bg-gradient-to-br from-[#fffdfb] via-[#fcf8f3] to-[#f8f3eb] px-6 pb-9 pt-10 sm:px-12 sm:pb-11 sm:pt-12">
              <CardTitle className={cn(wmDisplay, "text-[1.8rem] font-semibold tracking-tight text-[#152238] sm:text-[2rem] lg:text-[2.15rem]")}>
                Sculpted valuation range
              </CardTitle>
              <CardDescription className="text-[1.055rem] font-light leading-[1.78] text-[#475569]">
                Education—not legal advice. Cases breathe through evidence, place, insurer posture,{" "}
                <span className="italic text-[#64748b]">and</span> the truth of how you heal. Picture a compass—not a verdict.
              </CardDescription>
            </CardHeader>
            <form noValidate className="contents" onSubmit={(event) => event.preventDefault()}>
              <CardContent className="relative space-y-10 bg-gradient-to-b from-[#fefdfb] to-[#f3ece2] px-6 pb-12 pt-10 [overflow-anchor:none] sm:space-y-14 sm:px-12 sm:pb-16 sm:pt-14">
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

              <p className="text-center text-[0.88rem] font-light leading-relaxed text-[#64748b] sm:text-[0.92rem]">
                You&apos;re safe here in this little room of the internet—take your time. We&apos;ve got you while the math
                catches up to your reality.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-4">
                <Button
                  type="button"
                  disabled={!calcComplete}
                  onClick={(ev) => {
                    ev.preventDefault();
                    ev.stopPropagation();
                    runCalculator(ev);
                  }}
                  className="min-h-[3.25rem] flex-1 rounded-[1.05rem] bg-gradient-to-b from-[#152238] to-[#0a1628] py-3.5 text-[0.9rem] font-semibold text-[#fdfaf5] shadow-[0_22px_48px_-16px_rgba(15,23,42,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:from-[#1e354a] hover:to-[#142a3f] hover:shadow-[0_26px_56px_-14px_rgba(15,23,42,0.38)] disabled:pointer-events-none disabled:translate-y-0 disabled:opacity-35 sm:min-h-14 sm:text-[0.95rem]"
                >
                  Reveal my range
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={(ev) => {
                    ev.preventDefault();
                    ev.stopPropagation();
                    resetCalculator(ev);
                  }}
                  className="min-h-[3.25rem] shrink-0 rounded-[1.05rem] border-[#cbd5e1] bg-[#fffdfb] px-7 py-3.5 font-semibold text-[#1e293b] shadow-[0_14px_36px_-24px_rgba(15,23,42,0.2)] transition hover:border-[#c9a227]/55 hover:bg-[#fff9ed] hover:shadow-lg sm:min-h-14 sm:px-9"
                >
                  Clear
                </Button>
              </div>

              {calcResult ? (
                <div className="wm-result-rise scroll-mt-6 rounded-[1.4rem] border border-[#d4af72]/45 bg-gradient-to-br from-[#fffdf7] via-white to-[#fef8ef] px-7 py-10 text-center shadow-[inset_0_2px_0_rgba(255,255,255,0.95),0_36px_72px_-32px_rgba(201,162,39,0.28)] sm:rounded-[1.65rem] sm:px-12 sm:py-12">
                  <p
                    className={cn(
                      wmDisplay,
                      "text-[0.65rem] font-semibold uppercase tracking-[0.34em] text-[#8a6a1b]/75 sm:text-[0.68rem]",
                    )}
                  >
                    Your illustrated span
                  </p>
                  <p
                    className={cn(
                      wmDisplay,
                      "mt-7 text-[2.25rem] font-semibold tracking-[-0.02em] text-[#152238] sm:mt-9 sm:text-[2.85rem] lg:text-[3.1rem]",
                    )}
                  >
                    <span className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] bg-clip-text text-transparent">
                      {formatUsd(calcResult.low)}
                    </span>
                    <span className="mx-2.5 align-middle text-[#c9a227]/75 sm:mx-3">—</span>
                    <span className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] bg-clip-text text-transparent">
                      {formatUsd(calcResult.high)}
                    </span>
                  </p>
                  <p className="mx-auto mt-6 max-w-lg text-[0.95rem] font-light leading-[1.78] text-[#475569]">
                    If this stirs something—relief, doubt, hope—that&apos;s human. Ava or our intake team can translate it
                    into next steps, no fee for a first, full-hearted conversation.
                  </p>
                  <p className="mx-auto mt-5 max-w-md text-[0.9rem] italic leading-relaxed text-[#64748b]">
                    We&apos;ve got you—these brackets are merely a lighthouse, not land itself.
                  </p>
                  <div className="mt-9 flex flex-col justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4">
                    <Button
                      type="button"
                      onClick={(ev) => {
                        ev.preventDefault();
                        ev.stopPropagation();
                        openRetellWidget();
                      }}
                      className="min-h-[3.25rem] rounded-[1.05rem] bg-gradient-to-b from-[#152238] to-[#081420] py-3.5 text-[0.9rem] font-semibold text-white shadow-[0_18px_44px_-12px_rgba(15,23,42,0.48)] transition-all hover:-translate-y-0.5 hover:shadow-xl sm:min-h-14 sm:min-w-[10.5rem] sm:px-9 sm:text-[0.95rem]"
                    >
                      <MessageSquare />
                      Chat with Ava
                    </Button>
                    <a
                      href="#intake"
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        wmBody,
                        "inline-flex min-h-[3.25rem] items-center justify-center rounded-[1.05rem] border-[#e2e8f0] bg-white px-7 py-3.5 text-[0.9rem] font-semibold text-[#152238] shadow-[0_14px_40px_-22px_rgba(15,23,42,0.15)] transition-all hover:-translate-y-0.5 hover:border-[#c9a227]/45 hover:bg-[#fffefb] sm:min-h-14 sm:px-9 sm:text-[0.95rem]",
                      )}
                    >
                      Official intake →
                    </a>
                  </div>
                </div>
              ) : null}
              </CardContent>
            </form>
          </Card>
        </div>
      </section>

      <section className="border-t border-[#c9a227]/14 bg-[#fdfbf7] py-28 sm:py-36 lg:py-40">
        <div className="mx-auto max-w-[80rem] px-4 sm:px-12 lg:px-20">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className={cn(wmDisplay, "text-balance text-[2.05rem] font-semibold tracking-[-0.03em] text-[#142032] sm:text-[3rem] lg:text-[3.35rem]")}>
              Eight questions—with kindness stitched in every line
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-pretty text-base font-light leading-[1.82] text-[#475569] sm:mt-10 sm:text-xl sm:leading-[1.78]">
              Grief. Pain forms. Stacks of envelopes. Texts that ping at 3 a.m.—we see it all. Step slowly; breathe between taps.
              Most finish in a few softened minutes—and remember:{" "}
              <span className="font-medium text-[#334155]">you&apos;re not alone anymore.</span>
            </p>
          </div>
          <div className="mt-14 grid gap-5 sm:mt-20 sm:grid-cols-2 sm:gap-7 lg:mt-24 lg:grid-cols-4 lg:gap-8">
            {INTRO_STEPS.map((item, idx) => {
              const Ico = item.icon;
              return (
                <article
                  key={item.title}
                  className="group flex gap-4 rounded-[1.3rem] border border-[#e8e3db] bg-gradient-to-b from-[#fffdfb] to-[#f4efe8] p-6 shadow-[0_22px_50px_-30px_rgba(15,23,42,0.16)] transition-all duration-300 hover:-translate-y-1 hover:border-[#c9a227]/35 hover:shadow-[0_28px_60px_-28px_rgba(201,162,39,0.18)] sm:gap-5 sm:p-7"
                >
                  <span
                    className={cn(
                      wmDisplay,
                      "flex size-[2.85rem] shrink-0 items-center justify-center rounded-2xl bg-white text-[0.98rem] font-semibold text-[#8a5412] shadow-[0_8px_24px_-14px_rgba(201,162,39,0.35)] ring-1 ring-[#fde68a]/80",
                    )}
                  >
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-start gap-2.5">
                      <Ico className="mt-0.5 size-4 text-[#94a3b8] transition group-hover:text-[#b45309]" aria-hidden />
                      <h3 className={cn(wmBody, "text-[0.98rem] font-semibold leading-snug tracking-tight text-[#152238] sm:text-[1.02rem]")}>
                        {item.title}
                      </h3>
                    </div>
                    <p className="mt-3 text-[0.86rem] font-light leading-relaxed text-[#64748b] sm:text-[0.9rem]">{item.hint}</p>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="mt-16 flex flex-col items-center justify-center gap-4 sm:mt-20 sm:flex-row sm:gap-5">
            <a
              href="#intake"
              className={cn(
                buttonVariants({ size: "lg" }),
                wmBody,
                "min-h-[3.35rem] min-w-[min(100%,17.5rem)] rounded-[1rem] bg-gradient-to-b from-[#152238] to-[#0a1628] px-10 text-[0.9375rem] font-semibold text-[#fdfaf5] shadow-[0_20px_50px_-16px_rgba(15,23,42,0.42)] transition hover:-translate-y-0.5 hover:shadow-xl",
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
                wmBody,
                "min-h-[3.35rem] min-w-[min(100%,17.5rem)] rounded-[1rem] border-[#e2d5c5] bg-[#fffefb] text-[0.9375rem] font-semibold text-[#152238] shadow-sm transition hover:border-[#d4af72]/55 hover:bg-[#fff9ed] hover:shadow-md",
              )}
            >
              Start quietly with Ava
            </button>
          </div>
        </div>
      </section>

      <section className="border-t border-[#c9a227]/12 bg-gradient-to-b from-[#f9f6f1] via-[#f3eee6] to-[#eae3d9] py-28 sm:py-36 lg:py-40">
        <div className="mx-auto max-w-[80rem] px-6 sm:px-12 lg:px-20">
          <h2 className={cn(wmDisplay, "text-center text-balance text-[2.35rem] font-semibold tracking-[-0.03em] text-[#142032] sm:text-[3rem] lg:text-[3.2rem]")}>
            How WreckMatch earns your exhale
          </h2>
          <p className="mx-auto mt-7 max-w-2xl text-center text-[1.05rem] font-light leading-[1.75] text-[#475569] sm:text-lg lg:leading-[1.76]">
            Four restrained movements—from racing heartbeat to anchored next steps—without the billboard roar or side-eye.

            {" "}<span className="font-normal text-[#334155]">You&apos;re safe here.</span>
          </p>
          <div className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-9 lg:gap-y-11">
            {[
              {
                n: "01",
                title: "Share—only what you can",
                copy: "Short pulses of truth. Nobody floods your nervous system—we've got you.",
                icon: MessageSquare,
              },
              {
                n: "02",
                title: "~60‑second aligning",
                copy: "We pair you with litigators fluent in real verdict gravity—not churn rooms.",
                icon: Clock,
              },
              {
                n: "03",
                title: "Whisper-soft consult",
                copy: "Fees framed in daylight. Wins drive fees when ethically allowed.",
                icon: Phone,
              },
              {
                n: "04",
                title: "You heal; counsel advances",
                copy: "Demands, evidence, escalation—quiet storm behind you while mornings feel lighter.",
                icon: HeartHandshake,
              },
            ].map((item) => {
              const I = item.icon;
              return (
                <div
                  key={item.n}
                  className="group rounded-[1.4rem] border border-[#fffdfb]/95 bg-[#fefdfb]/92 p-10 shadow-[0_28px_62px_-36px_rgba(15,23,42,0.2)] backdrop-blur-[2px] transition-all duration-300 hover:-translate-y-2 hover:border-[#d4af72]/40 hover:shadow-[0_36px_78px_-32px_rgba(201,162,39,0.22)] lg:p-11"
                >
                  <span
                    className={cn(wmDisplay, "text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-[#94a3b8]")}
                  >
                    {item.n}
                  </span>
                  <div className="mt-9 flex justify-start">
                    <div className="relative flex size-[4rem] items-center justify-center rounded-2xl bg-gradient-to-br from-[#fff7e6] via-[#fffbeb] to-[#fef3c7] shadow-inner ring-[1.5px] ring-[#d4af72]/35 transition group-hover:ring-[#c9a227]/52">
                      <div className="absolute inset-[3px] rotate-45 rounded-xl border border-[#e8cfa5]/65 bg-white/35" aria-hidden />
                      <span className="relative">
                        <I className="size-[1.4rem] text-[#92400e]" aria-hidden />
                      </span>
                    </div>
                  </div>
                  <h3 className={cn(wmDisplay, "mt-8 text-xl font-semibold tracking-tight text-[#152238] sm:text-[1.35rem]")}>
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[0.9rem] font-light leading-relaxed text-[#64748b]">{item.copy}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="intake" className="relative scroll-mt-28 overflow-hidden border-t border-[#c9a227]/10 bg-[#ece5dc]/90 py-28 sm:py-36 lg:py-40">
        <div className="pointer-events-none absolute left-[-35%] bottom-[-40%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,251,243,0.94),transparent_65%)]" />
        <div className="pointer-events-none absolute right-[-20%] top-[-25%] h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle_at_center,rgba(201,162,39,0.08),transparent_68%)]" />
        <div className="relative mx-auto w-full max-w-lg px-4 sm:max-w-xl sm:px-10 lg:max-w-[30rem]">
          <Card className="overflow-hidden rounded-[2rem] border border-white shadow-[0_44px_100px_-40px_rgba(15,23,42,0.28)] ring-1 ring-[#d4af72]/38">
            <CardHeader className="border-b border-[#eae6df] bg-gradient-to-br from-[#fffdfb] via-[#fcf9f5] to-[#f8f4ed] pb-11 pt-11 sm:pt-12">
              <CardTitle className={cn(wmDisplay, "text-[1.75rem] font-semibold tracking-tight text-[#152238] sm:text-[2.1rem]")}>
                Trusted intake—not an interrogation room
              </CardTitle>
              <CardDescription className="mt-4 text-[0.98rem] font-light leading-[1.7] text-[#475569] sm:text-[1.05rem]">
                Step {step} of 8 · <span className="font-normal text-[#334155]">you&apos;re safe here</span> · pause whenever your chest tightens—we&apos;ll wait.

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
            <CardContent className="space-y-6 bg-[#fdfcfa] px-5 pb-10 pt-9 sm:space-y-8 sm:px-11 sm:pb-12 sm:pt-11">
              <p className="rounded-[1.05rem] border border-[#fde68a]/45 bg-[#fffdf9] px-4 py-3.5 text-[0.8325rem] font-light italic leading-relaxed text-[#475569] shadow-[inset_0_1px_0_rgba(255,255,255,0.95)]">
                {INTAKE_WHISPER[step]}
              </p>
              {step === 1 && (
                <div className="space-y-2">
                  <label className="text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-[#475569]">When did it happen?</label>
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
                  <label className="text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-[#475569]">Where (city & state)?</label>
                  <Input
                    className="h-12 rounded-2xl border-slate-200 shadow-sm transition focus-visible:ring-amber-100 sm:h-14"
                    placeholder="e.g. Knoxville, TN"
                    value={form.cityState}
                    onChange={(e) => update("cityState", e.target.value)}
                  />
                </div>
              )}
              {step === 3 && (
                <div className="space-y-2">
                  <label className="text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-[#475569]">Accident shape</label>
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
                  <label className="text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-[#475569]">Injuries?</label>
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
                  <label className="text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-[#475569]">Care received?</label>
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
                  <label className="text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-[#475569]">Insurance context</label>
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
                  <label className="text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-[#475569]">Attorney already?</label>
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
                  <label className="text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-[#475569]">Your phone number</label>
                  <Input
                    type="tel"
                    autoComplete="tel"
                    placeholder="digits only okay"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    className="h-12 rounded-2xl border-slate-200 shadow-sm transition focus-visible:ring-amber-100 sm:h-14"
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
            <CardFooter className="flex flex-col-reverse gap-3 border-t border-[#eae6df] bg-gradient-to-b from-[#fefdfb] to-[#faf6ef] px-5 pb-9 pt-7 sm:flex-row sm:gap-4 sm:justify-between sm:px-10 sm:pb-11 sm:pt-9">
              <Button
                type="button"
                variant="outline"
                onClick={goBack}
                disabled={step === 1 || submitting}
                className="h-12 rounded-2xl border-slate-200 bg-white text-[0.9rem] font-medium shadow-md transition hover:border-amber-200/70 hover:bg-amber-50/30 sm:h-14 sm:text-sm"
              >
                Previous
              </Button>
              {step < 8 ? (
                <Button
                  type="button"
                  onClick={goNext}
                  className="h-12 rounded-2xl bg-gradient-to-b from-amber-600 to-amber-700 px-8 text-[0.9rem] font-semibold text-white shadow-lg shadow-amber-900/25 transition hover:-translate-y-px hover:from-amber-500 hover:to-amber-600 sm:h-14 sm:px-10 sm:text-[0.9375rem]"
                >
                  Continue
                  <ArrowRight />
                </Button>
              ) : (
                <Button
                  type="button"
                  disabled={submitting}
                  onClick={handleSubmit}
                  className="h-12 rounded-2xl bg-gradient-to-b from-[#1e293b] to-[#0f172a] px-6 text-[0.9rem] font-semibold text-white shadow-lg transition hover:-translate-y-px hover:from-slate-700 hover:to-slate-900 disabled:translate-y-0 sm:h-14 sm:px-8 sm:text-[0.9375rem]"
                >
                  {submitting ? "Submitting…" : "Secure consult request"}
                </Button>
              )}
            </CardFooter>
          </Card>
          <p className="mx-auto mt-12 max-w-md text-center text-[0.9rem] font-light leading-[1.8] text-[#64748b]">
            Craving warmth through your earpiece instead of a keyboard? Reach{" "}
            <a
              href={telHref}
              className={cn(wmBody, "font-semibold text-[#8a6914] underline decoration-[#fcd34d]/80 underline-offset-4 hover:text-[#713f12]")}
            >
              {SUPPORT_PHONE_DISPLAY}
            </a>{" "}
            — or{" "}
            <button
              type="button"
              onClick={openRetellWidget}
              className={cn(wmBody, "font-semibold text-[#8a6914] underline decoration-[#fcd34d]/80 underline-offset-4 hover:text-[#713f12]")}
            >
              open Ava softly
            </button>
            . Whichever honors your nervous system.
          </p>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-[#1e293b] bg-gradient-to-b from-[#111f36] via-[#0d1829] to-[#060d16] py-28 text-slate-200 sm:py-32 lg:py-36">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_55%_at_50%_-8%,rgba(251,191,36,0.11),transparent)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#fde68a]/25 to-transparent" />
        <div className="relative mx-auto max-w-[80rem] px-6 sm:px-12 lg:px-20">
          <h2 className={cn(wmDisplay, "text-center text-balance text-[2.15rem] font-semibold tracking-[-0.03em] text-[#fdfaf5] sm:text-[3rem]")}>
            Kind words from people just like you
          </h2>
          <p className="mx-auto mt-6 max-w-[34rem] text-center text-[1.05rem] font-light leading-[1.75] text-[#cbd5f5]/88 sm:text-lg">
            Larger quotes on purpose—we want these voices to linger. Yes,{" "}
            <span className="text-[#fde68a]/95">you&apos;re not alone anymore.</span>

          </p>
          <div className="mt-16 grid gap-10 lg:grid-cols-3 lg:gap-11">
            {[
              {
                q: "I went from voicemail purgatory to clarity in one hushed conversation. They guarded my dignity like heirloom crystal—not another lead barcode.",
                n: "Alicia K.",
                s: "Rear-impact cervical strain",
              },
              {
                q: "The carrier quit slow-walking us the moment heavyweight counsel leaned in—with fees explained like we were equals, zero thunderous theater.",
                n: "Devon L.",
                s: "Uninsured motorist strategy",
              },
              {
                q: "Steel trap was what I expected. Instead: empathy soaked the line first—only then timelines. Trust landed before legalese—and I slept.",
                n: "Rosa F.",
                s: "T‑bone disputed liability",
              },
            ].map((t) => (
              <blockquote
                key={t.n}
                className="group relative flex min-h-[20rem] flex-col overflow-hidden rounded-[1.65rem] border border-white/[0.1] bg-gradient-to-br from-[#152238]/75 via-[#101b2f]/82 to-[#0a1625]/94 p-11 shadow-[0_38px_80px_-40px_rgba(0,0,0,0.65)] backdrop-blur-xl transition duration-300 hover:border-[#fde68a]/22 hover:shadow-[0_44px_90px_-36px_rgba(251,191,36,0.14)] sm:min-h-0 sm:p-12"
              >
                <span
                  className={cn(
                    wmDisplay,
                    "pointer-events-none absolute left-7 top-7 text-[4.75rem] leading-none text-[#fde68a]/12 transition group-hover:text-[#fde68a]/20 sm:left-10 sm:top-9 sm:text-[5.75rem]",
                  )}
                  aria-hidden
                >
                  &ldquo;
                </span>
                <div className="relative z-[1] flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#34d399]/42 bg-[#022c2292] px-[0.7rem] py-2 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[#bbf7d0] shadow-[0_12px_32px_-16px_rgba(16,185,129,0.35)] sm:tracking-[0.26em]">
                    <BadgeCheck className="size-[0.92rem] text-[#fde68a]" aria-hidden />
                    Verified pairing
                  </span>
                  <span className="hidden text-[0.62rem] font-medium uppercase tracking-[0.26em] text-[#fde68a]/55 sm:inline">
                    · Confidential review
                  </span>
                </div>
                <p
                  className={cn(
                    wmDisplay,
                    "relative z-[1] mt-10 flex-1 text-[1.375rem] font-normal leading-[1.68] tracking-[-0.015em] text-[#eef2ff]/95 sm:mt-12 sm:text-[1.625rem] sm:leading-[1.62] lg:text-[1.75rem]",
                  )}
                >
                  {t.q}
                </p>
                <footer className="relative z-[1] mt-11 border-t border-white/[0.12] pt-9">
                  <p className={cn(wmDisplay, "text-[1.12rem] font-semibold tracking-tight text-white")}>{t.n}</p>
                  <p className="mt-2 text-[0.88rem] font-light text-[#94a3c8]/95">{t.s}</p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <footer className="relative border-t border-[#c9a227]/22 bg-[#f5efe6] pb-[calc(6rem+env(safe-area-inset-bottom))] pt-20 sm:pb-32 sm:pt-28">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d4af72]/45 to-transparent" />
        <div className="mx-auto flex max-w-[80rem] flex-col items-center gap-11 px-5 text-center sm:gap-12 sm:px-12 lg:px-20">
          <div className={cn(wmDisplay, "flex flex-col items-center gap-4 sm:flex-row sm:gap-4")}>
            <span className="flex size-12 items-center justify-center rounded-[1rem] bg-gradient-to-br from-[#fff7e8] via-white to-[#fde68a]/35 shadow-inner ring-1 ring-[#d4af72]/42">
              <Shield className="size-7 text-[#92400e]" />
            </span>
            <span className="text-[1.85rem] font-semibold tracking-[-0.02em] text-[#142032] sm:text-[2rem]">WreckMatch</span>
          </div>
          <p className="max-w-2xl text-[1.08rem] font-light leading-[1.78] text-[#475569]">
            Souls first, spreadsheets second. We braid you toward counsel fluent in nine-figure arenas who still cradle terrified
            callers with patience.{" "}
            <span className="font-normal text-[#334155]">You&apos;re safe here.</span>
          </p>
          <div className="flex w-full max-w-md flex-wrap justify-center gap-3 sm:max-w-none sm:gap-4">
            <a
              href={telHref}
              className={cn(
                buttonVariants({ size: "lg" }),
                wmBody,
                "min-h-[3.5rem] flex-1 rounded-[1rem] bg-gradient-to-b from-[#e8c056] via-[#d4af72] to-[#c9a227] px-9 text-[0.95rem] font-semibold text-[#171f30] shadow-[0_22px_48px_-18px_rgba(201,162,39,0.45)] transition hover:-translate-y-0.5 hover:shadow-xl sm:flex-initial sm:px-12",
              )}
            >
              <Phone /> Call {SUPPORT_PHONE_DISPLAY}
            </a>
            <button
              type="button"
              onClick={openRetellWidget}
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                wmBody,
                "min-h-[3.5rem] flex-1 rounded-[1rem] border-[#cfd8ea] bg-white px-8 text-[0.95rem] font-semibold text-[#152238] shadow-md transition hover:border-[#fde68a]/85 hover:bg-[#fffdfb] hover:shadow-lg sm:flex-initial sm:px-14",
              )}
            >
              <MessageSquare /> Ask Ava quietly
            </button>
          </div>
          <p className="max-w-2xl text-[0.7rem] font-light leading-[1.8] text-[#64748b]">
            Paid attorney advertising coordinated by participating counsel. Past verdicts/settlements are never promises of tomorrow.
            Messaging alone does not create an attorney-client relationship—you remain sovereign until you say otherwise.
          </p>
        </div>
      </footer>

      {showFloatAva && !exitModalOpen ? (
        <div className="fixed bottom-0 right-0 z-50 flex max-w-[100vw] flex-col items-end gap-2 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pr-[calc(1.25rem+env(safe-area-inset-right))] sm:gap-2.5 sm:pb-[calc(1.75rem+env(safe-area-inset-bottom))] sm:pr-[calc(1.75rem+env(safe-area-inset-right))]">
          <button
            type="button"
            aria-label="Speak with Ava 24 hours a day, 7 days a week"
            onClick={openRetellWidget}
            className={cn(
              wmBody,
              "wm-ava-soft pointer-events-auto inline-flex max-w-[calc(100vw-2rem)] touch-manipulation items-center gap-2.5 rounded-full border border-[#fde68a]/55 bg-gradient-to-r from-[#132447] via-[#0f1c38] to-[#0c152c] px-4 py-[0.7rem] pl-3 shadow-[0_26px_64px_-14px_rgba(15,23,42,0.62)] ring-[3px] ring-black/10 transition hover:-translate-y-[3px] hover:border-[#fde68a] active:translate-y-0 sm:max-w-none sm:gap-3.5 sm:px-[1.65rem] sm:py-[0.82rem]",
            )}
          >
            <span className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-[#fde68a]/18 ring-[1.5px] ring-[#fde68a]/35">
              <span className="absolute inset-2 rounded-full bg-[#fde68a]/12 blur-md" aria-hidden />
              <MessageSquare className="relative size-[1.15rem] text-[#fef9c3]" aria-hidden />
            </span>
            <span className="flex min-w-0 flex-col items-start gap-0.5 pr-0.5 text-left">
              <span className="text-[0.58rem] font-semibold uppercase tracking-[0.28em] text-[#fcd34d]/95">Speak with Ava</span>
              <span className="text-[0.95rem] font-semibold tracking-tight text-[#fdfaf5] sm:text-[1.02rem]">24/7—always welcoming</span>
            </span>
          </button>
          <p className="hidden max-w-[14rem] text-right text-[0.62rem] font-medium uppercase leading-snug tracking-[0.2em] text-[#475569]/90 sm:block">
            Gentle AI · Complimentary hello · Leaves when you exhale
          </p>
        </div>
      ) : null}

      {exitModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center p-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:items-center sm:p-6 sm:pb-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="exit-modal-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-[#0f172a]/62 backdrop-blur-[3px]"
            aria-label="Close dialog background"
            onClick={() => setExitModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-[28rem] overflow-hidden rounded-[1.85rem] border border-white/[0.92] bg-gradient-to-br from-[#fffefb] via-[#faf8f5] to-[#ede6dc] px-8 pb-10 pt-10 shadow-[0_44px_100px_-32px_rgba(15,23,42,0.55)] sm:rounded-[2rem] sm:px-12 sm:pb-11 sm:pt-11">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[4px] bg-gradient-to-r from-transparent via-[#d4af72]/95 to-transparent" aria-hidden />
            <button
              type="button"
              onClick={() => setExitModalOpen(false)}
              className="absolute right-3 top-3 rounded-full p-2.5 text-[#64748b] transition hover:bg-white hover:text-[#334155]"
              aria-label="Close"
            >
              <X className="size-[1.125rem]" />
            </button>
            <p
              className={cn(
                wmDisplay,
                "text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-[#92400e]/85 sm:text-[0.65rem]",
              )}
            >
              Whenever you&apos;re ready
            </p>
            <h2 id="exit-modal-title" className={cn(wmDisplay, "mt-4 text-[1.65rem] font-semibold leading-snug tracking-[-0.025em] text-[#152238] sm:text-[1.85rem]")}>
              Leaving the tab is alright
            </h2>
            <p className="mt-5 text-[0.96rem] font-light leading-[1.78] text-[#475569]">
              If overwhelm is bubbling, you never have to mute yourself. Ava—and our human side—stands by for an unrushed whisper of guidance. Zero invoice. Zero performance. Whenever you glide back—we&apos;ll still be softly lit.

            </p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <Button
                type="button"
                onClick={() => {
                  setExitModalOpen(false);
                  openRetellWidget();
                }}
                className={cn(
                  wmBody,
                  "min-h-[3.35rem] flex-1 rounded-[1rem] bg-gradient-to-b from-[#152238] to-[#0d192d] px-5 py-3 text-[0.9325rem] font-semibold text-white shadow-xl transition hover:-translate-y-0.5 hover:shadow-2xl sm:min-w-[11rem]",
                )}
              >
                <MessageSquare className="size-4" />
                Lean on Ava gently
              </Button>
              <a
                href={telHref}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  wmBody,
                  "inline-flex min-h-[3.35rem] flex-1 items-center justify-center rounded-[1rem] border-[#d6dee9] bg-white px-6 py-3 text-[0.9325rem] font-semibold text-[#152238] shadow-md transition hover:-translate-y-0.5 hover:border-[#fde68a]/80 hover:bg-[#fffdfb] hover:shadow-lg sm:min-w-[11rem]",
                )}
                onClick={() => setExitModalOpen(false)}
              >
                <Phone className="size-4" />
                Prefer a calm voice live
              </a>
            </div>
            <button
              type="button"
              onClick={() => setExitModalOpen(false)}
              className="mx-auto mt-9 block text-center text-sm font-medium leading-relaxed text-[#64748b] underline-offset-[5px] transition hover:text-[#334155] hover:underline"
            >
              Close for now—we&apos;ll be right here holding space
            </button>
          </div>
        </div>
      )}
      </div>
    </>
  );
}
