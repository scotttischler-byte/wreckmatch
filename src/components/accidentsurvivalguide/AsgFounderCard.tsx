"use client";

import Image from "next/image";
import { BadgeCheck } from "lucide-react";
import { useAsgLocale } from "@/components/accidentsurvivalguide/AsgLocaleProvider";
import { asg, asgCn } from "@/components/accidentsurvivalguide/asg-ui";
import { SCOTT_FOUNDER_IMAGE } from "@/lib/accidentsurvivalguide";

type Variant = "light" | "dark" | "compact" | "story";

export function AsgFounderCard({
  variant = "light",
  showQuote = true,
  hostLabel,
}: {
  variant?: Variant;
  showQuote?: boolean;
  hostLabel?: string;
}) {
  const { messages } = useAsgLocale();
  const founder = messages.founder;
  const isDark = variant === "dark";
  const isCompact = variant === "compact";
  const isStory = variant === "story";

  const imageSize = isCompact ? 72 : isStory ? 96 : 112;

  return (
    <div
      className={asgCn(
        "flex gap-4",
        isCompact ? "items-center" : "items-start",
        isStory && "flex-col items-center text-center sm:flex-row sm:items-start sm:text-left",
      )}
    >
      <div className="relative shrink-0">
        <div
          className={asgCn(
            "overflow-hidden rounded-2xl ring-2 ring-offset-2",
            isDark
              ? "ring-asg-sage/70 ring-offset-asg-navy"
              : "ring-asg-teal/25 ring-offset-asg-surface shadow-md shadow-asg-navy/10",
            isCompact && "rounded-full ring-2",
            isStory && "rounded-2xl",
          )}
          style={{ width: imageSize, height: imageSize }}
        >
          <Image
            src={SCOTT_FOUNDER_IMAGE}
            alt={founder.imageAlt}
            width={imageSize}
            height={imageSize}
            className="size-full object-cover object-top"
            priority={variant === "dark" || variant === "compact"}
          />
        </div>
        {!isCompact ? (
          <span
            className={asgCn(
              "absolute -bottom-2 -right-2 flex size-8 items-center justify-center rounded-full shadow-sm",
              isDark ? "bg-asg-sage text-white" : "bg-asg-surface text-asg-teal ring-1 ring-asg-border",
            )}
            aria-hidden
          >
            <BadgeCheck className="size-4" />
          </span>
        ) : null}
      </div>

      <div className={asgCn("min-w-0 flex-1", isCompact && "text-left")}>
        {hostLabel || founder.hostLabel ? (
          <p
            className={asgCn(
              "text-xs font-bold uppercase tracking-[0.14em]",
              isDark ? "text-asg-sage" : "text-asg-sage",
            )}
          >
            {hostLabel ?? founder.hostLabel}
          </p>
        ) : null}
        <p
          className={asgCn(
            "font-serif font-semibold leading-tight",
            isCompact ? "text-base" : "text-lg sm:text-xl",
            isDark ? "text-white" : "text-asg-navy",
          )}
        >
          {founder.name}
        </p>
        <p className={asgCn("mt-0.5 text-sm", isDark ? "text-asg-sky" : "text-asg-muted")}>
          {founder.title}
        </p>
        {!isCompact ? (
          <p className={asgCn("mt-2 text-xs leading-relaxed", isDark ? "text-white/75" : "text-asg-subtle")}>
            {founder.credentials}
          </p>
        ) : null}
        {showQuote && !isCompact ? (
          <blockquote
            className={asgCn(
              "mt-3 border-l-2 pl-3 text-sm leading-relaxed italic",
              isDark ? "border-asg-sage/50 text-white/90" : "border-asg-teal/30 text-asg-muted",
              isStory && "border-l-0 pl-0 italic",
            )}
          >
            &ldquo;{founder.quote}&rdquo;
          </blockquote>
        ) : null}
      </div>
    </div>
  );
}
