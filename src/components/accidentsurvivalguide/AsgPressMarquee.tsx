import { getMessages } from "@/lib/i18n/get-messages";
import { getAsgLocale } from "@/lib/i18n/server";
import {
  ASG_PRESS_OUTLETS,
  pressOutletLogoStyle,
  pressOutletMark,
} from "@/lib/asg-press-outlets";
import { asg, asgCn } from "@/components/accidentsurvivalguide/asg-ui";

export function AsgPressMarquee() {
  const m = getMessages(getAsgLocale()).pressMarquee;
  const rotatingOutlets = [...ASG_PRESS_OUTLETS, ...ASG_PRESS_OUTLETS];

  return (
    <section
      className="border-b border-asg-navy/20 bg-asg-navy text-white"
      aria-label={m.ariaLabel}
    >
      <div className={asgCn(asg.container, "py-3.5 sm:py-4")}>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
          <div className="shrink-0 lg:w-52">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-asg-sage">{m.eyebrow}</p>
            <p className="mt-0.5 text-xs leading-snug text-asg-sky/90 sm:text-sm">{m.subtitle}</p>
          </div>

          <div className="asg-marquee relative min-w-0 flex-1 overflow-hidden" aria-hidden="true">
            <div className="asg-marquee-track flex w-max gap-2.5 sm:gap-3">
              {rotatingOutlets.map((outlet, index) => (
                <span
                  key={`${outlet}-${index}`}
                  className="inline-flex h-10 items-center gap-2.5 whitespace-nowrap rounded-lg border border-white/15 bg-white/10 px-2.5 pr-3.5 text-xs font-semibold text-white shadow-sm sm:h-11 sm:text-sm"
                >
                  <span
                    className={asgCn(
                      "grid h-7 min-w-7 place-items-center rounded-md border px-1 text-[9px] font-black leading-none shadow-sm sm:h-8 sm:min-w-8 sm:text-[10px]",
                      pressOutletLogoStyle(index),
                    )}
                  >
                    {pressOutletMark(outlet)}
                  </span>
                  <span>{outlet}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
