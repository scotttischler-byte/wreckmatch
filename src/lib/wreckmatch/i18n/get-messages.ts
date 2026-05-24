import type { WmLocale } from "@/lib/wreckmatch/i18n/config";
import { en, type WmMessages } from "@/lib/wreckmatch/i18n/messages/en";
import { es } from "@/lib/wreckmatch/i18n/messages/es";

export type { WmMessages };

export function getWmMessages(locale: WmLocale): WmMessages {
  return locale === "es" ? es : en;
}
