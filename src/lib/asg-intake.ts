/** Shared accident intake fields for ASG lead magnet forms. */

export type AsgAccidentIntake = {
  accidentWhen: string;
  otherDriverAtFault: string;
  policeReportFiled: string;
  medicalTreatment: string;
  otherDriverInsurance: string;
  hasAttorney: string;
};

export const EMPTY_ASG_ACCIDENT_INTAKE: AsgAccidentIntake = {
  accidentWhen: "",
  otherDriverAtFault: "",
  policeReportFiled: "",
  medicalTreatment: "",
  otherDriverInsurance: "",
  hasAttorney: "",
};

const INTAKE_KEYS: (keyof AsgAccidentIntake)[] = [
  "accidentWhen",
  "otherDriverAtFault",
  "policeReportFiled",
  "medicalTreatment",
  "otherDriverInsurance",
  "hasAttorney",
];

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

export function parseAccidentIntakeFromBody(
  body: Record<string, unknown>,
): AsgAccidentIntake {
  return {
    accidentWhen: str(body.accidentWhen),
    otherDriverAtFault: str(body.otherDriverAtFault),
    policeReportFiled: str(body.policeReportFiled),
    medicalTreatment: str(body.medicalTreatment),
    otherDriverInsurance: str(body.otherDriverInsurance),
    hasAttorney: str(body.hasAttorney),
  };
}

export function isAccidentIntakeComplete(intake: AsgAccidentIntake): boolean {
  return INTAKE_KEYS.every((key) => intake[key].length > 0);
}

type IntakeLabelMessages = {
  accidentWhen: string;
  otherDriverAtFault: string;
  policeReportFiled: string;
  medicalTreatment: string;
  otherDriverInsurance: string;
  hasAttorney: string;
  yes: string;
  no: string;
  notSure: string;
  whenTodayYesterday: string;
  whenThisWeek: string;
  whenWithin30Days: string;
  whenOneToThreeMonths: string;
  whenThreeToTwelveMonths: string;
  whenOverAYear: string;
  medicalYes: string;
  medicalNo: string;
  medicalScheduled: string;
  medicalNotYet: string;
  insuranceYes: string;
  insuranceNo: string;
  insuranceUninsured: string;
};

export function intakeValueLabels(m: IntakeLabelMessages): Record<string, string> {
  return {
    yes: m.yes,
    no: m.no,
    not_sure: m.notSure,
    today_yesterday: m.whenTodayYesterday,
    this_week: m.whenThisWeek,
    within_30_days: m.whenWithin30Days,
    one_to_three_months: m.whenOneToThreeMonths,
    three_to_twelve_months: m.whenThreeToTwelveMonths,
    over_a_year: m.whenOverAYear,
    scheduled: m.medicalScheduled,
    not_yet: m.medicalNotYet,
    uninsured: m.insuranceUninsured,
  };
}

/** Plain-text summary for GHL notes / case description. */
export function buildAccidentIntakeSummary(
  intake: AsgAccidentIntake,
  labels: Record<keyof AsgAccidentIntake, string>,
  valueLabels: Record<string, string>,
): string {
  const line = (label: string, value: string) =>
    `${label}: ${valueLabels[value] ?? value}`;

  return [
    line(labels.accidentWhen, intake.accidentWhen),
    line(labels.otherDriverAtFault, intake.otherDriverAtFault),
    line(labels.policeReportFiled, intake.policeReportFiled),
    line(labels.medicalTreatment, intake.medicalTreatment),
    line(labels.otherDriverInsurance, intake.otherDriverInsurance),
    line(labels.hasAttorney, intake.hasAttorney),
  ].join(" | ");
}
