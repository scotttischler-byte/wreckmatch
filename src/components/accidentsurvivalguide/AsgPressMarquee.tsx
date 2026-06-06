import Image from "next/image";
import { getMessages } from "@/lib/i18n/get-messages";
import { getAsgLocale } from "@/lib/i18n/server";
import { ASG_TOP_PRESS_OUTLETS } from "@/lib/asg-press-outlets";
import { asg, asgCn } from "@/components/accidentsurvivalguide/asg-ui";

function PressOutletBadge({
  outlet,
}: {
  outlet: (typeof ASG_TOP_PRESS_OUTLETS)[number];
}) {
  return (
    <span className="asg-press-badge inline-flex shrink-0 items-center rounded-2xl border border-asg-border/55 bg-white/95 px-5 py-3 shadow-sm shadow-asg-navy/[0.05] backdrop-blur-sm transition duration-300 hover:border-asg-teal/25 hover:shadow-md hover:shadow-asg-navy/[0.08] sm:px-6 sm:py-3.5">
      <Image
        src={outlet.logoSrc}
        alt={outlet.name}
        width={outlet.logoWidth}
        height={outlet.logoHeight}
        className="h-7 w-auto max-w-[220px] object-contain object-center sm:h-9 md:h-10"
      />
    </span>
  );
}

export function AsgPressMarquee() {
  const m = getMessages(getAsgLocale()).pressMarquee;
  const rotatingOutlets = [...ASG_TOP_PRESS_OUTLETS, ...ASG_TOP_PRESS_OUTLETS];

  return (
    <section
      className="relative overflow-hidden border-b border-asg-border/60 bg-gradient-to-b from-asg-surface via-asg-elevated/70 to-asg-page"
      aria-label={m.ariaLabel}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-asg-teal/35 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-24 top-1/2 size-48 -translate-y-1/2 rounded-full bg-asg-sage/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 top-1/2 size-48 -translate-y-1/2 rounded-full bg-asg-teal/10 blur-3xl"
        aria-hidden
      />

      <div className={asgCn(asg.container, "relative flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:gap-6 sm:py-3.5")}>
        <div className="flex shrink-0 items-center justify-center gap-3 sm:justify-start sm:gap-4">
          <span className="hidden h-10 w-px bg-gradient-to-b from-transparent via-asg-border to-transparent sm:block" aria-hidden />
          <div className="text-center sm:text-left">
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.28em] text-asg-sage sm:text-[11px]">
              {m.kicker}
            </p>
            <p className="mt-0.5 font-serif text-xl font-semibold leading-none tracking-tight text-asg-navy sm:text-2xl md:text-[1.75rem]">
              {m.eyebrow}
            </p>
          </div>
          <span className="hidden h-10 w-px bg-gradient-to-b from-transparent via-asg-border to-transparent sm:block" aria-hidden />
        </div>

        <div className="asg-press-marquee relative min-w-0 flex-1 overflow-hidden">
          <div className="asg-press-marquee-track flex w-max items-center gap-3 sm:gap-4">
            {rotatingOutlets.map((outlet, index) => (
              <PressOutletBadge key={`${outlet.id}-${index}`} outlet={outlet} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
