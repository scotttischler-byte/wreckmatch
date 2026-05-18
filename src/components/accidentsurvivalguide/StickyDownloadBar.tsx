"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";

export function StickyDownloadBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#c5dce8] bg-white/95 px-4 py-3 shadow-[0_-8px_30px_-12px_rgba(26,58,82,0.2)] backdrop-blur sm:hidden"
      role="region"
      aria-label="Quick download"
    >
      <a
        href="#download"
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2a7a9b] py-3 text-sm font-semibold text-white"
      >
        <Download className="size-4" aria-hidden />
        Get My Free Checklist PDF
      </a>
    </div>
  );
}
