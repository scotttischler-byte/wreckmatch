"use client";

import { Lock, Scale, ShieldCheck } from "lucide-react";
import { useAsgLocale } from "@/components/accidentsurvivalguide/AsgLocaleProvider";
import { asg, asgCn } from "@/components/accidentsurvivalguide/asg-ui";

const ICONS = [ShieldCheck, Lock, ShieldCheck, Scale] as const;

type Variant = "light" | "dark" | "inline";

export function AsgTrustStrip({ variant = "light" }: { variant?: Variant }) {
  const { messages } = useAsgLocale();
  const t = messages.trust;

  if (variant === "inline") {
    return (
      <ul className="flex flex-wrap items-center justify-center gap-2" aria-label={t.stripAria}>
        {t.items.map((item) => (
          <li
            key={item}
            className={asgCn(
              asg.pill,
              "border-asg-teal/20 bg-asg-surface/90 text-asg-navy/90 shadow-none",
            )}
          >
            <ShieldCheck className="size-3.5 text-asg-sage" aria-hidden />
            {item}
          </li>
        ))}
      </ul>
    );
  }

  const isDark = variant === "dark";

  return (
    <div
      className={asgCn(
        "rounded-2xl border px-4 py-3 sm:px-5",
        isDark
          ? "border-white/15 bg-white/5"
          : "border-asg-border/60 bg-asg-surface/80 shadow-sm shadow-asg-navy/[0.03]",
      )}
      role="region"
      aria-label={t.stripAria}
    >
      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {t.items.map((item, index) => {
          const Icon = ICONS[index] ?? ShieldCheck;
          return (
            <li
              key={item}
              className={asgCn(
                "flex items-center gap-2 text-xs font-medium sm:text-sm",
                isDark ? "text-asg-sky" : "text-asg-muted",
              )}
            >
              <Icon className={asgCn("size-4 shrink-0", isDark ? "text-asg-sage" : "text-asg-teal")} aria-hidden />
              {item}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
