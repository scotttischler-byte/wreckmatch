import type { AsgLeadInput } from "@/lib/asg-lead-pipeline";
import {
  buildAccidentIntakeSummary,
  intakeValueLabels,
  isAccidentIntakeComplete,
  parseAccidentIntakeFromBody,
  type AsgAccidentIntake,
} from "@/lib/asg-intake";
import type { Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/get-messages";

export function accidentIntakeLeadFields(
  intake: AsgAccidentIntake,
  locale: Locale,
): Pick<
  AsgLeadInput,
  | "accidentWhen"
  | "otherDriverAtFault"
  | "policeReportFiled"
  | "medicalTreatment"
  | "otherDriverInsurance"
  | "hasAttorney"
  | "accidentIntakeSummary"
  | "caseDescription"
> {
  const m = getMessages(locale).form.intake;
  const labels = {
    accidentWhen: m.accidentWhen,
    otherDriverAtFault: m.otherDriverAtFault,
    policeReportFiled: m.policeReportFiled,
    medicalTreatment: m.medicalTreatment,
    otherDriverInsurance: m.otherDriverInsurance,
    hasAttorney: m.hasAttorney,
  };
  const summary = buildAccidentIntakeSummary(intake, labels, intakeValueLabels(m));

  return {
    accidentWhen: intake.accidentWhen,
    otherDriverAtFault: intake.otherDriverAtFault,
    policeReportFiled: intake.policeReportFiled,
    medicalTreatment: intake.medicalTreatment,
    otherDriverInsurance: intake.otherDriverInsurance,
    hasAttorney: intake.hasAttorney,
    accidentIntakeSummary: summary,
    caseDescription: summary,
  };
}

export function parseAndValidateAccidentIntake(
  body: Record<string, unknown>,
  locale: Locale,
): { intake: AsgAccidentIntake; fields: ReturnType<typeof accidentIntakeLeadFields> } | { error: string } {
  const intake = parseAccidentIntakeFromBody(body);
  const errors = getMessages(locale).form.errors;
  if (!isAccidentIntakeComplete(intake)) {
    return { error: errors.intakeIncomplete };
  }
  return { intake, fields: accidentIntakeLeadFields(intake, locale) };
}
