import { cn } from "@/lib/utils";
import { LEGAL_DISCLAIMER } from "@/lib/wreckmatch/site";

type LegalDisclaimerBannerProps = {
  text?: string;
  className?: string;
  variant?: "banner" | "compact";
};

export function LegalDisclaimerBanner({
  text = LEGAL_DISCLAIMER,
  className,
  variant = "banner",
}: LegalDisclaimerBannerProps) {
  if (variant === "compact") {
    return (
      <p
        role="note"
        className={cn(
          "rounded-xl border border-[#006D77]/15 bg-[#006D77]/5 px-4 py-3 text-sm leading-relaxed text-[#5C5C5C]",
          className,
        )}
      >
        {text}
      </p>
    );
  }

  return (
    <aside
      role="note"
      aria-label="Legal disclaimer"
      className={cn(
        "border-b border-[#006D77]/15 bg-[#006D77]/8 px-4 py-3 text-center text-sm leading-relaxed text-[#5C5C5C]",
        className,
      )}
    >
      {text}
    </aside>
  );
}
