import type { AsgLeadMagnetType } from "@/lib/asg-lead-pipeline";
import { ASG_WEBINAR_LEAD_SOURCE } from "@/lib/asg-lead-pipeline";
import { ASG_LEAD_SOURCE } from "@/lib/ghl-survival-guide";

export type AsgLeadSubmitResponse = {
  success?: boolean;
  message?: string;
  redirectTo?: string;
  ghlContactId?: string;
  sarahCallStarted?: boolean;
  emailAutomationTriggered?: boolean;
  pdfUrl?: string;
};

export type AsgLeadFormPayload = {
  firstName: string;
  lastName?: string;
  email: string;
  phone: string;
  state?: string;
  city: string;
  zip?: string;
  magnet_type: AsgLeadMagnetType;
  form_name?: string;
  consentEmail?: boolean;
  consentSms?: boolean;
  preferredLanguage?: string;
  caseDescription?: string;
  calculator_summary?: string;
  lead_source?: string;
  accidentWhen?: string;
  otherDriverAtFault?: string;
  policeReportFiled?: string;
  medicalTreatment?: string;
  otherDriverInsurance?: string;
  hasAttorney?: string;
  accidentType?: string;
  injured?: string;
  injurySeverity?: string;
  ownInsurance?: string;
  preferredCallbackTime?: string;
  additionalNotes?: string;
  priority_intake?: boolean;
};

/** POST intake form → GHL (via /api/submit-lead on ASG). */
export async function submitAsgLeadForm(
  payload: AsgLeadFormPayload,
): Promise<AsgLeadSubmitResponse> {
  const res = await fetch("/api/submit-lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      consentEmail: payload.consentEmail ?? true,
      ...payload,
      lead_source: payload.lead_source ?? ASG_LEAD_SOURCE,
      lastName: payload.lastName?.trim() || ".",
    }),
  });
  return (await res.json()) as AsgLeadSubmitResponse;
}

export type SurvivalGuideFormPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  state?: string;
  city: string;
  zip?: string;
  consentEmail: boolean;
  consentSms: boolean;
  preferredLanguage?: string;
  form_name?: string;
  accidentWhen?: string;
  otherDriverAtFault?: string;
  policeReportFiled?: string;
  medicalTreatment?: string;
  otherDriverInsurance?: string;
  hasAttorney?: string;
  accidentType?: string;
  injured?: string;
  injurySeverity?: string;
  ownInsurance?: string;
  preferredCallbackTime?: string;
  additionalNotes?: string;
  priority_intake?: boolean;
};

export type WebinarRegistrationPayload = {
  firstName: string;
  lastName?: string;
  email: string;
  phone: string;
  state?: string;
  city?: string;
  consentEmail?: boolean;
  consentSms?: boolean;
  preferredLanguage?: string;
  form_name?: string;
};

/** POST webinar signup → GHL on the ASG webinar channel (no Sarah call). */
export async function submitWebinarRegistration(
  payload: WebinarRegistrationPayload,
): Promise<AsgLeadSubmitResponse> {
  return submitAsgLeadForm({
    ...payload,
    city: payload.city?.trim() || "Not specified",
    magnet_type: "webinar-registration",
    form_name: payload.form_name ?? "asg-webinar-signup",
    lead_source: ASG_WEBINAR_LEAD_SOURCE,
    consentEmail: payload.consentEmail ?? true,
    consentSms: payload.consentSms ?? true,
    preferredLanguage: payload.preferredLanguage,
  });
}

/** POST guide download form → GHL (via /api/submit-survival-guide). */
export async function submitSurvivalGuideForm(
  payload: SurvivalGuideFormPayload,
): Promise<AsgLeadSubmitResponse> {
  const res = await fetch("/api/submit-survival-guide", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return (await res.json()) as AsgLeadSubmitResponse;
}
