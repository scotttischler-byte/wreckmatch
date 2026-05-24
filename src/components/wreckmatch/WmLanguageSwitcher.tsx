"use client";

import { useWmLocale } from "@/lib/wreckmatch/context/WmLocaleProvider";
import type { WmLocale } from "@/lib/wreckmatch/i18n/config";
import { cn } from "@/lib/utils";

type WmLanguageSwitcherProps = {
  className?: string;
  variant?: "default" | "prominent" | "compact";
  showLabel?: boolean;
};

export function WmLanguageSwitcher({
  className,
  variant = "default",
  showLabel = variant === "prominent",
}: WmLanguageSwitcherProps) {
  const { locale, messages, setLocale } = useWmLocale();

  const options: { code: WmLocale; label: string }[] = [
    { code: "en", label: messages.lang.en },
    { code: "es", label: messages.lang.es },
  ];

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      {showLabel && (
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#5C5C5C]">
          {messages.lang.choose}
        </p>
      )}
      <div
        className={cn(
          "flex items-center gap-1 rounded-full font-semibold",
          variant === "prominent"
            ? "border-2 border-[#006D77]/20 bg-white p-1 shadow-[0_4px_20px_-8px_rgba(0,109,119,0.25)]"
            : variant === "compact"
              ? "border border-[#006D77]/15 bg-white/95 p-0.5 text-[0.65rem]"
              : "border border-[#006D77]/18 bg-white p-0.5 text-xs",
        )}
        role="group"
        aria-label={messages.lang.switch}
      >
        {options.map(({ code, label }) => (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code)}
            className={cn(
              "wm-press rounded-full transition",
              variant === "prominent" ? "min-h-11 px-5 py-2.5 text-sm" : "px-3 py-1.5",
              locale === code
                ? "bg-[#006D77] text-white shadow-sm"
                : "text-[#5C5C5C] hover:text-[#006D77]",
            )}
            aria-pressed={locale === code}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
