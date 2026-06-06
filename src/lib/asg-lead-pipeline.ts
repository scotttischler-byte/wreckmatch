/**
 * Accident Survival Guide — lead magnet pipeline
 *
 * Every homepage / calculator form:
 * 1. Upserts contact in GHL (API)
 * 2. POSTs inbound webhook (triggers GHL workflows: email PDF, email calculator link, internal notify)
 * 3. Starts Sarah outbound call via Retell (immediate)
 */

import { ASG_BASE_URL, ASG_DOMAIN, SURVIVAL_GUIDE_PDF } from "@/lib/accidentsurvivalguide";
import { getAsgSurvivalGuideWebhookUrl, survivalGuidePdfAbsoluteUrl } from "@/lib/ghl-survival-guide";
import { upsertGhlContact, type GhlUpsertInput } from "@/lib/ghl";
import { createSarahOutboundCall } from "@/lib/retell-sarah";
import { LAW_FIRM_NAME } from "@/lib/constants";

export type AsgLeadMagnetType =
  | "survival-guide-download"
  | "calculator-lead-magnet"
  | "calculator-case-review"
  | "attorney-match";

export type AsgLeadInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  state?: string;
  city?: string;
  postalCode?: string;
  magnetType: AsgLeadMagnetType;
  leadSource: string;
  formName?: string;
  consentEmail?: boolean;
  consentSms?: boolean;
  preferredLanguage?: string;
  caseDescription?: string;
  calculatorSummary?: string;
  accidentWhen?: string;
  otherDriverAtFault?: string;
  policeReportFiled?: string;
  medicalTreatment?: string;
  otherDriverInsurance?: string;
  hasAttorney?: string;
  accidentIntakeSummary?: string;
};

export type AsgLeadPipelineResult = {
  ok: boolean;
  contactId?: string;
  isNewContact?: boolean;
  webhookSent: boolean;
  sarahCallStarted: boolean;
  sarahCallId?: string;
  sarahSkipReason?: string;
  message?: string;
};

function tagsForMagnet(type: AsgLeadMagnetType, state?: string): string[] {
  const tags = ["wreckmatch-lead", "asg-lead", "sarah-callback-requested"];
  switch (type) {
    case "survival-guide-download":
      tags.push("survival-guide-lead", "downloaded-guide-yes");
      break;
    case "calculator-lead-magnet":
    case "calculator-case-review":
      tags.push("calculator-lead", "compensation-calculator");
      break;
    case "attorney-match":
      tags.push("attorney-match-lead", "wreckmatch-referral");
      break;
  }
  if (state) tags.push(`state-${state.toLowerCase()}`);
  return tags;
}

function automationTrigger(type: AsgLeadMagnetType): string {
  switch (type) {
    case "survival-guide-download":
      return "email_survival_guide_pdf";
    case "calculator-lead-magnet":
      return "email_calculator_access";
    case "calculator-case-review":
      return "email_calculator_case_review";
    case "attorney-match":
      return "asg_attorney_match_request";
    default:
      return "asg_lead_followup";
  }
}

function offerForMagnet(type: AsgLeadMagnetType): string {
  switch (type) {
    case "survival-guide-download":
      return "Accident Survival Guide 2026";
    case "calculator-lead-magnet":
    case "calculator-case-review":
      return "Accident Compensation Calculator 2026";
    case "attorney-match":
      return "Free attorney match";
    default:
      return "Accident Survival Guide";
  }
}

export function buildAsgWebhookPayload(lead: AsgLeadInput, contactId?: string) {
  const phoneDigits = lead.phone.replace(/\D/g, "");
  const pdfUrl = survivalGuidePdfAbsoluteUrl();
  const calculatorUrl = `${ASG_BASE_URL}/calculator`;

  return {
    first_name: lead.firstName,
    last_name: lead.lastName,
    full_name: `${lead.firstName} ${lead.lastName}`.trim(),
    email: lead.email,
    phone: lead.phone,
    phone_digits: phoneDigits,
    state: lead.state || "Not specified",
    city: lead.city || "",
    zip: lead.postalCode || "",
    lead_source: lead.leadSource,
    site: ASG_DOMAIN,
    source: LAW_FIRM_NAME,
    form_type: lead.magnetType,
    form_name: lead.formName || lead.magnetType,
    automation_trigger: automationTrigger(lead.magnetType),
    trigger_sarah_call: "yes",
    offer: offerForMagnet(lead.magnetType),
    pdf_download_url: pdfUrl,
    guide_pdf_path: SURVIVAL_GUIDE_PDF,
    calculator_url: calculatorUrl,
    email_consent: lead.consentEmail !== false ? "Yes" : "No",
    sms_consent: lead.consentSms ? "Yes" : "No",
    preferred_language: lead.preferredLanguage || "en",
    case_description: lead.caseDescription || lead.accidentIntakeSummary || "",
    calculator_summary: lead.calculatorSummary || "",
    accident_when: lead.accidentWhen || "",
    other_driver_at_fault: lead.otherDriverAtFault || "",
    police_report_filed: lead.policeReportFiled || "",
    medical_treatment: lead.medicalTreatment || "",
    other_driver_insurance: lead.otherDriverInsurance || "",
    has_attorney: lead.hasAttorney || "",
    accident_intake_summary: lead.accidentIntakeSummary || "",
    accident_date: lead.accidentWhen || "",
    injury_status: lead.medicalTreatment || "",
    insurance_status: lead.otherDriverInsurance || "",
    ghl_contact_id: contactId || "",
    created_at: new Date().toISOString(),
  };
}

function sarahOfferLabel(type: AsgLeadMagnetType): string {
  switch (type) {
    case "survival-guide-download":
      return "Accident Survival Guide download";
    case "calculator-lead-magnet":
      return "compensation calculator";
    case "calculator-case-review":
      return "calculator case review";
    case "attorney-match":
      return "free attorney match";
    default:
      return "Accident Survival Guide";
  }
}

export async function processAsgLead(lead: AsgLeadInput): Promise<AsgLeadPipelineResult> {
  const apiKey = process.env.GHL_API_KEY?.trim() ?? "";
  const webhookUrl = getAsgSurvivalGuideWebhookUrl();

  if (!apiKey && !webhookUrl) {
    return {
      ok: false,
      webhookSent: false,
      sarahCallStarted: false,
      message: "Lead automation is not configured (GHL_API_KEY or webhook URL required).",
    };
  }

  let contactId: string | undefined;
  let isNewContact: boolean | undefined;

  if (apiKey) {
    const upsertInput: GhlUpsertInput = {
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      phone: lead.phone,
      state: lead.state,
      city: lead.city,
      postalCode: lead.postalCode,
      tags: tagsForMagnet(lead.magnetType, lead.state),
      source: LAW_FIRM_NAME,
      customFields: [
        { key: "lead_source", field_value: lead.leadSource },
        {
          key: "last_offer",
          field_value: sarahOfferLabel(lead.magnetType),
        },
        {
          key: "automation_trigger",
          field_value: automationTrigger(lead.magnetType),
        },
        ...(lead.accidentWhen
          ? [{ key: "accident_when", field_value: lead.accidentWhen }]
          : []),
        ...(lead.otherDriverAtFault
          ? [{ key: "other_driver_at_fault", field_value: lead.otherDriverAtFault }]
          : []),
        ...(lead.policeReportFiled
          ? [{ key: "police_report_filed", field_value: lead.policeReportFiled }]
          : []),
        ...(lead.medicalTreatment
          ? [{ key: "medical_treatment", field_value: lead.medicalTreatment }]
          : []),
        ...(lead.otherDriverInsurance
          ? [{ key: "other_driver_insurance", field_value: lead.otherDriverInsurance }]
          : []),
        ...(lead.hasAttorney
          ? [{ key: "has_attorney", field_value: lead.hasAttorney }]
          : []),
        ...(lead.accidentIntakeSummary
          ? [{ key: "accident_intake_summary", field_value: lead.accidentIntakeSummary }]
          : []),
      ],
    };

    const upsert = await upsertGhlContact(apiKey, upsertInput);
    if (!upsert.ok) {
      console.error("[asg-lead] GHL upsert failed:", upsert.status, upsert.body);
      if (!webhookUrl) {
        return {
          ok: false,
          webhookSent: false,
          sarahCallStarted: false,
          message: "Failed to save lead to CRM.",
        };
      }
    } else {
      contactId = upsert.contactId;
      isNewContact = upsert.isNew;
      console.log("[asg-lead] GHL contact upserted:", { contactId, isNew: upsert.isNew });
    }
  }

  let webhookSent = false;
  if (webhookUrl) {
    const payload = buildAsgWebhookPayload(lead, contactId);
    const ghlResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!ghlResponse.ok) {
      const failureBody = await ghlResponse.text();
      console.error("[asg-lead] GHL webhook failed:", ghlResponse.status, failureBody);
      if (!contactId) {
        return {
          ok: false,
          webhookSent: false,
          sarahCallStarted: false,
          message: "Failed to send lead to automation.",
        };
      }
    } else {
      webhookSent = true;
      console.log("[asg-lead] GHL webhook sent:", lead.magnetType);
    }
  }

  const sarah = await createSarahOutboundCall({
    toPhone: lead.phone,
    firstName: lead.firstName,
    leadSource: lead.leadSource,
    offerLabel: sarahOfferLabel(lead.magnetType),
  });

  if (sarah.ok) {
    console.log("[asg-lead] Sarah outbound call started:", sarah.callId);
  } else {
    console.warn("[asg-lead] Sarah outbound skipped:", sarah.reason, sarah.detail ?? "");
  }

  const ok = Boolean(contactId || webhookSent);
  if (!webhookSent && webhookUrl) {
    console.warn("[asg-lead] Webhook did not succeed — GHL email workflows may not run.");
  }

  return {
    ok,
    contactId,
    isNewContact,
    webhookSent,
    sarahCallStarted: sarah.ok,
    sarahCallId: sarah.ok ? sarah.callId : undefined,
    sarahSkipReason: sarah.ok ? undefined : sarah.reason,
    message:
      ok && !sarah.ok
        ? `Lead saved. Sarah call pending (${sarah.reason}).`
        : undefined,
  };
}
