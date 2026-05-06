export const LAW_FIRM_NAME = "WreckMatch";
export const DEFAULT_ATTORNEY_PITCH = "Bobby Garcia Law";
export const SUPPORT_PHONE_DISPLAY = "(978) 515-6063";
export const SUPPORT_PHONE_E164 = "+19785156063";

export const DOCUHUB_TEMPLATE_ID =
  process.env.DOCUHUB_TEMPLATE_ID ?? "docuhub_template_placeholder";
export const DOCUHUB_TEMPLATE_LINK =
  process.env.DOCUHUB_TEMPLATE_LINK ?? "https://example.com/docuhub-template";
export const GHL_WEBHOOK_URL =
  process.env.GHL_WEBHOOK_URL ?? "https://example.com/webhooks/ghl-lead";

export const RETELL_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_RETELL_PUBLIC_KEY ?? "key_replace_with_retell_public_key";
export const RETELL_CHAT_AGENT_ID =
  process.env.NEXT_PUBLIC_RETELL_CHAT_AGENT_ID ?? "agent_replace_with_chat_agent_id";
export const RETELL_VOICE_AGENT_ID =
  process.env.NEXT_PUBLIC_RETELL_VOICE_AGENT_ID ?? "agent_replace_with_voice_agent_id";
export const RETELL_PHONE_NUMBER =
  process.env.NEXT_PUBLIC_RETELL_PHONE_NUMBER ?? SUPPORT_PHONE_E164;
