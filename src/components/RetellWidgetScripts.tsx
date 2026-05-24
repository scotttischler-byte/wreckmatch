"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import {
  WM_DEFAULT_LOCALE,
  WM_LOCALE_COOKIE,
  isWmLocale,
  type WmLocale,
} from "@/lib/wreckmatch/i18n/config";
import { getWmMessages } from "@/lib/wreckmatch/i18n/get-messages";
import { WM_LOCALE_CHANGE_EVENT } from "@/lib/wreckmatch/context/WmLocaleProvider";
import { getRetellWidgetConfig } from "@/lib/retell/config";

function readLocaleFromCookie(): WmLocale {
  if (typeof document === "undefined") return WM_DEFAULT_LOCALE;
  const match = document.cookie.match(new RegExp(`${WM_LOCALE_COOKIE}=(en|es)`));
  return isWmLocale(match?.[1]) ? match[1] : WM_DEFAULT_LOCALE;
}

/** Retell AI v2 embed — Sarah chat (+ optional voice), locale-aware. */
export function RetellWidgetScripts() {
  const cfg = getRetellWidgetConfig();
  const [locale, setLocale] = useState<WmLocale>(WM_DEFAULT_LOCALE);

  useEffect(() => {
    setLocale(readLocaleFromCookie());

    const onLocaleChange = (event: Event) => {
      const detail = (event as CustomEvent<{ locale: WmLocale }>).detail;
      if (detail?.locale) setLocale(detail.locale);
    };

    window.addEventListener(WM_LOCALE_CHANGE_EVENT, onLocaleChange);
    return () => window.removeEventListener(WM_LOCALE_CHANGE_EVENT, onLocaleChange);
  }, []);

  if (!cfg) return null;

  const retell = getWmMessages(locale).retell;

  return (
    <>
      {cfg.recaptchaKey ? (
        <Script
          id="retell-recaptcha"
          src={`https://www.google.com/recaptcha/api.js?render=${cfg.recaptchaKey}`}
          strategy="afterInteractive"
        />
      ) : null}
      <Script
        key={`retell-widget-${locale}`}
        id={`retell-widget-${locale}`}
        src="https://dashboard.retellai.com/retell-widget-v2.js"
        type="module"
        strategy="afterInteractive"
        data-public-key={cfg.publicKey}
        data-agent-id={cfg.chatAgentId}
        {...(cfg.voiceAgentId
          ? {
              "data-voice-public-key": cfg.publicKey,
              "data-voice-agent-id": cfg.voiceAgentId,
            }
          : {})}
        data-color="#006D77"
        data-bot-name="Sarah"
        data-fab-text={retell.fabText}
        data-title={retell.title}
        data-popup-message={retell.popup}
        data-show-ai-popup="true"
        data-show-ai-popup-time="10"
        data-dynamic={JSON.stringify({
          language: locale,
          preferred_language: locale === "es" ? "Spanish" : "English",
        })}
        {...(cfg.termsUrl ? { "data-tc": cfg.termsUrl } : {})}
        {...(cfg.recaptchaKey ? { "data-recaptcha-key": cfg.recaptchaKey } : {})}
      />
    </>
  );
}
