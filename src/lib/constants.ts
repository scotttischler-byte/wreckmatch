export const LAW_FIRM_NAME = "WreckMatch";
export const DEFAULT_ATTORNEY_PITCH = "Bobby Garcia Law";
export const SUPPORT_PHONE_DISPLAY = "(978) 515-6063";
export const SUPPORT_PHONE_E164 = "+19785156063";

export const DOCUHUB_TEMPLATE_ID =
  process.env.DOCUHUB_TEMPLATE_ID ?? "docuhub_template_placeholder";
export const DOCUHUB_TEMPLATE_LINK =
  process.env.DOCUHUB_TEMPLATE_LINK ?? "https://example.com/docuhub-template";
export const GHL_WEBHOOK_URL =
  process.env.GHL_WEBHOOK_URL ??
  "https://services.leadconnectorhq.com/hooks/rjrb67xfpyr4MIbZBrFZ/webhook-trigger/e9f8fe48-744d-467b-935a-537f6442b6e8";

/** Retell embed (layout) — voice callback widget + optional legacy references */
export const RETELL_EMBED_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_RETELL_PUBLIC_KEY ?? "key_3668132809d7066a44d6b61d3c8a";
export const RETELL_PUBLIC_KEY = RETELL_EMBED_PUBLIC_KEY;

/** Voice / conversation agent used by Retell **callback** embed (`data-widget="callback"`). */
export const RETELL_VOICE_AGENT_ID =
  process.env.NEXT_PUBLIC_RETELL_VOICE_AGENT_ID ?? "conversation_flow_3a31cc3b94b8";

/** @deprecated Chat agent id unused in layout; retained for tooling/docs during migration */
export const RETELL_CHAT_AGENT_ID =
  process.env.NEXT_PUBLIC_RETELL_CHAT_AGENT_ID ?? "agent_replace_with_chat_agent_id";

/** Retell outbound FROM number (E.164) shown on Caller ID — must match a Retell-provisioned phone. */
export const RETELL_PHONE_NUMBER =
  process.env.NEXT_PUBLIC_RETELL_PHONE_NUMBER ?? SUPPORT_PHONE_E164;

/** Optional absolute terms URL for Retell widget (`data-tc`). */
export const PUBLIC_SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");
export const RETELL_WIDGET_TERMS_URL =
  process.env.NEXT_PUBLIC_TERMS_URL ||
  (PUBLIC_SITE_URL ? `${PUBLIC_SITE_URL}/terms` : "");
