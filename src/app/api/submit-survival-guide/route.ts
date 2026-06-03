import { NextResponse } from "next/server";
import type { SurvivalGuideLeadInput } from "@/lib/ghl-survival-guide";
import { ASG_LEAD_SOURCE } from "@/lib/ghl-survival-guide";
import { SURVIVAL_GUIDE_PDF } from "@/lib/accidentsurvivalguide";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/get-messages";
import { localizeHref } from "@/lib/i18n/locale-path";
import { processAsgLead } from "@/lib/asg-lead-pipeline";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

function bool(v: unknown): boolean {
  return v === true || v === "true" || v === "1" || v === "yes";
}

function resolveLocale(body: Record<string, unknown>): Locale {
  const lang = str(body.preferredLanguage);
  return isLocale(lang) ? lang : DEFAULT_LOCALE;
}

function parseLead(
  body: Record<string, unknown>,
  locale: Locale,
): SurvivalGuideLeadInput | { error: string } {
  const errors = getMessages(locale).form.errors;
  const firstName = str(body.firstName);
  const lastName = str(body.lastName);
  const email = str(body.email).toLowerCase();
  const phone = str(body.phone);
  const state = str(body.state);
  const city = str(body.city);
  const zip = str(body.zip);
  const consentSms = bool(body.consentSms ?? body.consent);
  const consentEmail = bool(body.consentEmail ?? body.consent);

  if (!firstName) return { error: errors.firstName };
  if (!lastName) return { error: errors.lastName };
  if (!EMAIL_RE.test(email)) return { error: errors.email };
  if (!phone) return { error: errors.phone };
  const phoneDigits = phone.replace(/\D/g, "");
  if (phoneDigits.length < 10) return { error: errors.phoneInvalid };
  if (!consentSms && !consentEmail) return { error: errors.consent };

  return {
    firstName,
    lastName,
    email,
    phone,
    state,
    city,
    zip,
    consentSms,
    consentEmail,
    preferredLanguage: locale,
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const locale = resolveLocale(body);
    const formErrors = getMessages(locale).form.errors;
    const parsed = parseLead(body, locale);

    if ("error" in parsed) {
      return NextResponse.json({ success: false, message: parsed.error }, { status: 400 });
    }

    const result = await processAsgLead({
      firstName: parsed.firstName,
      lastName: parsed.lastName,
      email: parsed.email,
      phone: parsed.phone,
      state: parsed.state,
      city: parsed.city,
      postalCode: parsed.zip,
      magnetType: "survival-guide-download",
      leadSource: ASG_LEAD_SOURCE,
      consentEmail: parsed.consentEmail,
      consentSms: parsed.consentSms,
      preferredLanguage: locale,
    });

    if (!result.ok) {
      return NextResponse.json(
        { success: false, message: formErrors.saveFailed },
        { status: 502 },
      );
    }

    const thankYouParams = new URLSearchParams({
      email: parsed.email,
      firstName: parsed.firstName,
    });
    if (parsed.state) thankYouParams.set("state", parsed.state);
    if (parsed.phone) thankYouParams.set("phone", parsed.phone);

    return NextResponse.json({
      success: true,
      pdfUrl: SURVIVAL_GUIDE_PDF,
      redirectTo: `${localizeHref("/thank-you", locale)}?${thankYouParams.toString()}`,
      ghlContactId: result.contactId,
      sarahCallStarted: result.sarahCallStarted,
      emailAutomationTriggered: result.webhookSent,
    });
  } catch (error) {
    console.error("[submit-survival-guide] unexpected error:", error);
    return NextResponse.json(
      { success: false, message: getMessages(DEFAULT_LOCALE).form.errors.serverError },
      { status: 500 },
    );
  }
}
