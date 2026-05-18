import { NextResponse } from "next/server";
import {
  GHL_WEBHOOK_URL,
  LAW_FIRM_NAME,
} from "@/lib/constants";

const DEFAULT_FIELD = "Not specified — web intake";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const GHL_API_KEY = process.env.GHL_API_KEY ?? "";
const GHL_LOCATION_ID = "rjrb67xfpyr4MIbZBrFZ";

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
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

  return {
    city: cityState.trim(),
    state: "",
  };
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
      caseDescription: str(body.caseDescription),
      preferredCallbackTime: str(body.preferredCallbackTime),
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
    const { city, state } = parseCityState(lead.cityState);
    const createdAt = new Date().toISOString();
    const payload = {
      first_name: lead.firstName,
      last_name: lead.lastName,
      full_name: fullName,
      phone: lead.phone,
      phone_digits: phoneDigits,
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
      created_at: createdAt,
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

    if (!GHL_API_KEY) {
      console.warn("[submit-lead] GHL_API_KEY missing; skipping direct contact upsert.");
    } else {
      const ghlContactResponse = await fetch("https://services.leadconnectorhq.com/contacts/upsert", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GHL_API_KEY}`,
          Version: "2021-07-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: lead.firstName,
          lastName: lead.lastName,
          email: lead.email,
          phone: lead.phone,
          tags: ["wreckmatch-lead"],
          locationId: GHL_LOCATION_ID,
        }),
      });

      if (!ghlContactResponse.ok) {
        const failureBody = await ghlContactResponse.text();
        console.error("[submit-lead] GHL contact upsert failed:", {
          status: ghlContactResponse.status,
          statusText: ghlContactResponse.statusText,
          body: failureBody,
        });
      }
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
