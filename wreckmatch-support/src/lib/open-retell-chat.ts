"use client";

declare global {
  interface Window {
    RetellWidget?: { open?: () => void; show?: () => void; toggle?: () => void };
  }
}

type RetellPanel = {
  fab: HTMLElement;
  chat: HTMLElement;
  input: HTMLInputElement | null;
};

function walkShadowDom(root: Document | ShadowRoot): RetellPanel | null {
  const fab = root.querySelector("#retell-fab");
  const chat = root.querySelector("#retell-chat");
  if (fab && chat) {
    const input = root.querySelector("#retell-input");
    return {
      fab: fab as HTMLElement,
      chat: chat as HTMLElement,
      input: input instanceof HTMLInputElement ? input : null,
    };
  }

  for (const el of root.querySelectorAll("*")) {
    if (el instanceof HTMLElement && el.shadowRoot) {
      const found = walkShadowDom(el.shadowRoot);
      if (found) return found;
    }
  }

  return null;
}

function clickByLabel(labels: string[]): boolean {
  const needles = labels.map((l) => l.toLowerCase());
  for (const el of document.querySelectorAll("button, [role='button']")) {
    if (!(el instanceof HTMLElement)) continue;
    const text = (el.textContent ?? "").trim().toLowerCase();
    if (needles.some((n) => text.includes(n))) {
      el.click();
      return true;
    }
  }
  return false;
}

function clickRetellFab(): boolean {
  const panel = walkShadowDom(document);
  if (panel?.fab) {
    panel.fab.click();
    return true;
  }

  for (const host of document.querySelectorAll("[id*='retell'], retell-widget")) {
    if (!(host instanceof HTMLElement)) continue;
    const btn = host.shadowRoot?.querySelector("button");
    if (btn instanceof HTMLElement) {
      btn.click();
      return true;
    }
  }

  return false;
}

function tryRetellGlobal(): boolean {
  const api = window.RetellWidget;
  if (typeof api?.open === "function") {
    api.open();
    return true;
  }
  if (typeof api?.show === "function") {
    api.show();
    return true;
  }
  if (typeof api?.toggle === "function") {
    api.toggle();
    return true;
  }
  return false;
}

/** Open the Retell chat widget (Sarah) from dashboard.retellai.com embed. */
export function openRetellChatWidget(): boolean {
  if (typeof window === "undefined") return false;

  if (tryRetellGlobal()) return true;

  if (
    clickByLabel([
      "open assistant",
      "chat with sarah",
      "talk to sarah",
      "need support",
    ])
  ) {
    return true;
  }

  if (clickRetellFab()) return true;

  let attempts = 0;
  const timer = window.setInterval(() => {
    attempts += 1;
    const opened =
      tryRetellGlobal() ||
      clickByLabel(["open assistant", "chat with sarah"]) ||
      clickRetellFab();
    if (opened || attempts >= 16) {
      window.clearInterval(timer);
    }
  }, 250);

  return true;
}
