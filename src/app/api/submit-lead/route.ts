import { NextResponse } from "next/server";
import {
  DOCUHUB_TEMPLATE_ID,
  DOCUHUB_TEMPLATE_LINK,
  GHL_WEBHOOK_URL,
  LAW_FIRM_NAME,
  SUPPORT_PHONE_DISPLAY,
} from "@/lib/constants";

const DEFAULT_FIELD = "Not specified — web intake";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
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
    };

    if (!lead.firstName) {
      return NextResponse.json(
        { success: false, message: "Missing required field: firstName" },
        { status: 400 },
      );
    }

    if (!lead.lastName) {
      return NextResponse.json(
        { success: false, message: "Missing required field: lastName" },
        { status: 400 },
      );
    }

    if (!EMAIL_RE.test(lead.email)) {
      return NextResponse.json(
        { success: false, message: "Enter a valid email address." },
        { status: 400 },
      );
    }

    if (!lead.phone) {
      return NextResponse.json(
        { success: false, message: "Missing required field: phone" },
        { status: 400 },
      );
    }

    const phoneDigits = lead.phone.replace(/\D/g, "");
    if (phoneDigits.length < 10) {
      return NextResponse.json(
        { success: false, message: "Enter a valid phone number." },
        { status: 400 },
      );
    }

    if (!GHL_WEBHOOK_URL || /example\.com|placeholder|REPLACE_WITH/i.test(GHL_WEBHOOK_URL)) {
      console.error("[submit-lead] GHL webhook URL is missing or still placeholder.");
      return NextResponse.json(
        { success: false, message: "Lead automation is not configured yet." },
        { status: 500 },
      );
    }

    const fullName = `${lead.firstName} ${lead.lastName}`.trim();
    const payload = {
      source: LAW_FIRM_NAME,
      submittedAt: new Date().toISOString(),
      docuHubTemplateId: DOCUHUB_TEMPLATE_ID,
      docuHubTemplateLink: DOCUHUB_TEMPLATE_LINK,
      callbackPhone: SUPPORT_PHONE_DISPLAY,
      contact: {
        firstName: lead.firstName,
        lastName: lead.lastName,
        fullName,
        email: lead.email,
        phone: lead.phone,
        phoneDigits,
      },
      lead,
    };

    console.log("[submit-lead] incoming lead payload:", JSON.stringify(payload, null, 2));

    const ghlResponse = await fetch(GHL_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!ghlResponse.ok) {
      const failureBody = await ghlResponse.text();
      console.error("[submit-lead] GHL webhook failed:", {
        status: ghlResponse.status,
        statusText: ghlResponse.statusText,
        body: failureBody,
      });
      return NextResponse.json(
        { success: false, message: "Failed to send lead to automation." },
        { status: 502 },
      );
    }

    return NextResponse.json({
      success: true,
      redirectTo: "/thank-you",
    });
  } catch (error) {
    console.error("[submit-lead] unexpected error:", error);
    return NextResponse.json(
      { success: false, message: "Unexpected server error while submitting lead." },
      { status: 500 },
    );
  }
}
