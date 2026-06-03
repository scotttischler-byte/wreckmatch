"use client";

import { usePathname } from "next/navigation";
import { useBgLocale } from "@/components/bobbygarcia/BgLocaleProvider";
import { BG_LOCALE_COOKIE, type BgLocale } from "@/lib/bobbygarcia/i18n/config";
import { parseBgLocaleFromPathname, resolveBgLocaleSwitchHref } from "@/lib/bobbygarcia/i18n/locale-path";
import { cn } from "@/lib/utils";

function setLocaleCookie(locale: BgLocale) {
  document.cookie = `${BG_LOCALE_COOKIE}=${locale};path=/;max-age=31536000;samesite=lax`;
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className={className}
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

export function BgLanguageSwitcher({ className }: { className?: string }) {
  const { locale, messages } = useBgLocale();
  const pathname = usePathname() ?? "/";
  const { locale: pathLocale } = parseBgLocaleFromPathname(pathname);
  const activeLocale = pathLocale ?? locale;

  function switchTo(next: BgLocale) {
    if (next === activeLocale) return;
    setLocaleCookie(next);
    const href = resolveBgLocaleSwitchHref(pathname, next);
    window.location.assign(href);
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-[#c9a227]/35 bg-[#0a1220]/80 px-1.5 py-1 shadow-[inset_0_1px_0_rgba(201,162,39,0.08)]",
        className,
      )}
      role="group"
      aria-label={messages.lang.switch}
    >
      <GlobeIcon className="ml-1 size-4 shrink-0 text-[#c9a227]" />
      {(["en", "es"] as const).map((code, index) => (
        <span key={code} className="flex items-center">
          {index > 0 && <span className="mx-0.5 text-[#4a5a72]" aria-hidden>|</span>}
          <button
            type="button"
            onClick={() => switchTo(code)}
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide transition sm:px-3 sm:text-sm",
              activeLocale === code
                ? "bg-[#c9a227] text-[#0a1220] shadow-sm"
                : "text-[#c8d4e0] hover:bg-white/5 hover:text-white",
            )}
            aria-pressed={activeLocale === code}
            aria-label={code === "en" ? messages.lang.en : messages.lang.es}
          >
            <span className="sm:hidden">{code.toUpperCase()}</span>
            <span className="hidden sm:inline">{code === "en" ? messages.lang.en : messages.lang.es}</span>
          </button>
        </span>
      ))}
    </div>
  );
}
