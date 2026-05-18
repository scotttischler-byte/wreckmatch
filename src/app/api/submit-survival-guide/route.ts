import { NextResponse } from "next/server";
import { GHL_WEBHOOK_URL, LAW_FIRM_NAME } from "@/lib/constants";
import { SURVIVAL_GUIDE_PDF } from "@/lib/accidentsurvivalguide";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const GHL_API_KEY = process.env.GHL_API_KEY ?? "";
const GHL_LOCATION_ID = "rjrb67xfpyr4MIbZBrFZ";

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

function splitFullName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0] ?? "", lastName: "." };
  return {
    firstName: parts[0] ?? "",
    lastName: parts.slice(1).join(" "),
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const fullName = str(body.fullName);
    const email = str(body.email).toLowerCase();
    const phone = str(body.phone);
    const state = str(body.state);

    if (!fullName) {
      return NextResponse.json(
        { success: false, message: "Please enter your full name." },
        { status: 400 },
      );
    }

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json(
        { success: false, message: "Enter a valid email address." },
        { status: 400 },
      );
    }

    if (!phone) {
      return NextResponse.json(
        { success: false, message: "Please enter your phone number." },
        { status: 400 },
      );
    }

    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length < 10) {
      return NextResponse.json(
        { success: false, message: "Enter a valid phone number." },
        { status: 400 },
      );
    }

    if (!GHL_WEBHOOK_URL || /example\.com|placeholder|REPLACE_WITH/i.test(GHL_WEBHOOK_URL)) {
      console.error("[submit-survival-guide] GHL webhook URL is missing or placeholder.");
      return NextResponse.json(
        { success: false, message: "Lead automation is not configured yet." },
        { status: 500 },
      );
    }

    const { firstName, lastName } = splitFullName(fullName);
    const createdAt = new Date().toISOString();
    const payload = {
      first_name: firstName,
      last_name: lastName,
      full_name: fullName,
      phone,
      phone_digits: phoneDigits,
      email,
      state: state || "Not specified",
      source: LAW_FIRM_NAME,
      lead_source: "www.accidentsurvivalguide.com",
      offer: "Car Accident Survival Guide PDF",
      created_at: createdAt,
    };

    console.log("[submit-survival-guide] payload:", JSON.stringify(payload, null, 2));

    const ghlResponse = await fetch(GHL_WEBHOOK_URL, {
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
        { success: false, message: "Failed to send your request. Please try again." },
        { status: 502 },
      );
    }

    if (GHL_API_KEY) {
      const tags = ["survival-guide-lead"];
      if (state) tags.push(`state-${state.toLowerCase()}`);

      const ghlContactResponse = await fetch(
        "https://services.leadconnectorhq.com/contacts/upsert",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${GHL_API_KEY}`,
            Version: "2021-07-28",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            phone,
            tags,
            locationId: GHL_LOCATION_ID,
            source: "Accident Survival Guide",
          }),
        },
      );

      if (!ghlContactResponse.ok) {
        const failureBody = await ghlContactResponse.text();
        console.error("[submit-survival-guide] GHL upsert failed:", failureBody);
      }
    }

    return NextResponse.json({
      success: true,
      pdfUrl: SURVIVAL_GUIDE_PDF,
      redirectTo: "/thank-you",
    });
  } catch (error) {
    console.error("[submit-survival-guide] unexpected error:", error);
    return NextResponse.json(
      { success: false, message: "Unexpected server error." },
      { status: 500 },
    );
  }
}
