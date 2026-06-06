"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { useAsgLocale } from "@/components/accidentsurvivalguide/AsgLocaleProvider";
import { asg, asgCn } from "@/components/accidentsurvivalguide/asg-ui";

export function StickyDownloadBar() {
  const { messages } = useAsgLocale();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById("asg-hero-end");
    if (!sentinel) return;

    const mobileMq = window.matchMedia("(max-width: 639px)");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (mobileMq.matches) {
          setVisible(!entry.isIntersecting);
        }
      },
      { threshold: 0, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(sentinel);

    const onMqChange = (e: MediaQueryListEvent) => {
      if (!e.matches) setVisible(false);
    };
    mobileMq.addEventListener("change", onMqChange);

    return () => {
      observer.disconnect();
      mobileMq.removeEventListener("change", onMqChange);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-asg-border bg-asg-surface/95 px-4 pt-3 pb-safe shadow-[0_-4px_24px_-8px_rgba(26,58,82,0.15)] backdrop-blur sm:hidden"
      role="region"
      aria-label={messages.sticky.aria}
    >
      <a href="#get-help" className={asgCn(asg.btnPrimary, "w-full gap-2")}>
        <Download className="size-4" aria-hidden />
        {messages.sticky.cta}
      </a>
    </div>
  );
}
