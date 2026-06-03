import {
  RETELL_PHONE_NUMBER,
  RETELL_VOICE_AGENT_ID,
} from "@/lib/constants";
import { normalizeGhlPhone } from "@/lib/ghl";

const RETELL_API_BASE = "https://api.retellai.com";

export type SarahOutboundInput = {
  toPhone: string;
  firstName: string;
  leadSource: string;
  offerLabel: string;
};

export type SarahOutboundResult =
  | { ok: true; callId: string }
  | { ok: false; reason: string; detail?: string };

/** Start an immediate outbound call from Sarah (Retell voice agent). */
export async function createSarahOutboundCall(
  input: SarahOutboundInput,
): Promise<SarahOutboundResult> {
  const apiKey = process.env.RETELL_API_KEY?.trim();
  const fromNumber = normalizeGhlPhone(RETELL_PHONE_NUMBER);
  const toNumber = normalizeGhlPhone(input.toPhone);
  const agentId = process.env.RETELL_AGENT_ID?.trim() || RETELL_VOICE_AGENT_ID?.trim();

  if (!apiKey) {
    return { ok: false, reason: "RETELL_API_KEY not configured" };
  }

  if (!fromNumber || !toNumber) {
    return { ok: false, reason: "invalid_phone" };
  }

  if (!agentId) {
    return { ok: false, reason: "RETELL_VOICE_AGENT_ID not configured" };
  }

  const body: Record<string, unknown> = {
    from_number: fromNumber,
    to_number: toNumber,
    override_agent_id: agentId,
    retell_llm_dynamic_variables: {
      first_name: input.firstName || "there",
      lead_source: input.leadSource,
      offer: input.offerLabel,
    },
    metadata: {
      lead_source: input.leadSource,
      offer: input.offerLabel,
    },
  };

  try {
    const res = await fetch(`${RETELL_API_BASE}/v2/create-phone-call`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const text = await res.text();
    if (!res.ok) {
      return { ok: false, reason: "retell_api_error", detail: text.slice(0, 500) };
    }

    const parsed = JSON.parse(text) as { call_id?: string };
    const callId = parsed.call_id ?? "";
    if (!callId) {
      return { ok: false, reason: "missing_call_id", detail: text.slice(0, 300) };
    }

    return { ok: true, callId };
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    return { ok: false, reason: "retell_request_failed", detail };
  }
}

export { normalizeGhlPhone as phoneToE164 };
