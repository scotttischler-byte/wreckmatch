"use client";

import { MessageSquare } from "lucide-react";
import { openGhlChatWidget } from "@/lib/open-ghl-chat";

export function HomeChatButton() {
  return (
    <button
      type="button"
      onClick={() => openGhlChatWidget()}
      className="inline-flex items-center justify-center gap-2 rounded-full border border-[#fde68a]/35 bg-[#fde68a]/10 px-6 py-3 text-sm font-semibold text-[#fffaf0] transition hover:bg-[#fde68a]/20"
    >
      <MessageSquare className="size-4" aria-hidden />
      Start secure chat
    </button>
  );
}
