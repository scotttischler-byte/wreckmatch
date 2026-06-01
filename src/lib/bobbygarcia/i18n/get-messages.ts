import type { BgLocale } from "@/lib/bobbygarcia/i18n/config";
import { en, type BgMessages } from "@/lib/bobbygarcia/i18n/messages/en";
import { es } from "@/lib/bobbygarcia/i18n/messages/es";

export type { BgMessages };

export function getBgMessages(locale: BgLocale): BgMessages {
  return locale === "es" ? es : en;
}
