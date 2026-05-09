declare global {
  interface Window {
    RetellWidget?: { open?: () => void; show?: () => void };
  }
}

/** Retell callback FAB lives in shadow DOM. */
export const WM_RETELL_STACK_Z = "999800";
export const WM_GHL_STACK_Z = "2147483645";

export function findRetellFabInShadow(): HTMLElement | null {
  if (typeof document === "undefined") return null;

  const walk = (root: Document | ShadowRoot): HTMLElement | null => {
    const fab = root.querySelector("#retell-fab");
    if (fab instanceof HTMLElement) return fab;
    for (const el of root.querySelectorAll("*")) {
      if (el instanceof HTMLElement && el.shadowRoot) {
        const hit = walk(el.shadowRoot);
        if (hit) return hit;
      }
    }
    return null;
  };

  return walk(document);
}

function forceClickRetellFab(fab: HTMLElement) {
  try {
    fab.dispatchEvent(
      new PointerEvent("pointerdown", { bubbles: true, cancelable: true, composed: true, view: window }),
    );
    fab.dispatchEvent(
      new PointerEvent("pointerup", { bubbles: true, cancelable: true, composed: true, view: window }),
    );
  } catch {
    /* PointerEvent unsupported */
  }
  fab.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, composed: true, view: window }));
  fab.click();
}

function tryRetellWidgetGlobal(): void {
  const api = window.RetellWidget;
  if (typeof api?.open === "function") {
    api.open();
    return;
  }
  if (typeof api?.show === "function") api.show();
}

/** Avoid Node `Timer` typing clash in Next.js typings (browser timers are numeric). */
let pollId: number | null = null;

/** Opens Retell voice/callback widget (same as tapping launcher). Call from client only. */
export function openRetellVoiceWidget(): void {
  if (typeof window === "undefined") return;
  tryRetellWidgetGlobal();

  const tryFab = (): boolean => {
    const fab = findRetellFabInShadow();
    if (fab) {
      forceClickRetellFab(fab);
      return true;
    }
    return false;
  };

  if (tryFab()) return;

  if (pollId !== null) {
    window.clearInterval(pollId);
    pollId = null;
  }

  const POLL_MS = 250;
  const MAX_MS = 6000;
  const started = Date.now();

  pollId = window.setInterval(() => {
    const elapsed = Date.now() - started;
    const ok = tryFab();
    if (ok || elapsed >= MAX_MS) {
      if (pollId !== null) window.clearInterval(pollId);
      pollId = null;
    }
  }, POLL_MS) as unknown as number;
}
