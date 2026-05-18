import { headers } from "next/headers";
import { ASG_LOCALE_HEADER, DEFAULT_LOCALE, type Locale, isLocale } from "@/lib/i18n/config";

export function getAsgLocale(): Locale {
  const value = headers().get(ASG_LOCALE_HEADER);
  return isLocale(value) ? value : DEFAULT_LOCALE;
}
