"use client";

import { usePathname, useRouter } from "next/navigation";
import { useBgLocale } from "@/components/bobbygarcia/BgLocaleProvider";
import { BG_LOCALE_COOKIE, type BgLocale } from "@/lib/bobbygarcia/i18n/config";
import { localizeBgHref, parseBgLocaleFromPathname } from "@/lib/bobbygarcia/i18n/locale-path";
import { cn } from "@/lib/utils";

function setLocaleCookie(locale: BgLocale) {
  document.cookie = `${BG_LOCALE_COOKIE}=${locale};path=/;max-age=31536000;samesite=lax`;
}

export function BgLanguageSwitcher({ className }: { className?: string }) {
  const { locale, messages } = useBgLocale();
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const { publicPath } = parseBgLocaleFromPathname(pathname);

  function switchTo(next: BgLocale) {
    if (next === locale) return;
    setLocaleCookie(next);
    let href = localizeBgHref(publicPath, next);
    if (pathname.startsWith("/bobbygarcia")) {
      href = href === "/es" ? "/bobbygarcia/es" : `/bobbygarcia${href}`;
    }
    router.push(href);
  }

  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-full border border-[#c9a227]/40 bg-[#0f1c2e] p-0.5 text-xs font-semibold",
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
            locale === code
              ? "bg-[#c9a227] text-[#0a1220] shadow-sm"
              : "text-[#d4dce8] hover:text-white",
          )}
          aria-pressed={locale === code}
        >
          {code === "en" ? messages.lang.en : messages.lang.es}
        </button>
      ))}
    </div>
  );
}
