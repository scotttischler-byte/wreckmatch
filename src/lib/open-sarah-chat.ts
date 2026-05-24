import { isRetellChatConfigured } from "@/lib/retell/config";
import { openRetellChatWidget } from "@/lib/open-retell-chat";
import { openGhlChatWidget } from "@/lib/open-ghl-chat";

/** Sarah chat — Retell when configured, otherwise GHL LeadConnector. */
export function openSarahChat(): void {
  if (isRetellChatConfigured()) {
    openRetellChatWidget();
    return;
  }
  openGhlChatWidget();
}
