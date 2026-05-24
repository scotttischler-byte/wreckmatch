/** Best-effort open of the GoHighLevel / LeadConnector chat widget (Sarah). */
export function openGhlChatWidget() {
  if (typeof window === "undefined") return;

  const w = window as Window & {
    leadConnector?: { openChat?: () => void };
    LeadConnector?: { openChat?: () => void };
  };

  if (typeof w.leadConnector?.openChat === "function") {
    w.leadConnector.openChat();
    return;
  }
  if (typeof w.LeadConnector?.openChat === "function") {
    w.LeadConnector.openChat();
    return;
  }

  const selectors = [
    "#lc_text-widget--btn",
    ".lc_text-widget--btn",
    "[id^='lc_'] button",
    "iframe[id*='leadconnector']",
  ];

  for (const sel of selectors) {
    const el = document.querySelector(sel) as HTMLElement | null;
    if (el) {
      el.click();
      return;
    }
  }

  document.getElementById("ghl-chat-widget-loader")?.scrollIntoView({ behavior: "smooth" });
}
