/** Shared accident intake fields for ASG lead magnet forms. */

export type AsgAccidentIntake = {
  accidentWhen: string;
  otherDriverAtFault: string;
  policeReportFiled: string;
  medicalTreatment: string;
  otherDriverInsurance: string;
  hasAttorney: string;
  accidentType: string;
  injured: string;
  injurySeverity: string;
  ownInsurance: string;
  preferredCallbackTime: string;
  additionalNotes: string;
};

export const EMPTY_ASG_ACCIDENT_INTAKE: AsgAccidentIntake = {
  accidentWhen: "",
  otherDriverAtFault: "",
  policeReportFiled: "",
  medicalTreatment: "",
  otherDriverInsurance: "",
  hasAttorney: "",
  accidentType: "",
  injured: "",
  injurySeverity: "",
  ownInsurance: "",
  preferredCallbackTime: "",
  additionalNotes: "",
};

const REQUIRED_INTAKE_KEYS: (keyof AsgAccidentIntake)[] = [
  "accidentWhen",
  "otherDriverAtFault",
  "policeReportFiled",
  "medicalTreatment",
  "otherDriverInsurance",
  "hasAttorney",
  "accidentType",
  "injured",
  "injurySeverity",
  "ownInsurance",
  "preferredCallbackTime",
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
    accidentType: str(body.accidentType),
    injured: str(body.injured),
    injurySeverity: str(body.injurySeverity),
    ownInsurance: str(body.ownInsurance),
    preferredCallbackTime: str(body.preferredCallbackTime),
    additionalNotes: str(body.additionalNotes),
  };
}

export function isAccidentIntakeComplete(intake: AsgAccidentIntake): boolean {
  return REQUIRED_INTAKE_KEYS.every((key) => intake[key].length > 0);
}

export type IntakeLabelMessages = {
  accidentWhen: string;
  otherDriverAtFault: string;
  policeReportFiled: string;
  medicalTreatment: string;
  otherDriverInsurance: string;
  hasAttorney: string;
  accidentType: string;
  injured: string;
  injurySeverity: string;
  ownInsurance: string;
  preferredCallbackTime: string;
  additionalNotes: string;
  yes: string;
  no: string;
  notSure: string;
  whenThisWeek: string;
  whenLastWeek: string;
  whenLastMonth: string;
  whenWithin6Months: string;
  whenOver6Months: string;
  medicalYes: string;
  medicalNo: string;
  medicalScheduled: string;
  medicalNotYet: string;
  insuranceYes: string;
  insuranceNo: string;
  insuranceUninsured: string;
  attorneyNotHappy: string;
  typeRearEnd: string;
  typeIntersection: string;
  typeHighway: string;
  typeRideshare: string;
  typeTruck: string;
  typePedestrian: string;
  typeHitAndRun: string;
  typeOther: string;
  injuryMinor: string;
  injuryModerate: string;
  injurySerious: string;
  injuryOngoing: string;
  injuryNotApplicable: string;
  ownInsuranceFull: string;
  ownInsuranceUmUim: string;
  callbackMorning: string;
  callbackAfternoon: string;
  callbackEvening: string;
  callbackAnytime: string;
  callbackAsap: string;
};

export function intakeFieldLabels(m: IntakeLabelMessages): Record<keyof AsgAccidentIntake, string> {
  return {
    accidentWhen: m.accidentWhen,
    otherDriverAtFault: m.otherDriverAtFault,
    policeReportFiled: m.policeReportFiled,
    medicalTreatment: m.medicalTreatment,
    otherDriverInsurance: m.otherDriverInsurance,
    hasAttorney: m.hasAttorney,
    accidentType: m.accidentType,
    injured: m.injured,
    injurySeverity: m.injurySeverity,
    ownInsurance: m.ownInsurance,
    preferredCallbackTime: m.preferredCallbackTime,
    additionalNotes: m.additionalNotes,
  };
}

export function intakeValueLabels(m: IntakeLabelMessages): Record<string, string> {
  return {
    yes: m.yes,
    no: m.no,
    not_sure: m.notSure,
    this_week: m.whenThisWeek,
    last_week: m.whenLastWeek,
    last_month: m.whenLastMonth,
    within_6_months: m.whenWithin6Months,
    over_6_months: m.whenOver6Months,
    scheduled: m.medicalScheduled,
    not_yet: m.medicalNotYet,
    uninsured: m.insuranceUninsured,
    attorney_not_happy: m.attorneyNotHappy,
    rear_end: m.typeRearEnd,
    intersection: m.typeIntersection,
    highway: m.typeHighway,
    rideshare: m.typeRideshare,
    truck: m.typeTruck,
    pedestrian: m.typePedestrian,
    hit_and_run: m.typeHitAndRun,
    other: m.typeOther,
    minor: m.injuryMinor,
    moderate: m.injuryModerate,
    serious: m.injurySerious,
    ongoing: m.injuryOngoing,
    not_applicable: m.injuryNotApplicable,
    full_coverage: m.ownInsuranceFull,
    um_uim: m.ownInsuranceUmUim,
    morning: m.callbackMorning,
    afternoon: m.callbackAfternoon,
    evening: m.callbackEvening,
    anytime: m.callbackAnytime,
    asap: m.callbackAsap,
  };
}

/** Plain-text summary for GHL notes / case description. */
export function buildAccidentIntakeSummary(
  intake: AsgAccidentIntake,
  labels: Record<keyof AsgAccidentIntake, string>,
  valueLabels: Record<string, string>,
): string {
  const line = (label: string, value: string) =>
    value ? `${label}: ${valueLabels[value] ?? value}` : "";

  const parts = REQUIRED_INTAKE_KEYS.map((key) =>
    line(labels[key], intake[key]),
  ).filter(Boolean);

  if (intake.additionalNotes) {
    parts.push(`${labels.additionalNotes}: ${intake.additionalNotes}`);
  }

  return parts.join(" | ");
}
