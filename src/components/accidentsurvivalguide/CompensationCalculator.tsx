"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Calculator,
  ChevronLeft,
  ChevronRight,
  Download,
  MessageCircle,
  Scale,
} from "lucide-react";
import { useAsgLocale } from "@/components/accidentsurvivalguide/AsgLocaleProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { US_STATES } from "@/lib/accidentsurvivalguide";
import {
  estimateCompensation,
  formatUsd,
  type AccidentType,
  type CalculatorInput,
  type FaultAnswer,
  type InjurySeverity,
  type LostWagesBand,
  type MedicalBillsBand,
} from "@/lib/compensation-calculator";
import { trackAsgEvent } from "@/lib/analytics";
import { formatMessage } from "@/lib/i18n/get-messages";

const TOTAL_STEPS = 5;

const MEDICAL_BANDS: MedicalBillsBand[] = [
  "0",
  "1-5000",
  "5001-25000",
  "25001-100000",
  "100001-500000",
  "500000+",
];

const WAGE_BANDS: LostWagesBand[] = [
  "0",
  "1-5000",
  "5001-25000",
  "25001-100000",
  "100001-200000",
  "200000+",
];

const ACCIDENT_TYPES: AccidentType[] = [
  "car",
  "truck",
  "motorcycle",
  "slip-fall",
  "pedestrian",
  "other",
];

const INJURIES: InjurySeverity[] = ["minor", "moderate", "severe", "catastrophic"];

function openGhlChat() {
  const selectors = [
    '[class*="lc_text-widget"]',
    '[id*="chat-widget"]',
    'button[aria-label*="chat" i]',
    'button[aria-label*="Chat" i]',
  ];
  for (const sel of selectors) {
    const el = document.querySelector<HTMLElement>(sel);
    if (el) {
      el.click();
      return;
    }
  }
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
}

function DisclaimerBanner({ text }: { text: string }) {
  return (
    <div
      role="note"
      className="flex gap-3 rounded-xl border-2 border-amber-300/80 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-950"
    >
      <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-600" aria-hidden />
      <p>{text}</p>
    </div>
  );
}

function ProgressBar({ step, total, label }: { step: number; total: number; label: string }) {
  const pct = Math.round((step / total) * 100);
  return (
    <div className="mb-8">
      <div className="mb-2 flex items-center justify-between text-sm font-medium text-[#5b8fa8]">
        <span>{label}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[#e8f4fa]">
        <div
          className="h-full rounded-full bg-[#2a7a9b] transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function OptionCard({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition ${
        selected
          ? "border-[#2a7a9b] bg-[#e8f4fa] text-[#1a3a52]"
          : "border-[#c5dce8] bg-white text-[#4a6578] hover:border-[#5b8fa8]"
      }`}
    >
      {children}
    </button>
  );
}

function EstimateGauge({
  label,
  amount,
  max,
  tone,
}: {
  label: string;
  amount: number;
  max: number;
  tone: "low" | "mid" | "high";
}) {
  const pct = max > 0 ? Math.min(100, Math.round((amount / max) * 100)) : 0;
  const bar =
    tone === "low" ? "bg-[#5b8fa8]" : tone === "mid" ? "bg-[#2a7a9b]" : "bg-[#1a3a52]";

  return (
    <div className="rounded-2xl border border-[#c5dce8] bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-wide text-[#5b8fa8]">{label}</p>
      <p className="mt-2 font-serif text-3xl font-semibold text-[#1a3a52]">{formatUsd(amount)}</p>
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#eef6fb]">
        <div className={`h-full rounded-full transition-all ${bar}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function CompensationCalculator() {
  const { locale, messages } = useAsgLocale();
  const c = messages.calculator;

  const [step, setStep] = useState(1);
  const [input, setInput] = useState<CalculatorInput>({
    accidentType: "car",
    injurySeverity: "moderate",
    medicalBills: "5001-25000",
    lostWages: "1-5000",
    futureMedical: false,
    atFault: "unsure",
    state: "",
    policeReport: true,
  });

  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewDone, setReviewDone] = useState(false);
  const [reviewError, setReviewError] = useState("");

  const estimate = useMemo(
    () => (step === 5 ? estimateCompensation(input) : null),
    [step, input],
  );

  const stepLabel = formatMessage(c.stepLabel, { current: step, total: TOTAL_STEPS });

  function bandLabelMedical(b: MedicalBillsBand) {
    return (c.bands as Record<string, string>)[b] ?? b;
  }

  function bandLabelWages(b: LostWagesBand) {
    if (b === "100001-200000") return c.bands.wages200;
    if (b === "200000+") return c.bands.wages200plus;
    return bandLabelMedical(b as MedicalBillsBand);
  }

  async function submitCaseReview(e: React.FormEvent) {
    e.preventDefault();
    if (!consent) return;
    setReviewLoading(true);
    setReviewError("");

    const est = estimateCompensation(input);
    const summary = [
      `Calculator estimate: ${formatUsd(est.low)} – ${formatUsd(est.high)}`,
      `Type: ${input.accidentType}`,
      `Injury: ${input.injurySeverity}`,
      `State: ${input.state || "n/a"}`,
      `At fault other party: ${input.atFault}`,
    ].join("; ");

    try {
      const res = await fetch("/api/submit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName: ".",
          email,
          phone,
          cityState: input.state ? `, ${input.state}` : "Not specified — compensation calculator",
          accidentType: input.accidentType,
          injured: "Yes",
          caseDescription: summary,
          lead_source: "accidentsurvivalguide-compensation-calculator",
          preferredLanguage: locale,
        }),
      });
      const data = (await res.json()) as { success?: boolean; message?: string };
      if (!res.ok || !data.success) {
        setReviewError(data.message ?? c.reviewError);
        return;
      }
      trackAsgEvent("calculator_case_review", { state: input.state });
      setReviewDone(true);
    } catch {
      setReviewError(c.reviewError);
    } finally {
      setReviewLoading(false);
    }
  }

  function downloadResults() {
    if (!estimate) return;
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${c.title}</title>
<style>body{font-family:system-ui,sans-serif;padding:2rem;color:#1a3a52}h1{font-size:1.5rem}
.box{border:2px solid #c5dce8;padding:1rem;margin:1rem 0;border-radius:8px}
.warn{border:2px solid #f59e0b;background:#fffbeb;padding:1rem;font-size:0.9rem}</style></head><body>
<h1>${c.title}</h1>
<p>${c.resultsSubtitle}</p>
<div class="box"><strong>${c.low}:</strong> ${formatUsd(estimate.low)}</div>
<div class="box"><strong>${c.medium}:</strong> ${formatUsd(estimate.medium)}</div>
<div class="box"><strong>${c.high}:</strong> ${formatUsd(estimate.high)}</div>
<div class="warn"><strong>${c.resultsDisclaimerTitle}</strong><p>${c.resultsDisclaimer}</p></div>
<p><small>accidentsurvivalguide.com — ${new Date().toLocaleDateString()}</small></p>
</body></html>`;
    const w = window.open("", "_blank");
    if (w) {
      w.document.write(html);
      w.document.close();
      w.focus();
      w.print();
    }
    trackAsgEvent("calculator_download_results");
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-8 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#e8f4fa] px-4 py-1.5 text-sm font-semibold text-[#2a7a9b]">
          <Calculator className="size-4" aria-hidden />
          {c.title}
        </span>
        <p className="mt-4 text-lg leading-relaxed text-[#5b6b7f]">{c.subtitle}</p>
      </div>

      <DisclaimerBanner text={c.disclaimerBanner} />

      <div className="mt-8 rounded-2xl border border-[#c5dce8] bg-white p-6 shadow-sm sm:p-8">
        <ProgressBar step={step} total={TOTAL_STEPS} label={stepLabel} />

        {step === 1 && (
          <fieldset>
            <legend className="font-serif text-xl font-semibold text-[#1a3a52]">
              {c.steps.accidentType}
            </legend>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {ACCIDENT_TYPES.map((type) => (
                <OptionCard
                  key={type}
                  selected={input.accidentType === type}
                  onClick={() => setInput((p) => ({ ...p, accidentType: type }))}
                >
                  {c.accidentTypes[type]}
                </OptionCard>
              ))}
            </div>
          </fieldset>
        )}

        {step === 2 && (
          <fieldset>
            <legend className="font-serif text-xl font-semibold text-[#1a3a52]">
              {c.steps.injury}
            </legend>
            <div className="mt-4 grid gap-3">
              {INJURIES.map((inj) => (
                <OptionCard
                  key={inj}
                  selected={input.injurySeverity === inj}
                  onClick={() => setInput((p) => ({ ...p, injurySeverity: inj }))}
                >
                  {c.injuries[inj]}
                </OptionCard>
              ))}
            </div>
          </fieldset>
        )}

        {step === 3 && (
          <div className="space-y-8">
            <fieldset>
              <legend className="font-serif text-xl font-semibold text-[#1a3a52]">
                {c.medicalBills}
              </legend>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {MEDICAL_BANDS.map((b) => (
                  <OptionCard
                    key={b}
                    selected={input.medicalBills === b}
                    onClick={() => setInput((p) => ({ ...p, medicalBills: b }))}
                  >
                    {bandLabelMedical(b)}
                  </OptionCard>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="font-serif text-xl font-semibold text-[#1a3a52]">
                {c.lostWages}
              </legend>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {WAGE_BANDS.map((b) => (
                  <OptionCard
                    key={b}
                    selected={input.lostWages === b}
                    onClick={() => setInput((p) => ({ ...p, lostWages: b }))}
                  >
                    {bandLabelWages(b)}
                  </OptionCard>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="font-serif text-xl font-semibold text-[#1a3a52]">
                {c.futureMedical}
              </legend>
              <div className="mt-4 flex flex-wrap gap-3">
                {([true, false] as const).map((val) => (
                  <OptionCard
                    key={String(val)}
                    selected={input.futureMedical === val}
                    onClick={() => setInput((p) => ({ ...p, futureMedical: val }))}
                  >
                    {val ? c.yesNo.yes : c.yesNo.no}
                  </OptionCard>
                ))}
              </div>
            </fieldset>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-8">
            <fieldset>
              <legend className="font-serif text-xl font-semibold text-[#1a3a52]">
                {c.atFault}
              </legend>
              <div className="mt-4 flex flex-wrap gap-3">
                {(["yes", "no", "unsure"] as FaultAnswer[]).map((f) => (
                  <OptionCard
                    key={f}
                    selected={input.atFault === f}
                    onClick={() => setInput((p) => ({ ...p, atFault: f }))}
                  >
                    {c.fault[f]}
                  </OptionCard>
                ))}
              </div>
            </fieldset>
            <div>
              <label htmlFor="calc-state" className="font-serif text-xl font-semibold text-[#1a3a52]">
                {c.state}
              </label>
              <select
                id="calc-state"
                required
                value={input.state}
                onChange={(e) => setInput((p) => ({ ...p, state: e.target.value }))}
                className="mt-3 w-full rounded-xl border border-[#c5dce8] bg-white px-4 py-3 text-[#1a3a52]"
              >
                <option value="">{c.selectState}</option>
                {US_STATES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <fieldset>
              <legend className="font-serif text-xl font-semibold text-[#1a3a52]">
                {c.policeReport}
              </legend>
              <div className="mt-4 flex flex-wrap gap-3">
                {([true, false] as const).map((val) => (
                  <OptionCard
                    key={String(val)}
                    selected={input.policeReport === val}
                    onClick={() => setInput((p) => ({ ...p, policeReport: val }))}
                  >
                    {val ? c.yesNo.yes : c.yesNo.no}
                  </OptionCard>
                ))}
              </div>
            </fieldset>
          </div>
        )}

        {step === 5 && estimate && (
          <div id="calculator-results-print" className="space-y-8">
            <div className="text-center">
              <Scale className="mx-auto size-10 text-[#2a7a9b]" aria-hidden />
              <h2 className="mt-3 font-serif text-2xl font-semibold text-[#1a3a52]">
                {c.resultsTitle}
              </h2>
              <p className="mt-2 text-sm text-[#5b6b7f]">{c.resultsSubtitle}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <EstimateGauge
                label={c.low}
                amount={estimate.low}
                max={estimate.high}
                tone="low"
              />
              <EstimateGauge
                label={c.medium}
                amount={estimate.medium}
                max={estimate.high}
                tone="mid"
              />
              <EstimateGauge
                label={c.high}
                amount={estimate.high}
                max={estimate.high}
                tone="high"
              />
            </div>

            <p className="rounded-xl bg-[#f4faf8] px-4 py-3 text-sm leading-relaxed text-[#4a6578]">
              {c.howCalculated}
            </p>

            <DisclaimerBanner text={c.disclaimerBanner} />

            <div
              role="alert"
              className="rounded-2xl border-4 border-amber-400 bg-amber-50 p-6 sm:p-8"
            >
              <h3 className="font-serif text-xl font-bold text-amber-950">
                {c.resultsDisclaimerTitle}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-amber-950">{c.resultsDisclaimer}</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button
                type="button"
                className="flex-1 bg-[#2a7a9b] hover:bg-[#236884]"
                onClick={() => {
                  document.getElementById("case-review-form")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {c.ctaCaseReview}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-[#2a7a9b] text-[#2a7a9b]"
                onClick={() => {
                  openGhlChat();
                  trackAsgEvent("calculator_open_chat");
                }}
              >
                <MessageCircle className="mr-2 size-4" aria-hidden />
                {c.ctaAi}
              </Button>
              <Button type="button" variant="outline" className="flex-1" onClick={downloadResults}>
                <Download className="mr-2 size-4" aria-hidden />
                {c.ctaDownload}
              </Button>
            </div>
            <p className="text-center text-xs text-[#7a8a98]">{c.downloadHint}</p>

            <div
              id="case-review-form"
              className="rounded-xl border border-[#c5dce8] bg-[#f8fbfd] p-6"
            >
              <h3 className="font-serif text-lg font-semibold text-[#1a3a52]">
                {c.caseReviewTitle}
              </h3>
              {reviewDone ? (
                <p className="mt-4 text-sm text-[#5a9a82]">{c.reviewSuccess}</p>
              ) : (
                <form onSubmit={submitCaseReview} className="mt-4 space-y-3">
                  <Input
                    required
                    placeholder={messages.thankYou.formFirstName}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <Input
                    required
                    type="email"
                    placeholder={messages.thankYou.formEmail}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Input
                    required
                    type="tel"
                    placeholder={messages.thankYou.formPhone}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <label className="flex gap-2 text-sm text-[#4a6578]">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-1"
                      required
                    />
                    {c.consent}
                  </label>
                  {reviewError ? (
                    <p className="text-sm text-red-700">{reviewError}</p>
                  ) : null}
                  <Button
                    type="submit"
                    disabled={reviewLoading}
                    className="w-full bg-[#5a9a82] hover:bg-[#4d8872]"
                  >
                    {reviewLoading ? messages.form.submitting : c.submitReview}
                  </Button>
                </form>
              )}
            </div>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between gap-4 border-t border-[#c5dce8] pt-6">
          {step > 1 ? (
            <Button
              type="button"
              variant="ghost"
              onClick={() => setStep((s) => s - 1)}
              className="text-[#2a7a9b]"
            >
              <ChevronLeft className="mr-1 size-4" aria-hidden />
              {c.back}
            </Button>
          ) : (
            <span />
          )}
          {step < TOTAL_STEPS ? (
            <Button
              type="button"
              className="bg-[#2a7a9b] hover:bg-[#236884]"
              disabled={step === 4 && !input.state}
              onClick={() => {
                if (step === 4 && !input.state) return;
                setStep((s) => s + 1);
                if (step === 4) trackAsgEvent("calculator_complete");
              }}
            >
              {c.next}
              <ChevronRight className="ml-1 size-4" aria-hidden />
            </Button>
          ) : (
            <Button type="button" variant="outline" onClick={() => setStep(1)}>
              {c.startOver}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
