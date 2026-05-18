import { NextResponse } from "next/server";
import {
  buildGhlSurvivalGuidePayload,
  getAsgSurvivalGuideWebhookUrl,
  type SurvivalGuideLeadInput,
} from "@/lib/ghl-survival-guide";
import { upsertGhlContact } from "@/lib/ghl";
import { ASG_LEAD_SOURCE } from "@/lib/ghl-survival-guide";
import { SURVIVAL_GUIDE_PDF } from "@/lib/accidentsurvivalguide";
import { LAW_FIRM_NAME } from "@/lib/constants";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/get-messages";
import { localizeHref } from "@/lib/i18n/locale-path";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const GHL_API_KEY = process.env.GHL_API_KEY ?? "";

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

    const webhookUrl = getAsgSurvivalGuideWebhookUrl();
    if (!webhookUrl && !GHL_API_KEY) {
      console.error("[submit-survival-guide] GHL webhook URL and API key both missing.");
      return NextResponse.json(
        { success: false, message: "Lead automation is not configured yet." },
        { status: 500 },
      );
    }

    const tags = ["wreckmatch-lead", "survival-guide-lead", "downloaded-guide-yes"];
    if (parsed.state) tags.push(`state-${parsed.state.toLowerCase()}`);

    let contactId: string | undefined;

    if (GHL_API_KEY) {
      const upsert = await upsertGhlContact(GHL_API_KEY, {
        firstName: parsed.firstName,
        lastName: parsed.lastName,
        email: parsed.email,
        phone: parsed.phone,
        state: parsed.state || undefined,
        city: parsed.city || undefined,
        postalCode: parsed.zip || undefined,
        tags,
        source: LAW_FIRM_NAME,
        customFields: [
          { key: "lead_source", field_value: ASG_LEAD_SOURCE },
          { key: "downloaded_guide", field_value: "Yes" },
        ],
      });

      if (!upsert.ok) {
        console.error("[submit-survival-guide] GHL upsert failed:", upsert.status, upsert.body);
        return NextResponse.json(
          { success: false, message: formErrors.saveFailed },
          { status: 502 },
        );
      }

      contactId = upsert.contactId;
      console.log("[submit-survival-guide] GHL contact upserted:", {
        contactId: upsert.contactId,
        isNew: upsert.isNew,
        email: parsed.email,
      });
    } else {
      console.warn("[submit-survival-guide] GHL_API_KEY missing; webhook-only mode.");
    }

    if (webhookUrl) {
      const payload = buildGhlSurvivalGuidePayload(parsed);
      if (contactId) {
        (payload as Record<string, unknown>).ghl_contact_id = contactId;
      }

      const ghlResponse = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!ghlResponse.ok) {
        const failureBody = await ghlResponse.text();
        console.error("[submit-survival-guide] GHL webhook failed:", {
          status: ghlResponse.status,
          body: failureBody,
          contactId,
        });
        if (!contactId) {
          return NextResponse.json(
            {
              success: false,
              message:
                "We couldn't complete your request right now. Please try again or call us for help.",
            },
            { status: 502 },
          );
        }
      }
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
      emailSentViaGhl: Boolean(webhookUrl),
      ghlContactId: contactId,
    });
  } catch (error) {
    console.error("[submit-survival-guide] unexpected error:", error);
    return NextResponse.json(
      { success: false, message: getMessages(DEFAULT_LOCALE).form.errors.serverError },
      { status: 500 },
    );
  }
}
