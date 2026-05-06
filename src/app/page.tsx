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

const steps = [
  "When did the accident happen?",
  "Where did the accident occur?",
  "What type of accident was it?",
  "Were you injured?",
  "Did you receive any medical treatment yet?",
  "Do you have insurance?",
  "Have you already hired an attorney?",
  "What's the best phone number to reach you?",
];

export default function Home() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpeningRetell, setIsOpeningRetell] = useState(false);
  const [retellMode, setRetellMode] = useState<"chat" | "callback">("chat");
  const [submitError, setSubmitError] = useState("");
  const [stepError, setStepError] = useState("");
  const [formData, setFormData] = useState<FormState>(initialFormState);

  const progressValue = useMemo(() => ((step + 1) / steps.length) * 100, [step]);

  const canContinue = useMemo(() => {
    if (step === 0) return Boolean(formData.accidentTime);
    if (step === 1) return Boolean(formData.cityState.trim());
    if (step === 2) return Boolean(formData.accidentType);
    if (step === 3) {
      if (!formData.injured) return false;
      if (formData.injured === "Yes") return Boolean(formData.injuryType);
      return true;
    }
    if (step === 4) return Boolean(formData.medicalTreatment);
    if (step === 5) return Boolean(formData.insurance);
    if (step === 6) return Boolean(formData.hasAttorney);
    if (step === 7) return /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/.test(formData.phone);
    return false;
  }, [formData, step]);

  const getStepError = () => {
    if (step === 0 && !formData.accidentTime) return "Please select when the accident happened.";
    if (step === 1 && !formData.cityState.trim()) return "Please enter city and state.";
    if (step === 2 && !formData.accidentType) return "Please select the accident type.";
    if (step === 3) {
      if (!formData.injured) return "Please select whether you were injured.";
      if (formData.injured === "Yes" && !formData.injuryType) return "Please select your injury type.";
    }
    if (step === 4 && !formData.medicalTreatment) return "Please select your treatment status.";
    if (step === 5 && !formData.insurance) return "Please select your insurance status.";
    if (step === 6 && !formData.hasAttorney) return "Please select whether you have an attorney.";
    if (step === 7 && !/^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/.test(formData.phone)) {
      return "Please enter a valid 10-digit phone number.";
    }
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
      script.setAttribute("data-color", "#dc2626");

      if (preferredMode === "chat") {
        script.setAttribute("data-bot-name", "Ava");
        script.setAttribute("data-popup-message", "Need help after an accident? Talk to Ava now.");
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

      setSubmitError(
        "Ava is still loading. Please try again in a moment or call (978) 515-6063 now.",
      );
    } finally {
      setIsOpeningRetell(false);
    }
  };

  const submitLead = async () => {
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/submit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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

    if (step === steps.length - 1) {
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
    <div className="min-h-screen bg-neutral-950 text-white">
      <header className="border-b border-red-900/50 bg-neutral-950/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <p className="text-lg font-semibold tracking-wide text-white">{LAW_FIRM_NAME}</p>
          <a
            href={`tel:${SUPPORT_PHONE_E164}`}
            className="rounded-md border border-red-500 px-3 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-600 hover:text-white"
          >
            {SUPPORT_PHONE_DISPLAY}
          </a>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-2 md:py-16">
        <section className="space-y-6">
          <span className="inline-block rounded-full border border-red-700/60 bg-red-950/40 px-3 py-1 text-xs font-semibold tracking-wide text-red-200">
            Immediate Accident Help
          </span>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            Get Matched With A Car Accident Expert In Minutes.
          </h1>
          <p className="max-w-xl text-base text-neutral-300 sm:text-lg">
            Answer 8 quick questions to review your accident case. Speak with an AI or live expert
            24/7 and get clear next steps fast.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={() => openRetellWidget("chat")}
              disabled={isOpeningRetell}
            >
              {isOpeningRetell && retellMode === "chat"
                ? "Opening Ava..."
                : "Talk to Ava 24/7 (AI or Live Expert)"}
            </Button>
            <a
              href={`tel:${SUPPORT_PHONE_E164}`}
              className="inline-flex items-center justify-center rounded-md border border-neutral-600 px-5 py-3 font-semibold text-white hover:border-red-500"
            >
              Call {SUPPORT_PHONE_DISPLAY}
            </a>
          </div>
          <p className="text-sm text-neutral-400">
            Retell widget is integrated for both chat and voice callback workflows.
          </p>
        </section>

        <section>
          <Card className="border-neutral-800 bg-neutral-900/80 text-white shadow-2xl">
            <CardHeader className="space-y-3">
              <CardTitle className="text-xl font-bold">Free Case Check</CardTitle>
              <Progress value={progressValue} className="h-2 bg-neutral-800" />
              <p className="text-sm text-neutral-400">
                Question {step + 1} of {steps.length}
              </p>
            </CardHeader>
            <CardContent className="space-y-5">
              <p className="text-lg font-semibold">{steps[step]}</p>

              {step === 0 && (
                <Select
                  value={formData.accidentTime}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, accidentTime: value ?? "" }))
                  }
                >
                  <SelectTrigger className="h-11 w-full border-neutral-700 bg-neutral-950 text-white">
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

              {step === 1 && (
                <Input
                  value={formData.cityState}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, cityState: event.target.value }))
                  }
                  placeholder="Enter city and state (e.g., Boston, MA)"
                  className="h-11 border-neutral-700 bg-neutral-950 text-white placeholder:text-neutral-500"
                />
              )}

              {step === 2 && (
                <Select
                  value={formData.accidentType}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, accidentType: value ?? "" }))
                  }
                >
                  <SelectTrigger className="h-11 w-full border-neutral-700 bg-neutral-950 text-white">
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

              {step === 3 && (
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
                    <SelectTrigger className="h-11 w-full border-neutral-700 bg-neutral-950 text-white">
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
                      <SelectTrigger className="h-11 w-full border-neutral-700 bg-neutral-950 text-white">
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

              {step === 4 && (
                <Select
                  value={formData.medicalTreatment}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, medicalTreatment: value ?? "" }))
                  }
                >
                  <SelectTrigger className="h-11 w-full border-neutral-700 bg-neutral-950 text-white">
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

              {step === 5 && (
                <Select
                  value={formData.insurance}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, insurance: value ?? "" }))
                  }
                >
                  <SelectTrigger className="h-11 w-full border-neutral-700 bg-neutral-950 text-white">
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

              {step === 6 && (
                <Select
                  value={formData.hasAttorney}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, hasAttorney: value ?? "" }))
                  }
                >
                  <SelectTrigger className="h-11 w-full border-neutral-700 bg-neutral-950 text-white">
                    <SelectValue placeholder="Select yes or no" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              )}

              {step === 7 && (
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, phone: event.target.value }))
                  }
                  placeholder="(555) 123-4567"
                  className="h-11 border-neutral-700 bg-neutral-950 text-white placeholder:text-neutral-500"
                />
              )}

              {stepError ? (
                <p className="rounded-md border border-amber-700 bg-amber-950/30 p-3 text-sm text-amber-100">
                  {stepError}
                </p>
              ) : null}

              {submitError ? (
                <p className="rounded-md border border-red-800 bg-red-950/40 p-3 text-sm text-red-100">
                  {submitError}
                </p>
              ) : null}

              <div className="flex items-center justify-between gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="border-neutral-700 bg-transparent text-white hover:bg-neutral-800 hover:text-white"
                  onClick={handleBack}
                  disabled={step === 0 || isSubmitting}
                >
                  Back
                </Button>
                <Button
                  type="button"
                  className="bg-red-600 text-white hover:bg-red-700"
                  onClick={handleNext}
                  disabled={!canContinue || isSubmitting}
                >
                  {isSubmitting
                    ? "Submitting..."
                    : step === steps.length - 1
                      ? "Submit"
                      : "Next"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <Button
        type="button"
        className="fixed right-4 bottom-4 z-40 bg-red-600 text-white shadow-lg hover:bg-red-700 md:hidden"
        onClick={() => openRetellWidget("callback")}
        disabled={isOpeningRetell}
      >
        {isOpeningRetell && retellMode === "callback" ? "Opening..." : "Call Ava Now"}
      </Button>
    </div>
  );
}
