import type { AsgLeadMagnetType } from "@/lib/asg-lead-pipeline";
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
  city?: string;
  zip?: string;
  magnet_type: AsgLeadMagnetType;
  form_name?: string;
  consentEmail?: boolean;
  consentSms?: boolean;
  preferredLanguage?: string;
  caseDescription?: string;
  calculator_summary?: string;
  lead_source?: string;
};

/** POST intake form → GHL (via /api/submit-lead on ASG). */
export async function submitAsgLeadForm(
  payload: AsgLeadFormPayload,
): Promise<AsgLeadSubmitResponse> {
  const res = await fetch("/api/submit-lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      lead_source: ASG_LEAD_SOURCE,
      consentEmail: payload.consentEmail ?? true,
      ...payload,
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
  city?: string;
  zip?: string;
  consentEmail: boolean;
  consentSms: boolean;
  preferredLanguage?: string;
  form_name?: string;
};

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
