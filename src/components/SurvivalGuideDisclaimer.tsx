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
    return (
      <p className={cn("text-[0.78rem] leading-[1.75] text-[#5b6b7f]", className)}>
        {text}
      </p>
    );
  }

  if (variant === "compact") {
    return (
      <p
        className={cn(
          "rounded-lg border border-[#b8d4e8]/60 bg-[#eef6fb] px-3 py-2.5 text-[0.78rem] leading-[1.65] text-[#3d5568]",
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
        "border-b border-[#c5dce8]/80 bg-[#e8f4fa] px-4 py-3 text-center text-[0.8rem] leading-[1.7] text-[#3d5568] sm:px-6",
        className,
      )}
      role="note"
      aria-label="Educational disclaimer"
    >
      {text}
    </aside>
  );
}
