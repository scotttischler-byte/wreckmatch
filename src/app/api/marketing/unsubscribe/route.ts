import { NextResponse } from "next/server";

const WEBHOOK_URL =
  process.env.ATTORNEY_CAMPAIGN_UNSUBSCRIBE_WEBHOOK_URL ||
  process.env.MARKETING_UNSUBSCRIBE_WEBHOOK_URL ||
  "";

function str(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

async function parsePayload(request: Request) {
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const body = (await request.json()) as Record<string, unknown>;
    return {
      campaign: typeof body.campaign === "string" ? body.campaign.trim() : "",
      recipient: typeof body.recipient === "string" ? body.recipient.trim() : "",
      reason: typeof body.reason === "string" ? body.reason.trim() : "unsubscribe",
    };
  }

  const form = await request.formData();
  return {
    campaign: str(form.get("campaign")),
    recipient: str(form.get("recipient")),
    reason: str(form.get("reason")) || "unsubscribe",
  };
}

export async function POST(request: Request) {
  try {
    const payload = {
      ...(await parsePayload(request)),
      source: "wreckmatch-attorney-campaign",
      created_at: new Date().toISOString(),
    };

    if (WEBHOOK_URL) {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.error("[marketing-unsubscribe] webhook failed:", res.status, await res.text());
      }
    } else {
      console.warn("[marketing-unsubscribe] webhook missing; opt-out received:", payload);
    }

    return NextResponse.redirect(new URL("/unsubscribe?success=1", request.url), 303);
  } catch (error) {
    console.error("[marketing-unsubscribe] unexpected error:", error);
    return NextResponse.redirect(new URL("/unsubscribe?error=1", request.url), 303);
  }
}
