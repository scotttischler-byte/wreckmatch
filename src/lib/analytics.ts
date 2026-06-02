import { GOOGLE_ADS_SIGNUP_CONVERSION } from "@/lib/google-ads";

type WreckmatchEvent =
  | "form_start"
  | "form_submit"
  | "form_error"
  | "blog_view"
  | "city_page_view"
  | "state_page_view"
  | "phone_click";

type AsgEvent =
  | "form_start"
  | "form_submit"
  | "form_error"
  | "pdf_download"
  | "blog_view"
  | "wreckmatch_referral"
  | "thank_you_view"
  | "sarah_chat_click"
  | "sarah_call_click"
  | "calculator_complete"
  | "calculator_case_review"
  | "calculator_open_chat"
  | "calculator_download_results";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: Record<string, unknown>[];
  }
}

export function trackWreckmatchEvent(event: WreckmatchEvent, params?: Record<string, string>) {
  if (typeof window === "undefined") return;

  const payload = { event, site: "wreckmatch", ...params };

  if (typeof window.gtag === "function") {
    window.gtag("event", event, payload);
  }

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(payload);
}

export function trackAsgEvent(event: AsgEvent, params?: Record<string, string>) {
  if (typeof window === "undefined") return;

  const payload = { event, site: "accidentsurvivalguide", ...params };

  if (typeof window.gtag === "function") {
    window.gtag("event", event, payload);
  }

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(payload);
}

/** Google Ads "Sign-up" conversion — fire once per thank-you visit (page load). */
export function trackGoogleAdsSignupConversion(dedupeKey?: string) {
  if (typeof window === "undefined" || !GOOGLE_ADS_SIGNUP_CONVERSION) return;

  const storageKey = dedupeKey
    ? `asg_signup_conversion:${dedupeKey}`
    : "asg_signup_conversion";
  try {
    if (sessionStorage.getItem(storageKey)) return;
    sessionStorage.setItem(storageKey, "1");
  } catch {
    /* private browsing */
  }

  if (typeof window.gtag === "function") {
    window.gtag("event", "conversion", {
      send_to: GOOGLE_ADS_SIGNUP_CONVERSION,
      value: 1.0,
      currency: "USD",
    });
  }
}
