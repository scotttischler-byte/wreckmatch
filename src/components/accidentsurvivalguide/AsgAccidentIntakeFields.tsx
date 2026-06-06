"use client";

import type { AsgAccidentIntake } from "@/lib/asg-intake";
import type { Messages } from "@/lib/i18n/get-messages";

type IntakeMessages = Messages["form"]["intake"];

type Props = {
  values: AsgAccidentIntake;
  onChange: <K extends keyof AsgAccidentIntake>(key: K, value: string) => void;
  messages: IntakeMessages;
  /** Calculator card (dark teal) vs guide card (light). */
  variant: "light" | "dark";
  className?: string;
};

function selectClass(variant: "light" | "dark"): string {
  if (variant === "dark") {
    return "h-11 w-full min-h-[44px] rounded-xl border-0 bg-white px-3 text-sm text-[#1a3a52] shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80";
  }
  return "h-11 min-h-[44px] w-full rounded-lg border border-[#c5dce8] bg-[#fafcfd] px-3 text-sm text-[#1a3a52] outline-none focus-visible:border-[#2a7a9b] focus-visible:ring-3 focus-visible:ring-[#2a7a9b]/20";
}

function labelClass(variant: "light" | "dark"): string {
  return variant === "dark"
    ? "mb-1 block text-[0.7rem] font-medium leading-snug text-[#d4e8f4] sm:text-xs"
    : "mb-1.5 block text-sm font-medium text-[#3d5568]";
}

export function AsgAccidentIntakeFields({
  values,
  onChange,
  messages: m,
  variant,
  className = "",
}: Props) {
  const yesNoUnsure = [
    { value: "yes", label: m.yes },
    { value: "no", label: m.no },
    { value: "not_sure", label: m.notSure },
  ];

  const whenOptions = [
    { value: "today_yesterday", label: m.whenTodayYesterday },
    { value: "this_week", label: m.whenThisWeek },
    { value: "within_30_days", label: m.whenWithin30Days },
    { value: "one_to_three_months", label: m.whenOneToThreeMonths },
    { value: "three_to_twelve_months", label: m.whenThreeToTwelveMonths },
    { value: "over_a_year", label: m.whenOverAYear },
    { value: "not_sure", label: m.notSure },
  ];

  const medicalOptions = [
    { value: "yes", label: m.medicalYes },
    { value: "no", label: m.medicalNo },
    { value: "scheduled", label: m.medicalScheduled },
    { value: "not_yet", label: m.medicalNotYet },
  ];

  const insuranceOptions = [
    { value: "yes", label: m.insuranceYes },
    { value: "no", label: m.insuranceNo },
    { value: "uninsured", label: m.insuranceUninsured },
    { value: "not_sure", label: m.notSure },
  ];

  const titleClass =
    variant === "dark"
      ? "text-[0.75rem] font-semibold uppercase tracking-wide text-[#a8d4e8] sm:text-xs"
      : "text-sm font-semibold text-[#1a3a52]";

  function renderSelect(
    id: string,
    label: string,
    field: keyof AsgAccidentIntake,
    options: { value: string; label: string }[],
    required = true,
  ) {
    return (
      <label className="block" htmlFor={id}>
        <span className={labelClass(variant)}>
          {label}
          {required ? <span className={variant === "dark" ? "text-amber-200" : "text-[#c45c5c]"}> *</span> : null}
        </span>
        <select
          id={id}
          required={required}
          value={values[field]}
          onChange={(e) => onChange(field, e.target.value)}
          className={selectClass(variant)}
        >
          <option value="">{m.selectOne}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>
    );
  }

  return (
    <fieldset className={`space-y-2.5 border-0 p-0 ${className}`}>
      <legend className={`${titleClass} mb-1 w-full`}>{m.sectionTitle}</legend>
      <p className={variant === "dark" ? "text-[0.65rem] leading-relaxed text-[#b8d4e4] sm:text-xs" : "text-xs leading-relaxed text-[#5b6b7f]"}>
        {m.sectionHint}
      </p>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {renderSelect("asg-accident-when", m.accidentWhen, "accidentWhen", whenOptions)}
        {renderSelect("asg-other-fault", m.otherDriverAtFault, "otherDriverAtFault", yesNoUnsure)}
        {renderSelect("asg-police-report", m.policeReportFiled, "policeReportFiled", yesNoUnsure)}
        {renderSelect("asg-medical", m.medicalTreatment, "medicalTreatment", medicalOptions)}
        {renderSelect(
          "asg-other-insurance",
          m.otherDriverInsurance,
          "otherDriverInsurance",
          insuranceOptions,
        )}
        {renderSelect("asg-has-attorney", m.hasAttorney, "hasAttorney", yesNoUnsure)}
      </div>
    </fieldset>
  );
}
