import { NextResponse } from "next/server";
import {
  ASG_SURVIVAL_GUIDE_WEBHOOK_URL,
  buildGhlSurvivalGuidePayload,
  type SurvivalGuideLeadInput,
} from "@/lib/ghl-survival-guide";
import { SURVIVAL_GUIDE_PDF } from "@/lib/accidentsurvivalguide";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const GHL_API_KEY = process.env.GHL_API_KEY ?? "";
const GHL_LOCATION_ID = "rjrb67xfpyr4MIbZBrFZ";

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

function bool(v: unknown): boolean {
  return v === true || v === "true" || v === "1" || v === "yes";
}

function parseLead(body: Record<string, unknown>): SurvivalGuideLeadInput | { error: string } {
  const firstName = str(body.firstName);
  const lastName = str(body.lastName);
  const email = str(body.email).toLowerCase();
  const phone = str(body.phone);
  const state = str(body.state);
  const city = str(body.city);
  const zip = str(body.zip);
  const consentSms = bool(body.consentSms ?? body.consent);
  const consentEmail = bool(body.consentEmail ?? body.consent);

  if (!firstName) {
    return { error: "Please enter your first name." };
  }
  if (!lastName) {
    return { error: "Please enter your last name." };
  }
  if (!EMAIL_RE.test(email)) {
    return { error: "Enter a valid email address." };
  }
  if (!phone) {
    return { error: "Please enter your phone number." };
  }
  const phoneDigits = phone.replace(/\D/g, "");
  if (phoneDigits.length < 10) {
    return { error: "Enter a valid phone number." };
  }
  if (!consentSms && !consentEmail) {
    return { error: "Please confirm you agree to receive your guide and related updates." };
  }

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
  };
}

async function upsertGhlContact(lead: SurvivalGuideLeadInput) {
  if (!GHL_API_KEY) return;

  const tags = ["survival-guide-lead", "downloaded-guide-yes"];
  if (lead.state) tags.push(`state-${lead.state.toLowerCase()}`);

  const customFields: { id?: string; key?: string; field_value: string }[] = [
    { key: "lead_source", field_value: "AccidentSurvivalGuide" },
    { key: "downloaded_guide", field_value: "Yes" },
  ];

  const body: Record<string, unknown> = {
    firstName: lead.firstName,
    lastName: lead.lastName,
    email: lead.email,
    phone: lead.phone,
    state: lead.state || undefined,
    city: lead.city || undefined,
    postalCode: lead.zip || undefined,
    tags,
    locationId: GHL_LOCATION_ID,
    source: "Accident Survival Guide",
  };

  if (customFields.length) {
    body.customFields = customFields;
  }

  const res = await fetch("https://services.leadconnectorhq.com/contacts/upsert", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GHL_API_KEY}`,
      Version: "2021-07-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    console.error("[submit-survival-guide] GHL upsert failed:", await res.text());
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const parsed = parseLead(body);

    if ("error" in parsed) {
      return NextResponse.json({ success: false, message: parsed.error }, { status: 400 });
    }

    const webhookUrl = ASG_SURVIVAL_GUIDE_WEBHOOK_URL;
    if (!webhookUrl || /example\.com|placeholder|REPLACE_WITH/i.test(webhookUrl)) {
      console.error("[submit-survival-guide] GHL webhook URL missing.");
      return NextResponse.json(
        { success: false, message: "Lead automation is not configured yet." },
        { status: 500 },
      );
    }

    const payload = buildGhlSurvivalGuidePayload(parsed);
    console.log("[submit-survival-guide] webhook payload:", JSON.stringify(payload, null, 2));

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
      });
      return NextResponse.json(
        {
          success: false,
          message:
            "We couldn't complete your request right now. Please try again or call us for help.",
        },
        { status: 502 },
      );
    }

    await upsertGhlContact(parsed);

    const thankYouParams = new URLSearchParams({
      email: parsed.email,
      firstName: parsed.firstName,
    });
    if (parsed.state) thankYouParams.set("state", parsed.state);
    if (parsed.phone) thankYouParams.set("phone", parsed.phone);

    return NextResponse.json({
      success: true,
      pdfUrl: SURVIVAL_GUIDE_PDF,
      redirectTo: `/thank-you?${thankYouParams.toString()}`,
      emailSentViaGhl: true,
    });
  } catch (error) {
    console.error("[submit-survival-guide] unexpected error:", error);
    return NextResponse.json(
      { success: false, message: "Unexpected server error." },
      { status: 500 },
    );
  }
}
