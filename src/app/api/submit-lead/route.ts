import { NextResponse } from "next/server";
import {
  DOCUHUB_TEMPLATE_ID,
  DOCUHUB_TEMPLATE_LINK,
  GHL_WEBHOOK_URL,
  LAW_FIRM_NAME,
  SUPPORT_PHONE_DISPLAY,
} from "@/lib/constants";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, message: "Invalid lead payload." },
        { status: 400 },
      );
    }

    const requiredFields = [
      "accidentTime",
      "cityState",
      "accidentType",
      "injured",
      "medicalTreatment",
      "insurance",
      "hasAttorney",
      "phone",
    ] as const;

    for (const field of requiredFields) {
      const value = body[field];
      if (typeof value !== "string" || value.trim().length === 0) {
        return NextResponse.json(
          { success: false, message: `Missing required field: ${field}` },
          { status: 400 },
        );
      }
    }

    const payload = {
      source: LAW_FIRM_NAME,
      submittedAt: new Date().toISOString(),
      docuHubTemplateId: DOCUHUB_TEMPLATE_ID,
      docuHubTemplateLink: DOCUHUB_TEMPLATE_LINK,
      callbackPhone: SUPPORT_PHONE_DISPLAY,
      lead: body,
    };

    console.log("[submit-lead] incoming lead payload:", JSON.stringify(payload, null, 2));

    // TODO: Replace with real GoHighLevel webhook URL once provided.
    // The current placeholder allows front-end flow testing without breaking submissions.
    if (
      GHL_WEBHOOK_URL &&
      !GHL_WEBHOOK_URL.includes("example.com") &&
      !GHL_WEBHOOK_URL.includes("placeholder")
    ) {
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
