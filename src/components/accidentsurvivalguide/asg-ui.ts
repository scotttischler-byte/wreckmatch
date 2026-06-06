import { cn } from "@/lib/utils";

/** Shared Accident Survival Guide design tokens (Tailwind v4 @theme colors). */
export const asg = {
  page: "bg-asg-page text-asg-navy",
  eyebrow: "text-xs font-bold uppercase tracking-[0.18em] text-asg-sage",
  h1: "font-serif text-3xl font-semibold leading-[1.1] tracking-tight text-asg-navy sm:text-4xl lg:text-[2.65rem]",
  h2: "font-serif text-2xl font-semibold tracking-tight text-asg-navy sm:text-3xl",
  h3: "font-serif text-lg font-semibold tracking-tight text-asg-navy sm:text-xl",
  body: "text-base leading-relaxed text-asg-muted",
  bodySm: "text-sm leading-relaxed text-asg-muted",
  legal: "text-xs leading-relaxed text-asg-subtle",
  section: "py-16 sm:py-20",
  sectionTight: "py-12 sm:py-16",
  container: "mx-auto max-w-6xl px-4 sm:px-6",
  containerNarrow: "mx-auto max-w-3xl px-4 sm:px-6",
  card: "rounded-xl border border-asg-border/80 bg-asg-surface shadow-sm",
  cardPad: "rounded-xl border border-asg-border/80 bg-asg-surface p-6 shadow-sm",
  pill: "inline-flex items-center gap-1.5 rounded-full border border-asg-border bg-asg-surface px-3 py-1.5 text-xs font-medium text-asg-navy/80 shadow-sm",
  btnPrimary:
    "inline-flex min-h-[48px] items-center justify-center rounded-lg bg-asg-teal px-5 text-sm font-semibold text-white transition hover:bg-asg-teal-hover active:scale-[0.98] disabled:opacity-60",
  btnSecondary:
    "inline-flex min-h-[48px] items-center justify-center rounded-lg border border-asg-border bg-asg-surface px-5 text-sm font-semibold text-asg-navy transition hover:border-asg-teal/40 hover:bg-asg-elevated active:scale-[0.98]",
  inputLight:
    "h-12 min-h-[48px] w-full rounded-lg border border-asg-border bg-asg-page px-3 text-base text-asg-navy outline-none placeholder:text-asg-subtle focus-visible:border-asg-teal focus-visible:ring-2 focus-visible:ring-asg-teal/20",
  inputDark:
    "h-12 min-h-[48px] w-full rounded-lg border-0 bg-white px-3 text-base text-asg-navy shadow-sm outline-none placeholder:text-asg-subtle focus-visible:ring-2 focus-visible:ring-white/80",
  selectLight:
    "h-12 min-h-[48px] w-full rounded-lg border border-asg-border bg-asg-page px-3 text-base text-asg-navy outline-none focus-visible:border-asg-teal focus-visible:ring-2 focus-visible:ring-asg-teal/20",
  selectDark:
    "h-12 min-h-[48px] w-full rounded-lg border-0 bg-white px-3 text-base text-asg-navy shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-white/80",
  alertError: "rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800",
  alertErrorDark: "rounded-lg border border-red-300/30 bg-red-950/30 px-3 py-2.5 text-sm text-red-100",
  note: "rounded-lg border border-asg-border/60 bg-asg-elevated px-3 py-2.5 text-xs leading-relaxed text-asg-muted",
  noteDark: "rounded-lg bg-white/10 px-3 py-2.5 text-xs leading-relaxed text-asg-sky",
} as const;

export function asgCn(...classes: Array<string | false | null | undefined>) {
  return cn(...classes);
}
