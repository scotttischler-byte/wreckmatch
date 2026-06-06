import Image from "next/image";
import { getMessages } from "@/lib/i18n/get-messages";
import { getAsgLocale } from "@/lib/i18n/server";
import { ASG_TOP_PRESS_OUTLETS } from "@/lib/asg-press-outlets";
import { asgCn } from "@/components/accidentsurvivalguide/asg-ui";

function PressOutletBadge({
  outlet,
}: {
  outlet: (typeof ASG_TOP_PRESS_OUTLETS)[number];
}) {
  return (
    <span className="inline-flex shrink-0 items-center rounded-xl border border-white/20 bg-white px-4 py-2.5 shadow-sm sm:px-5 sm:py-3">
      <Image
        src={outlet.wordmarkSrc}
        alt={outlet.name}
        width={outlet.wordmarkWidth}
        height={outlet.wordmarkHeight}
        className="h-8 w-auto sm:h-10 md:h-11"
      />
    </span>
  );
}

export function AsgPressMarquee() {
  const m = getMessages(getAsgLocale()).pressMarquee;
  const rotatingOutlets = [...ASG_TOP_PRESS_OUTLETS, ...ASG_TOP_PRESS_OUTLETS];

  return (
    <section
      className="border-b border-asg-navy/25 bg-asg-navy text-white"
      aria-label={m.ariaLabel}
    >
      <div className="flex flex-col gap-2 px-3 py-2.5 sm:flex-row sm:items-center sm:gap-5 sm:px-4 sm:py-3">
        <p
          className={asgCn(
            "shrink-0 text-center font-black uppercase tracking-[0.22em] text-asg-sage",
            "text-lg sm:text-left sm:text-xl md:text-2xl",
            "sm:w-36 md:w-44",
          )}
        >
          {m.eyebrow}
        </p>

        <div className="asg-marquee relative min-w-0 flex-1 overflow-hidden">
          <div className="asg-marquee-track flex w-max items-center gap-3 sm:gap-4">
            {rotatingOutlets.map((outlet, index) => (
              <PressOutletBadge key={`${outlet.id}-${index}`} outlet={outlet} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
