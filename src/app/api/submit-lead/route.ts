import { NextResponse } from "next/server";
import {
  GHL_WEBHOOK_URL,
  LAW_FIRM_NAME,
} from "@/lib/constants";
import { accidentIntakeLeadFields } from "@/lib/asg-intake-lead";
import { isAccidentIntakeComplete, parseAccidentIntakeFromBody } from "@/lib/asg-intake";
import { ASG_LEAD_SOURCE } from "@/lib/ghl-survival-guide";
import { processAsgLead, type AsgLeadMagnetType } from "@/lib/asg-lead-pipeline";
import { isAsgRequest } from "@/lib/asg-request";
import { getMessages } from "@/lib/i18n/get-messages";
import { upsertGhlContact } from "@/lib/ghl";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/i18n/config";

const DEFAULT_FIELD = "Not specified — web intake";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const GHL_API_KEY = process.env.GHL_API_KEY ?? "";

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

/** SMS opt-in: explicit checkbox, or implied when form consent covers calls/texts. */
function resolveAsgSmsConsent(body: Record<string, unknown>): boolean {
  if (body.consentSms === true || body.consentSms === "true") return true;
  if (body.consentSms === false || body.consentSms === "false") return false;
  return body.consentEmail !== false;
}

function parseCityState(cityState: string) {
  if (!cityState) return { city: "", state: "" };
  const parts = cityState.split(",");
  if (parts.length >= 2) {
    return {
      city: parts[0]?.trim() ?? "",
      state: parts.slice(1).join(",").trim(),
    };
  }
  return { city: cityState.trim(), state: "" };
}

function resolveMagnetType(body: Record<string, unknown>): AsgLeadMagnetType {
  const explicit = str(body.magnet_type) as AsgLeadMagnetType;
  if (
    explicit === "survival-guide-download" ||
    explicit === "calculator-lead-magnet" ||
    explicit === "calculator-case-review" ||
    explicit === "attorney-match" ||
    explicit === "expert-intake-asap" ||
    explicit === "webinar-registration"
  ) {
    return explicit;
  }

  const src = str(body.lead_source);
  if (src.includes("webinar")) return "webinar-registration";
  if (src.includes("expert-intake")) return "expert-intake-asap";
  if (src.includes("calculator-lead-magnet")) return "calculator-lead-magnet";
  if (src.includes("compensation-calculator")) return "calculator-case-review";
  if (src.includes("thank-you")) return "attorney-match";
  return "calculator-lead-magnet";
}

function isAsgLead(body: Record<string, unknown>, request: Request): boolean {
  if (isAsgRequest(request)) return true;
  const src = str(body.lead_source);
  const magnet = str(body.magnet_type);
  return (
    magnet.length > 0 ||
    src.includes("accidentsurvivalguide") ||
    src.includes("accident-survival-guide")
  );
}

/** Legacy wreckmatch.com / SEO intake — webhook only. */
async function submitLegacyLead(body: Record<string, unknown>) {
  const lead = {
    firstName: str(body.firstName),
    lastName: str(body.lastName),
    email: str(body.email).toLowerCase(),
    accidentTime: str(body.accidentTime) || DEFAULT_FIELD,
    cityState: str(body.cityState) || DEFAULT_FIELD,
    accidentType: str(body.accidentType) || DEFAULT_FIELD,
    injured: str(body.injured) || DEFAULT_FIELD,
    medicalTreatment: str(body.medicalTreatment) || DEFAULT_FIELD,
    insurance: str(body.insurance) || DEFAULT_FIELD,
    hasAttorney: str(body.hasAttorney) || DEFAULT_FIELD,
    phone: str(body.phone),
    caseDescription: str(body.caseDescription),
    preferredCallbackTime: str(body.preferredCallbackTime),
  };

  if (!GHL_WEBHOOK_URL || /example\.com|placeholder|REPLACE_WITH/i.test(GHL_WEBHOOK_URL)) {
    return NextResponse.json(
      { success: false, message: "Lead automation is not configured yet." },
      { status: 500 },
    );
  }

  const fullName = `${lead.firstName} ${lead.lastName}`.trim();
  const { city, state } = parseCityState(lead.cityState);
  const payload = {
    first_name: lead.firstName,
    last_name: lead.lastName,
    full_name: fullName,
    phone: lead.phone,
    phone_digits: lead.phone.replace(/\D/g, ""),
    email: lead.email,
    accident_date: lead.accidentTime,
    accident_type: lead.accidentType,
    injury_status: lead.injured,
    medical_treatment: lead.medicalTreatment,
    insurance_status: lead.insurance,
    has_attorney: lead.hasAttorney,
    city_state: lead.cityState,
    city,
    state,
    case_description: lead.caseDescription,
    preferred_callback_time: lead.preferredCallbackTime,
    source: LAW_FIRM_NAME,
    lead_source: str(body.lead_source) || "www.wreckmatch.com",
    created_at: new Date().toISOString(),
  };

  const ghlResponse = await fetch(GHL_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!ghlResponse.ok) {
    return NextResponse.json(
      { success: false, message: "Failed to send lead to automation." },
      { status: 502 },
    );
  }

  if (GHL_API_KEY) {
    await upsertGhlContact(GHL_API_KEY, {
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      phone: lead.phone,
      tags: ["wreckmatch-lead"],
      source: LAW_FIRM_NAME,
    });
  }

  return NextResponse.json({ success: true, redirectTo: "/thank-you" });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, message: "Invalid lead payload." },
        { status: 400 },
      );
    }

    const firstName = str(body.firstName);
    const lastName = str(body.lastName) || ".";
    const email = str(body.email).toLowerCase();
    const phone = str(body.phone);

    if (!firstName) {
      return NextResponse.json(
        { success: false, message: "Missing required field: firstName" },
        { status: 400 },
      );
    }

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json(
        { success: false, message: "Enter a valid email address." },
        { status: 400 },
      );
    }

    if (!phone || phone.replace(/\D/g, "").length < 10) {
      return NextResponse.json(
        { success: false, message: "Enter a valid phone number." },
        { status: 400 },
      );
    }

    if (!isAsgLead(body, request)) {
      if (!lastName || lastName === ".") {
        return NextResponse.json(
          { success: false, message: "Missing required field: lastName" },
          { status: 400 },
        );
      }
      return submitLegacyLead(body);
    }

    const { state: parsedState } = parseCityState(str(body.cityState));
    const stateField = str(body.state) || parsedState;
    const lang = str(body.preferredLanguage);
    const locale: Locale = isLocale(lang) ? lang : DEFAULT_LOCALE;

    const magnetType = resolveMagnetType(body);
    const city = str(body.city);
    if (!city && magnetType !== "webinar-registration") {
      return NextResponse.json(
        { success: false, message: getMessages(locale).form.errors.city },
        { status: 400 },
      );
    }
    const intake = parseAccidentIntakeFromBody(body);
    const intakeRequired =
      magnetType === "calculator-lead-magnet" || magnetType === "expert-intake-asap";
    if (intakeRequired && !isAccidentIntakeComplete(intake)) {
      return NextResponse.json(
        { success: false, message: getMessages(locale).form.errors.intakeIncomplete },
        { status: 400 },
      );
    }
    const intakeFields = isAccidentIntakeComplete(intake)
      ? accidentIntakeLeadFields(intake, locale)
      : {};

    const result = await processAsgLead({
      firstName,
      lastName,
      email,
      phone,
      state: stateField,
      city,
      postalCode: str(body.zip),
      magnetType,
      leadSource: str(body.lead_source) || ASG_LEAD_SOURCE,
      formName: str(body.form_name) || str(body.magnet_type) || "asg-intake",
      consentEmail: body.consentEmail !== false,
      consentSms: resolveAsgSmsConsent(body),
      preferredLanguage: locale,
      caseDescription: str(body.caseDescription) || intakeFields.caseDescription,
      calculatorSummary: str(body.calculator_summary),
      priorityIntake:
        magnetType === "expert-intake-asap" || body.priority_intake === true,
      ...intakeFields,
    });

    if (!result.ok) {
      return NextResponse.json(
        { success: false, message: result.message ?? "Failed to save lead." },
        { status: 502 },
      );
    }

    const redirectTo =
      magnetType === "webinar-registration"
        ? `/webinar/thank-you?email=${encodeURIComponent(email)}&firstName=${encodeURIComponent(firstName)}`
        : "/thank-you";

    return NextResponse.json({
      success: true,
      ghlContactId: result.contactId,
      sarahCallStarted: result.sarahCallStarted,
      emailAutomationTriggered: result.webhookSent,
      redirectTo,
    });
  } catch (error) {
    console.error("[submit-lead] unexpected error:", error);
    return NextResponse.json(
      { success: false, message: "Unexpected server error while submitting lead." },
      { status: 500 },
    );
  }
}
