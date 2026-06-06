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
    <span
      className="inline-flex shrink-0 items-center gap-3 whitespace-nowrap rounded-xl border border-white/15 bg-white px-3 py-2 shadow-sm sm:gap-3.5 sm:px-4 sm:py-2.5"
      aria-label={outlet.name}
    >
      <Image
        src={outlet.logoSrc}
        alt=""
        width={outlet.logoWidth}
        height={outlet.logoHeight}
        className="size-10 shrink-0 sm:size-11"
        aria-hidden
      />
      <span
        className={asgCn(
          "text-sm leading-none sm:text-base",
          outlet.fontClass,
        )}
        style={{ color: outlet.nameColor }}
      >
        {outlet.name}
      </span>
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
      <div className="flex items-center gap-3 px-3 py-2 sm:gap-4 sm:px-4 sm:py-2.5">
        <p className="hidden shrink-0 text-[10px] font-bold uppercase tracking-[0.18em] text-asg-sage sm:block sm:w-24 sm:text-[11px]">
          {m.eyebrow}
        </p>

        <div className="asg-marquee relative min-w-0 flex-1 overflow-hidden">
          <p className="mb-1 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-asg-sage sm:hidden">
            {m.eyebrow}
          </p>
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
