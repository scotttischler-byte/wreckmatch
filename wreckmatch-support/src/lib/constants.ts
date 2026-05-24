export const LAW_FIRM_NAME = "WreckMatch";
export const DEFAULT_ATTORNEY_PITCH = "Bobby Garcia Law";

/** Sarah — vanity 855-8-WRECKMATCH (855-897-3262), forwarded to Sarah's line. */
export const SARAH_PHONE_DISPLAY =
  process.env.NEXT_PUBLIC_SARAH_PHONE_DISPLAY ?? "855-8-WRECKMATCH";
export const SARAH_PHONE_DIALABLE =
  process.env.NEXT_PUBLIC_SARAH_PHONE_DIALABLE ?? "855-897-3262";
export const SARAH_PHONE_E164 =
  process.env.NEXT_PUBLIC_SARAH_PHONE_E164 ?? "+18558973262";
export const SARAH_PHONE_TEL = `tel:${SARAH_PHONE_E164}`;

/** @deprecated Use SARAH_PHONE_* — kept for legacy references during migration */
export const SUPPORT_PHONE_DISPLAY = SARAH_PHONE_DISPLAY;
export const SUPPORT_PHONE_E164 = SARAH_PHONE_E164;

export const GHL_WEBHOOK_URL =
  process.env.GHL_WEBHOOK_URL ??
  "https://services.leadconnectorhq.com/hooks/rjrb67xfpyr4MIbZBrFZ/webhook-trigger/e9f8fe48-744d-467b-935a-537f6442b6e8";

/** Retell embed — public key + agent IDs (layout widget). */
export const RETELL_EMBED_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_RETELL_PUBLIC_KEY ??
  process.env.RETELL_PUBLIC_KEY ??
  "key_3668132809d7066a44d6b61d3c8a";
export const RETELL_PUBLIC_KEY = RETELL_EMBED_PUBLIC_KEY;

/** Chat agent for Retell website widget (text chat with Sarah). */
export const RETELL_CHAT_AGENT_ID =
  process.env.NEXT_PUBLIC_RETELL_CHAT_AGENT_ID ??
  process.env.RETELL_CHAT_AGENT_ID ??
  "";

/** Voice agent — enables voice calls inside the Retell widget + callback flows. */
export const RETELL_VOICE_AGENT_ID =
  process.env.NEXT_PUBLIC_RETELL_VOICE_AGENT_ID ??
  process.env.RETELL_AGENT_ID ??
  "conversation_flow_3a31cc3b94b8";

/** Retell outbound FROM number (E.164) shown on Caller ID — must match a Retell-provisioned phone. */
export const RETELL_PHONE_NUMBER =
  process.env.NEXT_PUBLIC_RETELL_PHONE_NUMBER ?? SUPPORT_PHONE_E164;

/** Optional absolute terms URL for Retell widget (`data-tc`). */
export const PUBLIC_SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");
export const RETELL_WIDGET_TERMS_URL =
  process.env.NEXT_PUBLIC_TERMS_URL ||
  (PUBLIC_SITE_URL ? `${PUBLIC_SITE_URL}/terms` : "");
