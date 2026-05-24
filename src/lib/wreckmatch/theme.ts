export const wm = {
  bg: "bg-[#F8F5F2]",
  bgCard: "bg-white",
  text: "text-[#2B2B2B]",
  textMuted: "text-[#5C5C5C]",
  primary: "bg-[#006D77] text-white hover:bg-[#005a62] active:bg-[#004950]",
  primaryText: "text-[#006D77]",
  secondary: "bg-[#FF8C42] text-white hover:bg-[#e67a35] active:bg-[#d66a28]",
  accent: "text-[#2A9D8F]",
  accentBg: "bg-[#2A9D8F]",
  border: "border-[#006D77]/12",
  shadow: "shadow-[0_8px_30px_-12px_rgba(0,109,119,0.25)]",
  shadowSoft: "shadow-[0_4px_24px_-8px_rgba(0,109,119,0.14)]",
  shadowCard: "shadow-[0_2px_16px_-4px_rgba(0,109,119,0.12)]",
  rounded: "rounded-2xl",
  roundedLg: "rounded-3xl",
  chip:
    "rounded-full border border-[#006D77]/20 bg-white px-4 py-3 text-sm font-medium text-[#2B2B2B] transition hover:border-[#006D77]/40 active:scale-[0.98]",
  chipActive: "border-[#006D77] bg-[#006D77]/10 text-[#006D77]",
  input:
    "w-full min-h-[3rem] rounded-xl border border-[#006D77]/18 bg-white px-4 py-3 text-base text-[#2B2B2B] outline-none transition placeholder:text-[#5C5C5C]/60 focus:border-[#006D77] focus:ring-[3px] focus:ring-[#006D77]/15 sm:min-h-11 sm:text-sm",
  select:
    "w-full min-h-[3rem] appearance-none rounded-xl border border-[#006D77]/18 bg-white bg-[length:1rem] bg-[right_0.875rem_center] bg-no-repeat px-4 py-3 text-base text-[#2B2B2B] outline-none transition focus:border-[#006D77] focus:ring-[3px] focus:ring-[#006D77]/15 sm:min-h-11 sm:text-sm",
  page: "wm-shell-bg mx-auto min-h-[100dvh] max-w-lg px-4 pb-[calc(5.5rem+var(--wm-safe-bottom))] pt-5 sm:px-6 sm:pt-6",
  pageSplash: "mx-auto min-h-[100dvh] max-w-lg px-4 pb-8 pt-6 sm:px-6",
  heading: "text-[1.625rem] font-semibold leading-tight tracking-tight text-[#2B2B2B] sm:text-2xl",
  headingLg: "text-[1.875rem] font-semibold leading-tight tracking-tight text-[#2B2B2B] sm:text-3xl",
  subheading: "text-[0.9375rem] leading-relaxed text-[#5C5C5C] sm:text-base",
  sectionTitle: "text-lg font-semibold tracking-tight text-[#2B2B2B]",
  sectionDesc: "mt-1 text-sm leading-relaxed text-[#5C5C5C]",
  actionRow:
    "wm-press flex min-h-[4.25rem] items-center gap-4 rounded-2xl border border-[#006D77]/12 bg-white p-4 transition hover:border-[#006D77]/25 hover:shadow-sm active:bg-[#F8F5F2]",
} as const;
