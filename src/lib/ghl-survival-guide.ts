/**
 * GHL Inbound Webhook workflow (configure in GoHighLevel):
 *
 * 1. Trigger: Inbound Webhook (use GHL_WEBHOOK_URL / ASG_SURVIVAL_GUIDE_WEBHOOK_URL)
 * 2. Create/Update Contact — map incoming JSON fields to contact + custom fields
 * 3. Add Tags: survival-guide-lead, downloaded-guide-yes, state-{abbr} (if present)
 * 4. Send Email — subject: "Your Free Accident Survival Guide is Here"
 *    - Attach PDF or link: {{pdf_download_url}}
 * 5. (Optional) Start nurture sequence / internal notification
 *
 * Custom fields to create in GHL:
 * - Lead Source (text) ← lead_source
 * - Downloaded Guide (text) ← downloaded_guide
 * - PDF Download URL (text) ← pdf_download_url
 */

import { GHL_WEBHOOK_URL } from "@/lib/constants";
import { ASG_BASE_URL, SURVIVAL_GUIDE_PDF } from "@/lib/accidentsurvivalguide";

export const ASG_LEAD_SOURCE = "AccidentSurvivalGuide";

const PLACEHOLDER_RE = /example\.com|placeholder|REPLACE_WITH/i;

function cleanWebhookUrl(value: string | undefined): string {
  const trimmed = value?.trim() ?? "";
  if (!trimmed || PLACEHOLDER_RE.test(trimmed)) return "";
  return trimmed;
}

/** Resolved at request time so Vercel env vars apply correctly. */
export function getAsgSurvivalGuideWebhookUrl(): string {
  return (
    cleanWebhookUrl(process.env.ASG_SURVIVAL_GUIDE_WEBHOOK_URL) ||
    cleanWebhookUrl(process.env.GHL_WEBHOOK_URL) ||
    GHL_WEBHOOK_URL
  );
}

export function survivalGuidePdfAbsoluteUrl() {
  return `${ASG_BASE_URL}${SURVIVAL_GUIDE_PDF}`;
}

export type SurvivalGuideLeadInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  state: string;
  city: string;
  zip: string;
  consentSms: boolean;
  consentEmail: boolean;
};

export function buildGhlSurvivalGuidePayload(lead: SurvivalGuideLeadInput) {
  const phoneDigits = lead.phone.replace(/\D/g, "");
  const fullName = `${lead.firstName} ${lead.lastName}`.trim();
  const pdfUrl = survivalGuidePdfAbsoluteUrl();

  return {
    first_name: lead.firstName,
    last_name: lead.lastName,
    full_name: fullName,
    email: lead.email,
    phone: lead.phone,
    phone_digits: phoneDigits,
    state: lead.state || "Not specified",
    city: lead.city || "",
    zip: lead.zip || "",
    lead_source: ASG_LEAD_SOURCE,
    downloaded_guide: "Yes",
    offer: "Accident Survival Guide 2026 PDF",
    pdf_download_url: pdfUrl,
    guide_pdf_path: SURVIVAL_GUIDE_PDF,
    sms_consent: lead.consentSms ? "Yes" : "No",
    email_consent: lead.consentEmail ? "Yes" : "No",
    marketing_consent: lead.consentSms || lead.consentEmail ? "Yes" : "No",
    source: "WreckMatch",
    site: "www.accidentsurvivalguide.com",
    created_at: new Date().toISOString(),
  };
}
