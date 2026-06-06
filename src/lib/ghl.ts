export const GHL_LOCATION_ID = "rjrb67xfpyr4MIbZBrFZ";
export const GHL_API_BASE = "https://services.leadconnectorhq.com";

/** US numbers → E.164 (+1…) for reliable GHL matching. */
export function normalizeGhlPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return phone.trim();
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  if (phone.trim().startsWith("+")) return phone.trim();
  return `+${digits}`;
}

export type GhlUpsertInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  state?: string;
  city?: string;
  postalCode?: string;
  tags?: string[];
  source?: string;
  customFields?: { key: string; field_value: string }[];
};

export type GhlUpsertResult =
  | { ok: true; contactId: string; isNew: boolean }
  | { ok: false; status: number; body: string };

export type GhlSendSmsResult =
  | { ok: true; messageId?: string }
  | { ok: false; status: number; reason: string; body?: string };

export async function upsertGhlContact(
  apiKey: string,
  input: GhlUpsertInput,
): Promise<GhlUpsertResult> {
  const body: Record<string, unknown> = {
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email.toLowerCase(),
    phone: normalizeGhlPhone(input.phone),
    state: input.state || undefined,
    city: input.city || undefined,
    postalCode: input.postalCode || undefined,
    tags: input.tags,
    locationId: GHL_LOCATION_ID,
    source: input.source,
  };

  if (input.customFields?.length) {
    body.customFields = input.customFields;
  }

  const res = await fetch(`${GHL_API_BASE}/contacts/upsert`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Version: "2021-07-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  if (!res.ok) {
    return { ok: false, status: res.status, body: text };
  }

  try {
    const parsed = JSON.parse(text) as { contact?: { id?: string }; new?: boolean };
    const contactId = parsed.contact?.id ?? "";
    if (!contactId) {
      return { ok: false, status: res.status, body: text };
    }
    return { ok: true, contactId, isNew: Boolean(parsed.new) };
  } catch {
    return { ok: false, status: res.status, body: text };
  }
}

/** Send outbound SMS via GHL LC Phone (requires conversations/message.write on API token). */
export async function sendGhlSms(
  apiKey: string,
  contactId: string,
  message: string,
): Promise<GhlSendSmsResult> {
  const res = await fetch(`${GHL_API_BASE}/conversations/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Version: "2021-04-15",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: "SMS",
      contactId,
      message,
      status: "pending",
    }),
  });

  const text = await res.text();
  if (!res.ok) {
    return {
      ok: false,
      status: res.status,
      reason: res.status === 401 ? "missing_conversations_scope" : "ghl_sms_failed",
      body: text,
    };
  }

  try {
    const parsed = JSON.parse(text) as { messageId?: string; id?: string };
    return { ok: true, messageId: parsed.messageId ?? parsed.id };
  } catch {
    return { ok: true };
  }
}
