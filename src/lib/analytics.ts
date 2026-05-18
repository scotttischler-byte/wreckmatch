type AsgEvent =
  | "form_start"
  | "form_submit"
  | "form_error"
  | "pdf_download"
  | "blog_view"
  | "wreckmatch_referral"
  | "thank_you_view"
  | "sarah_chat_click"
  | "sarah_call_click";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: Record<string, unknown>[];
  }
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
