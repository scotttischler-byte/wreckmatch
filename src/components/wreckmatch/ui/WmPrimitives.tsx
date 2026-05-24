import { cn } from "@/lib/utils";
import { wm } from "@/lib/wreckmatch/theme";

type WmButtonProps = React.ComponentProps<"button"> & {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "default" | "lg" | "xl";
};

export function WmButton({
  className,
  variant = "primary",
  size = "default",
  ...props
}: WmButtonProps) {
  return (
    <button
      className={cn(
        "wm-press inline-flex items-center justify-center rounded-xl font-semibold transition focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[#006D77]/25 disabled:pointer-events-none disabled:opacity-50",
        size === "default" && "min-h-12 px-5 py-3 text-sm",
        size === "lg" && "min-h-[3.25rem] px-6 py-3.5 text-base",
        size === "xl" && "min-h-14 px-6 py-4 text-base",
        variant === "primary" && wm.primary,
        variant === "secondary" && wm.secondary,
        variant === "outline" &&
          "border border-[#006D77]/22 bg-white text-[#006D77] hover:bg-[#006D77]/5 active:bg-[#006D77]/10",
        variant === "ghost" && "text-[#006D77] hover:bg-[#006D77]/8 active:bg-[#006D77]/12",
        className,
      )}
      {...props}
    />
  );
}

export function WmInput({ className, ...props }: React.ComponentProps<"input">) {
  return <input className={cn(wm.input, className)} {...props} />;
}

export function WmTextarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(wm.input, "min-h-[7rem] resize-y py-3 leading-relaxed", className)}
      {...props}
    />
  );
}

export function WmSelect({
  className,
  children,
  ...props
}: React.ComponentProps<"select">) {
  return (
    <select
      className={cn(
        wm.select,
        "bg-[url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2716%27 height=%2716%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%23006D77%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3E%3Cpath d=%27m6 9 6 6 6-6%27/%3E%3C/svg%3E')]",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export function WmCard({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        wm.bgCard,
        wm.rounded,
        wm.shadowCard,
        "border",
        wm.border,
        "p-5 sm:p-6",
        className,
      )}
      {...props}
    />
  );
}

type WmSectionProps = {
  title: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
};

export function WmSection({ title, description, className, children }: WmSectionProps) {
  return (
    <section className={cn("mt-8", className)}>
      <h2 className={wm.sectionTitle}>{title}</h2>
      {description && <p className={wm.sectionDesc}>{description}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

type WmActionLinkProps = {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  accent?: "teal" | "orange" | "neutral";
  className?: string;
};

export function WmActionLink({
  href,
  icon,
  title,
  description,
  accent = "teal",
  className,
}: WmActionLinkProps) {
  const iconBg =
    accent === "orange"
      ? "bg-[#FF8C42] text-white shadow-[0_4px_14px_-4px_rgba(255,140,66,0.5)]"
      : accent === "neutral"
        ? "bg-[#006D77]/10 text-[#006D77]"
        : "bg-[#006D77] text-white shadow-[0_4px_14px_-4px_rgba(0,109,119,0.4)]";

  return (
    <a href={href} className={cn(wm.actionRow, "block no-underline", className)}>
      <span
        className={cn(
          "inline-flex size-12 shrink-0 items-center justify-center rounded-2xl",
          iconBg,
        )}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold text-[#2B2B2B]">{title}</span>
        <span className="mt-0.5 block text-sm leading-snug text-[#5C5C5C]">{description}</span>
      </span>
    </a>
  );
}
