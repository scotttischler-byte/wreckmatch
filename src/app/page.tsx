"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LAW_FIRM_NAME,
  RETELL_CHAT_AGENT_ID,
  RETELL_PHONE_NUMBER,
  RETELL_PUBLIC_KEY,
  RETELL_VOICE_AGENT_ID,
  SUPPORT_PHONE_DISPLAY,
  SUPPORT_PHONE_E164,
} from "@/lib/constants";

const timeOptions = [
  "Today",
  "Yesterday",
  "2-3 days ago",
  "4-7 days ago",
  "1-2 weeks ago",
  "2-4 weeks ago",
  "1-3 months ago",
  "More than 3 months ago",
];

const accidentTypeOptions = [
  "Rear-end",
  "T-bone",
  "Head-on",
  "Sideswipe",
  "Rollover",
  "Hit and run",
  "Multi-vehicle pileup",
  "Single-car crash",
  "Other",
];

const injuryTypeOptions = [
  "Neck / whiplash",
  "Back injury",
  "Head injury / concussion",
  "Broken bone",
  "Soft tissue injury",
  "Cuts / bruising",
  "Other injury",
];

const treatmentOptions = [
  "Hospital / ER",
  "Urgent Care",
  "Primary Care Doctor",
  "Chiropractor",
  "Physical Therapy",
  "None yet",
];

const insuranceOptions = [
  "Own insurance",
  "Other driver's insurance",
  "Both",
  "None / uninsured",
  "Not sure yet",
];

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  preContactPhone: string;
  accidentTime: string;
  cityState: string;
  accidentType: string;
  injured: string;
  injuryType: string;
  medicalTreatment: string;
  insurance: string;
  hasAttorney: string;
  phone: string;
};

const initialFormState: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  preContactPhone: "",
  accidentTime: "",
  cityState: "",
  accidentType: "",
  injured: "",
  injuryType: "",
  medicalTreatment: "",
  insurance: "",
  hasAttorney: "",
  phone: "",
};

const stepLabels = [
  "First Name",
  "Last Name",
  "Email Address",
  "Phone Number",
  "When did the accident happen?",
  "Where did the accident occur?",
  "What type of accident was it?",
  "Were you injured?",
  "Did you receive any medical treatment yet?",
  "Do you have insurance?",
  "Have you already hired an attorney?",
  "What's the best phone number to reach you?",
];

const phoneRegex = /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;

export default function Home() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpeningRetell, setIsOpeningRetell] = useState(false);
  const [retellMode, setRetellMode] = useState<"chat" | "callback">("chat");
  const [submitError, setSubmitError] = useState("");
  const [stepError, setStepError] = useState("");
  const [formData, setFormData] = useState<FormState>(initialFormState);

  const progressValue = useMemo(() => ((step + 1) / stepLabels.length) * 100, [step]);

  const canContinue = useMemo(() => {
    if (step === 0) return formData.firstName.trim().length >= 2;
    if (step === 1) return formData.lastName.trim().length >= 2;
    if (step === 2) return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    if (step === 3) return phoneRegex.test(formData.preContactPhone);
    if (step === 4) return Boolean(formData.accidentTime);
    if (step === 5) return Boolean(formData.cityState.trim());
    if (step === 6) return Boolean(formData.accidentType);
    if (step === 7) {
      if (!formData.injured) return false;
      if (formData.injured === "Yes") return Boolean(formData.injuryType);
      return true;
    }
    if (step === 8) return Boolean(formData.medicalTreatment);
    if (step === 9) return Boolean(formData.insurance);
    if (step === 10) return Boolean(formData.hasAttorney);
    if (step === 11) return phoneRegex.test(formData.phone);
    return false;
  }, [formData, step]);

  const getStepError = () => {
    if (step === 0 && formData.firstName.trim().length < 2) return "Please enter your first name.";
    if (step === 1 && formData.lastName.trim().length < 2) return "Please enter your last name.";
    if (step === 2 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return "Please enter a valid email address.";
    }
    if (step === 3 && !phoneRegex.test(formData.preContactPhone)) {
      return "Please enter a valid 10-digit phone number.";
    }
    if (step === 4 && !formData.accidentTime) return "Please select when the accident happened.";
    if (step === 5 && !formData.cityState.trim()) return "Please enter city and state.";
    if (step === 6 && !formData.accidentType) return "Please select the accident type.";
    if (step === 7) {
      if (!formData.injured) return "Please select whether you were injured.";
      if (formData.injured === "Yes" && !formData.injuryType) return "Please select your injury type.";
    }
    if (step === 8 && !formData.medicalTreatment) return "Please select your treatment status.";
    if (step === 9 && !formData.insurance) return "Please select your insurance status.";
    if (step === 10 && !formData.hasAttorney) return "Please select whether you have an attorney.";
    if (step === 11 && !phoneRegex.test(formData.phone)) return "Please confirm your best callback number.";
    return "";
  };

  const openRetellWidget = async (preferredMode: "chat" | "callback" = "chat") => {
    if (typeof window === "undefined" || isOpeningRetell) return;
    setIsOpeningRetell(true);
    setRetellMode(preferredMode);
    setSubmitError("");

    type RetellWindow = Window & {
      RetellWidget?: {
        open?: () => void;
      };
    };

    const typedWindow = window as RetellWindow;
    const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    const removeOldRetellArtifacts = () => {
      const oldScript = document.getElementById("retell-widget-script");
      if (oldScript) oldScript.remove();
      const retellDomNodes = document.querySelectorAll('[class*="retell"], [id*="retell"]');
      retellDomNodes.forEach((node) => {
        if (node.id !== "retell-widget-script") node.remove();
      });
    };

    const clickRetellLauncher = () => {
      const selectors = [
        ".retell-widget-launcher",
        ".retell-widget button",
        '[class*="retell"] button',
        'button[aria-label*="Retell"]',
        'button[aria-label*="chat"]',
        'button[aria-label*="callback"]',
      ];
      for (const selector of selectors) {
        const button = document.querySelector(selector) as HTMLButtonElement | null;
        if (button) {
          button.click();
          return true;
        }
      }
      return false;
    };

    try {
      removeOldRetellArtifacts();

      const script = document.createElement("script");
      script.id = "retell-widget-script";
      script.src = "https://dashboard.retellai.com/retell-widget.js";
      script.type = "module";
      script.setAttribute("data-public-key", RETELL_PUBLIC_KEY);
      script.setAttribute(
        "data-agent-id",
        preferredMode === "chat" ? RETELL_CHAT_AGENT_ID : RETELL_VOICE_AGENT_ID,
      );
      script.setAttribute("data-title", preferredMode === "chat" ? "Talk to Ava" : "Request Callback");
      script.setAttribute("data-color", "#991b1b");

      if (preferredMode === "chat") {
        script.setAttribute("data-bot-name", "Ava");
        script.setAttribute("data-popup-message", "Need reassuring legal guidance now? Ava is here.");
        script.setAttribute("data-show-ai-popup", "true");
        script.setAttribute("data-show-ai-popup-time", "4");
      } else {
        script.setAttribute("data-widget", "callback");
        script.setAttribute("data-phone-number", RETELL_PHONE_NUMBER);
        script.setAttribute("data-countries", "US");
      }

      document.head.appendChild(script);

      for (let attempt = 0; attempt < 8; attempt += 1) {
        if (typedWindow.RetellWidget?.open) {
          typedWindow.RetellWidget.open();
          return;
        }
        if (clickRetellLauncher()) return;
        await wait(300);
      }

      setSubmitError("Ava is loading. Please try again in a moment or call (978) 515-6063 now.");
    } finally {
      setIsOpeningRetell(false);
    }
  };

  const submitLead = async () => {
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const payload = {
        ...formData,
        phone: formData.phone || formData.preContactPhone,
      };

      const response = await fetch("/api/submit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as {
        success?: boolean;
        redirectTo?: string;
        message?: string;
      };
      if (!response.ok || !result.success) {
        throw new Error(result.message ?? "Submission failed. Please try again.");
      }
      router.push(result.redirectTo ?? "/thank-you");
    } catch (error) {
      const fallback = "We couldn't submit your request. Please call (978) 515-6063 now.";
      setSubmitError(error instanceof Error && error.message ? error.message : fallback);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    if (!canContinue) {
      setStepError(getStepError());
      return;
    }
    setStepError("");

    if (step === stepLabels.length - 1) {
      await submitLead();
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (step === 0) return;
    setStepError("");
    setStep((prev) => prev - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#120506] via-[#15090a] to-[#0b0808] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(185,28,28,0.18),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(252,165,165,0.1),transparent_40%)]" />

      <header className="relative border-b border-red-900/40 bg-black/25 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
          <p className="text-xl font-semibold tracking-wide text-rose-50">{LAW_FIRM_NAME}</p>
          <a
            href={`tel:${SUPPORT_PHONE_E164}`}
            className="rounded-full border border-rose-400/50 bg-rose-950/40 px-4 py-2 text-sm font-semibold text-rose-100 transition hover:bg-rose-700/70"
          >
            {SUPPORT_PHONE_DISPLAY}
          </a>
        </div>
      </header>

      <main className="relative mx-auto grid w-full max-w-6xl gap-12 px-5 py-12 sm:px-8 md:grid-cols-[1.05fr_1fr] md:py-20">
        <section className="space-y-8">
          <div className="overflow-hidden rounded-3xl border border-amber-300/20 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
            <div
              className="h-52 w-full bg-cover bg-center sm:h-64"
              style={{
                backgroundImage:
                  "linear-gradient(120deg, rgba(25,8,8,0.35), rgba(25,8,8,0.75)), url('https://images.unsplash.com/photo-1617814076668-314406f5f113?auto=format&fit=crop&w=1600&q=80')",
              }}
            />
          </div>
          <span className="inline-block rounded-full border border-rose-300/30 bg-rose-950/40 px-4 py-1.5 text-xs font-semibold tracking-[0.12em] text-rose-100">
            Compassionate 24/7 Accident Intake
          </span>
          <h1 className="text-4xl font-semibold leading-tight text-rose-50 sm:text-5xl">
            Injured in a Car Accident? Get the Maximum Compensation You Deserve - 24/7
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-rose-100/90">
            We&apos;re so sorry this happened to you. Speak to an attorney at no cost to you. No
            money out of pocket. Your medical bills, time off work, and pain and suffering may be
            covered.
          </p>
          <div className="flex flex-col gap-4">
            <a
              href={`tel:${SUPPORT_PHONE_E164}`}
              className="inline-flex w-full animate-[pulse_2.8s_ease-in-out_infinite] items-center justify-center rounded-full bg-gradient-to-r from-[#c81e1e] via-[#ea580c] to-[#dc2626] px-8 py-5 text-center text-xl font-extrabold tracking-wide text-white shadow-[0_14px_36px_rgba(234,88,12,0.45)] transition hover:from-[#dc2626] hover:to-[#ea580c] sm:text-2xl"
            >
              CALL {SUPPORT_PHONE_DISPLAY} NOW
            </a>
            <Button
              size="lg"
              className="h-16 rounded-full border border-amber-300/40 bg-gradient-to-r from-[#3a1a1a] to-[#251212] px-7 text-lg font-semibold text-amber-100 shadow-[0_10px_28px_rgba(0,0,0,0.45)] hover:from-[#4a2020] hover:to-[#341818]"
              onClick={() => openRetellWidget("chat")}
              disabled={isOpeningRetell}
            >
              {isOpeningRetell && retellMode === "chat"
                ? "Opening Ava..."
                : "Talk to Ava 24/7 (AI or Live Expert)"}
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-amber-300/25 bg-black/30 px-4 py-3 text-center text-sm font-semibold text-amber-100">
              No Win, No Fee - No Cost to Talk to an Attorney
            </div>
            <div className="rounded-xl border border-amber-300/25 bg-black/30 px-4 py-3 text-center text-sm font-semibold text-amber-100">
              No Money Out of Pocket
            </div>
            <div className="rounded-xl border border-amber-300/25 bg-black/30 px-4 py-3 text-center text-sm font-semibold text-amber-100">
              Medical Bills, Lost Wages and Pain and Suffering May Be Covered
            </div>
          </div>
          <div className="max-w-xl rounded-2xl border border-rose-200/15 bg-white/5 p-5">
            <p className="text-sm leading-relaxed text-rose-100/85">
              &quot;WreckMatch called me in minutes and handled everything with compassion and total
              professionalism. I finally felt protected.&quot; - Recent Client
            </p>
          </div>
        </section>

        <section>
          <Card className="border-rose-300/20 bg-[#1f1113]/85 text-white shadow-[0_16px_50px_rgba(0,0,0,0.45)] backdrop-blur-sm">
            <CardHeader className="space-y-4 pb-3">
              <CardTitle className="text-2xl font-semibold text-rose-50">Private Case Review</CardTitle>
              <Progress value={progressValue} className="h-2 bg-rose-950/70" />
              <p className="text-sm text-rose-100/80">
                Step {step + 1} of {stepLabels.length}
              </p>
            </CardHeader>
            <CardContent className="space-y-6 pb-7">
              <p className="text-lg font-medium text-rose-50">{stepLabels[step]}</p>

              {step === 0 && (
                <Input
                  value={formData.firstName}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, firstName: event.target.value }))
                  }
                  placeholder="Enter your first name"
                  className="h-12 border-rose-200/20 bg-[#120c0d] text-white placeholder:text-rose-100/40"
                />
              )}

              {step === 1 && (
                <Input
                  value={formData.lastName}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, lastName: event.target.value }))
                  }
                  placeholder="Enter your last name"
                  className="h-12 border-rose-200/20 bg-[#120c0d] text-white placeholder:text-rose-100/40"
                />
              )}

              {step === 2 && (
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, email: event.target.value }))
                  }
                  placeholder="name@email.com"
                  className="h-12 border-rose-200/20 bg-[#120c0d] text-white placeholder:text-rose-100/40"
                />
              )}

              {step === 3 && (
                <Input
                  type="tel"
                  value={formData.preContactPhone}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      preContactPhone: event.target.value,
                      phone: prev.phone || event.target.value,
                    }))
                  }
                  placeholder="(555) 123-4567"
                  className="h-12 border-rose-200/20 bg-[#120c0d] text-white placeholder:text-rose-100/40"
                />
              )}

              {step === 4 && (
                <Select
                  value={formData.accidentTime}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, accidentTime: value ?? "" }))
                  }
                >
                  <SelectTrigger className="h-12 w-full border-rose-200/20 bg-[#120c0d] text-white">
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {step === 5 && (
                <Input
                  value={formData.cityState}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, cityState: event.target.value }))
                  }
                  placeholder="City, State (e.g., Boston, MA)"
                  className="h-12 border-rose-200/20 bg-[#120c0d] text-white placeholder:text-rose-100/40"
                />
              )}

              {step === 6 && (
                <Select
                  value={formData.accidentType}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, accidentType: value ?? "" }))
                  }
                >
                  <SelectTrigger className="h-12 w-full border-rose-200/20 bg-[#120c0d] text-white">
                    <SelectValue placeholder="Select accident type" />
                  </SelectTrigger>
                  <SelectContent>
                    {accidentTypeOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {step === 7 && (
                <div className="space-y-4">
                  <Select
                    value={formData.injured}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        injured: value ?? "",
                        injuryType: value === "No" ? "" : prev.injuryType,
                      }))
                    }
                  >
                    <SelectTrigger className="h-12 w-full border-rose-200/20 bg-[#120c0d] text-white">
                      <SelectValue placeholder="Were you injured?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>

                  {formData.injured === "Yes" && (
                    <Select
                      value={formData.injuryType}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, injuryType: value ?? "" }))
                      }
                    >
                      <SelectTrigger className="h-12 w-full border-rose-200/20 bg-[#120c0d] text-white">
                        <SelectValue placeholder="Select injury type" />
                      </SelectTrigger>
                      <SelectContent>
                        {injuryTypeOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              )}

              {step === 8 && (
                <Select
                  value={formData.medicalTreatment}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, medicalTreatment: value ?? "" }))
                  }
                >
                  <SelectTrigger className="h-12 w-full border-rose-200/20 bg-[#120c0d] text-white">
                    <SelectValue placeholder="Select treatment status" />
                  </SelectTrigger>
                  <SelectContent>
                    {treatmentOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {step === 9 && (
                <Select
                  value={formData.insurance}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, insurance: value ?? "" }))
                  }
                >
                  <SelectTrigger className="h-12 w-full border-rose-200/20 bg-[#120c0d] text-white">
                    <SelectValue placeholder="Select insurance status" />
                  </SelectTrigger>
                  <SelectContent>
                    {insuranceOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {step === 10 && (
                <Select
                  value={formData.hasAttorney}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, hasAttorney: value ?? "" }))
                  }
                >
                  <SelectTrigger className="h-12 w-full border-rose-200/20 bg-[#120c0d] text-white">
                    <SelectValue placeholder="Select yes or no" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              )}

              {step === 11 && (
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, phone: event.target.value }))
                  }
                  placeholder="Confirm best callback number"
                  className="h-12 border-rose-200/20 bg-[#120c0d] text-white placeholder:text-rose-100/40"
                />
              )}

              {stepError ? (
                <p className="rounded-xl border border-amber-700/70 bg-amber-950/35 p-3 text-sm text-amber-100">
                  {stepError}
                </p>
              ) : null}

              {submitError ? (
                <p className="rounded-xl border border-red-700/70 bg-red-950/35 p-3 text-sm text-red-100">
                  {submitError}
                </p>
              ) : null}

              <div className="flex items-center justify-between gap-3 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full border-rose-200/25 bg-transparent px-6 text-rose-50 hover:bg-rose-900/40 hover:text-rose-50"
                  onClick={handleBack}
                  disabled={step === 0 || isSubmitting}
                >
                  Back
                </Button>
                <Button
                  type="button"
                  className="rounded-full bg-gradient-to-r from-red-700 to-red-600 px-7 text-white hover:from-red-600 hover:to-red-500"
                  onClick={handleNext}
                  disabled={!canContinue || isSubmitting}
                >
                  {isSubmitting
                    ? "Submitting..."
                    : step === stepLabels.length - 1
                      ? "Submit"
                      : "Next"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <section className="relative mx-auto grid w-full max-w-6xl gap-4 px-5 pb-14 sm:px-8 md:grid-cols-3">
        <div className="rounded-2xl border border-rose-300/20 bg-black/35 p-5">
          <p className="text-sm font-semibold text-amber-200">Trusted by Accident Victims</p>
          <p className="mt-2 text-sm text-rose-100/85">
            Premium intake support with immediate legal routing.
          </p>
        </div>
        <div className="rounded-2xl border border-rose-300/20 bg-black/35 p-5">
          <p className="text-sm font-semibold text-amber-200">Luxury-Level Client Care</p>
          <p className="mt-2 text-sm text-rose-100/85">
            Calm, clear, and reassuring guidance from first contact to attorney handoff.
          </p>
        </div>
        <div className="rounded-2xl border border-rose-300/20 bg-black/35 p-5">
          <p className="text-sm font-semibold text-amber-200">Maximum Recovery Focus</p>
          <p className="mt-2 text-sm text-rose-100/85">
            Built to capture critical details quickly and pursue the strongest compensation path.
          </p>
        </div>
      </section>

      <Button
        type="button"
        className="fixed right-4 bottom-4 z-40 rounded-full bg-gradient-to-r from-red-700 to-red-600 text-white shadow-xl hover:from-red-600 hover:to-red-500 md:hidden"
        onClick={() => openRetellWidget("callback")}
        disabled={isOpeningRetell}
      >
        {isOpeningRetell && retellMode === "callback" ? "Opening..." : "Call Ava Now"}
      </Button>
    </div>
  );
}
