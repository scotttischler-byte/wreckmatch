import { headers } from "next/headers";
import {
  BG_DEFAULT_LOCALE,
  BG_LOCALE_HEADER,
  type BgLocale,
  isBgLocale,
} from "@/lib/bobbygarcia/i18n/config";

export function getBgLocale(): BgLocale {
  const value = headers().get(BG_LOCALE_HEADER);
  return isBgLocale(value) ? value : BG_DEFAULT_LOCALE;
}
