"use client";

import type { ReactNode } from "react";
import { asg, asgCn } from "@/components/accidentsurvivalguide/asg-ui";

type Props = {
  label: string;
  htmlFor?: string;
  required?: boolean;
  optional?: string;
  recommended?: string;
  variant?: "light" | "dark";
  children: ReactNode;
  className?: string;
};

export function AsgFormField({
  label,
  htmlFor,
  required,
  optional,
  recommended,
  variant = "light",
  children,
  className,
}: Props) {
  const labelClass =
    variant === "dark"
      ? "mb-1.5 block text-sm font-medium text-asg-sky"
      : "mb-1.5 block text-sm font-medium text-asg-navy/80";

  return (
    <label className={asgCn("block", className)} htmlFor={htmlFor}>
      <span className={labelClass}>
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
        {optional ? <span className="font-normal text-asg-subtle"> ({optional})</span> : null}
        {recommended ? (
          <span className="font-normal text-asg-subtle"> ({recommended})</span>
        ) : null}
      </span>
      {children}
    </label>
  );
}

export function AsgFormError({
  message,
  variant = "light",
}: {
  message: string;
  variant?: "light" | "dark";
}) {
  if (!message) return null;
  return (
    <p className={variant === "dark" ? asg.alertErrorDark : asg.alertError} role="alert">
      {message}
    </p>
  );
}

export function AsgConsentRow({
  checked,
  onChange,
  children,
  variant = "light",
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  children: ReactNode;
  variant?: "light" | "dark";
}) {
  return (
    <label
      className={asgCn(
        "flex min-h-[48px] cursor-pointer items-start gap-3 rounded-lg p-3 text-xs leading-relaxed",
        variant === "dark" ? "bg-white/10 text-asg-sky" : "bg-asg-elevated text-asg-muted",
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 size-5 shrink-0 accent-asg-teal"
        required
      />
      <span>{children}</span>
    </label>
  );
}
