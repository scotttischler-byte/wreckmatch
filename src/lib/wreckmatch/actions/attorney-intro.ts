"use server";

import { GHL_WEBHOOK_URL, LAW_FIRM_NAME } from "@/lib/constants";
import { upsertGhlContact } from "@/lib/ghl";
import { getProfile } from "@/lib/wreckmatch/actions/profile";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type AttorneyIntroInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message?: string;
  attorneyId?: string;
  attorneyName?: string;
  consent: boolean;
};

export async function submitAttorneyIntro(input: AttorneyIntroInput) {
  if (!input.consent) {
    return { ok: false, error: "Please acknowledge the disclaimer to continue." };
  }

  const firstName = input.firstName.trim();
  const lastName = input.lastName.trim();
  const email = input.email.trim().toLowerCase();
  const phone = input.phone.trim();
  const message = input.message?.trim() ?? "";

  if (!firstName || !lastName) {
    return { ok: false, error: "Please enter your name." };
  }
  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  if (phone.replace(/\D/g, "").length < 10) {
    return { ok: false, error: "Please enter a valid phone number." };
  }

  const profile = await getProfile();

  const payload = {
    first_name: firstName,
    last_name: lastName,
    full_name: `${firstName} ${lastName}`.trim(),
    phone,
    email,
    accident_type: profile?.wreck_type ?? "Not specified",
    injury_status: profile?.injuries?.join(", ") || "Not specified",
    state: profile?.state ?? "Not specified",
    accident_date: profile?.accident_date ?? "Not specified",
    case_description: message || profile?.story || "",
    has_attorney: "Requesting intro via WreckMatch app",
    lead_source: "wreckmatch-app-attorney-intro",
    source: LAW_FIRM_NAME,
    attorney_id: input.attorneyId ?? "",
    attorney_name: input.attorneyName ?? "",
    created_at: new Date().toISOString(),
  };

  const ghlApiKey = process.env.GHL_API_KEY ?? "";

  if (GHL_WEBHOOK_URL && !/example\.com|placeholder|REPLACE_WITH/i.test(GHL_WEBHOOK_URL)) {
    try {
      const res = await fetch(GHL_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        console.error("[attorney-intro] webhook failed:", res.status, await res.text());
        return { ok: false, error: "We couldn't send your request right now. Please try again." };
      }
    } catch (error) {
      console.error("[attorney-intro] webhook error:", error);
      return { ok: false, error: "We couldn't send your request right now. Please try again." };
    }
  } else if (ghlApiKey) {
    console.warn("[attorney-intro] webhook missing; using contact upsert only.");
  } else {
    console.warn("[attorney-intro] GHL not configured; accepting request in demo mode.");
    return { ok: true, demo: true };
  }

  if (ghlApiKey) {
    const tags = [
      "wreckmatch-app",
      "attorney-intro",
      profile?.state ? `state-${profile.state}` : "state-unknown",
      profile?.wreck_type ? `wreck-${profile.wreck_type.toLowerCase()}` : "wreck-unknown",
    ];
    if (input.attorneyId) tags.push(`attorney-${input.attorneyId}`);

    const upsert = await upsertGhlContact(ghlApiKey, {
      firstName,
      lastName,
      email,
      phone,
      state: profile?.state ?? undefined,
      tags,
      source: "WreckMatch App — Attorney Intro",
      customFields: message
        ? [{ key: "case_description", field_value: message }]
        : undefined,
    });

    if (!upsert.ok) {
      console.error("[attorney-intro] upsert failed:", upsert.status, upsert.body);
    }
  }

  return { ok: true };
}
