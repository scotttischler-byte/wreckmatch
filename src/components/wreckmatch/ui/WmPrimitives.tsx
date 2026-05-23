import { cn } from "@/lib/utils";
import { wm } from "@/lib/wreckmatch/theme";

type WmButtonProps = React.ComponentProps<"button"> & {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "default" | "lg";
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
        "inline-flex items-center justify-center rounded-xl font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006D77]/30 disabled:pointer-events-none disabled:opacity-50",
        size === "default" && "min-h-11 px-5 py-2.5 text-sm",
        size === "lg" && "min-h-12 px-6 py-3 text-base",
        variant === "primary" && wm.primary,
        variant === "secondary" && wm.secondary,
        variant === "outline" &&
          "border border-[#006D77]/25 bg-white text-[#006D77] hover:bg-[#006D77]/5",
        variant === "ghost" && "text-[#006D77] hover:bg-[#006D77]/8",
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
      className={cn(wm.input, "min-h-28 resize-y", className)}
      {...props}
    />
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
        wm.shadowSoft,
        "border",
        wm.border,
        "p-5",
        className,
      )}
      {...props}
    />
  );
}
