import Link from "next/link";
import { Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { CRISIS_PHONE, CRISIS_PHONE_HREF } from "@/lib/wreckmatch/site";

type CrisisHelpButtonProps = {
  className?: string;
};

export function CrisisHelpButton({ className }: CrisisHelpButtonProps) {
  return (
    <Link
      href={CRISIS_PHONE_HREF}
      className={cn(
        "fixed right-4 z-50 inline-flex items-center gap-2 rounded-full bg-[#FF8C42] px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(255,140,66,0.55)] transition hover:bg-[#e67a35] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8C42]/40 bottom-24 md:bottom-6",
        className,
      )}
      aria-label={`Crisis help — call ${CRISIS_PHONE}`}
    >
      <Phone className="size-4" aria-hidden />
      Crisis Help
    </Link>
  );
}
