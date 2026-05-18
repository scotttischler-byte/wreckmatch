"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useAsgLocale } from "@/components/accidentsurvivalguide/AsgLocaleProvider";

type AsgLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
};

export function AsgLink({ href, ...props }: AsgLinkProps) {
  const { href: localize } = useAsgLocale();
  return <Link href={localize(href)} {...props} />;
}
