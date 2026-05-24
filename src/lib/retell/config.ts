import {
  RETELL_EMBED_PUBLIC_KEY,
  RETELL_CHAT_AGENT_ID,
  RETELL_VOICE_AGENT_ID,
  RETELL_PHONE_NUMBER,
  RETELL_WIDGET_TERMS_URL,
  SARAH_PHONE_E164,
} from "@/lib/constants";

const PLACEHOLDER = /REPLACE_WITH|placeholder|your_value|example\.com/i;

export type RetellWidgetConfig = {
  publicKey: string;
  chatAgentId: string;
  voiceAgentId?: string;
  phoneNumber: string;
  termsUrl?: string;
  recaptchaKey?: string;
};

function isReal(value: string | undefined | null): value is string {
  const v = value?.trim();
  if (!v) return false;
  return !PLACEHOLDER.test(v);
}

/** Server + client safe — uses env vars with constants fallbacks for layout Script. */
export function getRetellWidgetConfig(): RetellWidgetConfig | null {
  const publicKey = RETELL_EMBED_PUBLIC_KEY.trim();
  const chatAgentId = RETELL_CHAT_AGENT_ID.trim();
  const voiceAgentId = RETELL_VOICE_AGENT_ID.trim();
  const phoneNumber = RETELL_PHONE_NUMBER.trim() || SARAH_PHONE_E164;

  const resolvedChat = isReal(chatAgentId)
    ? chatAgentId
    : isReal(voiceAgentId)
      ? voiceAgentId
      : "";

  if (!isReal(publicKey) || !isReal(resolvedChat)) {
    return null;
  }

  return {
    publicKey,
    chatAgentId: resolvedChat,
    voiceAgentId: isReal(voiceAgentId) && voiceAgentId !== resolvedChat ? voiceAgentId : undefined,
    phoneNumber,
    termsUrl: RETELL_WIDGET_TERMS_URL || undefined,
    recaptchaKey: process.env.NEXT_PUBLIC_RETELL_RECAPTCHA_KEY?.trim() || undefined,
  };
}

export function isRetellChatConfigured(): boolean {
  return getRetellWidgetConfig() !== null;
}
