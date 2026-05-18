"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAsgLocale } from "@/components/accidentsurvivalguide/AsgLocaleProvider";
import { ASG_LOCALE_COOKIE, type Locale } from "@/lib/i18n/config";
import { localizeHref, parseLocaleFromPathname } from "@/lib/i18n/locale-path";
import { cn } from "@/lib/utils";

function setLocaleCookie(locale: Locale) {
  document.cookie = `${ASG_LOCALE_COOKIE}=${locale};path=/;max-age=31536000;samesite=lax`;
}

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, messages } = useAsgLocale();
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const { publicPath } = parseLocaleFromPathname(pathname);

  function switchTo(next: Locale) {
    if (next === locale) return;
    setLocaleCookie(next);
    router.push(localizeHref(publicPath, next));
  }

  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-full border border-[#c5dce8] bg-[#f4faf8] p-0.5 text-xs font-semibold",
        className,
      )}
      role="group"
      aria-label={messages.lang.switch}
    >
      {(["en", "es"] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => switchTo(code)}
          className={cn(
            "rounded-full px-2.5 py-1 transition",
            locale === code ? "bg-white text-[#1a3a52] shadow-sm" : "text-[#5b6b7f] hover:text-[#1a3a52]",
          )}
          aria-pressed={locale === code}
        >
          {code === "en" ? messages.lang.en : messages.lang.es}
        </button>
      ))}
    </div>
  );
}
