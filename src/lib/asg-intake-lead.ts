import type { AsgLeadInput } from "@/lib/asg-lead-pipeline";
import {
  buildAccidentIntakeSummary,
  intakeFieldLabels,
  intakeValueLabels,
  isAccidentIntakeComplete,
  parseAccidentIntakeFromBody,
  type AsgAccidentIntake,
} from "@/lib/asg-intake";
import type { Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/get-messages";

type IntakeLeadFields = Pick<
  AsgLeadInput,
  | "accidentWhen"
  | "otherDriverAtFault"
  | "policeReportFiled"
  | "medicalTreatment"
  | "otherDriverInsurance"
  | "hasAttorney"
  | "accidentType"
  | "injured"
  | "injurySeverity"
  | "ownInsurance"
  | "preferredCallbackTime"
  | "additionalNotes"
  | "accidentIntakeSummary"
  | "caseDescription"
>;

export function accidentIntakeLeadFields(
  intake: AsgAccidentIntake,
  locale: Locale,
): IntakeLeadFields {
  const m = getMessages(locale).form.intake;
  const labels = intakeFieldLabels(m);
  const summary = buildAccidentIntakeSummary(intake, labels, intakeValueLabels(m));

  return {
    accidentWhen: intake.accidentWhen,
    otherDriverAtFault: intake.otherDriverAtFault,
    policeReportFiled: intake.policeReportFiled,
    medicalTreatment: intake.medicalTreatment,
    otherDriverInsurance: intake.otherDriverInsurance,
    hasAttorney: intake.hasAttorney,
    accidentType: intake.accidentType,
    injured: intake.injured,
    injurySeverity: intake.injurySeverity,
    ownInsurance: intake.ownInsurance,
    preferredCallbackTime: intake.preferredCallbackTime,
    additionalNotes: intake.additionalNotes,
    accidentIntakeSummary: summary,
    caseDescription: summary,
  };
}

export function parseAndValidateAccidentIntake(
  body: Record<string, unknown>,
  locale: Locale,
): { intake: AsgAccidentIntake; fields: IntakeLeadFields } | { error: string } {
  const intake = parseAccidentIntakeFromBody(body);
  const errors = getMessages(locale).form.errors;
  if (!isAccidentIntakeComplete(intake)) {
    return { error: errors.intakeIncomplete };
  }
  return { intake, fields: accidentIntakeLeadFields(intake, locale) };
}
