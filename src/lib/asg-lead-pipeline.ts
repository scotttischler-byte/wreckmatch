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
  | "calculator-case-review";

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
  consentEmail?: boolean;
  consentSms?: boolean;
  preferredLanguage?: string;
  caseDescription?: string;
  calculatorSummary?: string;
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
  if (type === "survival-guide-download") {
    tags.push("survival-guide-lead", "downloaded-guide-yes");
  } else {
    tags.push("calculator-lead", "compensation-calculator");
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
    default:
      return "asg_lead_followup";
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
    automation_trigger: automationTrigger(lead.magnetType),
    trigger_sarah_call: "yes",
    offer:
      lead.magnetType === "survival-guide-download"
        ? "Accident Survival Guide 2026"
        : "Accident Compensation Calculator 2026",
    pdf_download_url: pdfUrl,
    guide_pdf_path: SURVIVAL_GUIDE_PDF,
    calculator_url: calculatorUrl,
    email_consent: lead.consentEmail !== false ? "Yes" : "No",
    sms_consent: lead.consentSms ? "Yes" : "No",
    preferred_language: lead.preferredLanguage || "en",
    case_description: lead.caseDescription || "",
    calculator_summary: lead.calculatorSummary || "",
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
