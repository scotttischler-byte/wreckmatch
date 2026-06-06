import { cn } from "@/lib/utils";

type SurvivalGuideDisclaimerProps = {
  className?: string;
  variant?: "banner" | "compact" | "footer";
  text?: string;
};

const DEFAULT_DISCLAIMER =
  "AccidentSurvivalGuide.com is an educational resource operated by WreckMatch LLC, a legal referral service. We are not a law firm and do not provide legal advice. The information here is for general education only.";

export function SurvivalGuideDisclaimer({
  className,
  variant = "banner",
  text = DEFAULT_DISCLAIMER,
}: SurvivalGuideDisclaimerProps) {
  if (variant === "footer") {
    return <p className={cn("text-xs leading-relaxed text-asg-muted", className)}>{text}</p>;
  }

  if (variant === "compact") {
    return (
      <p
        className={cn(
          "rounded-lg border border-asg-border/60 bg-asg-elevated px-3 py-2.5 text-xs leading-relaxed text-asg-muted",
          className,
        )}
        role="note"
      >
        {text}
      </p>
    );
  }

  return (
    <aside
      className={cn(
        "border-b border-asg-border/80 bg-asg-elevated px-4 py-2.5 text-center text-xs leading-relaxed text-asg-muted sm:px-6",
        className,
      )}
      role="note"
      aria-label="Educational disclaimer"
    >
      {text}
    </aside>
  );
}
